import { Link } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";

export default function NotFound() {
  return (
    <>
      <PageHero title="Page Not Found" />
      <section className="section">
        <div className="wrap center">
          <p>The page you requested is not available.</p>
          <p>
            <Link className="btn" to="/">
              Return Home
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
