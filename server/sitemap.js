import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { products } from "../src/data/products.js";
import { segments } from "../src/data/segments.js";
import { seedSiteContent } from "./contentSeed.js";

const fallbackNews = [
  { slug: "7-08-2025-ingenio-care-1", status: "published" },
  { slug: "4-19-2024-ingenio-care-1", status: "published" },
  { slug: "4-19-2024-ingenio-care", status: "published" },
];

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export const SITE_ORIGIN = String(process.env.PUBLIC_SITE_URL || "https://ingeniocare.com").replace(
  /\/$/,
  ""
);

function contentHref(item) {
  if (item?.type === "whitepaper") return `/papers/${item.slug}`;
  if (item?.type === "podcast") return `/podcasts/${item.slug}`;
  if (item?.type === "news") return `/${item.slug}`;
  return `/blog/${item.slug}`;
}

function isPublished(item) {
  const status = String(item?.status || "published").toLowerCase();
  if (status !== "published" || !item?.slug) return false;
  const publishedAt = item.publishedAt || item.published_at;
  if (publishedAt && new Date(publishedAt).getTime() > Date.now()) return false;
  return true;
}

function formatLastmod(value) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function staticSitemapEntries() {
  const entries = [
    { path: "/", priority: "1.0", changefreq: "weekly" },
    { path: "/customers", priority: "0.9", changefreq: "weekly" },
    { path: "/solutions", priority: "0.9", changefreq: "weekly" },
    { path: "/about-us", priority: "0.8", changefreq: "monthly" },
    { path: "/blog", priority: "0.8", changefreq: "weekly" },
    { path: "/papers", priority: "0.8", changefreq: "weekly" },
    { path: "/podcasts", priority: "0.8", changefreq: "weekly" },
    { path: "/news", priority: "0.8", changefreq: "weekly" },
    { path: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
    { path: "/terms-of-use", priority: "0.3", changefreq: "yearly" },
  ];

  for (const product of products) {
    if (!product?.slug) continue;
    entries.push({ path: `/solutions/${product.slug}`, priority: "0.8", changefreq: "monthly" });
  }
  for (const segment of segments) {
    if (!segment?.slug) continue;
    entries.push({ path: `/customers/${segment.slug}`, priority: "0.8", changefreq: "monthly" });
  }

  return entries;
}

export function contentSitemapEntries({ articles = [], content = [] } = {}) {
  const news = articles.filter(isPublished).map((item) => ({
    path: `/${item.slug}`,
    lastmod: item.updatedAt || item.updated_at || item.createdAt || item.created_at || item.publishedAt,
    priority: "0.7",
    changefreq: "monthly",
  }));
  const rest = content.filter(isPublished).map((item) => ({
    path: contentHref(item),
    lastmod: item.updatedAt || item.updated_at || item.publishedAt || item.published_at || item.createdAt,
    priority: "0.7",
    changefreq: "monthly",
  }));
  return [...news, ...rest];
}

export function fallbackContentEntries() {
  return contentSitemapEntries({
    articles: fallbackNews,
    content: seedSiteContent,
  });
}

export function renderSitemapXml(entries, origin = SITE_ORIGIN) {
  const seen = new Set();
  const urls = [];

  for (const entry of entries) {
    const loc = `${origin}${entry.path === "/" ? "/" : entry.path}`;
    if (seen.has(loc)) continue;
    seen.add(loc);
    urls.push({ ...entry, loc });
  }

  const body = urls
    .map((entry) => {
      const lastmod = formatLastmod(entry.lastmod);
      return [
        "  <url>",
        `    <loc>${escapeXml(entry.loc)}</loc>`,
        lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
        entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : null,
        entry.priority ? `    <priority>${entry.priority}</priority>` : null,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

async function loadFromDatabase(pool) {
  const { rows: newsRows } = await pool.query(
    `SELECT slug, status, created_at, updated_at FROM news_articles`
  );
  const { rows: contentRows } = await pool.query(
    `SELECT type, slug, status, published_at, created_at, updated_at FROM site_content`
  );
  return {
    articles: newsRows.map((row) => ({
      slug: row.slug,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })),
    content: contentRows.map((row) => ({
      type: row.type,
      slug: row.slug,
      status: row.status,
      publishedAt: row.published_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })),
  };
}

function dataApiBaseUrl() {
  if (process.env.VITE_API_URL) return String(process.env.VITE_API_URL).replace(/\/$/, "");
  try {
    const outputs = JSON.parse(readFileSync(path.join(rootDir, "..", "amplify_outputs.json"), "utf8"));
    return String(outputs?.custom?.dataApiUrl || "").replace(/\/$/, "");
  } catch {
    return "";
  }
}

export async function fetchLiveSitemapData(baseUrl = dataApiBaseUrl()) {
  const base = String(baseUrl || "").replace(/\/$/, "");
  if (!base) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const [newsRes, blogRes, paperRes, podcastRes] = await Promise.all([
      fetch(`${base}/api/news`, { signal: controller.signal }),
      fetch(`${base}/api/content?type=blog`, { signal: controller.signal }),
      fetch(`${base}/api/content?type=whitepaper`, { signal: controller.signal }),
      fetch(`${base}/api/content?type=podcast`, { signal: controller.signal }),
    ]);
    if (![newsRes, blogRes, paperRes, podcastRes].every((res) => res.ok)) return null;
    const news = await newsRes.json();
    const blogs = await blogRes.json();
    const papers = await paperRes.json();
    const podcasts = await podcastRes.json();
    return {
      articles: news.articles || [],
      content: [...(blogs.items || []), ...(papers.items || []), ...(podcasts.items || [])],
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function buildSitemapXml({ pool = null, live = undefined, origin = SITE_ORIGIN } = {}) {
  let liveData = live;
  if (liveData === undefined && pool) {
    try {
      liveData = await loadFromDatabase(pool);
    } catch {
      liveData = null;
    }
  }
  if (liveData === undefined) {
    liveData = await fetchLiveSitemapData();
  }

  const contentEntries = liveData
    ? contentSitemapEntries(liveData)
    : fallbackContentEntries();

  return renderSitemapXml([...staticSitemapEntries(), ...contentEntries], origin);
}
