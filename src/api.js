import outputs from "../amplify_outputs.json";

const base = String(import.meta.env.VITE_API_URL || outputs?.custom?.dataApiUrl || "")
  .trim()
  .replace(/\/$/, "");

function authHeader() {
  const token = localStorage.getItem("ingenio-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function tenantHeader() {
  const tenantId = localStorage.getItem("ingenio-tenant");
  return tenantId ? { "X-Tenant-Id": tenantId } : {};
}

async function request(path, options = {}) {
  const response = await fetch(`${base}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
      ...tenantHeader(),
      ...(options.headers || {}),
    },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

export const api = {
  health: () => request("/api/health"),
  news: () => request("/api/news"),
  article: (slug) => request(`/api/news/${encodeURIComponent(slug)}`),
  contact: (body) => request("/api/contact", { method: "POST", body: JSON.stringify(body) }),
  register: (body) => request("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/api/auth/me"),
  siteSettings: () => request("/api/settings"),
  updateSiteSettings: (appearance) =>
    request("/api/settings", { method: "PATCH", body: JSON.stringify({ appearance }) }),
  content: (type) => request(`/api/content?type=${encodeURIComponent(type)}`),
  contentBySlug: (slug) => request(`/api/content/${encodeURIComponent(slug)}`),
  createContent: (body) => request("/api/content", { method: "POST", body: JSON.stringify(body) }),
  updateContent: (id, body) =>
    request(`/api/content/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(body) }),
  createNews: (body) => request("/api/news", { method: "POST", body: JSON.stringify(body) }),
  updateNews: (id, body) =>
    request(`/api/news/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(body) }),
  generateContent: (body) => request("/api/content/generate", { method: "POST", body: JSON.stringify(body) }),
  reviseContent: (body) => request("/api/content/revise", { method: "POST", body: JSON.stringify(body) }),
  contentTitleAlternatives: (body) =>
    request("/api/content/title-alternatives", { method: "POST", body: JSON.stringify(body) }),
  contentImages: () => request("/api/content/images"),
  generateContentImage: (body) =>
    request("/api/content/images/generate", { method: "POST", body: JSON.stringify(body) }),
  uploadContentImage: (body) =>
    request("/api/content/images/upload", { method: "POST", body: JSON.stringify(body) }),
  deleteContentImage: (id) => request(`/api/content/images/${encodeURIComponent(id)}`, { method: "DELETE" }),
  tenants: () => request("/api/tenants"),
  createTenant: (name) => request("/api/tenants", { method: "POST", body: JSON.stringify({ name }) }),
  updateTenant: (id, body) =>
    request(`/api/tenants/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(body) }),
  members: (tenantId) => request(`/api/tenants/${encodeURIComponent(tenantId)}/members`),
  inviteMember: (tenantId, body) =>
    request(`/api/tenants/${encodeURIComponent(tenantId)}/invites`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  revokeInvite: (id) => request(`/api/invites/${encodeURIComponent(id)}`, { method: "DELETE" }),
  resendInvite: (id) => request(`/api/invites/${encodeURIComponent(id)}/resend`, { method: "POST" }),
  invite: (token) => request(`/api/invites/${encodeURIComponent(token)}`),
  acceptInvite: (token) => request(`/api/invites/${encodeURIComponent(token)}/accept`, { method: "POST" }),
  updateMember: (id, body) =>
    request(`/api/members/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(body) }),
  removeMember: (id) => request(`/api/members/${encodeURIComponent(id)}`, { method: "DELETE" }),
  resetMemberPassword: (id, password) =>
    request(`/api/members/${encodeURIComponent(id)}/password`, {
      method: "POST",
      body: JSON.stringify({ password }),
    }),
  ownerBuilds: () => request("/api/owner/builds"),
  ownerBuildLog: (branch, jobId) =>
    request(`/api/owner/builds/${encodeURIComponent(branch)}/${encodeURIComponent(jobId)}`),
  deleteOwnerBuild: (branch, jobId) =>
    request(`/api/owner/builds/${encodeURIComponent(branch)}/${encodeURIComponent(jobId)}`, { method: "DELETE" }),
  ownerErrors: (opts = {}) => {
    const params = new URLSearchParams();
    if (opts.limit) params.set("limit", String(opts.limit));
    if (opts.offset) params.set("offset", String(opts.offset));
    if (opts.source) params.set("source", opts.source);
    if (opts.severity) params.set("severity", opts.severity);
    if (opts.q) params.set("q", opts.q);
    const query = params.toString();
    return request(`/api/owner/errors${query ? `?${query}` : ""}`);
  },
  ownerError: (id) => request(`/api/owner/errors/${encodeURIComponent(id)}`),
  deleteOwnerError: (id) => request(`/api/owner/errors/${encodeURIComponent(id)}`, { method: "DELETE" }),
  deleteOwnerErrors: (ids) => request("/api/owner/errors", { method: "DELETE", body: JSON.stringify({ ids }) }),
  recordClientError: (body) => request("/api/errors", { method: "POST", body: JSON.stringify(body) }),
  ownerCursor: () => request("/api/owner/cursor"),
  createCursorBrief: (body) => request("/api/owner/cursor", { method: "POST", body: JSON.stringify(body) }),
  dataModel: () => request("/api/owner/data-model"),
  dataModelRows: (table, offset = 0) =>
    request(`/api/owner/data-model/${encodeURIComponent(table)}?offset=${offset}`),
};
