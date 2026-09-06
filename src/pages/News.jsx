import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api";
import PageHero from "../components/PageHero.jsx";
import { useAuth } from "../AuthContext.jsx";
import { slugifyTitle } from "../roles";
import { sectionHero } from "../siteNav.js";
import { AdminBar, StatusChip } from "./ContentPages.jsx";

export default function News() {
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
      const data = await api.news();
      let rows = data.articles || [];
      if (!canManageContent || mode === "view") {
        rows = rows.filter((item) => String(item.status || "published").toLowerCase() === "published");
      } else if (mode === "preview") {
        rows = rows.filter((item) => {
          const status = String(item.status || "published").toLowerCase();
          return status === "published" || status === "draft";
        });
      }
      setItems(rows);
      setError("");
    } catch (err) {
      setItems([]);
      setError(err.message || "Could not load news.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [mode, canManageContent]);

  async function createBlank() {
    setBusy(true);
    try {
      const data = await api.createNews({
        title: "Untitled",
        slug: `${slugifyTitle("Untitled")}-${Date.now().toString(36).slice(-4)}`,
        headline: "Press Release",
        dateLabel: "PRESS RELEASE",
        status: "draft",
        body: "",
      });
      navigate(`/${data.article.slug}?mode=edit`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function setStatus(item, status) {
    if (!item?.id) return;
    setBusy(true);
    try {
      await api.updateNews(item.id, { status });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const counts = useMemo(() => {
    const statusOf = (item) => String(item.status || "published").toLowerCase();
    return {
      published: items.filter((item) => statusOf(item) === "published").length,
      draft: items.filter((item) => statusOf(item) === "draft").length,
      archived: items.filter((item) => statusOf(item) === "archived").length,
    };
  }, [items]);

  return (
    <>
      <PageHero title="Ingenio Care News" image={sectionHero.news} imagePosition="58% 18%" />
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
            <p>{isEdit ? "No items yet. Use + to add a blank draft." : "No published news yet."}</p>
          ) : (
            items.map((item) => {
              const href = item.slug ? `/${item.slug}` : null;
              return (
                <article className="content-index-item" key={item.id || item.slug}>
                  <div className="content-index-meta">
                    {showAdmin ? <StatusChip item={{ ...item, status: item.status || "published" }} /> : null}
                    <time>{item.dateLabel || "—"}</time>
                  </div>
                  {href ? (
                    <h2>
                      <Link to={href}>{item.title}</Link>
                    </h2>
                  ) : (
                    <h2>{item.title}</h2>
                  )}
                  {item.summary ? <p>{item.summary}</p> : null}
                  {isEdit ? (
                    <div className="owner-row-actions">
                      {href ? (
                        <Link className="btn ghost" to={`${href}?mode=edit`}>
                          Open
                        </Link>
                      ) : null}
                      {String(item.status || "published") !== "published" ? (
                        <button className="btn ghost" type="button" disabled={busy} onClick={() => setStatus(item, "published")}>
                          Publish
                        </button>
                      ) : (
                        <button className="btn ghost" type="button" disabled={busy} onClick={() => setStatus(item, "draft")}>
                          Unpublish
                        </button>
                      )}
                      {String(item.status || "") !== "archived" ? (
                        <button className="btn ghost" type="button" disabled={busy} onClick={() => setStatus(item, "archived")}>
                          Archive
                        </button>
                      ) : (
                        <button className="btn ghost" type="button" disabled={busy} onClick={() => setStatus(item, "draft")}>
                          Restore
                        </button>
                      )}
                    </div>
                  ) : null}
                </article>
              );
            })
          )}
        </div>
      </section>
    </>
  );
}
