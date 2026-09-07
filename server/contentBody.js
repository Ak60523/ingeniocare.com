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
  const value = String(raw || "").trim().toLowerCase();
  if (value === "pullout") return "pullout";
  if (value === "sidebar") return "sidebar";
  return "inline";
}

function decodeEntities(text) {
  return String(text || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function htmlToPlain(html) {
  return decodeEntities(
    String(html || "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|h[1-6]|li|blockquote)>/gi, "\n\n")
      .replace(/<strong\b[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**")
      .replace(/<b\b[^>]*>([\s\S]*?)<\/b>/gi, "**$1**")
      .replace(/<em\b[^>]*>([\s\S]*?)<\/em>/gi, "*$1*")
      .replace(/<i\b[^>]*>([\s\S]*?)<\/i>/gi, "*$1*")
      .replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)")
      .replace(/<[^>]+>/g, "")
  )
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function emptyHtmlBlock(html = "") {
  return { type: "html", html: String(html || "") };
}

export function emptyTextBlock(text = "") {
  return { type: "text", text: String(text || "") };
}

export function emptyHeadingBlock(text = "", level = 2) {
  return { type: "heading", text: String(text || ""), level: Number(level) === 3 ? 3 : 2 };
}

export function emptyQuoteBlock() {
  return { type: "quote", text: "", speaker: "", title: "" };
}

export function emptyListBlock() {
  return { type: "list", title: "", items: [""] };
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

export function emptyBlock(type = "text") {
  if (type === "heading") return emptyHeadingBlock();
  if (type === "quote") return emptyQuoteBlock();
  if (type === "list") return emptyListBlock();
  if (type === "image" || type === "infographic") return emptyFigureBlock(type);
  if (type === "html") return emptyHtmlBlock("");
  return emptyTextBlock();
}

function expandTextMarkdownHeadings(text) {
  const lines = String(text || "").split(/\r?\n/);
  const out = [];
  let buf = [];
  const flush = () => {
    const next = buf.join("\n").trim();
    if (next) out.push(emptyTextBlock(next));
    buf = [];
  };
  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      flush();
      out.push(emptyHeadingBlock(match[2].trim(), match[1].length >= 3 ? 3 : 2));
    } else {
      buf.push(line);
    }
  }
  flush();
  return out.length ? out : [emptyTextBlock("")];
}

function coerceListItems(raw) {
  if (!Array.isArray(raw)) return [""];
  const items = raw
    .map((item) => {
      if (item == null) return "";
      if (typeof item === "string" || typeof item === "number") return String(item).trim();
      if (typeof item === "object") {
        return String(item.text ?? item.content ?? item.label ?? "").trim();
      }
      return "";
    })
    .filter(Boolean);
  return items.length ? items : [""];
}

function normalizeFigure(block, type) {
  const kind = resolveFigureKind(type || block?.type);
  const libraryImageId = asText(block?.libraryImageId);
  return {
    type: kind,
    title: String(block?.title ?? ""),
    prompt: String(block?.prompt ?? block?.imagePrompt ?? block?.text ?? block?.description ?? ""),
    imageUrl: asText(block?.imageUrl ?? block?.url),
    placement: resolvePlacement(block?.placement) === "sidebar" ? "inline" : resolvePlacement(block?.placement),
    ...(libraryImageId ? { libraryImageId } : {}),
  };
}

function listFromHtml(inner) {
  const items = [...String(inner || "").matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((match) => htmlToPlain(match[1]))
    .filter(Boolean);
  return items.length ? [{ type: "list", title: "", items }] : [];
}

export function splitHtmlIntoBlocks(html) {
  const src = String(html || "").trim();
  if (!src) return [];
  const blocks = [];
  const re = /<(h[23]|ul|ol|blockquote|p)(\s[^>]*)?>([\s\S]*?)<\/\1>/gi;
  let last = 0;
  let match;
  let textBuf = [];

  const flushText = () => {
    const text = htmlToPlain(textBuf.join("\n\n"));
    if (text) blocks.push(emptyTextBlock(text));
    textBuf = [];
  };

  while ((match = re.exec(src)) !== null) {
    const between = src.slice(last, match.index);
    if (htmlToPlain(between)) textBuf.push(between);
    last = match.index + match[0].length;
    const tag = String(match[1] || "").toLowerCase();
    const attrs = String(match[2] || "");
    const inner = match[3] || "";
    if (tag === "h2" || tag === "h3") {
      flushText();
      const text = htmlToPlain(inner);
      if (text) blocks.push(emptyHeadingBlock(text, tag === "h3" ? 3 : 2));
    } else if (tag === "ul" || tag === "ol") {
      flushText();
      blocks.push(...listFromHtml(inner));
    } else if (tag === "blockquote" || /\bclass=["'][^"']*\bquote\b/i.test(attrs)) {
      flushText();
      const text = htmlToPlain(inner);
      if (text) blocks.push({ type: "quote", text, speaker: "", title: "" });
    } else {
      textBuf.push(match[0]);
    }
  }
  if (last < src.length) textBuf.push(src.slice(last));
  flushText();
  return blocks;
}

function normalizeOne(block) {
  if (!block || typeof block !== "object") return [];
  const type = String(block.type || "").toLowerCase();
  if (type === "image" || type === "infographic") return [normalizeFigure(block, type)];
  if (type === "heading") {
    return [emptyHeadingBlock(block.text ?? block.content ?? block.title ?? "", block.level)];
  }
  if (type === "quote") {
    return [
      {
        type: "quote",
        text: String(block.text ?? block.content ?? "").trim(),
        speaker: String(block.speaker ?? block.author ?? "").trim(),
        title: String(block.title ?? block.role ?? "").trim(),
      },
    ];
  }
  if (type === "list") {
    return [
      {
        type: "list",
        title: String(block.title ?? "").trim(),
        items: coerceListItems(block.items),
        ...(resolvePlacement(block.placement) === "sidebar" ? { placement: "sidebar" } : {}),
      },
    ];
  }
  if (type === "html") {
    return [{ type: "html", html: String(block.html ?? block.body ?? block.text ?? "") }];
  }
  if (asText(block.html) && !asText(block.text) && !type) {
    const split = splitHtmlIntoBlocks(block.html);
    return split.length ? split : [emptyHtmlBlock(block.html)];
  }
  return expandTextMarkdownHeadings(String(block.text ?? block.content ?? block.body ?? "").trim());
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
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    const parsed = parseJsonBlocks(trimmed);
    if (parsed) return parsed;
  }
  return splitHtmlIntoBlocks(trimmed);
}

export function serializeBody(blocks) {
  const next = parseBody(blocks);
  if (!next.length) return "";
  return JSON.stringify(next);
}

export function ensureEditableBlocks(raw) {
  const blocks = parseBody(raw);
  return blocks.length ? blocks : [emptyTextBlock("")];
}

export function blockHasContent(block) {
  if (!block) return false;
  if (block.type === "image" || block.type === "infographic") {
    return Boolean(asText(block.imageUrl) || asText(block.prompt) || asText(block.title));
  }
  if (block.type === "list") {
    return Boolean(asText(block.title) || (Array.isArray(block.items) && block.items.some((item) => asText(item))));
  }
  if (block.type === "html") return htmlHasContent(block.html);
  return asText(block.text).length > 0;
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

export function applyFigurePromptOnlyPolicy(blocks, previousBody) {
  const prevList = parseBody(previousBody).filter(
    (block) => block.type === "image" || block.type === "infographic"
  );
  let prevIdx = 0;
  return parseBody(blocks).map((block) => {
    if (block.type !== "image" && block.type !== "infographic") return block;
    const prev = prevList[prevIdx++];
    const prompt = asText(block.prompt);
    const prevPrompt = asText(prev?.prompt);
    const prevUrl = asText(prev?.imageUrl);
    const sameKind = !prev || prev.type === block.type;
    const keepImage = Boolean(prev && sameKind && prevUrl && prompt && prompt === prevPrompt);
    return {
      ...block,
      imageUrl: keepImage ? prevUrl : "",
      libraryImageId: keepImage ? prev?.libraryImageId : undefined,
    };
  });
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
  const blocks = [...splitHtmlIntoBlocks(html), ...mergedFigures];
  return serializeBody(blocks);
}
