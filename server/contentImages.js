import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const MIN_IMAGE_BYTES = 1024;
const MAX_UPLOAD_BYTES = 4.5 * 1024 * 1024;
const DEFAULT_IMAGE_MODEL = "amazon.nova-canvas-v1:0";
const TITAN_IMAGE_MODEL = "amazon.titan-image-generator-v2:0";

const s3 = new S3Client({});

function region() {
  return process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1";
}

function bucketName() {
  return String(process.env.CONTENT_IMAGES_BUCKET || "").trim();
}

export function resolveImageKind(raw) {
  return String(raw || "").trim().toLowerCase() === "infographic" ? "infographic" : "image";
}

export function resolvePlacement(raw) {
  return String(raw || "").trim().toLowerCase() === "pullout" ? "pullout" : "inline";
}

function sanitizeKeyPart(value, fallback = "item") {
  const stem = String(value ?? "")
    .trim()
    .replace(/[^a-zA-Z0-9-_]/g, "")
    .slice(0, 48);
  return stem || fallback;
}

function imageSizeFor(placement) {
  return placement === "pullout" ? { width: 1024, height: 1024, label: "1024x1024" } : { width: 1536, height: 1024, label: "1536x1024" };
}

function validateImageBuffer(buffer) {
  const byteLength = buffer?.length || 0;
  if (!byteLength) return { ok: false, error: "Image is empty" };
  if (byteLength < MIN_IMAGE_BYTES) return { ok: false, error: `Image is too small (${byteLength} bytes)` };
  if (byteLength > MAX_UPLOAD_BYTES) return { ok: false, error: "Image is larger than 4.5 MB" };
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8;
  const isPng = byteLength >= 8 && buffer[0] === 0x89 && buffer.slice(1, 4).toString("ascii") === "PNG";
  const isWebp =
    byteLength >= 12 &&
    buffer.slice(0, 4).toString("ascii") === "RIFF" &&
    buffer.slice(8, 12).toString("ascii") === "WEBP";
  if (!isJpeg && !isPng && !isWebp) return { ok: false, error: "Image must be JPEG, PNG, or WebP" };
  return { ok: true, contentType: isPng ? "image/png" : isWebp ? "image/webp" : "image/jpeg" };
}

export function parseDataUrl(dataUrl) {
  const raw = String(dataUrl || "").trim();
  const match = raw.match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,([a-zA-Z0-9+/=\s]+)$/i);
  if (!match) return { ok: false, error: "Upload a JPEG, PNG, or WebP image" };
  const contentType = match[1].toLowerCase() === "image/jpg" ? "image/jpeg" : match[1].toLowerCase();
  const buffer = Buffer.from(match[2].replace(/\s+/g, ""), "base64");
  const check = validateImageBuffer(buffer);
  if (!check.ok) return check;
  return { ok: true, buffer, contentType: check.contentType || contentType };
}

function buildImagePrompt({ prompt, placement, kind }) {
  const userPrompt = String(prompt || "").trim();
  const sizeHint =
    placement === "pullout"
      ? "Square 1:1 composition. Design for a pull-out sidebar figure — bold subject, limited detail, legible when small."
      : "Landscape ~3:2 composition. Design for a full-width inline article figure — clear focal point, readable at column width.";

  if (kind === "image") {
    return [
      "High-quality editorial photograph or photorealistic scene for a professional healthcare article.",
      "Natural lighting, authentic clinical or workplace context, no watermarks, no mockup frames, no UI chrome.",
      "Single strong subject — not a diagram, chart, icon grid, or labeled flowchart.",
      sizeHint,
      "Do not render any title, caption, headline, logo, or heading text in the image.",
      userPrompt,
    ]
      .filter(Boolean)
      .join(" ")
      .slice(0, 1024);
  }

  return [
    "Clean editorial infographic illustration for a professional healthcare article.",
    "Modern flat diagram style, clear hierarchy, no watermarks, no mockup frames, no UI chrome.",
    sizeHint,
    "Do not render any title, caption, headline, or article heading text in the image.",
    "Short diagram labels inside the graphic are OK only when needed for the chart itself.",
    userPrompt,
  ]
    .filter(Boolean)
    .join(" ")
    .slice(0, 1024);
}

function decodeInvokeBody(body) {
  if (!body) return {};
  const text = Buffer.isBuffer(body) ? body.toString("utf8") : new TextDecoder().decode(body);
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

async function invokeImageModel(modelId, payload) {
  const client = new BedrockRuntimeClient({ region: region() });
  const out = await client.send(
    new InvokeModelCommand({
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload),
    })
  );
  return decodeInvokeBody(out.body);
}

function imageFromModelResponse(parsed) {
  const b64 = parsed?.images?.[0] || parsed?.image || parsed?.artifacts?.[0]?.base64;
  if (!b64) return null;
  return Buffer.from(String(b64), "base64");
}

async function generateWithNova(fullPrompt, size) {
  const parsed = await invokeImageModel(process.env.BEDROCK_IMAGE_MODEL_ID?.trim() || DEFAULT_IMAGE_MODEL, {
    taskType: "TEXT_IMAGE",
    textToImageParams: {
      text: fullPrompt,
      negativeText: "watermark, caption, title text, logo lockup, UI chrome, blurry, low quality, stock photo watermark",
    },
    imageGenerationConfig: {
      numberOfImages: 1,
      quality: "standard",
      height: size.height,
      width: size.width,
      cfgScale: 6.5,
    },
  });
  const error = String(parsed?.error || parsed?.message || "").trim();
  const buffer = imageFromModelResponse(parsed);
  if (!buffer) {
    throw new Error(error || "Bedrock image model returned no image");
  }
  return buffer;
}

async function generateWithTitan(fullPrompt, size) {
  const parsed = await invokeImageModel(TITAN_IMAGE_MODEL, {
    taskType: "TEXT_IMAGE",
    textToImageParams: { text: fullPrompt.slice(0, 512) },
    imageGenerationConfig: {
      numberOfImages: 1,
      height: size.height === 1024 && size.width === 1536 ? 1024 : size.height,
      width: size.height === 1024 && size.width === 1536 ? 1024 : size.width,
      cfgScale: 8,
    },
  });
  const buffer = imageFromModelResponse(parsed);
  if (!buffer) {
    throw new Error(String(parsed?.error || parsed?.message || "Titan image generation failed"));
  }
  return buffer;
}

async function generateImageBuffer(fullPrompt, size) {
  try {
    return await generateWithNova(fullPrompt, size);
  } catch (err) {
    const message = String(err?.message || err);
    if (/ValidationException|AccessDenied|not found|UnrecognizedClient|ResourceNotFound/i.test(message) && !process.env.BEDROCK_IMAGE_MODEL_ID) {
      return generateWithTitan(fullPrompt, size);
    }
    throw err;
  }
}

async function storeLocal(buffer, key, ext) {
  const dir = path.join(process.cwd(), "public", "content-images");
  await mkdir(dir, { recursive: true });
  const filename = `${key.replace(/[\\/]/g, "-")}.${ext}`;
  await writeFile(path.join(dir, filename), buffer);
  return `/content-images/${filename}`;
}

export async function storeImageBuffer({ buffer, contentType, key }) {
  const check = validateImageBuffer(buffer);
  if (!check.ok) return { ok: false, statusCode: 400, message: check.error };
  const ext = (check.contentType || contentType || "image/png").includes("jpeg")
    ? "jpg"
    : (check.contentType || contentType || "").includes("webp")
      ? "webp"
      : "png";
  const bucket = bucketName();
  const objectKey = key.endsWith(`.${ext}`) ? key : `${key}.${ext}`;
  if (!bucket) {
    if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
      return {
        ok: false,
        statusCode: 503,
        message: "Image storage is not configured — CONTENT_IMAGES_BUCKET missing. Redeploy so Amplify creates the content images bucket.",
      };
    }
    const imageUrl = await storeLocal(buffer, objectKey, ext);
    return { ok: true, imageUrl, contentType: check.contentType || contentType, storageKey: objectKey };
  }
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      Body: buffer,
      ContentType: check.contentType || contentType || "image/png",
      CacheControl: "public, max-age=86400",
    })
  );
  return {
    ok: true,
    imageUrl: `https://${bucket}.s3.${region()}.amazonaws.com/${objectKey}`,
    contentType: check.contentType || contentType,
    storageKey: objectKey,
  };
}

export async function deleteStoredImage(imageUrl) {
  const url = String(imageUrl || "").trim();
  if (!url) return;
  const bucket = bucketName();
  if (bucket && url.includes(`${bucket}.s3.`)) {
    try {
      const parsed = new URL(url);
      const key = decodeURIComponent(parsed.pathname.replace(/^\//, ""));
      if (key) await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    } catch {
      /* ignore storage cleanup errors */
    }
    return;
  }
  if (url.startsWith("/content-images/")) {
    const filePath = path.join(process.cwd(), "public", url.replace(/^\//, ""));
    try {
      await unlink(filePath);
    } catch {
      /* ignore */
    }
  }
}

function mapImageRow(row) {
  return {
    id: row.id,
    kind: row.kind,
    fileName: row.file_name,
    imageUrl: row.image_url,
    prompt: row.prompt,
    caption: row.caption,
    placement: row.placement,
    imageSize: row.image_size,
    source: row.source,
    contentId: row.content_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function persistLibraryImage(db, opts) {
  const imageUrl = String(opts.imageUrl || "").trim();
  if (!db || !imageUrl) return null;
  const { rows } = await db.query(
    `INSERT INTO content_images
      (kind, file_name, image_url, prompt, caption, placement, image_size, source, content_id, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     RETURNING *`,
    [
      resolveImageKind(opts.kind),
      String(opts.fileName || `content-${resolveImageKind(opts.kind)}.png`).slice(0, 255),
      imageUrl,
      String(opts.prompt || "").trim() || null,
      String(opts.caption || "").trim() || null,
      resolvePlacement(opts.placement),
      String(opts.imageSize || "").trim() || null,
      String(opts.source || "content-image").slice(0, 64),
      opts.contentId != null ? String(opts.contentId) : null,
      opts.createdBy || null,
    ]
  );
  return rows[0] ? mapImageRow(rows[0]) : null;
}

export async function listLibraryImages(db, limit = 80) {
  const { rows } = await db.query(
    `SELECT * FROM content_images ORDER BY updated_at DESC, id DESC LIMIT ?`,
    [Math.min(Math.max(Number(limit) || 80, 1), 200)]
  );
  return rows.map(mapImageRow);
}

export async function getLibraryImage(db, id) {
  const { rows } = await db.query("SELECT * FROM content_images WHERE id = ? LIMIT 1", [id]);
  return rows[0] ? mapImageRow(rows[0]) : null;
}

export async function deleteLibraryImage(db, id) {
  const existing = await getLibraryImage(db, id);
  if (!existing) return null;
  await db.query("DELETE FROM content_images WHERE id = ?", [id]);
  await deleteStoredImage(existing.imageUrl);
  return existing;
}

export async function generateContentImage(opts) {
  const prompt = String(opts.prompt || "").trim();
  if (!prompt) return { ok: false, statusCode: 400, message: "prompt is required" };
  const kind = resolveImageKind(opts.kind);
  const placement = resolvePlacement(opts.placement);
  const size = imageSizeFor(placement);
  const fullPrompt = buildImagePrompt({ prompt, placement, kind });
  try {
    const buffer = await generateImageBuffer(fullPrompt, size);
    const folder = kind === "infographic" ? "content-infographics" : "content-images";
    const imageId = randomUUID().replace(/-/g, "").slice(0, 16);
    const contentKey = sanitizeKeyPart(opts.contentId, "content");
    const stored = await storeImageBuffer({
      buffer,
      contentType: "image/png",
      key: `${folder}/${contentKey}/${imageId}`,
    });
    if (!stored.ok) return stored;
    const fileName = `content-${kind}-${contentKey}-${imageId}.png`;
    const library = opts.db
      ? await persistLibraryImage(opts.db, {
          kind,
          fileName,
          imageUrl: stored.imageUrl,
          prompt,
          caption: opts.title,
          placement,
          imageSize: size.label,
          source: kind === "infographic" ? "content-infographic" : "content-image",
          contentId: opts.contentId,
          createdBy: opts.createdBy,
        })
      : null;
    return {
      ok: true,
      imageUrl: stored.imageUrl,
      prompt,
      placement,
      kind,
      imageSize: size.label,
      libraryImageId: library?.id != null ? String(library.id) : null,
      fileName,
    };
  } catch (err) {
    const name = err?.name || "";
    const message = err?.message || String(err);
    if (/CredentialsProviderError|Could not load credentials|Missing credentials/i.test(name + message)) {
      return {
        ok: false,
        statusCode: 503,
        message: "AWS credentials are not configured for Bedrock image generation.",
      };
    }
    const statusCode =
      name === "ValidationException" ? 400 : name === "ThrottlingException" || name === "ServiceUnavailableException" ? 429 : 502;
    return { ok: false, statusCode, message: message || "Image generation failed" };
  }
}

export async function uploadContentImage(opts) {
  const parsed = parseDataUrl(opts.dataUrl);
  if (!parsed.ok) return { ok: false, statusCode: 400, message: parsed.error };
  const kind = resolveImageKind(opts.kind);
  const placement = resolvePlacement(opts.placement);
  const folder = kind === "infographic" ? "content-infographics" : "content-images";
  const imageId = randomUUID().replace(/-/g, "").slice(0, 16);
  const contentKey = sanitizeKeyPart(opts.contentId, "upload");
  const stored = await storeImageBuffer({
    buffer: parsed.buffer,
    contentType: parsed.contentType,
    key: `${folder}/${contentKey}/${imageId}`,
  });
  if (!stored.ok) return stored;
  const ext = parsed.contentType.includes("jpeg") ? "jpg" : parsed.contentType.includes("webp") ? "webp" : "png";
  const fileName = String(opts.fileName || `upload-${imageId}.${ext}`).slice(0, 255);
  const library = opts.db
    ? await persistLibraryImage(opts.db, {
        kind,
        fileName,
        imageUrl: stored.imageUrl,
        prompt: opts.prompt,
        caption: opts.title,
        placement,
        imageSize: imageSizeFor(placement).label,
        source: "upload",
        contentId: opts.contentId,
        createdBy: opts.createdBy,
      })
    : null;
  return {
    ok: true,
    imageUrl: stored.imageUrl,
    placement,
    kind,
    libraryImageId: library?.id != null ? String(library.id) : null,
    fileName,
  };
}
