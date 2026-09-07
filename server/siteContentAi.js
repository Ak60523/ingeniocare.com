import { bedrockJsonRequest, getBedrockSonnetModelId } from "./bedrock.js";
import {
  applyFigurePromptOnlyPolicy,
  bodyHasContent,
  mergeGeneratedBody,
  parseBody,
} from "./contentBody.js";

export const CONTENT_AI_TYPES = new Set(["blog", "whitepaper", "news", "podcast"]);

export function normalizeHashtags(raw) {
  const list = Array.isArray(raw)
    ? raw
    : typeof raw === "string"
      ? raw.split(/[,#\s]+/)
      : [];
  const out = [];
  const seen = new Set();
  for (const item of list) {
    const tag = String(item ?? "")
      .trim()
      .replace(/^#+/, "")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");
    if (!tag || seen.has(tag)) continue;
    seen.add(tag);
    out.push(tag);
    if (out.length >= 12) break;
  }
  return out;
}

export function sanitizeHtml(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "")
    .trim();
}

export function htmlHasContent(html) {
  return sanitizeHtml(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .trim().length > 0;
}

const GENERATE_SYSTEM = `You are Ingenio Care's editorial writer. Ingenio Care is an AI-enabled, patient-centric digital health network that connects patients, providers, and payers — improving access, coordination, and affordability.

Write practical, concrete content. Do not invent statistics, quotes from unnamed studies, or fake URLs. Prefer clear healthcare language over hype.
Return ONLY valid JSON with this shape:
{
  "title": string,
  "subtitle": string,
  "headline": string,
  "dateLabel": string,
  "summary": string,
  "hashtags": string[],
  "seoTitle": string,
  "seoDescription": string,
  "body": [
    { "type": "heading", "text": string, "level": 2 | 3 },
    { "type": "text", "text": string (one or more paragraphs separated by blank lines; may include **bold** and *italic* markdown; never use # markdown headings) },
    { "type": "list", "title": string, "items": string[], "placement": "sidebar" (optional — place immediately before the section it summarizes) },
    { "type": "quote", "text": string, "speaker": string, "title": string },
    { "type": "infographic", "title": string (optional short caption under the figure only — not drawn in the image), "prompt": string (diagram/infographic generation brief only), "imageUrl": "", "placement": "inline" | "pullout" },
    { "type": "image", "title": string (optional short caption under the figure only — not drawn in the image), "prompt": string (photographic / editorial scene brief only — not a diagram), "imageUrl": "", "placement": "inline" | "pullout" }
  ]
}

Rules:
- body is an ordered array of section blocks. Do not return a single HTML string. Do not wrap the article in <html>, <head>, or <body>. Never include <script> or <img>.
- Use heading blocks (level 2 for section titles, level 3 for subsections) — never put # or ## markdown inside text blocks.
- For sidebar lists and pullout figures: place each immediately before the related text section so it floats beside that content; do not collect all sidebars at the end.
- Include infographic or image blocks only when the instruction asks for them. Write ONLY a concrete prompt in "prompt" and an optional short caption in "title". ALWAYS set "imageUrl" to "" (empty). Never invent URLs.
- hashtags: 3-8 lowercase tags without #.
- summary: 1-2 sentences.
- For blog: 5-8 body blocks. For whitepaper: 8-14 body blocks with heading structure and a short list of takeaways. For news: a wire-style press release with a dateline, at least one attributed quote, an About Ingenio Care heading + text, and a media contact heading + text. For podcast: episode show notes with a short intro heading, 4-8 talking-point list or text blocks, and a closing call to action.
- news headline is a short kicker such as "Press Release - 9/5/2026". news dateLabel looks like "September 5, 2026, PRESS RELEASE".
- Default spokesperson is Alex Kumar, CEO of Ingenio Care, when a quote is needed and no other speaker is specified.
- Default media contact is Rohin Gopalka, rohin.gopalka@ingeniocare.com, unless the instruction says otherwise.
- Company URL: https://ingeniocare.ai
- Keep JSON compact enough to finish in one response.`;

function typeLabel(type) {
  if (type === "whitepaper") return "a white paper";
  if (type === "news") return "a press release";
  if (type === "podcast") return "a podcast episode";
  return "a blog post";
}

function bodyFromParsed(parsed, input) {
  const rawBody = parsed.body ?? parsed.blocks;
  const previousBody = input.draft?.body;
  if (Array.isArray(rawBody) || (typeof rawBody === "string" && rawBody.trim().startsWith("["))) {
    return applyFigurePromptOnlyPolicy(parseBody(rawBody), previousBody);
  }
  const html = sanitizeHtml(typeof rawBody === "string" ? rawBody : parsed.html || "");
  return parseBody(
    mergeGeneratedBody({
      html,
      figures: parsed.figures,
      previousBody,
    })
  );
}

function draftFromParsed(parsed, input, type) {
  const body = bodyFromParsed(parsed, input);
  return {
    type,
    title: String(parsed.title ?? input.topicTitle ?? input.draft?.title ?? "Untitled").trim() || "Untitled",
    subtitle: String(parsed.subtitle ?? input.draft?.subtitle ?? "").trim(),
    headline: String(parsed.headline ?? parsed.subtitle ?? input.draft?.headline ?? "").trim(),
    dateLabel: String(parsed.dateLabel ?? input.draft?.dateLabel ?? "").trim(),
    summary: String(parsed.summary ?? input.topicSummary ?? input.draft?.summary ?? "").trim(),
    body,
    hashtags: normalizeHashtags(parsed.hashtags ?? input.draft?.hashtags),
    seoTitle: String(parsed.seoTitle ?? parsed.title ?? "").trim(),
    seoDescription: String(parsed.seoDescription ?? parsed.summary ?? "").trim(),
    gated: false,
    slug: input.draft?.slug || null,
    status: input.draft?.status || "draft",
    pdfUrl: input.draft?.pdfUrl || null,
  };
}

export async function generateTitleAlternatives(input) {
  const type = CONTENT_AI_TYPES.has(input.type) ? input.type : "blog";
  const prompt = String(input.prompt ?? "").trim();
  if (!prompt) {
    return { ok: false, statusCode: 400, message: "prompt is required" };
  }

  const system = `You are Ingenio Care's editorial headline writer. Ingenio Care is an AI-enabled, patient-centric digital health network for patients, providers, and payers.

Return ONLY valid JSON:
{
  "alternatives": [
    { "title": string, "subtitle": string }
  ]
}

Rules:
- Provide exactly 5 distinct alternatives.
- Titles are punchy, concrete, and suitable for ${typeLabel(type)}.
- Subtitles support the title in one sentence (empty string only if truly unnecessary).
- Do not invent statistics. Prefer clear healthcare language over hype.
- Vary angle and wording across the five options.`;

  const userPrompt = [
    `Content type: ${type}`,
    `Prompt: ${prompt}`,
    input.currentTitle ? `Current title (optional reference): ${input.currentTitle}` : "",
    input.currentSubtitle ? `Current subtitle (optional reference): ${input.currentSubtitle}` : "",
    "Generate 5 title + subtitle alternatives now.",
  ]
    .filter(Boolean)
    .join("\n");

  const result = await bedrockJsonRequest(system, userPrompt, 2048, {
    modelId: getBedrockSonnetModelId(),
    logContext: "site-content-title-alternatives",
  });
  if (!result.ok) {
    return { ok: false, statusCode: result.statusCode || 502, message: result.message || "AI generation failed" };
  }
  const parsed = result.parsed && typeof result.parsed === "object" ? result.parsed : {};
  const raw = Array.isArray(parsed.alternatives) ? parsed.alternatives : [];
  const alternatives = raw
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const title = String(row.title ?? "").trim();
      if (!title) return null;
      return { title, subtitle: String(row.subtitle ?? "").trim() };
    })
    .filter(Boolean)
    .slice(0, 8);

  if (!alternatives.length) {
    return { ok: false, statusCode: 502, message: "AI returned no usable title alternatives" };
  }
  return { ok: true, alternatives };
}

export async function generateSiteContentDraft(input) {
  const type = CONTENT_AI_TYPES.has(input.type) ? input.type : "blog";
  const userPrompt = [
    `Content type: ${type}`,
    input.topicKey ? `Topic key: ${input.topicKey}` : "",
    input.topicTitle ? `Topic title: ${input.topicTitle}` : "",
    input.topicSummary ? `Topic brief: ${input.topicSummary}` : "",
    input.instruction ? `Extra instruction: ${input.instruction}` : "",
    "Write the full draft now as ordered section blocks.",
  ]
    .filter(Boolean)
    .join("\n");

  const maxTokens = type === "blog" ? 4096 : 8192;
  const result = await bedrockJsonRequest(GENERATE_SYSTEM, userPrompt, maxTokens, {
    modelId: getBedrockSonnetModelId(),
    logContext: "site-content-generate",
  });
  if (!result.ok) {
    return { ok: false, statusCode: result.statusCode || 502, message: result.message || "AI generation failed" };
  }
  const parsed = result.parsed && typeof result.parsed === "object" ? result.parsed : {};
  const draft = draftFromParsed(parsed, input, type);
  if (!bodyHasContent(draft.body)) {
    return { ok: false, statusCode: 502, message: "AI returned no usable body content — try Write again" };
  }
  return { ok: true, draft };
}

export async function reviseSiteContentDraft(input) {
  const instruction = String(input.instruction ?? "").trim();
  if (!instruction) {
    return { ok: false, statusCode: 400, message: "instruction is required" };
  }
  const current = input.draft && typeof input.draft === "object" ? input.draft : {};
  const type = CONTENT_AI_TYPES.has(String(current.type)) ? String(current.type) : "blog";
  const system = `${GENERATE_SYSTEM}

Revise the provided draft according to the instruction. Keep the same JSON shape, with body as an array of section blocks. Preserve useful structure and accurate claims unless the instruction asks otherwise.`;
  const currentForModel = {
    ...current,
    body: parseBody(current.body),
  };
  const userPrompt = [`Instruction: ${instruction}`, `Current draft JSON:\n${JSON.stringify(currentForModel)}`].join("\n\n");

  const result = await bedrockJsonRequest(system, userPrompt, 8192, {
    modelId: getBedrockSonnetModelId(),
    logContext: "site-content-revise",
  });
  if (!result.ok) {
    return { ok: false, statusCode: result.statusCode || 502, message: result.message || "AI revise failed" };
  }
  const parsed = result.parsed && typeof result.parsed === "object" ? result.parsed : {};
  const draft = draftFromParsed(parsed, { ...input, draft: current, topicTitle: current.title, topicSummary: current.summary }, type);
  if (!bodyHasContent(draft.body)) {
    return { ok: false, statusCode: 502, message: "AI revise returned no usable body — try again" };
  }
  if (!draft.subtitle && current.subtitle) draft.subtitle = String(current.subtitle);
  if (!draft.headline && current.headline) draft.headline = String(current.headline);
  if (!draft.dateLabel && current.dateLabel) draft.dateLabel = String(current.dateLabel);
  return { ok: true, draft };
}
