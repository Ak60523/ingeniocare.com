import { useEffect } from "react";

const DEFAULT_TITLE = "Ingenio Care";
const DEFAULT_DESCRIPTION = "Ai Enabled, Patient Centric Digital Health Network";
const DEFAULT_IMAGE = "/assets/images/home-hero.jpg";

function absoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  if (typeof window === "undefined") return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${window.location.origin}${path}`;
}

function ensureMeta(attr, key, content) {
  if (!content) return;
  const selector = attr === "property" ? `meta[property="${key}"]` : `meta[name="${key}"]`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function ensureLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Sets document title and Open Graph / Twitter meta for the current route.
 * Crawlers that do not run JS still need SSR/prerender for reliable previews;
 * this keeps in-browser title/meta correct and helps any future prerender.
 */
export function usePageMeta({
  title,
  description,
  image,
  url,
  type = "article",
} = {}) {
  useEffect(() => {
    const pageTitle = String(title || "").trim();
    const fullTitle = pageTitle
      ? pageTitle.includes("Ingenio Care")
        ? pageTitle
        : `${pageTitle} | Ingenio Care`
      : DEFAULT_TITLE;
    const desc = String(description || "").trim() || DEFAULT_DESCRIPTION;
    const imageUrl = absoluteUrl(image || DEFAULT_IMAGE);
    const pageUrl = absoluteUrl(url || (typeof window !== "undefined" ? window.location.pathname : "/"));

    const previousTitle = document.title;
    document.title = fullTitle;

    ensureMeta("name", "description", desc);
    ensureMeta("property", "og:title", fullTitle);
    ensureMeta("property", "og:description", desc);
    ensureMeta("property", "og:type", type);
    ensureMeta("property", "og:url", pageUrl);
    ensureMeta("property", "og:image", imageUrl);
    ensureMeta("property", "og:site_name", "Ingenio Care");
    ensureMeta("name", "twitter:card", "summary_large_image");
    ensureMeta("name", "twitter:title", fullTitle);
    ensureMeta("name", "twitter:description", desc);
    ensureMeta("name", "twitter:image", imageUrl);
    ensureLink("canonical", pageUrl);

    return () => {
      document.title = previousTitle || DEFAULT_TITLE;
      ensureMeta("name", "description", DEFAULT_DESCRIPTION);
      ensureMeta("property", "og:title", DEFAULT_TITLE);
      ensureMeta("property", "og:description", DEFAULT_DESCRIPTION);
      ensureMeta("property", "og:type", "website");
      ensureMeta("property", "og:url", absoluteUrl("/"));
      ensureMeta("property", "og:image", absoluteUrl(DEFAULT_IMAGE));
      ensureMeta("name", "twitter:card", "summary_large_image");
      ensureMeta("name", "twitter:title", DEFAULT_TITLE);
      ensureMeta("name", "twitter:description", DEFAULT_DESCRIPTION);
      ensureMeta("name", "twitter:image", absoluteUrl(DEFAULT_IMAGE));
      ensureLink("canonical", absoluteUrl("/"));
    };
  }, [title, description, image, url, type]);
}
