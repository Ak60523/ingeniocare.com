import { useEffect, useState } from "react";
import {
  emptyBlock,
  ensureEditableBlocks,
  parseBody,
} from "../../../server/contentBody.js";
import ArticleBody from "./ArticleBody.jsx";
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

export function groupSectionIndexes(blocks) {
  // Each content block is its own editable section (heading, text, quote, list, figure, …).
  return (blocks || []).map((_, index) => [index]);
}

export function getSectionBlocks(blocks, sectionIndex) {
  const sections = groupSectionIndexes(blocks);
  const indexes = sections[sectionIndex];
  if (!indexes?.length) return null;
  return indexes.map((index) => structuredClone(blocks[index]));
}

export function replaceSectionBlocks(blocks, sectionIndex, nextSectionBlocks) {
  const sections = groupSectionIndexes(blocks);
  const indexes = sections[sectionIndex];
  if (!indexes?.length) return blocks;
  const start = indexes[0];
  const end = indexes[indexes.length - 1] + 1;
  return [...blocks.slice(0, start), ...ensureEditableBlocks(nextSectionBlocks || []), ...blocks.slice(end)];
}

function sectionContentKey(blocks) {
  return JSON.stringify(blocks || []);
}

function BodyBlockEditor({
  block,
  index,
  lastIndex,
  contentId,
  disabled,
  onChangeType,
  onMove,
  onRemove,
  onUpdate,
  onUpdateListItem,
  onAddListItem,
  onRemoveListItem,
}) {
  return (
    <div className="body-block">
      <div className="body-block-bar">
        <label className="body-block-type">
          Type
          <select
            value={BLOCK_TYPES.some((item) => item.value === block.type) ? block.type : "text"}
            disabled={disabled}
            onChange={(event) => onChangeType(index, event.target.value)}
          >
            {BLOCK_TYPES.filter((item) => item.value !== "html" || block.type === "html").map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <div className="owner-row-actions">
          <button className="btn ghost" type="button" disabled={disabled || index === 0} onClick={() => onMove(index, -1)}>
            Up
          </button>
          <button
            className="btn ghost"
            type="button"
            disabled={disabled || index === lastIndex}
            onClick={() => onMove(index, 1)}
          >
            Down
          </button>
          <button className="btn ghost" type="button" disabled={disabled} onClick={() => onRemove(index)}>
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
              onChange={(event) => onUpdate(index, { text: event.target.value })}
            />
          </label>
          <label>
            Level
            <select
              value={block.level === 3 ? 3 : 2}
              disabled={disabled}
              onChange={(event) => onUpdate(index, { level: Number(event.target.value) })}
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
          onChange={(text) => onUpdate(index, { text })}
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
              onChange={(event) => onUpdate(index, { text: event.target.value })}
            />
          </label>
          <div className="body-heading-row">
            <label>
              Speaker
              <input
                value={block.speaker || ""}
                disabled={disabled}
                onChange={(event) => onUpdate(index, { speaker: event.target.value })}
              />
            </label>
            <label>
              Title / role
              <input
                value={block.title || ""}
                disabled={disabled}
                onChange={(event) => onUpdate(index, { title: event.target.value })}
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
                onChange={(event) => onUpdate(index, { title: event.target.value })}
              />
            </label>
            <label className="body-sidebar-toggle">
              <input
                type="checkbox"
                checked={block.placement === "sidebar"}
                disabled={disabled}
                onChange={(event) => onUpdate(index, { placement: event.target.checked ? "sidebar" : undefined })}
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
                  onChange={(event) => onUpdateListItem(index, itemIndex, event.target.value)}
                />
              </label>
              <button
                className="btn ghost"
                type="button"
                disabled={disabled || (block.items || []).length <= 1}
                onClick={() => onRemoveListItem(index, itemIndex)}
              >
                Remove
              </button>
            </div>
          ))}
          <button className="btn ghost" type="button" disabled={disabled} onClick={() => onAddListItem(index)}>
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
          onChange={(next) => onUpdate(index, next)}
        />
      ) : null}

      {block.type === "html" ? (
        <label>
          Body (HTML)
          <textarea
            rows="16"
            value={block.html || ""}
            disabled={disabled}
            onChange={(event) => onUpdate(index, { html: event.target.value })}
          />
        </label>
      ) : null}
    </div>
  );
}

export default function ArticleBodyEditor({
  value,
  onChange,
  contentId,
  disabled = false,
  review = false,
  reviewEpoch = 0,
  precedingBlocks = null,
  onResetSection,
  onSectionDone,
}) {
  const blocks = ensureEditableBlocks(value);
  const preceding = precedingBlocks ? ensureEditableBlocks(precedingBlocks) : null;
  const [editingSection, setEditingSection] = useState(null);
  const [sectionSnapshots, setSectionSnapshots] = useState({});

  useEffect(() => {
    setEditingSection(null);
    setSectionSnapshots({});
  }, [review, reviewEpoch]);

  function commit(next) {
    onChange?.(ensureEditableBlocks(parseBody(next)));
  }

  function precedingForSection(sectionIndex) {
    if (sectionSnapshots[sectionIndex]) return sectionSnapshots[sectionIndex];
    return getSectionBlocks(preceding, sectionIndex);
  }

  function canResetSection(sectionIndex) {
    if (disabled || typeof onResetSection !== "function") return false;
    const current = getSectionBlocks(blocks, sectionIndex);
    const previous = precedingForSection(sectionIndex);
    if (!current || !previous) return false;
    return sectionContentKey(current) !== sectionContentKey(previous);
  }

  async function handleToggleEdit(sectionIndex, isEditing) {
    if (isEditing) {
      setEditingSection(null);
      await onSectionDone?.(sectionIndex, blocks);
      return;
    }
    const snapshot = getSectionBlocks(blocks, sectionIndex);
    if (snapshot) {
      setSectionSnapshots((current) => ({ ...current, [sectionIndex]: snapshot }));
    }
    setEditingSection(sectionIndex);
  }

  async function handleReset(sectionIndex) {
    const previous = precedingForSection(sectionIndex);
    if (!previous) return;
    await onResetSection?.(sectionIndex, previous);
    setEditingSection(null);
    setSectionSnapshots((current) => {
      const next = { ...current };
      delete next[sectionIndex];
      return next;
    });
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

  const blockProps = {
    lastIndex: blocks.length - 1,
    contentId,
    disabled,
    onChangeType: changeType,
    onMove: move,
    onRemove: removeAt,
    onUpdate: updateAt,
    onUpdateListItem: updateListItem,
    onAddListItem: addListItem,
    onRemoveListItem: removeListItem,
  };

  if (review) {
    const sections = groupSectionIndexes(blocks);
    return (
      <div className="body-editor is-review">
        {sections.map((indexes, sectionIndex) => {
          const isEditing = editingSection === sectionIndex;
          const resetEnabled = canResetSection(sectionIndex);
          const block = blocks[indexes[0]];
          return (
            <div className="article-section-review" key={`section-${sectionIndex}-${block?.type || "block"}`}>
              <div className="article-section-bar">
                <span className="article-section-type">{blockLabel(block)}</span>
                <button
                  type="button"
                  disabled={disabled || !resetEnabled}
                  onClick={() => handleReset(sectionIndex)}
                >
                  Reset
                </button>
                <button type="button" disabled={disabled} onClick={() => handleToggleEdit(sectionIndex, isEditing)}>
                  {isEditing ? "Done" : "Edit"}
                </button>
              </div>
              {isEditing ? (
                indexes.map((index) => <BodyBlockEditor key={`${blocks[index].type}-${index}`} block={blocks[index]} index={index} {...blockProps} />)
              ) : (
                <div className="article article-section-preview">
                  <ArticleBody body={indexes.map((index) => blocks[index])} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
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
        <BodyBlockEditor key={`${block.type}-${index}`} block={block} index={index} {...blockProps} />
      ))}
    </div>
  );
}
