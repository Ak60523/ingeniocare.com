import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api } from "../api";
import PageHero from "../components/PageHero.jsx";
import ShareButton from "../components/ShareButton.jsx";
import { StartWithAiSection, WriteSection } from "../components/content/AiAssist.jsx";
import ArticleBody from "../components/content/ArticleBody.jsx";
import ArticleBodyEditor, {
  replaceSectionBlocks,
} from "../components/content/ArticleBodyEditor.jsx";
import { bodyHasContent, ensureEditableBlocks, serializeBody } from "../../server/contentBody.js";
import { useAuth } from "../AuthContext.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";
import { sectionHero } from "../siteNav.js";
import NotFound from "./NotFound.jsx";
import { AdminBar, ContentBrowseNav, ContentStatusActions } from "./ContentPages.jsx";

function formFromArticle(article) {
  return {
    title: article.title || "",
    slug: article.slug || "",
    headline: article.headline || "",
    dateLabel: article.dateLabel || article.date_label || "",
    summary: article.summary || "",
    blocks: ensureEditableBlocks(article.body),
  };
}

export default function Article() {
  const { slug } = useParams();
  const { canManageContent } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const mode = params.get("mode") === "edit" ? "edit" : "preview";
  const isEdit = canManageContent && mode === "edit";
  const [article, setArticle] = useState(null);
  const [form, setForm] = useState(null);
  const [newer, setNewer] = useState(null);
  const [older, setOlder] = useState(null);
  const [missing, setMissing] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [bodyReview, setBodyReview] = useState(false);
  const [reviewEpoch, setReviewEpoch] = useState(0);
  const [precedingBlocks, setPrecedingBlocks] = useState(null);

  async function load() {
    setArticle(null);
    setForm(null);
    setNewer(null);
    setOlder(null);
    setMissing(false);
    setError("");
    setBodyReview(false);
    setReviewEpoch(0);
    setPrecedingBlocks(null);
    try {
      const data = await api.article(slug);
      setArticle(data.article);
      setForm(formFromArticle(data.article));
      setNewer(data.newer || null);
      setOlder(data.older || null);
    } catch {
      setMissing(true);
    }
  }

  useEffect(() => {
    load();
  }, [slug]);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function save(event) {
    event.preventDefault();
    if (!article?.id || !form) return;
    if (String(article.status || "").toLowerCase() === "published") {
      setError("Published articles can only be unpublished or archived");
      return;
    }
    setBusy(true);
    try {
      const data = await api.updateNews(article.id, {
        ...form,
        body: serializeBody(form.blocks),
      });
      setArticle(data.article);
      setForm(formFromArticle(data.article));
      setError("");
      const nextSlug = data.article?.slug;
      if (nextSlug && nextSlug !== slug) {
        navigate(`/${nextSlug}?mode=preview`);
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
    if (!article?.id) return;
    setBusy(true);
    try {
      const data = await api.updateNews(article.id, { status });
      setArticle(data.article);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function applyDraft(draft) {
    if (!article?.id) return;
    if (String(article.status || "").toLowerCase() === "published") {
      setError("Published articles can only be unpublished or archived");
      return;
    }
    const data = await api.updateNews(article.id, {
      title: draft.title || form.title,
      headline: draft.headline || draft.subtitle || form.headline,
      dateLabel: draft.dateLabel || form.dateLabel,
      summary: draft.summary ?? form.summary,
      body: draft.body || serializeBody(form.blocks),
      slug: form.slug,
    });
    setArticle(data.article);
    setForm(formFromArticle(data.article));
  }

  async function generate(instruction = "", generateMode = "write") {
    if (!article?.id || !form) return;
    setBusy(true);
    setError("");
    try {
      setPrecedingBlocks(structuredClone(ensureEditableBlocks(form.blocks)));
      const guidance = String(instruction || "").trim() || undefined;
      let draft = {};
      const current = {
        type: "news",
        title: form.title,
        subtitle: form.headline,
        headline: form.headline,
        dateLabel: form.dateLabel,
        summary: form.summary,
        body: form.blocks,
        slug: form.slug,
        status: article.status,
      };
      if (generateMode === "refine") {
        const rev = await api.reviseContent({
          instruction: guidance || "Refine the press release for clarity and structure.",
          draft: current,
        });
        draft = rev.draft || {};
      } else {
        const gen = await api.generateContent({
          type: "news",
          topicTitle: form.title,
          topicSummary: form.summary || undefined,
          instruction: guidance,
          draft: current,
        });
        draft = gen.draft || {};
      }
      await applyDraft(draft);
      setBodyReview(true);
      setReviewEpoch((n) => n + 1);
    } catch (err) {
      setError(err.message || (generateMode === "refine" ? "Refine failed" : "Write failed"));
    } finally {
      setBusy(false);
    }
  }

  async function resetSection(sectionIndex, previousSection) {
    if (!article?.id || !form || !previousSection) return;
    const nextBlocks = replaceSectionBlocks(form.blocks, sectionIndex, previousSection);
    setBusy(true);
    setError("");
    try {
      await applyDraft({
        title: form.title,
        headline: form.headline,
        dateLabel: form.dateLabel,
        summary: form.summary,
        body: serializeBody(nextBlocks),
      });
      setPrecedingBlocks(structuredClone(ensureEditableBlocks(nextBlocks)));
    } catch (err) {
      setError(err.message || "Reset failed");
    } finally {
      setBusy(false);
    }
  }

  async function persistSectionEdits(_sectionIndex, nextBlocks) {
    if (!article?.id || !form) return;
    const blocks = nextBlocks || form.blocks;
    setBusy(true);
    setError("");
    try {
      await applyDraft({
        title: form.title,
        headline: form.headline,
        dateLabel: form.dateLabel,
        summary: form.summary,
        body: serializeBody(blocks),
      });
    } catch (err) {
      setError(err.message || "Could not save section");
    } finally {
      setBusy(false);
    }
  }

  const sharePath = article?.slug ? `/${article.slug}` : "/news";
  const metaTitle = article?.seoTitle || article?.headline || article?.title || "News";
  const metaDescription =
    article?.seoDescription || article?.summary || article?.headline || "Ingenio Care news";

  usePageMeta({
    title: missing ? "Not found" : metaTitle,
    description: missing ? undefined : metaDescription,
    image: sectionHero.news,
    url: missing ? undefined : sharePath,
    type: "article",
  });

  if (missing) return <NotFound />;
  if (!article || !form) {
    return (
      <section className="section">
        <div className="wrap">
          <p>Loading…</p>
        </div>
      </section>
    );
  }

  const isPublished = String(article.status || "published").toLowerCase() === "published";
  const listHref = canManageContent ? "/news?mode=edit" : "/news";
  const hasBody = bodyHasContent(form.blocks);
  const showSectionReview = bodyReview || hasBody;

  return (
    <>
      <PageHero variant="article" kicker="News" title={article.headline || article.title} image={sectionHero.news} imagePosition="58% 18%">
        <h4>{article.dateLabel || article.date_label}</h4>
      </PageHero>
      <section className="section content-detail">
        <div className="wrap content-sheet">
          <div className="article-toolbar">
            <div className="article-toolbar-start">
              {!isEdit ? (
                <ShareButton
                  title={article.seoTitle || article.headline || article.title}
                  text={article.seoDescription || article.summary || ""}
                  url={typeof window !== "undefined" ? `${window.location.origin}${sharePath}` : sharePath}
                />
              ) : (
                <span />
              )}
            </div>
            <ContentBrowseNav
              previousHref={newer?.slug ? `/${newer.slug}` : null}
              indexHref={listHref}
              nextHref={older?.slug ? `/${older.slug}` : null}
            />
          </div>

          {canManageContent ? (
            <AdminBar mode={isEdit ? "edit" : "preview"} onChange={(next) => setParams({ mode: next })}>
              {article.id ? (
                <ContentStatusActions item={article} busy={busy} onSetStatus={setStatus} />
              ) : null}
            </AdminBar>
          ) : null}

          {error ? <p className="form-error">{error}</p> : null}

          {isEdit && article.id ? (
            <form className="content-editor" onSubmit={save}>
              {!isPublished ? (
                <StartWithAiSection
                  busy={busy}
                  disabled={busy}
                  contentType="news"
                  currentTitle={form.title}
                  currentSubtitle={form.headline}
                  onSelect={async ({ title, subtitle }) => {
                    setBusy(true);
                    try {
                      await applyDraft({
                        title,
                        headline: subtitle,
                        summary: form.summary,
                        body: serializeBody(form.blocks),
                        dateLabel: form.dateLabel,
                      });
                      setParams({ mode: "preview" });
                    } catch (err) {
                      setError(err.message);
                    } finally {
                      setBusy(false);
                    }
                  }}
                />
              ) : null}
              <fieldset className="content-editor-fields" disabled={isPublished}>
                <label>
                  Headline
                  <input value={form.headline} onChange={(event) => updateField("headline", event.target.value)} />
                </label>
                <label>
                  Date label
                  <input value={form.dateLabel} onChange={(event) => updateField("dateLabel", event.target.value)} />
                </label>
                <label>
                  Title
                  <input value={form.title} onChange={(event) => updateField("title", event.target.value)} required />
                </label>
                <label>
                  Slug
                  <input value={form.slug} onChange={(event) => updateField("slug", event.target.value)} required />
                </label>
                <label>
                  Summary
                  <textarea rows="3" value={form.summary} onChange={(event) => updateField("summary", event.target.value)} />
                </label>
                {!isPublished ? (
                  <WriteSection
                    busy={busy}
                    disabled={busy}
                    hasBody={hasBody}
                    onWrite={(instruction) => generate(instruction, "write")}
                    onRefine={(instruction) => generate(instruction, "refine")}
                  />
                ) : (
                  <p className="form-note">Published articles can only be unpublished or archived.</p>
                )}
                <ArticleBodyEditor
                  value={form.blocks}
                  contentId={article.id}
                  disabled={busy || isPublished}
                  review={showSectionReview}
                  reviewEpoch={reviewEpoch}
                  precedingBlocks={precedingBlocks}
                  onResetSection={resetSection}
                  onSectionDone={persistSectionEdits}
                  onChange={(blocks) => updateField("blocks", blocks)}
                />
                {!isPublished ? (
                  <div className="content-editor-save">
                    <p className="form-note">Refine, Rewrite, section Done, and Reset save automatically. Use Save for title, summary, and other fields.</p>
                    <button className="btn ghost" type="submit" disabled={busy}>
                      {busy ? "Saving…" : "Save"}
                    </button>
                  </div>
                ) : null}
              </fieldset>
            </form>
          ) : (
            <article className="article">
              <ArticleBody body={article.body} />
            </article>
          )}
          {isEdit && !article.id ? (
            <p className="form-note">Connect Postgres to save and use AI editing on this article.</p>
          ) : null}
        </div>
      </section>
    </>
  );
}
