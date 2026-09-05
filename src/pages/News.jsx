import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { fallbackNews } from "../data/news";
import PageHero from "../components/PageHero.jsx";

export default function News() {
  const [items, setItems] = useState(fallbackNews);
  const [source, setSource] = useState("local");

  useEffect(() => {
    api
      .news()
      .then((data) => {
        if (data.articles?.length) {
          setItems(data.articles);
          setSource("aurora");
        }
      })
      .catch(() => setSource("local"));
  }, []);

  return (
    <>
      <PageHero title="Ingenio Care News" />
      <section className="section">
        <div className="wrap news-list">
          {source === "aurora" ? (
            <p className="form-note">Loaded from Aurora.</p>
          ) : null}
          {items.map((item) => (
            <article className="news-item" key={item.slug}>
              <p className="date">{item.dateLabel || item.date_label}</p>
              <p>
                <Link to={`/${item.slug}`}>{item.title}</Link>
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
