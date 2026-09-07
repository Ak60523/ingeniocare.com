export const DEFAULT_APPEARANCE = {
  headingFont: "Cinzel",
  bodyFont: "Source Sans Pro",
  menuFont: "Source Sans Pro",
  menuSize: 18,
  bodySize: 17,
  headingScale: 1,
  accent: "#38bdf8",
  accentHover: "#0ea5e9",
  brand: "#0f2940",
  brandMid: "#1b3f60",
  brandDark: "#001a44",
  brandSoft: "#eef4fd",
  headingColor: "#0f2940",
  menuColor: "#0f2940",
  textColor: "#151515",
  mutedColor: "#5e5e5e",
  pageColor: "#ffffff",
  altColor: "#f3f3f3",
  borderColor: "#e2e2e2",
  onDark: "#ffffff",
  footerText: "#dce4f2",
};

export const COLOR_FIELDS = [
  { id: "pageColor", label: "Page background" },
  { id: "altColor", label: "Alternate sections" },
  { id: "brandSoft", label: "Soft sections" },
  { id: "headingColor", label: "Headings" },
  { id: "textColor", label: "Body text" },
  { id: "mutedColor", label: "Secondary text" },
  { id: "brandMid", label: "Links" },
  { id: "menuColor", label: "Menu" },
  { id: "accent", label: "Accent" },
  { id: "accentHover", label: "Menu & accent hover" },
  { id: "brand", label: "Buttons & dark sections" },
  { id: "onDark", label: "Text on dark" },
  { id: "brandDark", label: "Footer background" },
  { id: "footerText", label: "Footer text" },
  { id: "borderColor", label: "Borders" },
];

export const FONT_FIELDS = [
  { id: "headingFont", label: "Heading font", kind: "font" },
  { id: "headingScale", label: "Heading size", kind: "scale", min: 0.8, max: 1.4, step: 0.05 },
  { id: "bodyFont", label: "Body font", kind: "font" },
  { id: "bodySize", label: "Body size", kind: "size", min: 14, max: 22, step: 1 },
  { id: "menuFont", label: "Menu font", kind: "font" },
  { id: "menuSize", label: "Menu size", kind: "size", min: 12, max: 28, step: 1 },
];

export const FONTS = [
  { id: "Cinzel", label: "Cinzel", stack: 'Cinzel, "Times New Roman", serif', google: "Cinzel:wght@400;500;600;700" },
  { id: "Playfair Display", label: "Playfair Display", stack: '"Playfair Display", Georgia, serif', google: "Playfair+Display:wght@400;500;600;700" },
  { id: "Merriweather", label: "Merriweather", stack: "Merriweather, Georgia, serif", google: "Merriweather:ital,wght@0,400;0,700;1,400" },
  { id: "Libre Baskerville", label: "Libre Baskerville", stack: '"Libre Baskerville", Georgia, serif', google: "Libre+Baskerville:ital,wght@0,400;0,700;1,400" },
  { id: "PT Serif", label: "PT Serif", stack: '"PT Serif", Georgia, serif', google: "PT+Serif:ital,wght@0,400;0,700;1,400" },
  { id: "Georgia", label: "Georgia", stack: 'Georgia, "Times New Roman", serif', google: null },
  { id: "Source Sans Pro", label: "Source Sans Pro", stack: '"Source Sans Pro", "Segoe UI", sans-serif', google: "Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400" },
  { id: "Inter", label: "Inter", stack: 'Inter, "Segoe UI", sans-serif', google: "Inter:wght@400;500;600;700" },
  { id: "Open Sans", label: "Open Sans", stack: '"Open Sans", "Segoe UI", sans-serif', google: "Open+Sans:ital,wght@0,400;0,600;0,700;1,400" },
  { id: "Lato", label: "Lato", stack: 'Lato, "Segoe UI", sans-serif', google: "Lato:ital,wght@0,400;0,700;1,400" },
  { id: "Montserrat", label: "Montserrat", stack: 'Montserrat, "Segoe UI", sans-serif', google: "Montserrat:wght@400;500;600;700" },
  { id: "Nunito", label: "Nunito", stack: 'Nunito, "Segoe UI", sans-serif', google: "Nunito:wght@400;600;700" },
  { id: "Roboto", label: "Roboto", stack: 'Roboto, "Segoe UI", sans-serif', google: "Roboto:ital,wght@0,400;0,500;0,700;1,400" },
  { id: "Share", label: "Share", stack: 'Share, "Source Sans Pro", sans-serif', google: "Share:wght@400;700" },
  { id: "Arial", label: "Arial", stack: "Arial, Helvetica, sans-serif", google: null },
];

const FONTS_BY_ID = Object.fromEntries(FONTS.map((font) => [font.id, font]));

function clamp(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function hexColor(value, fallback) {
  const match = String(value || "")
    .trim()
    .match(/^#([0-9a-f]{6})$/i);
  return match ? `#${match[1].toLowerCase()}` : fallback;
}

export function sanitizeAppearance(input = {}) {
  const accent = hexColor(input.accent, DEFAULT_APPEARANCE.accent);
  const brand = hexColor(input.brand, DEFAULT_APPEARANCE.brand);
  return {
    headingFont: FONTS_BY_ID[input.headingFont] ? input.headingFont : DEFAULT_APPEARANCE.headingFont,
    bodyFont: FONTS_BY_ID[input.bodyFont] ? input.bodyFont : DEFAULT_APPEARANCE.bodyFont,
    menuFont: FONTS_BY_ID[input.menuFont] ? input.menuFont : DEFAULT_APPEARANCE.menuFont,
    menuSize: clamp(input.menuSize, 12, 28, DEFAULT_APPEARANCE.menuSize),
    bodySize: clamp(input.bodySize, 14, 22, DEFAULT_APPEARANCE.bodySize),
    headingScale: clamp(input.headingScale, 0.8, 1.4, DEFAULT_APPEARANCE.headingScale),
    accent,
    accentHover: hexColor(input.accentHover, darkenHex(accent)),
    brand,
    brandMid: hexColor(input.brandMid, DEFAULT_APPEARANCE.brandMid),
    brandDark: hexColor(input.brandDark, DEFAULT_APPEARANCE.brandDark),
    brandSoft: hexColor(input.brandSoft, DEFAULT_APPEARANCE.brandSoft),
    headingColor: hexColor(input.headingColor, brand),
    menuColor: hexColor(input.menuColor, brand),
    textColor: hexColor(input.textColor, DEFAULT_APPEARANCE.textColor),
    mutedColor: hexColor(input.mutedColor, DEFAULT_APPEARANCE.mutedColor),
    pageColor: hexColor(input.pageColor, DEFAULT_APPEARANCE.pageColor),
    altColor: hexColor(input.altColor, DEFAULT_APPEARANCE.altColor),
    borderColor: hexColor(input.borderColor, DEFAULT_APPEARANCE.borderColor),
    onDark: hexColor(input.onDark, DEFAULT_APPEARANCE.onDark),
    footerText: hexColor(input.footerText, DEFAULT_APPEARANCE.footerText),
  };
}

function fontStack(id) {
  return FONTS_BY_ID[id]?.stack || FONTS_BY_ID[DEFAULT_APPEARANCE.bodyFont].stack;
}

function darkenHex(hex, amount = 24) {
  const value = hex.replace("#", "");
  const next = [0, 2, 4].map((index) =>
    Math.max(0, parseInt(value.slice(index, index + 2), 16) - amount)
      .toString(16)
      .padStart(2, "0")
  );
  return `#${next.join("")}`;
}

function loadGoogleFonts(ids) {
  const families = [...new Set(ids)]
    .map((id) => FONTS_BY_ID[id]?.google)
    .filter(Boolean);
  if (!families.length) return;
  let link = document.getElementById("site-theme-fonts");
  if (!link) {
    link = document.createElement("link");
    link.id = "site-theme-fonts";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  link.href = `https://fonts.googleapis.com/css2?${families.map((family) => `family=${family}`).join("&")}&display=swap`;
}

export function applyAppearance(input) {
  const theme = sanitizeAppearance(input);
  const root = document.documentElement;
  root.style.setProperty("--font-heading", fontStack(theme.headingFont));
  root.style.setProperty("--font-body", fontStack(theme.bodyFont));
  root.style.setProperty("--font-menu", fontStack(theme.menuFont));
  root.style.setProperty("--font-size", `${theme.bodySize}px`);
  root.style.setProperty("--nav-size", `${theme.menuSize}px`);
  root.style.setProperty("--heading-scale", String(theme.headingScale));
  root.style.setProperty("--sky", theme.accent);
  root.style.setProperty("--sky-hover", theme.accentHover);
  root.style.setProperty("--navy", theme.brand);
  root.style.setProperty("--navy-mid", theme.brandMid);
  root.style.setProperty("--navy-deep", theme.brandDark);
  root.style.setProperty("--navy-bright", "#1e88e5");
  root.style.setProperty("--navy-soft", theme.brandSoft);
  root.style.setProperty("--heading", theme.headingColor);
  root.style.setProperty("--menu", theme.menuColor);
  root.style.setProperty("--ink", theme.textColor);
  root.style.setProperty("--muted", theme.mutedColor);
  root.style.setProperty("--paper", theme.pageColor);
  root.style.setProperty("--fog", theme.altColor);
  root.style.setProperty("--line", theme.borderColor);
  root.style.setProperty("--on-dark", theme.onDark);
  root.style.setProperty("--footer-text", theme.footerText);
  loadGoogleFonts([theme.headingFont, theme.bodyFont, theme.menuFont]);
  return theme;
}
