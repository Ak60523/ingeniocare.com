import {
  emptyFigureBlock,
  emptyHtmlBlock,
  ensureEditableBlocks,
  parseBody,
} from "../../../server/contentBody.js";
import FigureBlockEditor from "./FigureBlockEditor.jsx";

function blockLabel(block) {
  if (block.type === "infographic") return "Infographic";
  if (block.type === "image") return "Image";
  return "HTML";
}

export default function ArticleBodyEditor({ value, onChange, contentId, disabled = false }) {
  const blocks = ensureEditableBlocks(value);

  function commit(next) {
    onChange?.(ensureEditableBlocks(parseBody(next)));
  }

  function updateAt(index, patch) {
    commit(blocks.map((block, i) => (i === index ? { ...block, ...patch } : block)));
  }

  function move(index, dir) {
    const next = [...blocks];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    commit(next);
  }

  function removeAt(index) {
    const next = blocks.filter((_, i) => i !== index);
    commit(next.length ? next : [emptyHtmlBlock("")]);
  }

  function add(type) {
    if (type === "image" || type === "infographic") {
      commit([...blocks, emptyFigureBlock(type)]);
      return;
    }
    commit([...blocks, emptyHtmlBlock("")]);
  }

  return (
    <div className="body-editor">
      <div className="body-editor-add owner-row-actions">
        <button className="btn ghost" type="button" disabled={disabled} onClick={() => add("html")}>
          + HTML
        </button>
        <button className="btn ghost" type="button" disabled={disabled} onClick={() => add("image")}>
          + Image
        </button>
        <button className="btn ghost" type="button" disabled={disabled} onClick={() => add("infographic")}>
          + Infographic
        </button>
      </div>
      {blocks.map((block, index) => (
        <div className="body-block" key={`${block.type}-${index}`}>
          <div className="body-block-bar">
            <strong>{blockLabel(block)}</strong>
            <div className="owner-row-actions">
              <button className="btn ghost" type="button" disabled={disabled || index === 0} onClick={() => move(index, -1)}>
                Up
              </button>
              <button
                className="btn ghost"
                type="button"
                disabled={disabled || index === blocks.length - 1}
                onClick={() => move(index, 1)}
              >
                Down
              </button>
              <button className="btn ghost" type="button" disabled={disabled} onClick={() => removeAt(index)}>
                Remove
              </button>
            </div>
          </div>
          {block.type === "image" || block.type === "infographic" ? (
            <FigureBlockEditor
              block={block}
              kind={block.type}
              contentId={contentId}
              disabled={disabled}
              onChange={(next) => updateAt(index, next)}
            />
          ) : (
            <label>
              Body (HTML)
              <textarea
                rows="16"
                value={block.html || ""}
                disabled={disabled}
                onChange={(event) => updateAt(index, { html: event.target.value })}
              />
            </label>
          )}
        </div>
      ))}
    </div>
  );
}
