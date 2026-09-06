import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function NewsFlash() {
  const [item, setItem] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .news()
      .then((data) => {
        if (cancelled) return;
        const published = (data.articles || []).filter(
          (article) => String(article.status || "published").toLowerCase() === "published"
        );
        setItem(published[0] || null);
      })
      .catch(() => {
        if (!cancelled) setItem(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!item?.slug || !item.title) return null;

  return (
    <section className="section news-flash">
      <div className="wrap">
        <h3>News Flash</h3>
        <div className="news-item">
          <Link to={`/${item.slug}`}>{item.title}</Link>
        </div>
      </div>
    </section>
  );
}
