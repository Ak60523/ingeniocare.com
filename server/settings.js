export const DEFAULT_APPEARANCE = {
  headingFont: "Cinzel",
  bodyFont: "Source Sans Pro",
  menuFont: "Share",
  menuSize: 18,
  bodySize: 17,
  headingScale: 1,
  accent: "#38bdf8",
  accentHover: "#0ea5e9",
  brand: "#0f2940",
  brandMid: "#1b3f60",
  brandDark: "#091e31",
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

const FONTS = new Set([
  "Cinzel",
  "Playfair Display",
  "Merriweather",
  "Libre Baskerville",
  "PT Serif",
  "Georgia",
  "Source Sans Pro",
  "Inter",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Nunito",
  "Roboto",
  "Share",
  "Arial",
]);

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

function darkenHex(hex, amount = 24) {
  const value = hex.replace("#", "");
  const next = [0, 2, 4].map((index) =>
    Math.max(0, parseInt(value.slice(index, index + 2), 16) - amount)
      .toString(16)
      .padStart(2, "0")
  );
  return `#${next.join("")}`;
}

export function sanitizeAppearance(input = {}) {
  const accent = hexColor(input.accent, DEFAULT_APPEARANCE.accent);
  const brand = hexColor(input.brand, DEFAULT_APPEARANCE.brand);
  return {
    headingFont: FONTS.has(input.headingFont) ? input.headingFont : DEFAULT_APPEARANCE.headingFont,
    bodyFont: FONTS.has(input.bodyFont) ? input.bodyFont : DEFAULT_APPEARANCE.bodyFont,
    menuFont: FONTS.has(input.menuFont) ? input.menuFont : DEFAULT_APPEARANCE.menuFont,
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

export async function getAppearance(db) {
  const { rows } = await db.query("SELECT appearance FROM site_settings WHERE id = 1");
  return sanitizeAppearance(rows[0]?.appearance || {});
}

export async function saveAppearance(db, input) {
  const appearance = sanitizeAppearance(input);
  await db.query(
    `INSERT INTO site_settings (id, appearance, updated_at)
     VALUES (1, ?::jsonb, NOW())
     ON CONFLICT (id) DO UPDATE SET appearance = EXCLUDED.appearance, updated_at = NOW()`,
    [JSON.stringify(appearance)]
  );
  return appearance;
}
