import { useEffect, useState } from "react";

const RECEPTION_ORIGIN = String(
  import.meta.env.VITE_GROWGENT_ORIGIN ||
    (import.meta.env.DEV ? "http://127.0.0.1:5177" : "https://growgent.ai"),
).replace(/\/$/, "");
const RECEPTION_URL = `${RECEPTION_ORIGIN}/business/ingenio-care?embed=1`;
const RECEPTION_LABEL = "Ingenio Care receptionist";

export default function GrowgentFab() {
  const [open, setOpen] = useState(false);
  const [frameReady, setFrameReady] = useState(false);

  useEffect(() => {
    if (!open) {
      setFrameReady(false);
      return undefined;
    }
    function onKey(event) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {open ? (
        <div className="growgent-fab-panel" role="dialog" aria-label={RECEPTION_LABEL}>
          <div className="growgent-fab-panel-bar">
            <strong>{RECEPTION_LABEL}</strong>
            <a href={RECEPTION_URL} target="_blank" rel="noopener noreferrer">
              Open in a new tab
            </a>
            <button type="button" aria-label={`Close ${RECEPTION_LABEL}`} onClick={() => setOpen(false)}>
              ×
            </button>
          </div>
          {frameReady ? null : <p className="growgent-fab-loading">Opening receptionist…</p>}
          <iframe
            title={RECEPTION_LABEL}
            src={RECEPTION_URL}
            allow="clipboard-write; microphone; autoplay"
            onLoad={() => setFrameReady(true)}
          />
        </div>
      ) : null}
      <button
        type="button"
        className={`growgent-fab${open ? " is-open" : ""}`}
        aria-label={open ? `Close ${RECEPTION_LABEL}` : `Chat with ${RECEPTION_LABEL}`}
        title={`Chat with ${RECEPTION_LABEL}`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.58 7.1 5.7a1 1 0 0 0-1.4 1.42L10.58 12l-4.88 4.9a1 1 0 1 0 1.42 1.4L12 13.42l4.9 4.88a1 1 0 0 0 1.4-1.42L13.42 12l4.88-4.9a1 1 0 0 0 0-1.4z"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a8 8 0 0 0-8 8v1.5A2.5 2.5 0 0 0 6.5 14H8v-5H7a5 5 0 0 1 10 0h-1v5h1.5A2.5 2.5 0 0 0 20 11.5V10a8 8 0 0 0-8-8zm-2 8v5H8.5A.5.5 0 0 1 8 14.5V12a6 6 0 0 1 .2-1.5H10zm6 5h-1.5V10h1.3A6 6 0 0 1 16 12v2.5a.5.5 0 0 1-.5.5zM9 16h6a3 3 0 0 1-3 3h-1v2h1a5 5 0 0 0 5-5H9z"
            />
          </svg>
        )}
      </button>
    </>
  );
}
