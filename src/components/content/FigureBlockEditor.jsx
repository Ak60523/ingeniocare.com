import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../../api";

const PLACEMENT_OPTIONS = [
  { id: "inline", label: "Inline", hint: "Full-width figure · landscape ~1536×1024 · spans the article column." },
  { id: "pullout", label: "Pull-out", hint: "Beside following section · square 1024×1024 · floats beside body text on desktop." },
];

function resolveKind(block, kindProp) {
  if (kindProp === "image" || kindProp === "infographic") return kindProp;
  return String(block?.type || "").toLowerCase() === "infographic" ? "infographic" : "image";
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read that file"));
    reader.readAsDataURL(file);
  });
}

export default function FigureBlockEditor({
  block,
  onChange,
  contentId,
  disabled = false,
  kind: kindProp,
}) {
  const kind = resolveKind(block, kindProp);
  const isImage = kind === "image";
  const figureLabel = isImage ? "image" : "graphic";
  const fileRef = useRef(null);

  const [title, setTitle] = useState(() => String(block?.title || ""));
  const [prompt, setPrompt] = useState(() => String(block?.prompt || ""));
  const [imageUrl, setImageUrl] = useState(() => String(block?.imageUrl || "").trim());
  const [placement, setPlacement] = useState(() =>
    String(block?.placement || "").toLowerCase() === "pullout" ? "pullout" : "inline"
  );
  const [libraryImageId, setLibraryImageId] = useState(() => String(block?.libraryImageId || ""));
  const [library, setLibrary] = useState([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(String(block?.title || ""));
    setPrompt(String(block?.prompt || ""));
    setImageUrl(String(block?.imageUrl || "").trim());
    setPlacement(String(block?.placement || "").toLowerCase() === "pullout" ? "pullout" : "inline");
    setLibraryImageId(String(block?.libraryImageId || ""));
  }, [block?.title, block?.prompt, block?.imageUrl, block?.placement, block?.libraryImageId]);

  const emit = (patch) => {
    const next = {
      type: kind,
      title: patch.title ?? title,
      prompt: patch.prompt ?? prompt,
      imageUrl: patch.imageUrl ?? imageUrl,
      placement: patch.placement ?? placement,
      libraryImageId: String(patch.libraryImageId ?? libraryImageId ?? "").trim() || undefined,
    };
    if (Object.prototype.hasOwnProperty.call(patch, "imageUrl") && !String(patch.imageUrl || "").trim()) {
      next.imageUrl = "";
      next.libraryImageId = undefined;
    }
    if (Object.prototype.hasOwnProperty.call(patch, "libraryImageId") && !patch.libraryImageId) {
      next.libraryImageId = undefined;
    }
    onChange?.(next);
    return next;
  };

  const loadLibrary = useCallback(async () => {
    setLibraryLoading(true);
    try {
      const data = await api.contentImages();
      const rows = (data.images || [])
        .filter((row) => String(row?.imageUrl || "").trim())
        .sort(
          (a, b) =>
            new Date(b?.updatedAt ?? b?.createdAt ?? 0).getTime() -
            new Date(a?.updatedAt ?? a?.createdAt ?? 0).getTime()
        );
      setLibrary(rows);
    } catch {
      setLibrary([]);
    } finally {
      setLibraryLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLibrary();
  }, [loadLibrary]);

  const clearImage = () => {
    setImageUrl("");
    setLibraryImageId("");
    emit({ imageUrl: "", libraryImageId: undefined });
  };

  const applyGenerated = (data) => {
    const url = String(data.imageUrl || "").trim();
    const libId = String(data.libraryImageId || "").trim();
    if (!url) throw new Error("No image URL returned");
    setImageUrl(url);
    if (libId) setLibraryImageId(libId);
    emit({
      title,
      prompt: String(prompt || "").trim(),
      imageUrl: url,
      placement,
      libraryImageId: libId || undefined,
    });
  };

  const generate = async () => {
    if (generating) return;
    const trimmed = String(prompt || "").trim();
    if (!trimmed) {
      setError(
        isImage
          ? "Add an image prompt before generating (caption is separate and not drawn on the photo)."
          : "Add an image prompt before generating (caption is separate and not drawn on the graphic)."
      );
      return;
    }
    setGenerating(true);
    setError("");
    try {
      const data = await api.generateContentImage({
        prompt: trimmed,
        title: String(title || "").trim() || undefined,
        contentId: contentId || undefined,
        placement,
        kind,
      });
      applyGenerated(data);
      void loadLibrary();
    } catch (err) {
      setError(err.message || "Image generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const uploadFile = async (file) => {
    if (!file || uploading) return;
    setUploading(true);
    setError("");
    try {
      const dataUrl = await fileToDataUrl(file);
      const data = await api.uploadContentImage({
        dataUrl,
        fileName: file.name,
        title: String(title || "").trim() || undefined,
        prompt: String(prompt || "").trim() || undefined,
        contentId: contentId || undefined,
        placement,
        kind,
      });
      applyGenerated(data);
      void loadLibrary();
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const pickFromLibrary = (img) => {
    const url = String(img?.imageUrl || "").trim();
    if (!url) return;
    setImageUrl(url);
    setLibraryImageId(String(img?.id || ""));
    emit({
      imageUrl: url,
      libraryImageId: String(img?.id || "") || undefined,
    });
  };

  const deleteFromLibrary = async (img) => {
    const id = String(img?.id || "").trim();
    if (!id || deletingId) return;
    setDeletingId(id);
    setError("");
    try {
      await api.deleteContentImage(id);
      const src = String(img?.imageUrl || "").trim();
      setLibrary((prev) => prev.filter((row) => String(row?.id || "") !== id));
      if (imageUrl && src && imageUrl === src) clearImage();
      else if (libraryImageId === id) {
        setLibraryImageId("");
        emit({ libraryImageId: undefined });
      }
    } catch (err) {
      setError(err.message || "Could not delete library image");
    } finally {
      setDeletingId("");
    }
  };

  const placementMeta = PLACEMENT_OPTIONS.find((item) => item.id === placement);
  const busy = generating || uploading || Boolean(deletingId) || disabled;

  return (
    <div className="figure-editor">
      <label>
        Caption
        <input
          value={title}
          onChange={(event) => {
            const value = event.target.value;
            setTitle(value);
            emit({ title: value });
          }}
          disabled={busy}
        />
        <span className="form-note">Shown under the {figureLabel} — not painted into the image.</span>
      </label>

      <div>
        <p className="ai-panel-label">Placement</p>
        <div className="ai-chip-list">
          {PLACEMENT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`chip${placement === opt.id ? " ok" : " muted"}`}
              disabled={busy}
              onClick={() => {
                setPlacement(opt.id);
                emit({ placement: opt.id });
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <p className="form-note">{placementMeta?.hint}</p>
      </div>

      <label>
        {isImage ? "Image prompt" : "Infographic prompt"}
        <textarea
          rows="3"
          value={prompt}
          onChange={(event) => {
            const value = event.target.value;
            setPrompt(value);
            setError("");
            emit({ prompt: value });
          }}
          placeholder={
            isImage
              ? placement === "pullout"
                ? "e.g. Clinic front desk at dusk, warm lamp light, receptionist mid-call…"
                : "e.g. Wide editorial photo of a pharmacy counter during evening rush, candid, natural light…"
              : placement === "pullout"
                ? "e.g. Compact three-icon flow: call missed → AI answers → appointment booked…"
                : "e.g. Wide process diagram with four labeled stages for specialty referral recovery…"
          }
          disabled={busy}
        />
      </label>
      <p className="form-note">
        {isImage
          ? "Write with AI fills this photo prompt only — use Generate image, upload, or pick from the library to add the photo."
          : "Write with AI fills this prompt only — use Generate graphic, upload, or pick from the library to add the image."}
      </p>

      <div className="owner-row-actions">
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void uploadFile(file);
          }}
        />
        <button className="btn ghost" type="button" disabled={busy} onClick={() => fileRef.current?.click()}>
          {uploading ? "Uploading…" : "Upload"}
        </button>
        {imageUrl ? (
          <button className="btn ghost" type="button" disabled={busy} onClick={clearImage}>
            Remove image
          </button>
        ) : null}
        <button className="btn" type="button" disabled={busy} onClick={() => void generate()}>
          {generating
            ? "Generating…"
            : imageUrl
              ? isImage
                ? "Regenerate image"
                : "Regenerate graphic"
              : isImage
                ? "Generate image"
                : "Generate graphic"}
        </button>
      </div>
      {generating ? (
        <p className="form-note">
          Generating {placement === "pullout" ? "square pull-out" : "landscape inline"} {isImage ? "photo" : "graphic"} —
          often 20–60 seconds…
        </p>
      ) : null}
      {error ? <p className="form-error">{error}</p> : null}

      <div>
        <div className="figure-library-head">
          <p className="ai-panel-label">Image library</p>
          <button className="btn ghost" type="button" disabled={libraryLoading || busy} onClick={() => void loadLibrary()}>
            {libraryLoading ? "Loading…" : "Refresh"}
          </button>
        </div>
        {!library.length ? (
          <p className="form-note">
            {libraryLoading
              ? "Loading library…"
              : "No images yet — generate or upload one; new graphics are saved to the library."}
          </p>
        ) : (
          <div className="figure-library">
            {library.map((img) => {
              const src = String(img.imageUrl || "").trim();
              if (!src) return null;
              const selected = imageUrl === src;
              const id = String(img.id || "");
              const deleting = deletingId === id;
              return (
                <div className={`figure-library-item${selected ? " is-selected" : ""}`} key={id || src}>
                  <button type="button" disabled={busy} onClick={() => pickFromLibrary(img)} title={img.caption || img.fileName || "Library image"}>
                    <img src={src} alt={img.fileName || "Library image"} />
                  </button>
                  <button
                    className="figure-library-delete"
                    type="button"
                    disabled={busy}
                    aria-label="Delete from library"
                    onClick={() => void deleteFromLibrary(img)}
                  >
                    {deleting ? "…" : "×"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {imageUrl ? (
        <figure className={`content-figure is-${placement} is-preview`}>
          <img src={imageUrl} alt={title || (isImage ? "Image" : "Infographic")} />
          {title ? <figcaption>{title}</figcaption> : null}
        </figure>
      ) : (
        <p className="form-note">No image yet — generate, upload, or pick from the library.</p>
      )}
    </div>
  );
}
