export function normalizeAppRole(value) {
  return value === "owner" || value === "admin" ? value : "user";
}

export function canManageTenants(role) {
  return role === "owner";
}

export function canManageUsers(role) {
  return role === "owner" || role === "admin";
}

export function canManageContent(role) {
  return role === "owner" || role === "admin";
}

export function canManageBuilds(role) {
  return role === "owner";
}

export function canManageCursorAgents(role) {
  return role === "owner";
}

export function canExploreDataModel(role) {
  return role === "owner";
}

export function canManageMember(actorRole, targetRole) {
  if (actorRole === "owner") return true;
  if (actorRole === "admin") return targetRole !== "owner";
  return false;
}

export function roleLabel(role) {
  if (role === "owner") return "Owner";
  if (role === "admin") return "Admin";
  if (role === "member") return "Member";
  return "User";
}

export function contentPath(item) {
  if (item?.type === "whitepaper") return `/papers/${item.slug}`;
  if (item?.type === "podcast") return `/podcasts/${item.slug}`;
  if (item?.type === "news") return `/${item.slug}`;
  return `/blog/${item.slug}`;
}

export function formatContentDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function contentStatusLabel(item) {
  const status = String(item?.status || "draft").toLowerCase();
  if (status === "published" && item?.publishedAt && new Date(item.publishedAt).getTime() > Date.now()) {
    return "scheduled";
  }
  return status;
}

export function slugifyTitle(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
