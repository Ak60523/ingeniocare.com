import { useEffect, useRef, useState } from "react";
import { api } from "../../api";

const SECTION_OPTIONS = [
  { id: "introduction", label: "Introduction" },
  { id: "problem", label: "Problem" },
  { id: "solution", label: "Solution" },
  { id: "how-it-works", label: "How it works" },
  { id: "use-cases", label: "Use cases" },
  { id: "takeaways", label: "Takeaways" },
  { id: "quote", label: "Quote" },
  { id: "sidebar", label: "Sidebar list" },
  { id: "conclusion", label: "Conclusion" },
  { id: "references", label: "References" },
  { id: "infographic", label: "Infographic" },
  { id: "image", label: "Image" },
];

const DEFAULT_SECTIONS = ["introduction", "problem", "solution", "takeaways", "conclusion"];

const SIZE_OPTIONS = [
  { id: "short", label: "Short" },
  { id: "medium", label: "Medium" },
  { id: "long", label: "Long" },
];

const TONE_OPTIONS = [
  { id: "practical", label: "Practical" },
  { id: "authoritative", label: "Authoritative" },
  { id: "conversational", label: "Conversational" },
  { id: "urgent", label: "Urgent" },
];

const STYLE_OPTIONS = [
  { id: "editorial", label: "Editorial" },
  { id: "how-to", label: "How-to" },
  { id: "analysis", label: "Analysis" },
  { id: "story", label: "Story" },
];

const AUDIENCE_OPTIONS = [
  { id: "providers", label: "Providers" },
  { id: "health-plans", label: "Health plans" },
  { id: "employers", label: "Employers" },
  { id: "health-systems", label: "Health systems" },
  { id: "patients", label: "Patients" },
  { id: "ipas", label: "IPAs" },
];

function paramLabel(options, id, override) {
  const custom = String(override || "").trim();
  if (custom) return custom;
  return options.find((item) => item.id === id)?.label || id;
}

function ChipRow({ label, options, value, multi = false, onChange, disabled, override, onOverrideChange, overridePlaceholder }) {
  const selected = new Set(multi ? (Array.isArray(value) ? value : []) : value ? [value] : []);

  function toggle(id) {
    if (disabled) return;
    if (multi) {
      const next = new Set(selected);
      if (next.has(id)) {
        if (next.size <= 1) return;
        next.delete(id);
      } else {
        next.add(id);
      }
      onChange([...next]);
      return;
    }
    onChange(id);
  }

  return (
    <div className="ai-chip-row">
      <p className="ai-panel-label">{label}</p>
      <div className="ai-chip-list">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`chip${selected.has(opt.id) ? " ok" : " muted"}`}
            disabled={disabled}
            onClick={() => toggle(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {onOverrideChange ? (
        <input
          value={override || ""}
          onChange={(event) => onOverrideChange(event.target.value)}
          placeholder={overridePlaceholder || "Optional override…"}
          disabled={disabled}
        />
      ) : null}
    </div>
  );
}

function buildInstruction({
  intent,
  sections,
  prompt,
  size,
  tone,
  style,
  audience,
  sizeOverride,
  toneOverride,
  styleOverride,
  audienceOverride,
}) {
  const sectionLabels = SECTION_OPTIONS.filter((item) => sections.includes(item.id)).map((item) => item.label);
  return [
    intent === "refine"
      ? "Refine the existing article. Preserve strong structure and accurate claims unless the guidance says otherwise."
      : intent === "rewrite"
        ? "Rewrite the full article body from scratch using the title and summary as the source of truth."
        : "",
    sectionLabels.length
      ? intent === "refine"
        ? `Focus refinement on these sections when present: ${sectionLabels.join(", ")}.`
        : `Include these sections (in a sensible order): ${sectionLabels.join(", ")}.`
      : "",
    sections.includes("sidebar")
      ? "Include a sidebar list placed immediately before the section it summarizes (not at the end of the article)."
      : "",
    sections.includes("infographic")
      ? 'Include one infographic body block with placement "inline" or "pullout" and a concrete diagram/chart prompt only; optional short caption in title; ALWAYS leave imageUrl as an empty string — do not invent URLs; the author will Generate or pick from the library afterward.'
      : "",
    sections.includes("image")
      ? 'Include one image body block with placement "inline" or "pullout" and a concrete photographic/editorial-scene prompt only (not a diagram or labeled flowchart); optional short caption in title; ALWAYS leave imageUrl as an empty string — do not invent URLs; the author will Generate or pick from the library afterward.'
      : "",
    "Use heading blocks (level 2/3) for section titles — never use # markdown inside text blocks. Return the article body as ordered section blocks (heading, text, quote, list, image, infographic), not a single HTML string.",
    `Length: ${paramLabel(SIZE_OPTIONS, size, sizeOverride)}.`,
    `Tone: ${paramLabel(TONE_OPTIONS, tone, toneOverride)}.`,
    `Style: ${paramLabel(STYLE_OPTIONS, style, styleOverride)}.`,
    `Audience: ${paramLabel(AUDIENCE_OPTIONS, audience, audienceOverride)}.`,
    prompt ? `Additional guidance: ${prompt}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function StartWithAiSection({
  busy = false,
  disabled = false,
  contentType = "blog",
  currentTitle = "",
  currentSubtitle = "",
  onSelect,
}) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [alternatives, setAlternatives] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const locked = disabled || busy || generating;

  function reset() {
    setPrompt("");
    setAlternatives([]);
    setSelectedIndex(null);
    setError("");
  }

  async function handleGenerate() {
    const trimmed = String(prompt || "").trim();
    if (!trimmed || locked) return;
    setGenerating(true);
    setError("");
    setAlternatives([]);
    setSelectedIndex(null);
    try {
      const data = await api.contentTitleAlternatives({
        prompt: trimmed,
        type: contentType,
        currentTitle: String(currentTitle || "").trim() || undefined,
        currentSubtitle: String(currentSubtitle || "").trim() || undefined,
      });
      const list = (data.alternatives || [])
        .map((row) => ({
          title: String(row?.title ?? "").trim(),
          subtitle: String(row?.subtitle ?? "").trim(),
        }))
        .filter((row) => row.title);
      if (!list.length) throw new Error("No alternatives returned — try a clearer prompt");
      setAlternatives(list);
      setSelectedIndex(0);
    } catch (err) {
      setError(err.message || "Could not generate alternatives");
    } finally {
      setGenerating(false);
    }
  }

  async function handleApply() {
    if (selectedIndex == null || locked) return;
    const pick = alternatives[selectedIndex];
    if (!pick?.title) return;
    await onSelect?.({ title: pick.title, subtitle: pick.subtitle || "" });
    setOpen(false);
    reset();
  }

  return (
    <div className="ai-panel">
      {!open ? (
        <div className="ai-panel-head">
          <div>
            <p className="ai-panel-label">Start with AI</p>
            <p className="form-note">Generate title and subtitle options, then pick one for this article.</p>
          </div>
          <button className="btn" type="button" disabled={disabled || busy} onClick={() => setOpen(true)}>
            Start with AI
          </button>
        </div>
      ) : (
        <div className="ai-panel-form">
          <p className="ai-panel-label">Start with AI</p>
          <label>
            Prompt
            <textarea
              rows="3"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="e.g. Same-day access for IPA members using unused provider capacity…"
              disabled={locked}
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          {alternatives.length ? (
            <div className="ai-alt-list">
              <p className="ai-panel-label">Alternatives</p>
              {alternatives.map((alt, index) => (
                <button
                  key={`${alt.title}-${index}`}
                  type="button"
                  className={`ai-alt${selectedIndex === index ? " is-selected" : ""}`}
                  disabled={locked}
                  onClick={() => setSelectedIndex(index)}
                >
                  <strong>{alt.title}</strong>
                  {alt.subtitle ? <span>{alt.subtitle}</span> : null}
                </button>
              ))}
            </div>
          ) : null}
          <div className="owner-row-actions">
            <button
              className="btn ghost"
              type="button"
              disabled={locked}
              onClick={() => {
                setOpen(false);
                reset();
              }}
            >
              Cancel
            </button>
            <button className="btn ghost" type="button" disabled={locked || !prompt.trim()} onClick={handleGenerate}>
              {generating ? "Generating…" : "Generate titles"}
            </button>
            <button className="btn" type="button" disabled={locked || selectedIndex == null} onClick={handleApply}>
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function WriteSection({ busy = false, disabled = false, hasBody = false, extraActions = null, onWrite, onRefine }) {
  const [intent, setIntent] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [size, setSize] = useState("medium");
  const [tone, setTone] = useState("practical");
  const [style, setStyle] = useState("editorial");
  const [audience, setAudience] = useState("providers");
  const [sizeOverride, setSizeOverride] = useState("");
  const [toneOverride, setToneOverride] = useState("");
  const [styleOverride, setStyleOverride] = useState("");
  const [audienceOverride, setAudienceOverride] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const basePromptRef = useRef("");
  const canDictate = typeof window !== "undefined" && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  const open = Boolean(intent);

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        /* ignore */
      }
    };
  }, []);

  function stopDictate() {
    try {
      recognitionRef.current?.stop();
    } catch {
      /* ignore */
    }
    recognitionRef.current = null;
    setListening(false);
  }

  function toggleDictate() {
    if (listening) {
      stopDictate();
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    basePromptRef.current = prompt;
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.onstart = () => setListening(true);
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      const base = basePromptRef.current;
      setPrompt(base ? `${base.trim()} ${transcript.trim()}`.trim() : transcript.trim());
    };
    recognition.onerror = () => {
      setListening(false);
      recognitionRef.current = null;
    };
    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };
    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setListening(false);
    }
  }

  function resetForm() {
    setPrompt("");
    setSections(DEFAULT_SECTIONS);
    setSize("medium");
    setTone("practical");
    setStyle("editorial");
    setAudience("providers");
    setSizeOverride("");
    setToneOverride("");
    setStyleOverride("");
    setAudienceOverride("");
  }

  async function handleSubmit() {
    stopDictate();
    const instruction = buildInstruction({
      intent,
      sections,
      prompt: String(prompt || "").trim(),
      size,
      tone,
      style,
      audience,
      sizeOverride,
      toneOverride,
      styleOverride,
      audienceOverride,
    });
    if (intent === "refine") await onRefine?.(instruction);
    else await onWrite?.(instruction);
    setIntent(null);
    resetForm();
  }

  const title = intent === "refine" ? "Refine" : intent === "rewrite" ? "Rewrite" : hasBody ? "Rewrite or Refine" : "Write with AI";
  const description =
    intent === "refine"
      ? "Improve the existing article — keep what’s working and apply your guidance."
      : intent === "rewrite"
        ? "Replace the article body with a fresh draft from the title, summary, and options below."
        : hasBody
          ? "Rewrite the whole article, or refine the current draft with specific guidance."
          : "Draft the article body with AI from the title and summary — choose sections and guidance, then write.";
  const submitLabel = intent === "refine" ? "Refine" : intent === "rewrite" ? "Rewrite" : "Write with AI";
  const busyLabel = intent === "refine" ? "Refining…" : intent === "rewrite" ? "Rewriting…" : "Writing…";

  return (
    <div className="ai-panel">
      {!open ? (
        <div className="ai-panel-head">
          <div>
            <p className="ai-panel-label">{title}</p>
            <p className="form-note">{description}</p>
          </div>
          <div className="ai-panel-actions">
            {extraActions}
            {hasBody ? (
              <>
                <button className="btn ghost" type="button" disabled={disabled || busy || !onWrite} onClick={() => setIntent("rewrite")}>
                  Rewrite
                </button>
                <button className="btn" type="button" disabled={disabled || busy || !onRefine} onClick={() => setIntent("refine")}>
                  Refine
                </button>
              </>
            ) : (
              <button className="btn" type="button" disabled={disabled || busy || !onWrite} onClick={() => setIntent("write")}>
                Write with AI
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="ai-panel-form">
          <p className="ai-panel-label">{title}</p>
          <p className="form-note">{description}</p>
          <ChipRow
            label={intent === "refine" ? "Sections to focus" : "Sections to generate"}
            options={SECTION_OPTIONS}
            value={sections}
            multi
            onChange={setSections}
            disabled={busy}
          />
          <label>
            Prompt
            <textarea
              rows="3"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder={
                intent === "refine"
                  ? "e.g. Shorten by 30%, drop invented stats, keep the access story…"
                  : "e.g. Focus on unused capacity and same-day visits for IPA physicians…"
              }
              disabled={busy}
            />
          </label>
          {canDictate ? (
            <button className="btn ghost" type="button" disabled={busy} onClick={toggleDictate}>
              {listening ? "Stop dictation" : "Dictate prompt"}
            </button>
          ) : null}
          <ChipRow
            label="Size"
            options={SIZE_OPTIONS}
            value={size}
            onChange={setSize}
            disabled={busy}
            override={sizeOverride}
            onOverrideChange={setSizeOverride}
            overridePlaceholder="Override size (e.g. ~800 words)"
          />
          <ChipRow
            label="Tone"
            options={TONE_OPTIONS}
            value={tone}
            onChange={setTone}
            disabled={busy}
            override={toneOverride}
            onOverrideChange={setToneOverride}
            overridePlaceholder="Override tone (e.g. clinical)"
          />
          <ChipRow
            label="Style"
            options={STYLE_OPTIONS}
            value={style}
            onChange={setStyle}
            disabled={busy}
            override={styleOverride}
            onOverrideChange={setStyleOverride}
            overridePlaceholder="Override style (e.g. white paper)"
          />
          <ChipRow
            label="Audience"
            options={AUDIENCE_OPTIONS}
            value={audience}
            onChange={setAudience}
            disabled={busy}
            override={audienceOverride}
            onOverrideChange={setAudienceOverride}
            overridePlaceholder="Override audience (e.g. hospital CIOs)"
          />
          <div className="ai-panel-actions">
            {extraActions}
            <button
              className="btn ghost"
              type="button"
              disabled={busy}
              onClick={() => {
                stopDictate();
                setIntent(null);
                resetForm();
              }}
            >
              Cancel
            </button>
            <button className="btn" type="button" disabled={busy || (intent !== "refine" && !sections.length)} onClick={handleSubmit}>
              {busy ? busyLabel : submitLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export { htmlHasContent, bodyHasContent } from "../../../server/contentBody.js";
