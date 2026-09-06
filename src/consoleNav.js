export const RAIL_COLLAPSED = 56;
export const RAIL_EXPANDED = 248;
export const NAV_STORAGE_KEY = "ingenio.navExpanded";

export function readNavExpanded() {
  if (typeof window === "undefined") return true;
  const value = window.localStorage.getItem(NAV_STORAGE_KEY);
  if (value === null) return true;
  return value === "1";
}

export function writeNavExpanded(expanded) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(NAV_STORAGE_KEY, expanded ? "1" : "0");
}

export const CONSOLE_PATHS = ["/users", "/tenants", "/builds", "/errors", "/cursor", "/data-model", "/settings"];

export function isConsolePath(pathname) {
  return CONSOLE_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export const technicalItems = [
  { to: "/builds", label: "Builds", icon: "builds" },
  { to: "/errors", label: "Errors", icon: "errors" },
  { to: "/cursor", label: "Cursor", icon: "cursor" },
  { to: "/data-model", label: "Data Model", icon: "schema" },
];

export function isNavActive(pathname, item) {
  if (!item?.to) return false;
  const path = item.match || String(item.to).split("?")[0];
  return pathname === path || pathname.startsWith(`${path}/`);
}
