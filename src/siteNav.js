import { customersPath } from "./data/segments.js";
import { solutionsPath } from "./data/products.js";

export const primaryNav = [
  { id: "home", to: "/", label: "Home", exact: true, icon: "home" },
  { id: "customers", to: customersPath, label: "Customers", icon: "customers" },
  { id: "solutions", to: solutionsPath, label: "Solutions", icon: "solutions" },
  { id: "about", to: "/about-us", label: "About Us", icon: "about" },
  { id: "blogs", to: "/blog", label: "Blogs", editTo: "/blog?mode=edit", childrenKey: "blog", icon: "blogs" },
  { id: "papers", to: "/papers", label: "Papers", editTo: "/papers?mode=edit", childrenKey: "whitepaper", icon: "papers" },
  { id: "podcasts", to: "/podcasts", label: "Podcasts", editTo: "/podcasts?mode=edit", childrenKey: "podcast", icon: "podcasts" },
  { id: "news", to: "/news", label: "News", editTo: "/news?mode=edit", childrenKey: "news", icon: "news" },
];

export const headerNav = [
  { id: "home", to: "/", label: "Home", exact: true },
  { id: "customers", label: "Customers", to: customersPath },
  { id: "solutions", to: solutionsPath, label: "Solutions" },
  { id: "about", to: "/about-us", label: "About Us" },
  {
    id: "resources",
    label: "Resources",
    children: [
      { id: "blogs", to: "/blog", label: "Blogs" },
      { id: "papers", to: "/papers", label: "Papers" },
      { id: "podcasts", to: "/podcasts", label: "Podcasts" },
    ],
  },
  { id: "news", to: "/news", label: "News" },
];

export const footerNav = [
  { id: "terms", to: "/terms-of-use", label: "Terms of Use", icon: "privacy" },
  { id: "privacy", to: "/privacy-policy", label: "Privacy Policy", icon: "privacy" },
];

export function navPath(item, { edit = false } = {}) {
  if (edit && item.editTo) return item.editTo;
  return item.to;
}

export function pathOf(item) {
  return String(item?.to || item?.editTo || "").split("?")[0].split("#")[0];
}

export function isSitePathActive(pathname, item) {
  if (item?.children?.length) {
    const selfActive = item.to
      ? isSitePathActive(pathname, { ...item, children: undefined })
      : false;
    return selfActive || item.children.some((child) => isSitePathActive(pathname, child));
  }
  const path = pathOf(item);
  if (!path) return false;
  if (item.exact || path === "/") return pathname === path;
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function contentEditPath(item) {
  if (item?.type === "news") return `/${item.slug}?mode=edit`;
  const href =
    item?.type === "whitepaper"
      ? `/papers/${item.slug}`
      : item?.type === "podcast"
        ? `/podcasts/${item.slug}`
        : `/blog/${item.slug}`;
  return `${href}?mode=edit`;
}
