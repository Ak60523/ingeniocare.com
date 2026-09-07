import pg from "pg";
import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";

function toPgParams(sql) {
  let index = 0;
  return sql.replace(/\?/g, () => `$${++index}`);
}

export function isDbConfigured() {
  return Boolean(
    process.env.DATABASE_URL ||
      process.env.DATABASE_SECRET_ARN ||
      process.env.DB_HOST ||
      process.env.POSTGRES_HOST ||
      process.env.PGHOST ||
      process.env.AURORA_HOST
  );
}

function sslConfig() {
  const sslDisabled =
    process.env.POSTGRES_SSL === "false" ||
    process.env.PGSSL === "false" ||
    process.env.AURORA_SSL === "false" ||
    process.env.DB_SSL === "false";
  if (sslDisabled) return false;
  // Lambda's Node trust store does not include the Amazon RDS CA.
  // Traffic stays on the private VPC; TLS is still used.
  if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return { rejectUnauthorized: false };
  }
  return { rejectUnauthorized: true };
}

function poolSize() {
  return process.env.AWS_LAMBDA_FUNCTION_NAME ? 2 : 10;
}

async function loadDbSecret() {
  const arn = process.env.DATABASE_SECRET_ARN;
  if (!arn) return { username: "", password: "" };
  const sm = new SecretsManagerClient({});
  const res = await sm.send(new GetSecretValueCommand({ SecretId: arn }));
  const parsed = JSON.parse(res.SecretString || "{}");
  return {
    username: String(parsed.username || parsed.user || ""),
    password: String(parsed.password || ""),
  };
}

async function createPgPool() {
  const connectionString = process.env.DATABASE_URL;
  if (connectionString) {
    return new pg.Pool({ connectionString, max: poolSize(), ssl: sslConfig() });
  }

  let user = process.env.POSTGRES_USER || process.env.PGUSER || process.env.AURORA_USER || process.env.DB_USER;
  let password = process.env.POSTGRES_PASSWORD || process.env.PGPASSWORD || process.env.AURORA_PASSWORD;
  if (process.env.DATABASE_SECRET_ARN) {
    const creds = await loadDbSecret();
    user = creds.username || user;
    password = creds.password || password;
  }

  const host = process.env.DB_HOST || process.env.POSTGRES_HOST || process.env.PGHOST || process.env.AURORA_HOST;
  return new pg.Pool({
    host,
    port: Number(process.env.DB_PORT || process.env.POSTGRES_PORT || process.env.PGPORT || process.env.AURORA_PORT || 5432),
    user,
    password,
    database:
      process.env.DB_NAME ||
      process.env.POSTGRES_DATABASE ||
      process.env.PGDATABASE ||
      process.env.AURORA_DATABASE ||
      "ingeniocare",
    max: poolSize(),
    ssl: sslConfig(),
  });
}

function quoteIdent(name) {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    throw new Error(`Invalid Postgres identifier: ${name}`);
  }
  return name;
}

async function adminConnectionConfig() {
  let user = process.env.POSTGRES_USER || process.env.PGUSER || process.env.AURORA_USER || process.env.DB_USER;
  let password = process.env.POSTGRES_PASSWORD || process.env.PGPASSWORD || process.env.AURORA_PASSWORD;
  if (process.env.DATABASE_SECRET_ARN) {
    const creds = await loadDbSecret();
    user = creds.username || user;
    password = creds.password || password;
  }
  return {
    host: process.env.DB_HOST || process.env.POSTGRES_HOST || process.env.PGHOST || process.env.AURORA_HOST,
    port: Number(process.env.DB_PORT || process.env.POSTGRES_PORT || process.env.PGPORT || process.env.AURORA_PORT || 5432),
    user,
    password,
    ssl: sslConfig(),
    max: 1,
  };
}

/**
 * Create DB_NAME on the shared account cluster if it is missing.
 * Connects to the existing maintenance database, not a new Aurora cluster.
 */
export async function ensureTargetDatabase() {
  const targetDb = process.env.DB_NAME || "ingeniocare";
  const maintenanceDb =
    process.env.DB_MAINTENANCE_NAME || process.env.POSTGRES_MAINTENANCE_DB || "ingenio_population";
  if (targetDb === maintenanceDb) return;

  const base = await adminConnectionConfig();
  if (!base.host || !base.user) return;

  const admin = new pg.Pool({ ...base, database: maintenanceDb });
  try {
    const { rows } = await admin.query("SELECT 1 FROM pg_database WHERE datname = $1", [targetDb]);
    if (!rows.length) {
      await admin.query(`CREATE DATABASE ${quoteIdent(targetDb)}`);
      console.log(`Created database ${targetDb} on shared Aurora cluster`);
    }
  } finally {
    await admin.end();
  }
}

export function createPool() {
  if (!isDbConfigured()) return null;
  let inner = null;
  let pending = null;

  async function ensure() {
    if (inner) return inner;
    if (!pending) pending = createPgPool();
    inner = await pending;
    return inner;
  }

  return {
    async query(sql, params = []) {
      const pool = await ensure();
      const result = await pool.query(toPgParams(sql), params);
      return {
        rows: result.rows,
        rowCount: result.rowCount,
        insertId: result.rows[0]?.id,
      };
    },
  };
}

async function columnExists(db, table, column) {
  const { rows } = await db.query(
    `SELECT column_name FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = ? AND column_name = ?`,
    [table, column]
  );
  return rows.length > 0;
}

async function addColumnIfMissing(db, table, column, definition) {
  if (await columnExists(db, table, column)) return;
  await db.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
}

export async function initSchema(db) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(32) NOT NULL DEFAULT 'user',
      phone VARCHAR(64),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await addColumnIfMissing(db, "users", "role", "VARCHAR(32) NOT NULL DEFAULT 'user'");
  await addColumnIfMissing(db, "users", "phone", "VARCHAR(64)");

  await db.query(`
    CREATE TABLE IF NOT EXISTS tenants (
      id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(120) UNIQUE,
      brand_name VARCHAR(255),
      support_email VARCHAR(255),
      support_phone VARCHAR(64),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS tenant_memberships (
      id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role VARCHAR(32) NOT NULL DEFAULT 'member',
      status VARCHAR(32) NOT NULL DEFAULT 'active',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (tenant_id, user_id)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS tenant_invites (
      id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      email VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      phone VARCHAR(64),
      role VARCHAR(32) NOT NULL DEFAULT 'member',
      token VARCHAR(128) NOT NULL UNIQUE,
      invited_by_user_id BIGINT,
      expires_at TIMESTAMPTZ NOT NULL,
      accepted_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      message TEXT,
      newsletter BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS news_articles (
      id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      slug VARCHAR(255) NOT NULL UNIQUE,
      date_label VARCHAR(120) NOT NULL,
      title VARCHAR(500) NOT NULL,
      headline VARCHAR(255),
      summary TEXT,
      body TEXT NOT NULL,
      status VARCHAR(32) NOT NULL DEFAULT 'published',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await addColumnIfMissing(db, "news_articles", "status", "VARCHAR(32) NOT NULL DEFAULT 'published'");
  await addColumnIfMissing(db, "news_articles", "updated_at", "TIMESTAMPTZ NOT NULL DEFAULT NOW()");

  await db.query(`
    CREATE TABLE IF NOT EXISTS news_aliases (
      slug VARCHAR(255) PRIMARY KEY,
      article_id BIGINT NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS site_content (
      id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      type VARCHAR(32) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      title VARCHAR(500) NOT NULL,
      subtitle VARCHAR(500),
      summary TEXT,
      body TEXT,
      hashtags TEXT,
      status VARCHAR(32) NOT NULL DEFAULT 'draft',
      gated BOOLEAN NOT NULL DEFAULT FALSE,
      pdf_url VARCHAR(500),
      published_at TIMESTAMPTZ,
      topic_key VARCHAR(120),
      seo_title VARCHAR(255),
      seo_description VARCHAR(500),
      created_by BIGINT,
      tenant_id BIGINT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await db.query(`
    CREATE INDEX IF NOT EXISTS content_type_status_idx ON site_content (type, status)
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS content_images (
      id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      kind VARCHAR(32) NOT NULL DEFAULT 'image',
      file_name VARCHAR(255),
      image_url TEXT NOT NULL,
      prompt TEXT,
      caption VARCHAR(500),
      placement VARCHAR(32),
      image_size VARCHAR(32),
      source VARCHAR(64),
      content_id VARCHAR(64),
      created_by BIGINT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await db.query(`CREATE INDEX IF NOT EXISTS content_images_updated_idx ON content_images (updated_at DESC)`);

  await db.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
      appearance JSONB NOT NULL DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await db.query(
    `INSERT INTO site_settings (id, appearance) VALUES (1, '{}'::jsonb) ON CONFLICT (id) DO NOTHING`
  );

  await db.query(`
    CREATE TABLE IF NOT EXISTS site_errors (
      id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      message TEXT NOT NULL,
      stack TEXT,
      path VARCHAR(500),
      method VARCHAR(16),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS cursor_briefs (
      id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      mode VARCHAR(32) NOT NULL DEFAULT 'agent',
      prompt TEXT NOT NULL,
      files TEXT,
      created_by BIGINT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}
