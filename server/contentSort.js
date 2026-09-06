function parseContentDate(value) {
  if (!value) return 0;
  if (value instanceof Date) {
    const time = value.getTime();
    return Number.isFinite(time) ? time : 0;
  }
  const raw = String(value).trim();
  if (!raw) return 0;
  const stripped = raw.replace(/,?\s*PRESS RELEASE\s*$/i, "").trim();
  const parsed = Date.parse(stripped) || Date.parse(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function contentTimestamp(item) {
  if (!item) return 0;
  return (
    parseContentDate(item.publishedAt) ||
    parseContentDate(item.published_at) ||
    parseContentDate(item.dateLabel) ||
    parseContentDate(item.date_label) ||
    parseContentDate(item.createdAt) ||
    parseContentDate(item.created_at) ||
    0
  );
}

export function sortNewestFirst(items) {
  return [...(items || [])].sort((a, b) => {
    const diff = contentTimestamp(b) - contentTimestamp(a);
    if (diff) return diff;
    return Number(b.id || 0) - Number(a.id || 0);
  });
}
