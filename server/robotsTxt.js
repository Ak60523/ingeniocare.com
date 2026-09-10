/** Hosts that must not be indexed when this app is served on them. */
export const BLOCKED_ROBOTS_HOSTS = new Set([
  "app.ingeniocare.com",
  "dev.ingeniocare.com",
]);

export const DISALLOW_ALL_ROBOTS_TXT = `User-agent: *
Disallow: /
`;

export const PRODUCTION_ROBOTS_TXT = `User-agent: *
Allow: /
Disallow: /404
Disallow: /m/
Disallow: /invite/
Disallow: /tenants
Disallow: /users
Disallow: /settings
Disallow: /builds
Disallow: /errors
Disallow: /cursor
Disallow: /data-model

Sitemap: https://ingeniocare.com/sitemap.xml
`;

export function hostnameFromOrigin(origin) {
  try {
    return new URL(String(origin || "")).hostname.toLowerCase();
  } catch {
    return "";
  }
}

export function shouldDisallowAllRobots({
  origin = process.env.PUBLIC_SITE_URL,
  branch = process.env.AWS_BRANCH,
  hostname = "",
} = {}) {
  const host = String(hostname || hostnameFromOrigin(origin) || "").toLowerCase();
  if (host && BLOCKED_ROBOTS_HOSTS.has(host)) return true;
  const b = String(branch || "").toLowerCase();
  return b === "dev" || b === "develop" || b === "app";
}

export function robotsTxtForDeploy(options = {}) {
  return shouldDisallowAllRobots(options) ? DISALLOW_ALL_ROBOTS_TXT : PRODUCTION_ROBOTS_TXT;
}
