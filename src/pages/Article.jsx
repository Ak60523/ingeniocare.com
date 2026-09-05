import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import { seedArticles } from "../../server/articles.js";
import PageHero from "../components/PageHero.jsx";
import NotFound from "./NotFound.jsx";

function localArticle(slug) {
  return (
    seedArticles.find((item) => item.slug === slug || item.aliases.includes(slug)) ||
    null
  );
}

export default function Article() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setArticle(null);
    setMissing(false);
    api
      .article(slug)
      .then((data) => {
        if (!cancelled) setArticle(data.article);
      })
      .catch(() => {
        if (!cancelled) {
          const fallback = localArticle(slug);
          if (fallback) setArticle(fallback);
          else setMissing(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (missing) return <NotFound />;
  if (!article) {
    return (
      <section className="section">
        <div className="wrap">
          <p>Loading…</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHero title={article.headline || article.title}>
        <h4>{article.dateLabel || article.date_label}</h4>
      </PageHero>
      <section className="section">
        <div className="wrap article" dangerouslySetInnerHTML={{ __html: article.body }} />
      </section>
    </>
  );
}
