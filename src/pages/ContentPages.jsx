import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api } from "../api";
import PageHero from "../components/PageHero.jsx";
import { StartWithAiSection, WriteSection } from "../components/content/AiAssist.jsx";
import ArticleBody from "../components/content/ArticleBody.jsx";
import ArticleBodyEditor from "../components/content/ArticleBodyEditor.jsx";
import { bodyHasContent, ensureEditableBlocks, serializeBody } from "../../server/contentBody.js";
import { useAuth } from "../AuthContext.jsx";
import { contentPath, contentStatusLabel, formatContentDate, slugifyTitle } from "../roles";
import { seedSiteContent } from "../../server/contentSeed.js";
import { sortNewestFirst } from "../../server/contentSort.js";
import { sectionHero } from "../siteNav.js";

const CONTENT_META = {
  blog: {
    listPath: "/blog",
    listTitle: "Blogs",
    lede: "Practical posts on AI-enabled, patient-centric care.",
    emptyNoun: "posts",
    itemTitle: "Blog",
    kicker: "Blog",
    mediaLabel: "PDF URL",
    mediaCta: "Download PDF",
    gated: false,
    heroImage: sectionHero.blogs,
  },
  whitepaper: {
    listPath: "/papers",
    listTitle: "Papers",
    lede: "White papers and deeper guides from Ingenio Care.",
    emptyNoun: "papers",
    itemTitle: "Paper",
    kicker: "Paper",
    mediaLabel: "PDF URL",
    mediaCta: "Download PDF",
    gated: false,
    heroImage: sectionHero.papers,
  },
  podcast: {
    listPath: "/podcasts",
    listTitle: "Podcasts",
    lede: "Conversations on AI-enabled, patient-centric care.",
    emptyNoun: "episodes",
    itemTitle: "Episode",
    kicker: "Podcast",
    mediaLabel: "Episode URL",
    mediaCta: "Listen",
    gated: false,
    heroImage: sectionHero.podcasts,
    heroPosition: "58% 60%",
  },
};

function metaFor(type) {
  return CONTENT_META[type] || CONTENT_META.blog;
}

export function AdminBar({ mode, onChange, children }) {
  return (
    <div className="content-admin-bar">
      <button type="button" className={mode === "edit" ? "active" : ""} onClick={() => onChange("edit")}>
        Edit
      </button>
      <button type="button" className={mode === "preview" ? "active" : ""} onClick={() => onChange("preview")}>
        Preview
      </button>
      {children ? <div className="content-admin-bar-actions">{children}</div> : null}
    </div>
  );
}

export function StatusChip({ item }) {
  const label = contentStatusLabel(item);
  return <span className={`chip status-${label}`}>{label}</span>;
}

export function ContentIndexActions({ item, href, busy, onSetStatus }) {
  const status = String(item.status || "published").toLowerCase();
  return (
    <div className="content-index-status">
      <StatusChip item={{ ...item, status }} />
      {href ? (
        <Link to={`${href}?mode=edit`}>
          Edit
        </Link>
      ) : null}
      {status !== "published" ? (
        <button type="button" disabled={busy} onClick={() => onSetStatus("published")}>
          Publish
        </button>
      ) : (
        <button type="button" disabled={busy} onClick={() => onSetStatus("draft")}>
          Unpublish
        </button>
      )}
      {status !== "archived" ? (
        <button type="button" disabled={busy} onClick={() => onSetStatus("archived")}>
          Archive
        </button>
      ) : (
        <button type="button" disabled={busy} onClick={() => onSetStatus("draft")}>
          Restore
        </button>
      )}
    </div>
  );
}

export function ContentStatusActions({ item, busy, onSetStatus }) {
  if (!item) return null;
  const status = String(item.status || "published").toLowerCase();
  return (
    <>
      <StatusChip item={{ ...item, status }} />
      {status !== "published" ? (
        <button type="button" disabled={busy} onClick={() => onSetStatus("published")}>
          Publish
        </button>
      ) : (
        <button type="button" disabled={busy} onClick={() => onSetStatus("draft")}>
          Unpublish
        </button>
      )}
      <button type="button" disabled={busy} onClick={() => onSetStatus("archived")}>
        Archive
      </button>
    </>
  );
}

export function ContentBrowseNav({ previousHref, indexHref, nextHref }) {
  return (
    <nav className="content-browse" aria-label="Article">
      {previousHref ? (
        <Link className="btn ghost" to={previousHref}>
          Previous
        </Link>
      ) : null}
      <Link className="btn ghost" to={indexHref}>
        Index
      </Link>
      {nextHref ? (
        <Link className="btn ghost" to={nextHref}>
          Next
        </Link>
      ) : null}
    </nav>
  );
}

export function ContentListPage({ type }) {
  const meta = metaFor(type);
  const { canManageContent } = useAuth();
  const [params, setParams] = useSearchParams();
  const mode = !canManageContent ? "view" : params.get("mode") === "preview" ? "preview" : "edit";
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const showAdmin = canManageContent && mode !== "view";
  const isEdit = canManageContent && mode === "edit";

  async function load() {
    setLoading(true);
    try {
      const data = await api.content(type);
      let rows = data.items || [];
      if (!canManageContent || mode === "view") {
        rows = rows.filter((item) => item.status === "published");
      } else if (mode === "preview") {
        rows = rows.filter((item) => item.status === "published" || item.status === "draft");
      }
      setItems(sortNewestFirst(rows));
      setError("");
    } catch (err) {
      let rows = seedSiteContent.filter((item) => item.type === type);
      if (!canManageContent || mode === "view") {
        rows = rows.filter((item) => item.status === "published");
      } else if (mode === "preview") {
        rows = rows.filter((item) => item.status === "published" || item.status === "draft");
      }
      setItems(sortNewestFirst(rows.map((item) => ({ ...item, publishedAt: item.publishedAt }))));
      setError("");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [type, mode, canManageContent]);

  async function createBlank() {
    setBusy(true);
    try {
      const data = await api.createContent({
        type,
        title: "Untitled",
        slug: `${slugifyTitle("Untitled")}-${Date.now().toString(36).slice(-4)}`,
        status: "draft",
        gated: meta.gated,
        hashtags: [],
      });
      navigate(contentPath({ ...data.item, type }));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function setStatus(item, status) {
    setBusy(true);
    try {
      await api.updateContent(item.id, {
        status,
        publishedAt: status === "published" ? item.publishedAt || new Date().toISOString() : item.publishedAt,
      });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const counts = useMemo(() => {
    const statusOf = (item) => String(item.status || "draft").toLowerCase();
    return {
      published: items.filter((item) => statusOf(item) === "published").length,
      draft: items.filter((item) => statusOf(item) === "draft").length,
      archived: items.filter((item) => statusOf(item) === "archived").length,
    };
  }, [items]);

  return (
    <>
      <PageHero title={meta.listTitle} image={meta.heroImage} imagePosition={meta.heroPosition}>
        <p className="lede">{meta.lede}</p>
      </PageHero>
      <section className="section">
        <div className="wrap content-sheet">
          {isEdit ? (
            <div className="content-sheet-head">
              <button className="btn" type="button" disabled={busy} onClick={createBlank}>
                + Add
              </button>
            </div>
          ) : null}

          {canManageContent ? (
            <AdminBar
              mode={showAdmin ? mode : "edit"}
              onChange={(next) => setParams(next === "view" ? {} : { mode: next })}
            />
          ) : null}

          {error ? <p className="form-error">{error}</p> : null}

          {isEdit && !loading ? (
            <p className="form-note">
              Index · {counts.draft} draft · {counts.published} published · {counts.archived} archived
            </p>
          ) : canManageContent && mode === "preview" && !loading ? (
            <p className="form-note">Preview · drafts and published (visitors only see published)</p>
          ) : null}

          {loading ? (
            <p>Loading…</p>
          ) : items.length === 0 ? (
            <p>
              {isEdit
                ? "No items yet. Use + to add a blank draft."
                : `No published ${meta.emptyNoun} yet.`}
            </p>
          ) : (
            items.map((item) => {
              const href = item.slug ? contentPath({ ...item, type }) : null;
              return (
                <article className="content-index-item" key={item.id || item.slug}>
                  <div className="content-index-meta">
                    {isEdit ? (
                      <ContentIndexActions
                        item={item}
                        href={href}
                        busy={busy}
                        onSetStatus={(status) => setStatus(item, status)}
                      />
                    ) : showAdmin ? (
                      <StatusChip item={item} />
                    ) : null}
                    <time>{formatContentDate(item.publishedAt) || "—"}</time>
                  </div>
                  {href ? (
                    <h2>
                      <Link to={href}>{item.title}</Link>
                    </h2>
                  ) : (
                    <h2>{item.title}</h2>
                  )}
                  {item.summary ? <p>{item.summary}</p> : null}
                  <div className="content-tags">
                    {(item.hashtags || []).map((tag) => (
                      <span key={tag}>#{tag}</span>
                    ))}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </>
  );
}

export function ContentDetailPage({ type }) {
  const { slug } = useParams();
  const meta = metaFor(type);
  const isPaper = type === "whitepaper";
  const isPodcast = type === "podcast";
  const { canManageContent } = useAuth();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = params.get("mode") === "edit" ? "edit" : "preview";
  const isEdit = canManageContent && mode === "edit";
  const [item, setItem] = useState(null);
  const [form, setForm] = useState(null);
  const [newer, setNewer] = useState(null);
  const [older, setOlder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function formFromItem(next) {
    return {
      title: next.title || "",
      slug: next.slug || "",
      subtitle: next.subtitle || "",
      summary: next.summary || "",
      hashtags: (next.hashtags || []).join(", "),
      blocks: ensureEditableBlocks(next.body),
      gated: Boolean(next.gated),
      pdfUrl: next.pdfUrl || "",
    };
  }

  async function load() {
    setLoading(true);
    try {
      const data = await api.contentBySlug(slug);
      setItem(data.item);
      setForm(formFromItem(data.item));
      setNewer(data.newer);
      setOlder(data.older);
      setError("");
    } catch (err) {
      const fallback = seedSiteContent.find((row) => row.slug === slug && row.type === type);
      if (fallback) {
        const siblings = sortNewestFirst(
          seedSiteContent.filter((row) => row.type === type && row.status === "published")
        );
        const index = siblings.findIndex((row) => row.slug === fallback.slug);
        setItem(fallback);
        setForm(formFromItem(fallback));
        setNewer(index > 0 ? { slug: siblings[index - 1].slug, title: siblings[index - 1].title } : null);
        setOlder(
          index >= 0 && index < siblings.length - 1
            ? { slug: siblings[index + 1].slug, title: siblings[index + 1].title }
            : null
        );
        setError("");
      } else {
        setItem(null);
        setForm(null);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [slug]);

  if (!loading && (!item || (item.type && item.type !== type))) {
    return <Navigate to={meta.listPath} replace />;
  }

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function save(event) {
    event.preventDefault();
    if (!item?.id || !form) return;
    setBusy(true);
    try {
      const data = await api.updateContent(item.id, {
        title: form.title,
        subtitle: form.subtitle,
        summary: form.summary,
        body: serializeBody(form.blocks),
        hashtags: form.hashtags,
        slug: form.slug,
        gated: false,
        pdfUrl: form.pdfUrl,
      });
      setItem(data.item);
      setForm(formFromItem(data.item));
      setError("");
      const nextSlug = data.item?.slug;
      if (nextSlug && nextSlug !== slug) {
        navigate(`${contentPath({ ...data.item, type })}?mode=preview`);
      } else {
        setParams({ mode: "preview" });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function setStatus(status) {
    setBusy(true);
    try {
      const data = await api.updateContent(item.id, {
        status,
        publishedAt: status === "published" ? item.publishedAt || new Date().toISOString() : item.publishedAt,
      });
      setItem(data.item);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function applyDraft(draft) {
    if (!item?.id) return;
    const data = await api.updateContent(item.id, {
      title: draft.title || form.title,
      subtitle: draft.subtitle ?? form.subtitle,
      summary: draft.summary ?? form.summary,
      body: draft.body || serializeBody(form.blocks),
      hashtags: draft.hashtags?.length ? draft.hashtags : form.hashtags,
      seoTitle: draft.seoTitle || undefined,
      seoDescription: draft.seoDescription || undefined,
    });
    setItem(data.item);
    setForm(formFromItem(data.item));
  }

  async function generate(instruction = "", generateMode = "write") {
    if (!item?.id || !form) return;
    setBusy(true);
    setError("");
    try {
      const guidance = String(instruction || "").trim() || undefined;
      let draft = {};
      const current = {
        type,
        title: form.title,
        subtitle: form.subtitle,
        summary: form.summary,
        body: form.blocks,
        hashtags: form.hashtags,
        gated: false,
        pdfUrl: form.pdfUrl,
        slug: form.slug,
        status: item.status,
      };
      if (generateMode === "refine") {
        const rev = await api.reviseContent({
          instruction: guidance || "Refine the article for clarity and structure.",
          draft: current,
        });
        draft = rev.draft || {};
      } else {
        const gen = await api.generateContent({
          type,
          topicTitle: form.title,
          topicSummary: form.summary || undefined,
          instruction: guidance,
          draft: current,
        });
        draft = gen.draft || {};
      }
      await applyDraft(draft);
    } catch (err) {
      setError(err.message || (generateMode === "refine" ? "Refine failed" : "Write failed"));
    } finally {
      setBusy(false);
    }
  }

  const listHref = canManageContent ? `${meta.listPath}?mode=edit` : meta.listPath;
  const isPublished = String(item?.status || "").toLowerCase() === "published";
  const writeDisabled = busy || isPublished;

  return (
    <>
      <PageHero kicker={meta.kicker} title={item?.title || meta.itemTitle} image={meta.heroImage} imagePosition={meta.heroPosition}>
        {item?.subtitle ? <h4>{item.subtitle}</h4> : null}
      </PageHero>
      <section className="section">
        <div className="wrap content-sheet">
          <ContentBrowseNav
            previousHref={newer ? contentPath({ ...newer, type }) : null}
            indexHref={listHref}
            nextHref={older ? contentPath({ ...older, type }) : null}
          />

          {canManageContent ? (
            <AdminBar mode={isEdit ? "edit" : "preview"} onChange={(next) => setParams({ mode: next })}>
              {item?.id ? <ContentStatusActions item={item} busy={busy} onSetStatus={setStatus} /> : null}
            </AdminBar>
          ) : null}

          {error ? <p className="form-error">{error}</p> : null}
          {loading || !item || !form ? (
            <p>Loading…</p>
          ) : isEdit ? (
            <form className="content-editor" onSubmit={save}>
              {!isPublished ? (
                <StartWithAiSection
                  busy={busy}
                  disabled={busy}
                  contentType={type}
                  currentTitle={form.title}
                  currentSubtitle={form.subtitle}
                  onSelect={async ({ title, subtitle }) => {
                    setBusy(true);
                    try {
                      await applyDraft({ title, subtitle, summary: form.summary, body: serializeBody(form.blocks), hashtags: form.hashtags });
                    } catch (err) {
                      setError(err.message);
                    } finally {
                      setBusy(false);
                    }
                  }}
                />
              ) : null}
              <label>
                Title
                <input name="title" value={form.title} onChange={(event) => updateField("title", event.target.value)} required />
              </label>
              <label>
                Slug
                <input name="slug" value={form.slug} onChange={(event) => updateField("slug", event.target.value)} required />
              </label>
              <label>
                Subtitle
                <input name="subtitle" value={form.subtitle} onChange={(event) => updateField("subtitle", event.target.value)} />
              </label>
              <label>
                Summary
                <textarea name="summary" rows="3" value={form.summary} onChange={(event) => updateField("summary", event.target.value)} />
              </label>
              <label>
                Hashtags
                <input name="hashtags" value={form.hashtags} onChange={(event) => updateField("hashtags", event.target.value)} />
              </label>
              {!isPublished ? (
                <WriteSection
                  busy={busy}
                  disabled={writeDisabled}
                  hasBody={bodyHasContent(form.blocks)}
                  onWrite={(instruction) => generate(instruction, "write")}
                  onRefine={(instruction) => generate(instruction, "refine")}
                />
              ) : (
                <p className="form-note">Unpublish to rewrite or refine with AI.</p>
              )}
              <ArticleBodyEditor
                value={form.blocks}
                contentId={item.id}
                disabled={busy}
                onChange={(blocks) => updateField("blocks", blocks)}
              />
              {isPaper || isPodcast ? (
                <label>
                  {meta.mediaLabel}
                  <input name="pdfUrl" value={form.pdfUrl} onChange={(event) => updateField("pdfUrl", event.target.value)} />
                </label>
              ) : null}
              <button className="btn" type="submit" disabled={busy}>
                {busy ? "Saving…" : "Save"}
              </button>
            </form>
          ) : (
            <article className="article">
              <p className="date">{formatContentDate(item.publishedAt)}</p>
              {item.summary ? <p className="lede">{item.summary}</p> : null}
              <div className="content-tags">
                {(item.hashtags || []).map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
              <ArticleBody body={item.body} />
              {item.pdfUrl ? (
                <p>
                  <a className="btn" href={item.pdfUrl} target="_blank" rel="noreferrer">
                    {meta.mediaCta}
                  </a>
                </p>
              ) : null}
            </article>
          )}
        </div>
      </section>
    </>
  );
}

export function BlogPage() {
  return <ContentListPage type="blog" />;
}

export function BlogPostPage() {
  return <ContentDetailPage type="blog" />;
}

export function PapersPage() {
  return <ContentListPage type="whitepaper" />;
}

export function PaperDetailPage() {
  return <ContentDetailPage type="whitepaper" />;
}

export function PodcastsPage() {
  return <ContentListPage type="podcast" />;
}

export function PodcastDetailPage() {
  return <ContentDetailPage type="podcast" />;
}
