import "dotenv/config";
import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import { seedArticles } from "./articles.js";
import { createPool, initSchema } from "./db.js";

const app = express();
const port = Number(process.env.API_PORT || 3001);
const jwtSecret = process.env.JWT_SECRET || "dev-only-change-me";
const pool = createPool();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || true,
  })
);
app.use(express.json({ limit: "1mb" }));

function requireDb(req, res, next) {
  if (!pool) {
    return res.status(503).json({
      error: "Aurora is not configured. Set AURORA_HOST and related variables in .env.",
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
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, jwtSecret, {
    expiresIn: "7d",
  });
}

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

app.get("/api/health", async (_req, res) => {
  if (!pool) {
    return res.json({ ok: true, database: "unconfigured" });
  }
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, database: "aurora" });
  } catch (error) {
    res.status(503).json({ ok: false, error: error.message });
  }
});

app.get(
  "/api/news",
  requireDb,
  asyncHandler(async (_req, res) => {
  const [rows] = await pool.query(
    "SELECT slug, date_label AS dateLabel, title, summary FROM news_articles ORDER BY created_at DESC, id DESC"
  );
    res.json({ articles: rows });
  })
);

app.get(
  "/api/news/:slug",
  requireDb,
  asyncHandler(async (req, res) => {
  const slug = req.params.slug;
  const [direct] = await pool.query(
    "SELECT slug, date_label AS dateLabel, title, headline, summary, body FROM news_articles WHERE slug = ? LIMIT 1",
    [slug]
  );
  if (direct[0]) return res.json({ article: direct[0] });

  const [aliased] = await pool.query(
    `SELECT a.slug, a.date_label AS dateLabel, a.title, a.headline, a.summary, a.body
     FROM news_aliases n
     JOIN news_articles a ON a.id = n.article_id
     WHERE n.slug = ?
     LIMIT 1`,
    [slug]
  );
    if (!aliased[0]) return res.status(404).json({ error: "Article not found" });
    res.json({ article: aliased[0] });
  })
);

app.post(
  "/api/contact",
  requireDb,
  asyncHandler(async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const message = String(req.body.message || "").trim();
  const newsletter = Boolean(req.body.newsletter);
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  await pool.query(
    "INSERT INTO contact_submissions (name, email, message, newsletter) VALUES (?, ?, ?, ?)",
    [name, email, message, newsletter ? 1 : 0]
  );
  if (newsletter) {
    await pool.query("INSERT IGNORE INTO newsletter_subscribers (email) VALUES (?)", [email]);
  }
    res.status(201).json({ ok: true });
  })
);

app.post(
  "/api/auth/register",
  requireDb,
  asyncHandler(async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  if (!name || !email || password.length < 8) {
    return res.status(400).json({ error: "Name, email, and an 8+ character password are required" });
  }

  const [existing] = await pool.query("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
  if (existing[0]) return res.status(409).json({ error: "An account with that email already exists" });

  const passwordHash = await bcrypt.hash(password, 12);
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
    [name, email, passwordHash]
  );
  const user = { id: result.insertId, name, email };
    res.status(201).json({ user, token: tokenFor(user) });
  })
);

app.post(
  "/api/auth/login",
  requireDb,
  asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const [rows] = await pool.query(
    "SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  const row = rows[0];
  if (!row || !(await bcrypt.compare(password, row.password_hash))) {
    return res.status(401).json({ error: "Email or password is incorrect" });
  }
  const user = { id: row.id, name: row.name, email: row.email };
    res.json({ user, token: tokenFor(user) });
  })
);

app.get(
  "/api/auth/me",
  requireDb,
  requireAuth,
  asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT id, name, email FROM users WHERE id = ? LIMIT 1", [
    req.user.id,
  ]);
  if (!rows[0]) return res.status(401).json({ error: "Invalid session" });
    res.json({ user: rows[0] });
  })
);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(503).json({
    error: error.code === "ECONNREFUSED"
      ? "Cannot reach Aurora/MySQL. Start Docker MySQL or set AURORA_HOST to your cluster."
      : error.message,
  });
});

async function seedNews(db) {
  const [countRows] = await db.query("SELECT COUNT(*) AS count FROM news_articles");
  if (countRows[0].count > 0) return;
  for (const article of seedArticles) {
    const [result] = await db.query(
      "INSERT INTO news_articles (slug, date_label, title, headline, summary, body) VALUES (?, ?, ?, ?, ?, ?)",
      [article.slug, article.dateLabel, article.title, article.headline, article.summary, article.body]
    );
    for (const alias of article.aliases) {
      await db.query("INSERT INTO news_aliases (slug, article_id) VALUES (?, ?)", [
        alias,
        result.insertId,
      ]);
    }
  }
}

async function start() {
  if (pool) {
    try {
      await initSchema(pool);
      await seedNews(pool);
      console.log("Aurora/MySQL schema ready");
    } catch (error) {
      console.error("Database setup failed:", error.message);
    }
  } else {
    console.warn("AURORA_HOST is not set. API routes that need the database will return 503.");
  }

  app.listen(port, () => {
    console.log(`API listening on http://127.0.0.1:${port}`);
  });
}

start();
