const IDENT = /^[a-z_][a-z0-9_]*$/i;
const SECRET = /hash|password|secret|token/i;
const TABLE_NOTES = {
  users: "Accounts and global roles.",
  tenants: "Workspaces the owner can switch between.",
  tenant_memberships: "User-to-workspace roles.",
  tenant_invites: "Pending workspace invites.",
  contact_submissions: "Contact form messages.",
  newsletter_subscribers: "Newsletter emails.",
  news_articles: "Press and news pages.",
  news_aliases: "Legacy slugs pointing at news.",
  site_content: "Blogs, papers, and podcasts.",
  content_images: "Generated and uploaded article figures.",
  site_settings: "Public appearance (fonts, sizes, colors).",
  site_errors: "Application error logs from the API, workers, and clients.",
  cursor_briefs: "Owner Cursor prompts.",
};

const CURSOR_MODES = ["agent", "ask", "plan"];

export function isCursorMode(value) {
  return CURSOR_MODES.includes(value);
}

export async function listTables(db) {
  const { rows } = await db.query(
    `SELECT table_name AS name
     FROM information_schema.tables
     WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
     ORDER BY table_name`
  );
  const tables = [];
  for (const row of rows) {
    const columns = await listColumns(db, row.name);
    const { rows: countRows } = await db.query(
      `SELECT COUNT(*)::int AS count FROM ${quoteIdent(row.name)}`
    );
    tables.push({
      name: row.name,
      label: labelize(row.name),
      description: TABLE_NOTES[row.name] || "Application table.",
      rowCount: countRows[0]?.count || 0,
      columns,
    });
  }
  return tables;
}

export async function listColumns(db, table) {
  const { rows } = await db.query(
    `SELECT column_name AS name, data_type AS type, is_nullable AS nullable, column_default AS default_value
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = ?
     ORDER BY ordinal_position`,
    [table]
  );
  return rows.map((col) => ({
    name: col.name,
    type: col.type,
    nullable: col.nullable === "YES",
    defaultValue: col.default_value,
    secret: SECRET.test(col.name),
  }));
}

export async function assertPublicTable(db, table) {
  if (!IDENT.test(table)) {
    const error = new Error("Invalid table name");
    error.status = 400;
    throw error;
  }
  const { rows } = await db.query(
    `SELECT table_name FROM information_schema.tables
     WHERE table_schema = 'public' AND table_type = 'BASE TABLE' AND table_name = ?`,
    [table]
  );
  if (!rows[0]) {
    const error = new Error("Table not found");
    error.status = 404;
    throw error;
  }
  return table;
}

export async function listRows(db, table, offset = 0, limit = 25) {
  const safe = await assertPublicTable(db, table);
  const columns = await listColumns(db, safe);
  const { rows: countRows } = await db.query(`SELECT COUNT(*)::int AS count FROM ${quoteIdent(safe)}`);
  const { rows } = await db.query(
    `SELECT * FROM ${quoteIdent(safe)} ORDER BY 1 DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  return {
    total: countRows[0]?.count || 0,
    offset,
    limit,
    columns,
    rows: rows.map((row) => redactRow(row, columns)),
  };
}

function redactRow(row, columns) {
  const next = { ...row };
  for (const col of columns) {
    if (col.secret && next[col.name] != null) next[col.name] = "••••";
  }
  return next;
}

function quoteIdent(name) {
  return `"${name.replace(/"/g, "")}"`;
}

function labelize(name) {
  return String(name)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

const MESSAGE_MAX = 2000;
const STACK_MAX = 8000;
const CONTEXT_MAX = 8000;
const ERROR_SOURCES = new Set(["api", "client", "worker"]);
const ERROR_SEVERITIES = new Set(["error", "warn"]);

function truncate(value, max) {
  const text = String(value || "");
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

function sanitizeContext(context) {
  if (!context || typeof context !== "object") return null;
  try {
    const raw = JSON.stringify(context);
    if (raw.length <= CONTEXT_MAX) return raw;
    return JSON.stringify({ truncated: true, preview: truncate(raw, CONTEXT_MAX) });
  } catch {
    return JSON.stringify({ note: "context_serialize_failed" });
  }
}

export function isErrorSource(value) {
  return ERROR_SOURCES.has(String(value || ""));
}

export function isErrorSeverity(value) {
  return ERROR_SEVERITIES.has(String(value || ""));
}

export async function recordError(db, error, req, extra = {}) {
  if (!db) return null;
  const source = isErrorSource(extra.source) ? extra.source : "api";
  const severity = isErrorSeverity(extra.severity) ? extra.severity : "error";
  const message = truncate(extra.message || error?.message || error || "Unknown error", MESSAGE_MAX);
  const stack = truncate(error?.stack || extra.stack || "", STACK_MAX) || null;
  const context = sanitizeContext(extra.context);
  try {
    const { rows } = await db.query(
      `INSERT INTO site_errors
         (message, stack, path, method, source, severity, code, tenant_id, user_id, request_id, context)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?::jsonb)
       RETURNING id`,
      [
        message,
        stack,
        extra.path || (extra.source === "client" ? null : req?.originalUrl) || null,
        extra.method || (extra.source === "client" ? null : req?.method) || null,
        source,
        severity,
        extra.code ? String(extra.code).slice(0, 100) : null,
        extra.tenantId || req?.actor?.tenantId || null,
        extra.userId || req?.actor?.user?.id || req?.user?.id || null,
        extra.requestId || req?.headers?.["x-amzn-requestid"] || req?.headers?.["x-request-id"] || null,
        context,
      ]
    );
    return rows[0]?.id || null;
  } catch (persistErr) {
    console.error("[site_errors] persist failed", persistErr?.message || persistErr);
    return null;
  }
}

const ERROR_SELECT = `id, message, stack, path, method, source, severity, code,
      tenant_id AS "tenantId", user_id AS "userId", request_id AS "requestId",
      context, created_at AS "createdAt"`;

export async function listErrors(db, opts = {}) {
  const limit = Math.min(Math.max(Number(opts.limit) || 50, 1), 100);
  const offset = Math.max(Number(opts.offset) || 0, 0);
  const filters = [];
  const params = [];
  if (isErrorSource(opts.source)) {
    filters.push("source = ?");
    params.push(opts.source);
  }
  if (isErrorSeverity(opts.severity)) {
    filters.push("severity = ?");
    params.push(opts.severity);
  }
  const q = String(opts.q || "").trim();
  if (q) {
    const pattern = `%${q}%`;
    filters.push(
      `(message ILIKE ? OR COALESCE(code, '') ILIKE ? OR COALESCE(path, '') ILIKE ? OR COALESCE(request_id, '') ILIKE ?)`
    );
    params.push(pattern, pattern, pattern, pattern);
  }
  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const { rows } = await db.query(
    `SELECT ${ERROR_SELECT} FROM site_errors ${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  const { rows: countRows } = await db.query(`SELECT COUNT(*)::int AS count FROM site_errors ${where}`, params);
  return {
    items: rows,
    total: countRows[0]?.count || 0,
    limit,
    offset,
  };
}

export async function getErrorById(db, id) {
  if (!/^\d+$/.test(String(id || ""))) return null;
  const { rows } = await db.query(`SELECT ${ERROR_SELECT} FROM site_errors WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

export async function deleteErrorsByIds(db, ids) {
  const next = [...new Set((ids || []).map((id) => String(id || "").trim()).filter((id) => /^\d+$/.test(id)))];
  if (!next.length) return 0;
  const placeholders = next.map(() => "?").join(", ");
  const { rowCount } = await db.query(`DELETE FROM site_errors WHERE id IN (${placeholders})`, next);
  return rowCount || 0;
}

export async function listCursorBriefs(db) {
  const { rows } = await db.query(
    `SELECT id, mode, prompt, files, created_at AS "createdAt"
     FROM cursor_briefs ORDER BY id DESC LIMIT 40`
  );
  return rows;
}

export async function createCursorBrief(db, { mode, prompt, files, createdBy }) {
  const nextMode = isCursorMode(mode) ? mode : "agent";
  const text = String(prompt || "").trim();
  if (!text) {
    const error = new Error("Prompt is required");
    error.status = 400;
    throw error;
  }
  const { rows } = await db.query(
    `INSERT INTO cursor_briefs (mode, prompt, files, created_by)
     VALUES (?, ?, ?, ?) RETURNING id, mode, prompt, files, created_at AS "createdAt"`,
    [nextMode, text, String(files || "").trim() || null, createdBy || null]
  );
  return rows[0];
}

export function formatCursorPrompt(brief) {
  const files = brief.files ? `\n\nFocus files:\n${brief.files}` : "";
  return `[${brief.mode}] ${brief.prompt}${files}`;
}
