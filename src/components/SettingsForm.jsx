import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSettings } from "../SettingsContext.jsx";
import { useTheme } from "../ThemeContext.jsx";
import { pageSectionOutline } from "../pageSections.js";
import { COLOR_FIELDS, FONT_FIELDS, FONTS } from "../theme";

const FALLBACK_FONT_OUTLINE = [
  { id: "header", label: "Header & menu", fonts: ["menuFont", "menuSize", "headingFont"] },
  { id: "page", label: "This page", fonts: ["headingFont", "headingScale", "bodyFont", "bodySize"] },
  { id: "footer", label: "Footer", fonts: ["bodyFont", "bodySize", "menuFont"] },
];

function usesNote(ids) {
  const names = [];
  if (ids.includes("headingFont") || ids.includes("headingScale")) names.push("heading");
  if (ids.includes("bodyFont") || ids.includes("bodySize")) names.push("body");
  if (ids.includes("menuFont") || ids.includes("menuSize")) names.push("menu");
  if (!names.length) return "Uses site fonts.";
  if (names.length === 1) return `Uses ${names[0]} styles from above.`;
  return `Uses ${names.slice(0, -1).join(", ")} and ${names.at(-1)} styles from above.`;
}

function fontGroupsFor(outline, selectedSection) {
  if (selectedSection) {
    return [
      {
        key: selectedSection.id,
        label: selectedSection.label,
        fields: FONT_FIELDS.filter((field) => selectedSection.fonts.includes(field.id)),
        uses: null,
        section: selectedSection,
      },
    ];
  }

  const source = outline.length ? outline : FALLBACK_FONT_OUTLINE;
  const used = new Set();
  return source.map((item, index) => {
    const remaining = item.fonts.filter((id) => !used.has(id));
    remaining.forEach((id) => used.add(id));
    return {
      key: `${item.id}-${index}`,
      label: item.label,
      fields: FONT_FIELDS.filter((field) => remaining.includes(field.id)),
      uses: remaining.length ? null : item.fonts,
      section: item.node ? item : null,
    };
  });
}

function ColorField({ label, value, onChange }) {
  const swatch = /^#([0-9a-f]{6})$/i.test(value) ? value : "#000000";
  return (
    <label>
      {label}
      <span className="color-field">
        <input type="color" value={swatch} onChange={(event) => onChange(event.target.value)} />
        <input value={value} onChange={(event) => onChange(event.target.value)} spellCheck="false" />
      </span>
    </label>
  );
}

function FontField({ field, value, onChange }) {
  if (field.kind === "font") {
    return (
      <label>
        {field.label}
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          {FONTS.map((font) => (
            <option key={font.id} value={font.id}>
              {font.label}
            </option>
          ))}
        </select>
      </label>
    );
  }
  if (field.kind === "scale") {
    return (
      <label>
        {field.label} ({Math.round(Number(value) * 100)}%)
        <input
          type="range"
          min={field.min}
          max={field.max}
          step={field.step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </label>
    );
  }
  return (
    <label>
      {field.label} ({value}px)
      <input
        type="range"
        min={field.min}
        max={field.max}
        step={field.step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export default function SettingsForm({ tab = "colors" }) {
  const { pathname } = useLocation();
  const { selectedSection, selectSection, open } = useSettings();
  const { appearance, preview, revert, save, reset } = useTheme();
  const [draft, setDraft] = useState(appearance);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [outline, setOutline] = useState([]);
  const showSection = Boolean(selectedSection);
  const colorFields = showSection
    ? COLOR_FIELDS.filter((field) => selectedSection.colors.includes(field.id))
    : COLOR_FIELDS;
  const showColors = tab === "colors";
  const showFonts = tab === "fonts";
  const fontGroups = useMemo(
    () => (showFonts ? fontGroupsFor(outline, selectedSection) : []),
    [outline, selectedSection, showFonts]
  );

  useEffect(() => {
    if (!open || !showFonts) return undefined;
    const frame = requestAnimationFrame(() => setOutline(pageSectionOutline()));
    return () => cancelAnimationFrame(frame);
  }, [open, pathname, showFonts]);

  useEffect(() => {
    setDraft(appearance);
  }, [appearance]);

  useEffect(() => {
    preview(draft);
  }, [draft, preview]);

  useEffect(() => () => revert(), [revert]);

  function update(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
    setMessage("");
  }

  async function onSave(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await save(draft);
      setMessage("Appearance saved. The public site now uses these fonts, sizes, and colors.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function onReset() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const next = await reset();
      setDraft(next);
      setMessage("Restored the default Ingenio Care fonts, sizes, and colors.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="owner-card" onSubmit={onSave}>
      {showColors ? (
        <div className="settings-grid">
          {colorFields.map((field) => (
            <ColorField
              key={field.id}
              label={field.label}
              value={draft[field.id] || ""}
              onChange={(value) => update(field.id, value)}
            />
          ))}
        </div>
      ) : null}

      {showFonts
        ? fontGroups.map((group) => (
            <div key={group.key} className="settings-font-group">
              {group.section && !selectedSection ? (
                <button
                  className="settings-group-title is-button"
                  type="button"
                  onClick={() => selectSection(group.section)}
                >
                  {group.label}
                </button>
              ) : (
                <p className="settings-group-title">{group.label}</p>
              )}
              {group.fields.length ? (
                <div className="settings-grid">
                  {group.fields.map((field) => (
                    <FontField
                      key={field.id}
                      field={field}
                      value={draft[field.id]}
                      onChange={(value) => update(field.id, value)}
                    />
                  ))}
                </div>
              ) : (
                <p className="form-note">{usesNote(group.uses || [])}</p>
              )}
            </div>
          ))
        : null}

      {error ? <p className="form-error">{error}</p> : null}
      {message ? <p className="owner-notice">{message}</p> : null}

      <div className="owner-row-actions">
        <button className="btn" type="submit" disabled={busy}>
          {busy ? "Saving…" : "Save appearance"}
        </button>
        <button className="btn ghost" type="button" disabled={busy} onClick={onReset}>
          Reset defaults
        </button>
      </div>
    </form>
  );
}
