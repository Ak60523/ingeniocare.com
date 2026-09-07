/** Lightweight inline markdown for content text: **bold**, *italic*, [label](url), bare URLs. */

const BOLD_ITALIC_RE = /(\*\*[^*]+\*\*|\*[^*]+\*|__[^_]+__|_[^_]+_)/g;
const LINK_SPLIT_RE = /(\[[^\]]+\]\(https?:\/\/[^)\s]+\)|https?:\/\/[^\s<>\[\]"'{}|\\^`]+)/g;

export function splitParagraphs(raw) {
  return String(raw ?? "")
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function wrapTextareaSelection(textarea, marker) {
  if (!textarea) return null;
  const start = textarea.selectionStart ?? 0;
  const end = textarea.selectionEnd ?? 0;
  const value = String(textarea.value ?? "");
  const selected = value.slice(start, end);
  const inner = selected || "text";
  const next = `${value.slice(0, start)}${marker}${inner}${marker}${value.slice(end)}`;
  const selStart = start + marker.length;
  return { value: next, selectionStart: selStart, selectionEnd: selStart + inner.length };
}

function trimUrlTrailingPunct(url) {
  let href = String(url || "");
  let trailing = "";
  while (/[.,;:!?)\]}>'"]$/.test(href)) {
    trailing = href.slice(-1) + trailing;
    href = href.slice(0, -1);
  }
  return { href, trailing };
}

function parseBoldItalic(raw) {
  const text = String(raw ?? "");
  if (!text) return [];
  const parts = [];
  let last = 0;
  let match;
  const re = new RegExp(BOLD_ITALIC_RE.source, "g");
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push({ type: "text", text: text.slice(last, match.index) });
    const token = match[0];
    if (token.startsWith("**") || token.startsWith("__")) {
      parts.push({ type: "bold", text: token.slice(2, -2) });
    } else {
      parts.push({ type: "italic", text: token.slice(1, -1) });
    }
    last = match.index + token.length;
  }
  if (last < text.length) parts.push({ type: "text", text: text.slice(last) });
  return parts.length ? parts : [{ type: "text", text }];
}

export function parseInlineMarkdown(raw) {
  const text = String(raw ?? "");
  if (!text) return [];
  const out = [];
  let last = 0;
  let match;
  const re = new RegExp(LINK_SPLIT_RE.source, "g");
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) out.push(...parseBoldItalic(text.slice(last, match.index)));
    const token = match[0];
    const md = token.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
    if (md) {
      out.push({ type: "link", text: md[1], href: md[2] });
    } else {
      const { href, trailing } = trimUrlTrailingPunct(token);
      if (href) out.push({ type: "link", text: href, href });
      if (trailing) out.push({ type: "text", text: trailing });
    }
    last = match.index + token.length;
  }
  if (last < text.length) out.push(...parseBoldItalic(text.slice(last)));
  return out.length ? out : [{ type: "text", text }];
}
