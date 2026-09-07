import { useRef } from "react";
import { wrapTextareaSelection } from "../../utils/contentRichText.js";

export default function ParagraphBlockEditor({
  value = "",
  onChange,
  label = "Text",
  rows = 6,
  disabled = false,
}) {
  const inputRef = useRef(null);

  function applyMark(marker) {
    const result = wrapTextareaSelection(inputRef.current, marker);
    if (!result) {
      onChange?.(marker === "**" ? `**${value || "text"}**` : `*${value || "text"}*`);
      return;
    }
    onChange?.(result.value);
    requestAnimationFrame(() => {
      const node = inputRef.current;
      if (!node) return;
      node.focus();
      node.setSelectionRange(result.selectionStart, result.selectionEnd);
    });
  }

  return (
    <label>
      <span className="body-text-label">
        {label}
        <span className="owner-row-actions">
          <button className="btn ghost" type="button" disabled={disabled} onClick={() => applyMark("**")}>
            Bold
          </button>
          <button className="btn ghost" type="button" disabled={disabled} onClick={() => applyMark("*")}>
            Italic
          </button>
        </span>
      </span>
      <textarea
        ref={inputRef}
        rows={rows}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value)}
      />
      <span className="form-note">Separate paragraphs with a blank line. Use Bold / Italic on a selection.</span>
    </label>
  );
}
