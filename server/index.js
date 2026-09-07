import "dotenv/config";
import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import path from "node:path";
import { seedSiteContent } from "./contentSeed.js";
import { createPool, initSchema } from "./db.js";
import {
  canAssignRole,
  canExploreDataModel,
  canManageBuilds,
  canManageContent,
  canManageCursorAgents,
  canManageMember,
  canManageTenants,
  canManageUsers,
  effectiveAppRole,
  isTenantRole,
  normalizeAppRole,
} from "./roles.js";
import {
  clearErrors,
  createCursorBrief,
  formatCursorPrompt,
  getBuildInfo,
  listCursorBriefs,
  listErrors,
  listRows,
  listTables,
  recordError,
} from "./ownerTools.js";
import { getAppearance, saveAppearance } from "./settings.js";
import {
  CONTENT_AI_TYPES,
  generateSiteContentDraft,
  generateTitleAlternatives,
  reviseSiteContentDraft,
  sanitizeHtml,
} from "./siteContentAi.js";
import { parseBody, serializeBody } from "./contentBody.js";
import { sortNewestFirst } from "./contentSort.js";
import {
  deleteLibraryImage,
  generateContentImage,
  listLibraryImages,
  uploadContentImage,
} from "./contentImages.js";
import { buildSitemapXml } from "./sitemap.js";

import {
  countActiveOwners,
  createTenant,
  createTenantInvite,
  ensurePersonalWorkspace,
  getInviteByToken,
  getMembershipForUser,
  getTenant,
  inviteFrontendUrl,
  listAllTenants,
  newInviteToken,
  listPendingInvites,
  listTenantMembers,
  slugify,
} from "./tenants.js";

const app = express();
const port = Number(process.env.API_PORT || 3001);
const host = process.env.API_HOST || "0.0.0.0";
const jwtSecret = process.env.JWT_SECRET || "dev-only-change-me";
const ownerEmail = String(process.env.OWNER_EMAIL || "")
  .trim()
  .toLowerCase();
const pool = createPool();

function corsOrigin() {
  const raw = String(process.env.CORS_ORIGIN || "").trim();
  if (!raw || raw === "true") return true;
  const list = raw.split(",").map((item) => item.trim().replace(/\/$/, "")).filter(Boolean);
  if (!list.length) return true;
  return list.length === 1 ? list[0] : list;
}

app.use(
  cors({
    origin: corsOrigin(),
  })
);
app.use(express.json({ limit: "8mb" }));
app.use("/content-images", express.static(path.join(process.cwd(), "public", "content-images")));

function requireDb(req, res, next) {
  if (!pool) {
    return res.status(503).json({
      error: "Postgres is not configured. Set POSTGRES_HOST or DATABASE_URL in .env.",
    });
  }
  next();
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return res.status(401).json({ error: "Sign in required" });
  try {
    req.user = jwt.verify(token, jwtSecret);
    next();
  } catch {
    res.status(401).json({ error: "Invalid session" });
  }
}

function tokenFor(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    jwtSecret,
    { expiresIn: "7d" }
  );
}

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

function persistableBody(raw) {
  const blocks = parseBody(raw).map((block) => {
    if (block.type === "html") return { ...block, html: sanitizeHtml(block.html) };
    const imageUrl = String(block.imageUrl || "").trim();
    return {
      ...block,
      imageUrl: /^javascript:/i.test(imageUrl) ? "" : imageUrl,
    };
  });
  return serializeBody(blocks);
}

function parseHashtags(value) {
  if (Array.isArray(value)) return value.map((tag) => String(tag).replace(/^#/, "").trim()).filter(Boolean);
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return parseHashtags(parsed);
  } catch {
    return String(value)
      .split(",")
      .map((tag) => tag.replace(/^#/, "").trim())
      .filter(Boolean);
  }
}

function mapContent(row) {
  return {
    id: row.id,
    type: row.type,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    summary: row.summary,
    body: row.body,
    hashtags: parseHashtags(row.hashtags),
    status: row.status,
    gated: Boolean(row.gated),
    pdfUrl: row.pdf_url,
    publishedAt: row.published_at,
    topicKey: row.topic_key,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapNews(row) {
  return {
    id: row.id,
    slug: row.slug,
    dateLabel: row.date_label,
    title: row.title,
    headline: row.headline,
    summary: row.summary,
    body: row.body,
    status: row.status || "published",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function isNewsVisible(item) {
  return String(item.status || "published").toLowerCase() === "published";
}

async function tryContentAdmin(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return false;
  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = await loadUser(payload.id);
    if (!user) return false;
    return canManageContent(effectiveAppRole(resolveGlobalRole(user.email, user.role)));
  } catch {
    return false;
  }
}

function isContentVisible(item) {
  if (String(item.status || "").toLowerCase() !== "published") return false;
  if (!item.publishedAt) return true;
  return new Date(item.publishedAt).getTime() <= Date.now();
}

function resolveGlobalRole(email, existingRole) {
  if (ownerEmail && email === ownerEmail) return "owner";
  return normalizeAppRole(existingRole);
}

async function loadUser(id) {
  const { rows } = await pool.query(
    "SELECT id, name, email, phone, role FROM users WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] || null;
}

async function sessionPayload(user, tenantId) {
  const memberships = await ensurePersonalWorkspace(pool, user);
  const globalRole = resolveGlobalRole(user.email, user.role);
  if (globalRole !== user.role) {
    await pool.query("UPDATE users SET role = ? WHERE id = ?", [globalRole, user.id]);
    user.role = globalRole;
  }
  const active =
    memberships.find((item) => String(item.tenantId) === String(tenantId)) || memberships[0] || null;
  const role = effectiveAppRole(globalRole, active?.role);
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role,
      globalRole,
    },
    memberships,
    tenantId: active?.tenantId || null,
    tenantRole: active?.role || null,
  };
}

async function actorForRequest(req) {
  const user = await loadUser(req.user.id);
  if (!user) return null;
  const requestedTenant = req.header("x-tenant-id") || req.query.tenantId || req.body?.tenantId;
  const session = await sessionPayload(user, requestedTenant);
  return { ...session, user: { ...session.user, id: user.id } };
}

function requireRole(check) {
  return asyncHandler(async (req, res, next) => {
    const actor = await actorForRequest(req);
    if (!actor) return res.status(401).json({ error: "Invalid session" });
    req.actor = actor;
    if (!check(actor.user.role, actor)) {
      return res.status(403).json({ error: "You do not have access to this action" });
    }
    next();
  });
}

app.get(["/sitemap.xml", "/api/sitemap.xml"], asyncHandler(async (_req, res) => {
  const xml = await buildSitemapXml({ pool });
  res.set("Content-Type", "application/xml; charset=utf-8");
  res.set("Cache-Control", "public, max-age=3600");
  res.send(xml);
}));

app.get("/api/health", async (_req, res) => {
  if (!pool) {
    return res.json({ ok: true, database: "unconfigured" });
  }
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, database: "postgres" });
  } catch (error) {
    res.status(503).json({ ok: false, error: error.message });
  }
});

app.get(
  "/api/settings",
  requireDb,
  asyncHandler(async (_req, res) => {
    res.json({ appearance: await getAppearance(pool) });
  })
);

app.patch(
  "/api/settings",
  requireDb,
  requireAuth,
  requireRole((role) => canManageContent(role)),
  asyncHandler(async (req, res) => {
    const appearance = await saveAppearance(pool, req.body?.appearance || req.body || {});
    res.json({ appearance });
  })
);

app.get(
  "/api/owner/builds",
  requireAuth,
  requireRole((role) => canManageBuilds(role)),
  asyncHandler(async (_req, res) => {
    res.json({ build: await getBuildInfo() });
  })
);

app.get(
  "/api/owner/errors",
  requireDb,
  requireAuth,
  requireRole((role) => canManageBuilds(role)),
  asyncHandler(async (_req, res) => {
    res.json({ errors: await listErrors(pool) });
  })
);

app.delete(
  "/api/owner/errors",
  requireDb,
  requireAuth,
  requireRole((role) => canManageBuilds(role)),
  asyncHandler(async (_req, res) => {
    await clearErrors(pool);
    res.json({ ok: true });
  })
);

app.get(
  "/api/owner/cursor",
  requireDb,
  requireAuth,
  requireRole((role) => canManageCursorAgents(role)),
  asyncHandler(async (_req, res) => {
    res.json({ briefs: await listCursorBriefs(pool) });
  })
);

app.post(
  "/api/owner/cursor",
  requireDb,
  requireAuth,
  requireRole((role) => canManageCursorAgents(role)),
  asyncHandler(async (req, res) => {
    const brief = await createCursorBrief(pool, {
      mode: req.body?.mode,
      prompt: req.body?.prompt,
      files: req.body?.files,
      createdBy: req.actor.user.id,
    });
    res.status(201).json({ brief, copyText: formatCursorPrompt(brief) });
  })
);

app.get(
  "/api/owner/data-model",
  requireDb,
  requireAuth,
  requireRole((role) => canExploreDataModel(role)),
  asyncHandler(async (_req, res) => {
    res.json({ tables: await listTables(pool) });
  })
);

app.get(
  "/api/owner/data-model/:table",
  requireDb,
  requireAuth,
  requireRole((role) => canExploreDataModel(role)),
  asyncHandler(async (req, res) => {
    const offset = Math.max(0, Number(req.query.offset) || 0);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 25));
    res.json(await listRows(pool, req.params.table, offset, limit));
  })
);

app.get(
  "/api/news",
  requireDb,
  asyncHandler(async (req, res) => {
    const admin = await tryContentAdmin(req);
    const { rows } = await pool.query(
      `SELECT id, slug, date_label, title, headline, summary, status, created_at, updated_at
       FROM news_articles ORDER BY created_at DESC, id DESC`
    );
    const articles = sortNewestFirst(rows.map(mapNews).filter((item) => (admin ? true : isNewsVisible(item))));
    res.json({ articles, admin });
  })
);

app.get(
  "/api/news/:slug",
  requireDb,
  asyncHandler(async (req, res) => {
    const slug = req.params.slug;
    const admin = await tryContentAdmin(req);
    const { rows: direct } = await pool.query(`SELECT * FROM news_articles WHERE slug = ? LIMIT 1`, [slug]);
    let row = direct[0];
    if (!row) {
      const { rows: aliased } = await pool.query(
        `SELECT a.*
         FROM news_aliases n
         JOIN news_articles a ON a.id = n.article_id
         WHERE n.slug = ?
         LIMIT 1`,
        [slug]
      );
      row = aliased[0];
    }
    if (!row) return res.status(404).json({ error: "Article not found" });
    const article = mapNews(row);
    if (!admin && !isNewsVisible(article)) return res.status(404).json({ error: "Article not found" });
    const { rows: siblings } = await pool.query(
      `SELECT slug, title, status, date_label, created_at FROM news_articles`
    );
    const visible = sortNewestFirst(
      siblings.filter((sibling) => admin || isNewsVisible(mapNews(sibling))).map(mapNews)
    );
    const index = visible.findIndex((sibling) => sibling.slug === article.slug);
    res.json({
      article,
      admin,
      newer: index > 0 ? { slug: visible[index - 1].slug, title: visible[index - 1].title } : null,
      older:
        index >= 0 && index < visible.length - 1
          ? { slug: visible[index + 1].slug, title: visible[index + 1].title }
          : null,
    });
  })
);

app.post(
  "/api/news",
  requireDb,
  requireAuth,
  requireRole((role) => canManageContent(role)),
  asyncHandler(async (req, res) => {
    const title = String(req.body.title || "Untitled").trim() || "Untitled";
    let slug = slugify(req.body.slug || title) || `draft-${Date.now().toString(36)}`;
    const { rows: clash } = await pool.query("SELECT id FROM news_articles WHERE slug = ? LIMIT 1", [slug]);
    if (clash[0]) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
    const status = ["draft", "published", "archived"].includes(req.body.status) ? req.body.status : "draft";
    const dateLabel = String(req.body.dateLabel || "").trim() || "PRESS RELEASE";
    const { insertId } = await pool.query(
      `INSERT INTO news_articles (slug, date_label, title, headline, summary, body, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       RETURNING id`,
      [
        slug,
        dateLabel,
        title,
        String(req.body.headline || "").trim() || null,
        String(req.body.summary || "").trim() || null,
        persistableBody(req.body.body),
        status,
      ]
    );
    const { rows } = await pool.query("SELECT * FROM news_articles WHERE id = ?", [insertId]);
    res.status(201).json({ article: mapNews(rows[0]) });
  })
);

app.patch(
  "/api/news/:id",
  requireDb,
  requireAuth,
  requireRole((role) => canManageContent(role)),
  asyncHandler(async (req, res) => {
    const { rows: existing } = await pool.query("SELECT * FROM news_articles WHERE id = ? LIMIT 1", [
      req.params.id,
    ]);
    if (!existing[0]) return res.status(404).json({ error: "Not found" });
    const current = existing[0];
    const title = req.body.title != null ? String(req.body.title).trim() : current.title;
    let slug = current.slug;
    if (req.body.slug != null) {
      slug = slugify(req.body.slug) || current.slug;
      const { rows: clash } = await pool.query(
        "SELECT id FROM news_articles WHERE slug = ? AND id <> ? LIMIT 1",
        [slug, current.id]
      );
      if (clash[0]) return res.status(409).json({ error: "That slug is already in use" });
    }
    const status = ["draft", "published", "archived"].includes(req.body.status)
      ? req.body.status
      : current.status || "published";
    await pool.query(
      `UPDATE news_articles SET
        title = ?, slug = ?, date_label = ?, headline = ?, summary = ?, body = ?, status = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        title || current.title,
        slug,
        req.body.dateLabel !== undefined ? String(req.body.dateLabel).trim() || "PRESS RELEASE" : current.date_label,
        req.body.headline !== undefined ? String(req.body.headline).trim() || null : current.headline,
        req.body.summary !== undefined ? String(req.body.summary).trim() || null : current.summary,
        req.body.body !== undefined ? persistableBody(req.body.body) : current.body,
        status,
        current.id,
      ]
    );
    const { rows } = await pool.query("SELECT * FROM news_articles WHERE id = ?", [current.id]);
    res.json({ article: mapNews(rows[0]) });
  })
);

app.get(
  "/api/content",
  requireDb,
  asyncHandler(async (req, res) => {
    const type = String(req.query.type || "").trim();
    if (!["blog", "whitepaper", "podcast"].includes(type)) {
      return res.status(400).json({ error: "type must be blog, whitepaper, or podcast" });
    }
    const admin = await tryContentAdmin(req);
    const { rows } = await pool.query(
      `SELECT * FROM site_content WHERE type = ? ORDER BY COALESCE(published_at, created_at) DESC, id DESC`,
      [type]
    );
    const items = sortNewestFirst(rows.map(mapContent).filter((item) => (admin ? true : isContentVisible(item))));
    res.json({ items, admin });
  })
);

app.post(
  "/api/content/generate",
  requireAuth,
  requireRole((role) => canManageContent(role)),
  asyncHandler(async (req, res) => {
    const type = String(req.body.type || "blog").trim();
    if (!CONTENT_AI_TYPES.has(type)) {
      return res.status(400).json({ error: "type must be news, blog, whitepaper, or podcast" });
    }
    const gen = await generateSiteContentDraft({
      type,
      topicKey: String(req.body.topicKey || "").trim() || undefined,
      topicTitle: String(req.body.topicTitle || "").trim() || undefined,
      topicSummary: String(req.body.topicSummary || "").trim() || undefined,
      instruction: String(req.body.instruction || "").trim() || undefined,
      draft: req.body.draft && typeof req.body.draft === "object" ? req.body.draft : undefined,
    });
    if (!gen.ok) return res.status(gen.statusCode || 502).json({ error: gen.message });
    res.json({ draft: gen.draft });
  })
);

app.post(
  "/api/content/revise",
  requireAuth,
  requireRole((role) => canManageContent(role)),
  asyncHandler(async (req, res) => {
    const instruction = String(req.body.instruction || "").trim();
    if (!instruction) return res.status(400).json({ error: "instruction is required" });
    const draft = req.body.draft && typeof req.body.draft === "object" ? req.body.draft : req.body;
    const rev = await reviseSiteContentDraft({ draft, instruction });
    if (!rev.ok) return res.status(rev.statusCode || 502).json({ error: rev.message });
    res.json({ draft: rev.draft });
  })
);

app.post(
  "/api/content/title-alternatives",
  requireAuth,
  requireRole((role) => canManageContent(role)),
  asyncHandler(async (req, res) => {
    const gen = await generateTitleAlternatives({
      type: String(req.body.type || "blog").trim(),
      prompt: String(req.body.prompt || "").trim(),
      currentTitle: String(req.body.currentTitle || "").trim() || undefined,
      currentSubtitle: String(req.body.currentSubtitle || "").trim() || undefined,
    });
    if (!gen.ok) return res.status(gen.statusCode || 502).json({ error: gen.message });
    res.json({ alternatives: gen.alternatives });
  })
);

app.get(
  "/api/content/images",
  requireDb,
  requireAuth,
  requireRole((role) => canManageContent(role)),
  asyncHandler(async (req, res) => {
    const images = await listLibraryImages(pool, req.query.limit);
    res.json({ images });
  })
);

app.post(
  "/api/content/images/generate",
  requireDb,
  requireAuth,
  requireRole((role) => canManageContent(role)),
  asyncHandler(async (req, res) => {
    const result = await generateContentImage({
      db: pool,
      prompt: String(req.body.prompt || "").trim(),
      title: String(req.body.title || req.body.caption || "").trim() || undefined,
      contentId: String(req.body.contentId || req.body.id || "").trim() || undefined,
      placement: String(req.body.placement || "").trim() || undefined,
      kind: String(req.body.kind || req.body.type || "").trim() || undefined,
      createdBy: req.actor?.user?.id,
    });
    if (!result.ok) return res.status(result.statusCode || 502).json({ error: result.message });
    res.json(result);
  })
);

app.post(
  "/api/content/images/upload",
  requireDb,
  requireAuth,
  requireRole((role) => canManageContent(role)),
  asyncHandler(async (req, res) => {
    const result = await uploadContentImage({
      db: pool,
      dataUrl: req.body.dataUrl || req.body.imageDataUrl,
      fileName: req.body.fileName,
      prompt: req.body.prompt,
      title: req.body.title || req.body.caption,
      contentId: req.body.contentId || req.body.id,
      placement: req.body.placement,
      kind: req.body.kind || req.body.type,
      createdBy: req.actor?.user?.id,
    });
    if (!result.ok) return res.status(result.statusCode || 400).json({ error: result.message });
    res.status(201).json(result);
  })
);

app.delete(
  "/api/content/images/:id",
  requireDb,
  requireAuth,
  requireRole((role) => canManageContent(role)),
  asyncHandler(async (req, res) => {
    const deleted = await deleteLibraryImage(pool, req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true, image: deleted });
  })
);

app.get(
  "/api/content/:slug",
  requireDb,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query("SELECT * FROM site_content WHERE slug = ? LIMIT 1", [
      req.params.slug,
    ]);
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    const item = mapContent(rows[0]);
    const admin = await tryContentAdmin(req);
    if (!admin && !isContentVisible(item)) return res.status(404).json({ error: "Not found" });
    const { rows: siblings } = await pool.query(
      `SELECT slug, title, status, published_at, created_at FROM site_content WHERE type = ?`,
      [item.type]
    );
    const visible = sortNewestFirst(
      siblings.filter((row) => admin || String(row.status).toLowerCase() === "published")
    );
    const index = visible.findIndex((row) => row.slug === item.slug);
    res.json({
      item,
      admin,
      newer: index > 0 ? { slug: visible[index - 1].slug, title: visible[index - 1].title } : null,
      older:
        index >= 0 && index < visible.length - 1
          ? { slug: visible[index + 1].slug, title: visible[index + 1].title }
          : null,
    });
  })
);

app.post(
  "/api/content",
  requireDb,
  requireAuth,
  requireRole((role) => canManageContent(role)),
  asyncHandler(async (req, res) => {
    const type = ["blog", "whitepaper", "podcast"].includes(req.body.type) ? req.body.type : "blog";
    const title = String(req.body.title || "Untitled").trim() || "Untitled";
    let slug = slugify(req.body.slug || title) || `draft-${Date.now().toString(36)}`;
    const { rows: clash } = await pool.query("SELECT id FROM site_content WHERE slug = ? LIMIT 1", [slug]);
    if (clash[0]) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
    const status = ["draft", "published", "archived"].includes(req.body.status)
      ? req.body.status
      : "draft";
    const publishedAt = status === "published" ? req.body.publishedAt || new Date() : req.body.publishedAt || null;
    const { insertId } = await pool.query(
      `INSERT INTO site_content
        (type, slug, title, subtitle, summary, body, hashtags, status, gated, pdf_url, published_at, created_by, tenant_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       RETURNING id`,
      [
        type,
        slug,
        title,
        String(req.body.subtitle || "").trim() || null,
        String(req.body.summary || "").trim() || null,
        persistableBody(req.body.body),
        JSON.stringify(parseHashtags(req.body.hashtags)),
        status,
        type === "whitepaper" ? false : Boolean(req.body.gated),
        String(req.body.pdfUrl || "").trim() || null,
        publishedAt,
        req.actor.user.id,
        req.actor.tenantId,
      ]
    );
    const { rows } = await pool.query("SELECT * FROM site_content WHERE id = ?", [insertId]);
    res.status(201).json({ item: mapContent(rows[0]) });
  })
);

app.patch(
  "/api/content/:id",
  requireDb,
  requireAuth,
  requireRole((role) => canManageContent(role)),
  asyncHandler(async (req, res) => {
    const { rows: existing } = await pool.query("SELECT * FROM site_content WHERE id = ? LIMIT 1", [
      req.params.id,
    ]);
    if (!existing[0]) return res.status(404).json({ error: "Not found" });
    const current = existing[0];
    const title = req.body.title != null ? String(req.body.title).trim() : current.title;
    let slug = current.slug;
    if (req.body.slug != null) {
      slug = slugify(req.body.slug) || current.slug;
      const { rows: clash } = await pool.query("SELECT id FROM site_content WHERE slug = ? AND id <> ? LIMIT 1", [
        slug,
        current.id,
      ]);
      if (clash[0]) return res.status(409).json({ error: "That slug is already in use" });
    }
    const status = ["draft", "published", "archived"].includes(req.body.status)
      ? req.body.status
      : current.status;
    let publishedAt = current.published_at;
    if (req.body.publishedAt !== undefined) publishedAt = req.body.publishedAt;
    if (status === "published" && !publishedAt) publishedAt = new Date();
    await pool.query(
      `UPDATE site_content SET
        title = ?, slug = ?, subtitle = ?, summary = ?, body = ?, hashtags = ?,
        status = ?, gated = ?, pdf_url = ?, published_at = ?, seo_title = ?, seo_description = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        title || current.title,
        slug,
        req.body.subtitle !== undefined ? String(req.body.subtitle).trim() || null : current.subtitle,
        req.body.summary !== undefined ? String(req.body.summary).trim() || null : current.summary,
        req.body.body !== undefined ? persistableBody(req.body.body) : current.body,
        req.body.hashtags !== undefined ? JSON.stringify(parseHashtags(req.body.hashtags)) : current.hashtags,
        status,
        current.type === "whitepaper"
          ? false
          : req.body.gated !== undefined
            ? Boolean(req.body.gated)
            : current.gated,
        req.body.pdfUrl !== undefined ? String(req.body.pdfUrl).trim() || null : current.pdf_url,
        publishedAt,
        req.body.seoTitle !== undefined ? String(req.body.seoTitle).trim() || null : current.seo_title,
        req.body.seoDescription !== undefined
          ? String(req.body.seoDescription).trim() || null
          : current.seo_description,
        current.id,
      ]
    );
    const { rows } = await pool.query("SELECT * FROM site_content WHERE id = ?", [current.id]);
    res.json({ item: mapContent(rows[0]) });
  })
);

app.post(
  "/api/contact",
  requireDb,
  asyncHandler(async (req, res) => {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const message = String(req.body.message || "").trim();
    const newsletter = Boolean(req.body.newsletter);
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    await pool.query(
      "INSERT INTO contact_submissions (name, email, message, newsletter) VALUES (?, ?, ?, ?)",
      [name, email, message, newsletter]
    );
    if (newsletter) {
      await pool.query(
        "INSERT INTO newsletter_subscribers (email) VALUES (?) ON CONFLICT (email) DO NOTHING",
        [email]
      );
    }
    res.status(201).json({ ok: true });
  })
);

app.post(
  "/api/auth/register",
  requireDb,
  asyncHandler(async (req, res) => {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body.password || "");
    const phone = String(req.body.phone || "").trim();
    if (!name || !email || password.length < 8) {
      return res.status(400).json({ error: "Name, email, and an 8+ character password are required" });
    }

    const { rows: existing } = await pool.query("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
    if (existing[0]) return res.status(409).json({ error: "An account with that email already exists" });

    const role = resolveGlobalRole(email, "user");
    const passwordHash = await bcrypt.hash(password, 12);
    const { insertId } = await pool.query(
      "INSERT INTO users (name, email, password_hash, role, phone) VALUES (?, ?, ?, ?, ?) RETURNING id",
      [name, email, passwordHash, role, phone || null]
    );
    const user = { id: insertId, name, email, phone, role };
    const session = await sessionPayload(user, null);
    res.status(201).json({ ...session, token: tokenFor(session.user) });
  })
);

app.post(
  "/api/auth/login",
  requireDb,
  asyncHandler(async (req, res) => {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body.password || "");
    const { rows } = await pool.query(
      "SELECT id, name, email, phone, role, password_hash FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    const row = rows[0];
    if (!row || !(await bcrypt.compare(password, row.password_hash))) {
      return res.status(401).json({ error: "Email or password is incorrect" });
    }
    const session = await sessionPayload(row, req.body.tenantId);
    res.json({ ...session, token: tokenFor(session.user) });
  })
);

app.get(
  "/api/auth/me",
  requireDb,
  requireAuth,
  asyncHandler(async (req, res) => {
    const actor = await actorForRequest(req);
    if (!actor) return res.status(401).json({ error: "Invalid session" });
    res.json(actor);
  })
);

app.post(
  "/api/tenants",
  requireDb,
  requireAuth,
  requireRole((role, actor) => canManageTenants(role) || actor.memberships.some((item) => item.role === "owner")),
  asyncHandler(async (req, res) => {
    const tenant = await createTenant(pool, {
      name: req.body.name,
      ownerUserId: req.actor.user.id,
    });
    const session = await sessionPayload(req.actor.user, tenant.id);
    res.status(201).json({ tenant, ...session });
  })
);

app.get(
  "/api/tenants",
  requireDb,
  requireAuth,
  requireRole((role) => canManageUsers(role) || canManageTenants(role)),
  asyncHandler(async (req, res) => {
    const tenants = canManageTenants(req.actor.user.role)
      ? await listAllTenants(pool)
      : (await Promise.all(req.actor.memberships.map((item) => getTenant(pool, item.tenantId)))).filter(Boolean);
    res.json({ tenants, memberships: req.actor.memberships });
  })
);

app.patch(
  "/api/tenants/:id",
  requireDb,
  requireAuth,
  requireRole((role) => canManageTenants(role)),
  asyncHandler(async (req, res) => {
    const tenant = await getTenant(pool, req.params.id);
    if (!tenant) return res.status(404).json({ error: "Workspace not found" });
    const name = req.body.name != null ? String(req.body.name).trim() : tenant.name;
    const slug = req.body.slug != null ? slugify(req.body.slug) || tenant.slug : tenant.slug;
    await pool.query(
      `UPDATE tenants SET name = ?, slug = ?, brand_name = ?, support_email = ?, support_phone = ? WHERE id = ?`,
      [
        name || tenant.name,
        slug,
        req.body.brandName !== undefined ? String(req.body.brandName).trim() || null : tenant.brandName,
        req.body.supportEmail !== undefined ? String(req.body.supportEmail).trim() || null : tenant.supportEmail,
        req.body.supportPhone !== undefined ? String(req.body.supportPhone).trim() || null : tenant.supportPhone,
        tenant.id,
      ]
    );
    res.json({ tenant: await getTenant(pool, tenant.id) });
  })
);

app.get(
  "/api/tenants/:id/members",
  requireDb,
  requireAuth,
  requireRole((role) => canManageUsers(role)),
  asyncHandler(async (req, res) => {
    if (!canManageTenants(req.actor.user.role)) {
      const membership = await getMembershipForUser(pool, req.params.id, req.actor.user.id);
      if (!membership || !canManageUsers(effectiveAppRole(req.actor.user.globalRole, membership.role))) {
        return res.status(403).json({ error: "Select a workspace you can manage" });
      }
    }
    const [members, invites] = await Promise.all([
      listTenantMembers(pool, req.params.id),
      listPendingInvites(pool, req.params.id),
    ]);
    res.json({ members, invites });
  })
);

app.post(
  "/api/tenants/:id/invites",
  requireDb,
  requireAuth,
  requireRole((role) => canManageUsers(role)),
  asyncHandler(async (req, res) => {
    const tenantId = req.params.id;
    const membership = await getMembershipForUser(pool, tenantId, req.actor.user.id);
    const actorRole = canManageTenants(req.actor.user.role)
      ? "owner"
      : membership?.role || req.actor.tenantRole;
    if (!actorRole || !canManageUsers(effectiveAppRole(req.actor.user.globalRole, actorRole))) {
      return res.status(403).json({ error: "You cannot invite users to this workspace" });
    }
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const role = isTenantRole(req.body.role) ? req.body.role : "member";
    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!canAssignRole(actorRole === "member" ? "user" : actorRole, role)) {
      return res.status(403).json({ error: "You cannot assign that role" });
    }
    const invite = await createTenantInvite(pool, {
      tenantId,
      email,
      name: String(req.body.name || "").trim() || null,
      phone: String(req.body.phone || "").trim() || null,
      role,
      invitedByUserId: req.actor.user.id,
    });
    res.status(201).json({ invite, inviteUrl: inviteFrontendUrl(invite.token) });
  })
);

app.delete(
  "/api/invites/:id",
  requireDb,
  requireAuth,
  requireRole((role) => canManageUsers(role)),
  asyncHandler(async (req, res) => {
    await pool.query("DELETE FROM tenant_invites WHERE id = ? AND accepted_at IS NULL", [req.params.id]);
    res.json({ ok: true });
  })
);

app.post(
  "/api/invites/:id/resend",
  requireDb,
  requireAuth,
  requireRole((role) => canManageUsers(role)),
  asyncHandler(async (req, res) => {
    const token = newInviteToken();
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const { rowCount } = await pool.query(
      `UPDATE tenant_invites SET token = ?, expires_at = ? WHERE id = ? AND accepted_at IS NULL`,
      [token, expiresAt, req.params.id]
    );
    if (!rowCount) return res.status(404).json({ error: "Invite not found" });
    res.json({ inviteUrl: inviteFrontendUrl(token) });
  })
);

app.get(
  "/api/invites/:token",
  requireDb,
  asyncHandler(async (req, res) => {
    const invite = await getInviteByToken(pool, req.params.token);
    if (!invite) return res.status(404).json({ error: "Invite not found" });
    res.json({
      email: invite.email,
      role: invite.role,
      tenantId: invite.tenant_id,
      tenantName: invite.tenant_name,
      expired: new Date(invite.expires_at).getTime() < Date.now(),
      accepted: Boolean(invite.accepted_at),
    });
  })
);

app.post(
  "/api/invites/:token/accept",
  requireDb,
  requireAuth,
  asyncHandler(async (req, res) => {
    const invite = await getInviteByToken(pool, req.params.token);
    if (!invite) return res.status(404).json({ error: "Invite not found" });
    if (invite.accepted_at) return res.status(409).json({ error: "Invite already accepted" });
    if (new Date(invite.expires_at).getTime() < Date.now()) {
      return res.status(410).json({ error: "Invite expired" });
    }
    const user = await loadUser(req.user.id);
    if (!user) return res.status(401).json({ error: "Invalid session" });
    if (user.email.toLowerCase() !== String(invite.email).toLowerCase()) {
      return res.status(403).json({ error: "Signed-in email does not match invite" });
    }
    const role = isTenantRole(invite.role) ? invite.role : "member";
    await pool.query(
      `INSERT INTO tenant_memberships (tenant_id, user_id, role, status)
       VALUES (?, ?, ?, 'active')
       ON CONFLICT (tenant_id, user_id)
       DO UPDATE SET role = EXCLUDED.role, status = 'active'`,
      [invite.tenant_id, user.id, role]
    );
    if (invite.name || invite.phone) {
      await pool.query("UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone) WHERE id = ?", [
        invite.name,
        invite.phone,
        user.id,
      ]);
    }
    await pool.query("UPDATE tenant_invites SET accepted_at = NOW() WHERE id = ?", [invite.id]);
    const session = await sessionPayload(user, invite.tenant_id);
    res.json({ ...session, token: tokenFor(session.user) });
  })
);

app.patch(
  "/api/members/:id",
  requireDb,
  requireAuth,
  requireRole((role) => canManageUsers(role)),
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT m.id, m.tenant_id AS "tenantId", m.user_id AS "userId", m.role, m.status,
              u.name, u.email, u.phone
       FROM tenant_memberships m
       INNER JOIN users u ON u.id = m.user_id
       WHERE m.id = ? LIMIT 1`,
      [req.params.id]
    );
    const member = rows[0];
    if (!member) return res.status(404).json({ error: "User not found" });
    const membership = await getMembershipForUser(pool, member.tenantId, req.actor.user.id);
    const actorRole = canManageTenants(req.actor.user.role)
      ? "owner"
      : membership?.role || req.actor.tenantRole;
    if (!canManageMember(actorRole === "member" ? "user" : actorRole, member.role)) {
      return res.status(403).json({ error: "You cannot manage that user" });
    }
    if (req.body.role && !canAssignRole(actorRole === "member" ? "user" : actorRole, req.body.role)) {
      return res.status(403).json({ error: "You cannot assign that role" });
    }
    if (req.body.role === "member" || (req.body.status === "inactive" && member.role === "owner")) {
      const owners = await countActiveOwners(pool, member.tenantId);
      if (member.role === "owner" && owners <= 1) {
        return res.status(400).json({ error: "A workspace must keep at least one owner" });
      }
    }
    if (req.body.name != null || req.body.phone != null) {
      await pool.query("UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone) WHERE id = ?", [
        req.body.name != null ? String(req.body.name).trim() : null,
        req.body.phone != null ? String(req.body.phone).trim() : null,
        member.userId,
      ]);
    }
    if (req.body.role || req.body.status) {
      await pool.query(
        `UPDATE tenant_memberships SET role = COALESCE(?, role), status = COALESCE(?, status) WHERE id = ?`,
        [isTenantRole(req.body.role) ? req.body.role : null, req.body.status || null, member.id]
      );
    }
    res.json({ ok: true });
  })
);

app.delete(
  "/api/members/:id",
  requireDb,
  requireAuth,
  requireRole((role) => canManageUsers(role)),
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT id, tenant_id AS "tenantId", user_id AS "userId", role FROM tenant_memberships WHERE id = ? LIMIT 1`,
      [req.params.id]
    );
    const member = rows[0];
    if (!member) return res.status(404).json({ error: "User not found" });
    if (String(member.userId) === String(req.actor.user.id)) {
      return res.status(400).json({ error: "You cannot remove yourself" });
    }
    const membership = await getMembershipForUser(pool, member.tenantId, req.actor.user.id);
    const actorRole = canManageTenants(req.actor.user.role)
      ? "owner"
      : membership?.role || req.actor.tenantRole;
    if (!canManageMember(actorRole === "member" ? "user" : actorRole, member.role)) {
      return res.status(403).json({ error: "You cannot remove that user" });
    }
    if (member.role === "owner" && (await countActiveOwners(pool, member.tenantId)) <= 1) {
      return res.status(400).json({ error: "A workspace must keep at least one owner" });
    }
    await pool.query("DELETE FROM tenant_memberships WHERE id = ?", [member.id]);
    res.json({ ok: true });
  })
);

app.post(
  "/api/members/:id/password",
  requireDb,
  requireAuth,
  requireRole((role) => canManageUsers(role)),
  asyncHandler(async (req, res) => {
    const password = String(req.body.password || "");
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }
    const { rows } = await pool.query(
      `SELECT m.id, m.user_id AS "userId", m.role, m.tenant_id AS "tenantId"
       FROM tenant_memberships m WHERE m.id = ? LIMIT 1`,
      [req.params.id]
    );
    const member = rows[0];
    if (!member) return res.status(404).json({ error: "User not found" });
    const hash = await bcrypt.hash(password, 12);
    await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [hash, member.userId]);
    res.json({ ok: true });
  })
);

app.use((error, req, res, _next) => {
  console.error(error);
  void recordError(pool, error, req);
  res.status(error.status || 503).json({
    error:
      error.code === "ECONNREFUSED"
        ? "Cannot reach Postgres."
        : error.message,
  });
});

async function seedContent(db) {
  await db.query("UPDATE site_content SET gated = FALSE WHERE type = 'whitepaper'");
  for (const item of seedSiteContent) {
    const { rows } = await db.query("SELECT id FROM site_content WHERE slug = ? LIMIT 1", [item.slug]);
    if (rows[0]) continue;
    await db.query(
      `INSERT INTO site_content
        (type, slug, title, subtitle, summary, body, hashtags, status, gated, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item.type,
        item.slug,
        item.title,
        item.subtitle,
        item.summary,
        item.body,
        JSON.stringify(item.hashtags),
        item.status,
        Boolean(item.gated),
        item.publishedAt,
      ]
    );
  }
}

export { app };

export async function ensureDatabase() {
  if (!pool) {
    console.warn("Postgres is not configured. API routes that need the database will return 503.");
    return;
  }
  try {
    await initSchema(pool);
    await seedContent(pool);
    console.log("Postgres schema ready");
  } catch (error) {
    console.error("Database setup failed:", error.message);
  }
}

async function start() {
  await ensureDatabase();
  app.listen(port, host, () => {
    console.log(`API listening on http://${host}:${port}`);
  });
}

if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  start();
}
