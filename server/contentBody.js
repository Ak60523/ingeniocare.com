export function htmlHasContent(html) {
  return String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .trim().length > 0;
}

function asText(value) {
  return String(value ?? "").trim();
}

function resolveFigureKind(type) {
  return String(type || "").toLowerCase() === "infographic" ? "infographic" : "image";
}

function resolvePlacement(raw) {
  return String(raw || "").trim().toLowerCase() === "pullout" ? "pullout" : "inline";
}

export function emptyHtmlBlock(html = "") {
  return { type: "html", html: String(html || "") };
}

export function emptyFigureBlock(kind = "image") {
  return {
    type: resolveFigureKind(kind),
    title: "",
    prompt: "",
    imageUrl: "",
    placement: "inline",
  };
}

function normalizeFigure(block, type) {
  const kind = resolveFigureKind(type || block?.type);
  const libraryImageId = asText(block?.libraryImageId);
  return {
    type: kind,
    title: String(block?.title ?? ""),
    prompt: String(block?.prompt ?? block?.imagePrompt ?? block?.text ?? block?.description ?? ""),
    imageUrl: asText(block?.imageUrl ?? block?.url),
    placement: resolvePlacement(block?.placement),
    ...(libraryImageId ? { libraryImageId } : {}),
  };
}

function normalizeOne(block) {
  if (!block || typeof block !== "object") return [];
  const type = String(block.type || "").toLowerCase();
  if (type === "image" || type === "infographic") return [normalizeFigure(block, type)];
  if (type === "html") return [{ type: "html", html: String(block.html ?? block.body ?? block.text ?? "") }];
  if (asText(block.html)) return [{ type: "html", html: String(block.html) }];
  return [];
}

function parseJsonBlocks(raw) {
  let input = raw;
  if (typeof input === "string") {
    try {
      input = JSON.parse(input);
    } catch {
      return null;
    }
  }
  if (input && typeof input === "object" && !Array.isArray(input)) {
    if (Array.isArray(input.body)) input = input.body;
    else if (Array.isArray(input.blocks)) input = input.blocks;
    else return null;
  }
  if (!Array.isArray(input)) return null;
  return input.flatMap(normalizeOne);
}

export function parseBody(raw) {
  if (Array.isArray(raw)) return raw.flatMap(normalizeOne);
  const text = String(raw ?? "");
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith("[")) {
    const parsed = parseJsonBlocks(trimmed);
    if (parsed) return parsed;
  }
  return [emptyHtmlBlock(text)];
}

export function serializeBody(blocks) {
  const next = parseBody(blocks);
  if (!next.length) return "";
  if (next.length === 1 && next[0].type === "html") return String(next[0].html || "");
  return JSON.stringify(next);
}

export function ensureEditableBlocks(raw) {
  const blocks = parseBody(raw);
  return blocks.length ? blocks : [emptyHtmlBlock("")];
}

export function blockHasContent(block) {
  if (!block) return false;
  if (block.type === "image" || block.type === "infographic") {
    return Boolean(asText(block.imageUrl) || asText(block.prompt) || asText(block.title));
  }
  return htmlHasContent(block.html);
}

export function bodyHasContent(raw) {
  return parseBody(raw).some(blockHasContent);
}

export function normalizeFigureList(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item) => normalizeOne({ ...item, type: item?.type || "image" }));
}

function takeMatchingFigure(pool, figure) {
  const index = pool.findIndex((item) => item.type === figure.type && asText(item.imageUrl));
  if (index < 0) return figure;
  const previous = pool.splice(index, 1)[0];
  return {
    ...figure,
    imageUrl: figure.imageUrl || previous.imageUrl,
    libraryImageId: figure.libraryImageId || previous.libraryImageId,
    title: asText(figure.title) ? figure.title : previous.title,
    prompt: asText(figure.prompt) ? figure.prompt : previous.prompt,
    placement: figure.placement || previous.placement,
  };
}

export function mergeGeneratedBody({ html, figures, previousBody }) {
  const previousFigures = parseBody(previousBody).filter(
    (block) => block.type === "image" || block.type === "infographic"
  );
  const nextFigures = normalizeFigureList(figures);
  const pool = [...previousFigures];
  const mergedFigures = nextFigures.length
    ? nextFigures.map((figure) => takeMatchingFigure(pool, figure))
    : previousFigures;
  const blocks = [];
  if (htmlHasContent(html)) blocks.push(emptyHtmlBlock(html));
  blocks.push(...mergedFigures);
  return serializeBody(blocks);
}
