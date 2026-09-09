import { useEffect, useId, useRef, useState } from "react";

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
    </svg>
  );
}

function canUseWebShare() {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.left = "-9999px";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
}

export default function ShareButton({
  title,
  text,
  url,
  className = "",
}) {
  const menuId = useId();
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const shareTitle = String(title || "").trim() || "Ingenio Care";
  const shareText = String(text || "").trim();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    function onKey(event) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!status) return undefined;
    const timer = window.setTimeout(() => setStatus(""), 2200);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function copyLink() {
    try {
      await copyText(shareUrl);
      setStatus("Link copied");
      setOpen(false);
    } catch {
      setStatus("Could not copy");
    }
  }

  async function shareNative() {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText || shareTitle,
        url: shareUrl,
      });
      setOpen(false);
    } catch (err) {
      if (err?.name === "AbortError") return;
      await copyLink();
    }
  }

  async function onPrimaryClick() {
    if (canUseWebShare()) {
      await shareNative();
      return;
    }
    setOpen((value) => !value);
  }

  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const emailHref = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(
    `${shareText ? `${shareText}\n\n` : ""}${shareUrl}`
  )}`;

  return (
    <div className={`share-control${className ? ` ${className}` : ""}`} ref={rootRef}>
      <button
        type="button"
        className="share-button"
        aria-haspopup={canUseWebShare() ? undefined : "menu"}
        aria-expanded={canUseWebShare() ? undefined : open}
        aria-controls={canUseWebShare() ? undefined : menuId}
        onClick={onPrimaryClick}
      >
        <ShareIcon />
        <span>Share</span>
      </button>

      {status ? <span className="share-status" role="status">{status}</span> : null}

      {open ? (
        <div className="share-menu" id={menuId} role="menu">
          <button type="button" role="menuitem" onClick={copyLink}>
            Copy link
          </button>
          <a role="menuitem" href={linkedInHref} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
            LinkedIn
          </a>
          <a role="menuitem" href={emailHref} onClick={() => setOpen(false)}>
            Email
          </a>
        </div>
      ) : null}
    </div>
  );
}
