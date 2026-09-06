import { execFile } from "child_process";
import { promisify } from "util";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const execFileAsync = promisify(execFile);
const startedAt = new Date().toISOString();
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
  site_errors: "Captured API failures.",
  cursor_briefs: "Owner Cursor prompts.",
};

const CURSOR_MODES = ["agent", "ask", "plan"];

export function isCursorMode(value) {
  return CURSOR_MODES.includes(value);
}

async function gitInfo() {
  try {
    const opts = { timeout: 4000, windowsHide: true };
    const { stdout: branch } = await execFileAsync("git", ["rev-parse", "--abbrev-ref", "HEAD"], opts);
    const { stdout: log } = await execFileAsync("git", ["log", "-1", "--format=%h|%s|%ci"], opts);
    const [hash, subject, date] = String(log).trim().split("|");
    return {
      branch: String(branch).trim(),
      hash: hash || null,
      subject: subject || null,
      date: date || null,
    };
  } catch {
    return null;
  }
}

export async function getBuildInfo() {
  let version = "1.0.0";
  try {
    const pkgPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "package.json");
    const pkg = JSON.parse(await readFile(pkgPath, "utf8"));
    version = pkg.version || version;
  } catch {
    /* keep default */
  }
  return {
    name: "Ingenio Care",
    version,
    node: process.version,
    env: process.env.NODE_ENV || "development",
    uptimeSec: Math.round(process.uptime()),
    startedAt,
    database: process.env.POSTGRES_DATABASE || process.env.PGDATABASE || "ingeniocare",
    git: await gitInfo(),
  };
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

export async function recordError(db, error, req) {
  if (!db) return;
  try {
    await db.query(
      `INSERT INTO site_errors (message, stack, path, method) VALUES (?, ?, ?, ?)`,
      [String(error?.message || error), error?.stack || null, req?.originalUrl || null, req?.method || null]
    );
  } catch {
    /* ignore logging failures */
  }
}

export async function listErrors(db, limit = 50) {
  const { rows } = await db.query(
    `SELECT id, message, stack, path, method, created_at AS "createdAt"
     FROM site_errors ORDER BY id DESC LIMIT ?`,
    [limit]
  );
  return rows;
}

export async function clearErrors(db) {
  await db.query("DELETE FROM site_errors");
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
