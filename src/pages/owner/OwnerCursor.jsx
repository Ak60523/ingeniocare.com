import { useEffect, useState } from "react";
import { api } from "../../api";

const MODES = [
  ["agent", "Agent", "Implements code changes."],
  ["ask", "Ask", "Read-only investigation."],
  ["plan", "Plan", "Draft a plan before coding."],
];

export default function OwnerCursor() {
  const [briefs, setBriefs] = useState([]);
  const [mode, setMode] = useState("agent");
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState("");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .ownerCursor()
      .then((data) => setBriefs(data.briefs || []))
      .catch((err) => setError(err.message));
  }, []);

  async function onSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNote("");
    try {
      const data = await api.createCursorBrief({ mode, prompt, files });
      setBriefs((current) => [data.brief, ...current]);
      setPrompt("");
      setFiles("");
      if (data.copyText && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(data.copyText);
        setNote("Saved and copied. Paste into Cursor.");
      } else {
        setNote("Saved. Copy the brief from the list below.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function copyBrief(item) {
    const text = `[${item.mode}] ${item.prompt}${item.files ? `\n\nFocus files:\n${item.files}` : ""}`;
    await navigator.clipboard.writeText(text);
    setNote("Copied to clipboard.");
  }

  return (
    <div className="owner-page">
      <header className="owner-page-head">
        <div>
          <h1>Cursor</h1>
          <p>Write an agent, ask, or plan brief for this repo and copy it into Cursor.</p>
        </div>
      </header>

      <form className="owner-card" onSubmit={onSubmit}>
        <h2>New brief</h2>
        <div className="mode-toggle" role="group" aria-label="Cursor mode">
          {MODES.map(([id, label, help]) => (
            <button
              key={id}
              type="button"
              className={mode === id ? "is-active" : undefined}
              onClick={() => setMode(id)}
            >
              <strong>{label}</strong>
              <span>{help}</span>
            </button>
          ))}
        </div>
        <label>
          Prompt
          <textarea
            rows={5}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            required
            placeholder="What should Cursor do in this Ingenio Care repo?"
          />
        </label>
        <label>
          Focus files (optional)
          <input
            value={files}
            onChange={(event) => setFiles(event.target.value)}
            placeholder="src/pages/Home.jsx, server/index.js"
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        {note ? <p className="owner-notice">{note}</p> : null}
        <button className="btn" type="submit" disabled={busy || !prompt.trim()}>
          {busy ? "Saving…" : "Save and copy"}
        </button>
      </form>

      <section className="owner-card">
        <h2>Recent briefs</h2>
        {!briefs.length ? (
          <p className="form-note">No Cursor briefs yet.</p>
        ) : (
          <ul className="brief-list">
            {briefs.map((item) => (
              <li key={item.id}>
                <div>
                  <strong>{item.mode}</strong>
                  <span className="form-note">
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
                  </span>
                  <p>{item.prompt}</p>
                  {item.files ? <p className="form-note">{item.files}</p> : null}
                </div>
                <button className="btn ghost" type="button" onClick={() => copyBrief(item)}>
                  Copy
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
