import {
  emptyBlock,
  ensureEditableBlocks,
  parseBody,
} from "../../../server/contentBody.js";
import FigureBlockEditor from "./FigureBlockEditor.jsx";
import ParagraphBlockEditor from "./ParagraphBlockEditor.jsx";

const BLOCK_TYPES = [
  { value: "heading", label: "Heading" },
  { value: "text", label: "Text" },
  { value: "quote", label: "Quote" },
  { value: "list", label: "List" },
  { value: "infographic", label: "Infographic" },
  { value: "image", label: "Image" },
  { value: "html", label: "HTML" },
];

function blockLabel(block) {
  return BLOCK_TYPES.find((item) => item.value === block.type)?.label || "Text";
}

export default function ArticleBodyEditor({ value, onChange, contentId, disabled = false }) {
  const blocks = ensureEditableBlocks(value);

  function commit(next) {
    onChange?.(ensureEditableBlocks(parseBody(next)));
  }

  function updateAt(index, patch) {
    commit(blocks.map((block, i) => (i === index ? { ...block, ...patch } : block)));
  }

  function changeType(index, type) {
    commit(blocks.map((block, i) => (i === index ? emptyBlock(type) : block)));
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
    commit(next.length ? next : [emptyBlock("text")]);
  }

  function add(type) {
    commit([...blocks, emptyBlock(type)]);
  }

  function updateListItem(blockIndex, itemIndex, text) {
    const block = blocks[blockIndex];
    if (!block || block.type !== "list") return;
    const items = [...(block.items || [])];
    items[itemIndex] = text;
    updateAt(blockIndex, { items });
  }

  function addListItem(blockIndex) {
    const block = blocks[blockIndex];
    if (!block || block.type !== "list") return;
    updateAt(blockIndex, { items: [...(block.items || []), ""] });
  }

  function removeListItem(blockIndex, itemIndex) {
    const block = blocks[blockIndex];
    if (!block || block.type !== "list") return;
    const items = (block.items || []).filter((_, i) => i !== itemIndex);
    updateAt(blockIndex, { items: items.length ? items : [""] });
  }

  return (
    <div className="body-editor">
      <div className="body-editor-add owner-row-actions">
        <button className="btn ghost" type="button" disabled={disabled} onClick={() => add("heading")}>
          + Heading
        </button>
        <button className="btn ghost" type="button" disabled={disabled} onClick={() => add("text")}>
          + Text
        </button>
        <button className="btn ghost" type="button" disabled={disabled} onClick={() => add("quote")}>
          + Quote
        </button>
        <button className="btn ghost" type="button" disabled={disabled} onClick={() => add("list")}>
          + List
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
            <label className="body-block-type">
              Type
              <select
                value={BLOCK_TYPES.some((item) => item.value === block.type) ? block.type : "text"}
                disabled={disabled}
                onChange={(event) => changeType(index, event.target.value)}
              >
                {BLOCK_TYPES.filter((item) => item.value !== "html" || block.type === "html").map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
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

          {block.type === "heading" ? (
            <div className="body-heading-row">
              <label>
                {blockLabel(block)}
                <input
                  value={block.text || ""}
                  disabled={disabled}
                  onChange={(event) => updateAt(index, { text: event.target.value })}
                />
              </label>
              <label>
                Level
                <select
                  value={block.level === 3 ? 3 : 2}
                  disabled={disabled}
                  onChange={(event) => updateAt(index, { level: Number(event.target.value) })}
                >
                  <option value={2}>H2</option>
                  <option value={3}>H3</option>
                </select>
              </label>
            </div>
          ) : null}

          {block.type === "text" ? (
            <ParagraphBlockEditor
              value={block.text || ""}
              disabled={disabled}
              onChange={(text) => updateAt(index, { text })}
            />
          ) : null}

          {block.type === "quote" ? (
            <>
              <label>
                Quote
                <textarea
                  rows="5"
                  value={block.text || ""}
                  disabled={disabled}
                  onChange={(event) => updateAt(index, { text: event.target.value })}
                />
              </label>
              <div className="body-heading-row">
                <label>
                  Speaker
                  <input
                    value={block.speaker || ""}
                    disabled={disabled}
                    onChange={(event) => updateAt(index, { speaker: event.target.value })}
                  />
                </label>
                <label>
                  Title / role
                  <input
                    value={block.title || ""}
                    disabled={disabled}
                    onChange={(event) => updateAt(index, { title: event.target.value })}
                  />
                </label>
              </div>
            </>
          ) : null}

          {block.type === "list" ? (
            <>
              <div className="body-heading-row">
                <label>
                  List title
                  <input
                    value={block.title || ""}
                    disabled={disabled}
                    onChange={(event) => updateAt(index, { title: event.target.value })}
                  />
                </label>
                <label className="body-sidebar-toggle">
                  <input
                    type="checkbox"
                    checked={block.placement === "sidebar"}
                    disabled={disabled}
                    onChange={(event) =>
                      updateAt(index, { placement: event.target.checked ? "sidebar" : undefined })
                    }
                  />
                  Sidebar (beside next section)
                </label>
              </div>
              {(block.items || []).map((item, itemIndex) => (
                <div className="body-list-item" key={itemIndex}>
                  <label>
                    Item {itemIndex + 1}
                    <input
                      value={item}
                      disabled={disabled}
                      onChange={(event) => updateListItem(index, itemIndex, event.target.value)}
                    />
                  </label>
                  <button
                    className="btn ghost"
                    type="button"
                    disabled={disabled || (block.items || []).length <= 1}
                    onClick={() => removeListItem(index, itemIndex)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button className="btn ghost" type="button" disabled={disabled} onClick={() => addListItem(index)}>
                + Item
              </button>
            </>
          ) : null}

          {block.type === "image" || block.type === "infographic" ? (
            <FigureBlockEditor
              block={block}
              kind={block.type}
              contentId={contentId}
              disabled={disabled}
              onChange={(next) => updateAt(index, next)}
            />
          ) : null}

          {block.type === "html" ? (
            <label>
              Body (HTML)
              <textarea
                rows="16"
                value={block.html || ""}
                disabled={disabled}
                onChange={(event) => updateAt(index, { html: event.target.value })}
              />
            </label>
          ) : null}
        </div>
      ))}
    </div>
  );
}
