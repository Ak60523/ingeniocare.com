export const SECTIONS = [
  {
    id: "banner",
    label: "Top banner",
    selector: ".banner",
    colors: ["brandDark", "onDark"],
    fonts: ["headingFont", "headingScale"],
  },
  {
    id: "header",
    label: "Header & menu",
    selector: ".site-header",
    colors: ["pageColor", "headingColor", "menuColor", "accentHover", "borderColor"],
    fonts: ["menuFont", "menuSize", "headingFont"],
  },
  {
    id: "hero",
    label: "Hero",
    selector: ".page-hero",
    colors: ["brand", "onDark", "accent"],
    fonts: ["headingFont", "headingScale", "bodyFont", "bodySize"],
  },
  {
    id: "quote",
    label: "Quote panel",
    selector: ".quote-panel",
    colors: ["brand", "onDark"],
    fonts: ["headingFont", "headingScale", "bodyFont", "bodySize"],
  },
  {
    id: "dark-section",
    label: "Dark section",
    selector: ".section.navy",
    colors: ["brand", "onDark", "accent"],
    fonts: ["headingFont", "headingScale", "bodyFont", "bodySize"],
  },
  {
    id: "alt-section",
    label: "Alternate section",
    selector: ".section.alt",
    colors: ["altColor", "headingColor", "textColor", "mutedColor", "brandMid", "accent", "brand", "onDark", "borderColor"],
    fonts: ["headingFont", "headingScale", "bodyFont", "bodySize"],
  },
  {
    id: "soft-section",
    label: "Soft section",
    selector: ".section.soft",
    colors: ["brandSoft", "headingColor", "textColor", "mutedColor", "brandMid", "accent", "brand", "onDark"],
    fonts: ["headingFont", "headingScale", "bodyFont", "bodySize"],
  },
  {
    id: "section",
    label: "Section",
    selector: ".section",
    colors: ["pageColor", "headingColor", "textColor", "mutedColor", "brandMid", "accent", "brand", "onDark", "borderColor"],
    fonts: ["headingFont", "headingScale", "bodyFont", "bodySize"],
  },
  {
    id: "footer",
    label: "Footer",
    selector: ".site-footer",
    colors: ["brandDark", "footerText", "onDark"],
    fonts: ["bodyFont", "bodySize", "menuFont"],
  },
];

export const SECTION_SELECTORS = SECTIONS.map((item) => item.selector).join(", ");

function namedSectionLabel(item, node) {
  if (item.id === "banner" || item.id === "header" || item.id === "footer") return item.label;
  const heading = node.querySelector("h1, h2, h3, h4, .content-kicker");
  const text = heading?.textContent?.replace(/\s+/g, " ").trim();
  return text ? text.slice(0, 48) : item.label;
}

export function pageSectionOutline(root = document) {
  const matches = [...root.querySelectorAll(SECTION_SELECTORS)];
  const outline = [];
  const seen = new Set();
  for (const node of matches) {
    if (seen.has(node)) continue;
    const item = SECTIONS.find((section) => node.matches(section.selector));
    if (!item) continue;
    seen.add(node);
    outline.push({
      id: item.id,
      label: namedSectionLabel(item, node),
      colors: item.colors,
      fonts: item.fonts,
      node,
    });
  }
  return outline;
}

export function resolvePageSection(target) {
  if (!(target instanceof Element)) return null;
  for (const item of SECTIONS) {
    const node = target.closest(item.selector);
    if (!node) continue;
    return {
      id: item.id,
      label: namedSectionLabel(item, node),
      colors: item.colors,
      fonts: item.fonts,
      node,
    };
  }
  return null;
}

