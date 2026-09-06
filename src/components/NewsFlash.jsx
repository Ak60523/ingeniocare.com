import { Link } from "react-router-dom";
import { fallbackNews } from "../data/news";

const newsFlash = fallbackNews[0];

export default function NewsFlash() {
  return (
    <section className="section news-flash">
      <div className="wrap">
        <h3>News Flash</h3>
        <div className="news-item">
          <Link to={`/${newsFlash.slug}`}>{newsFlash.title}</Link>
        </div>
      </div>
    </section>
  );
}
