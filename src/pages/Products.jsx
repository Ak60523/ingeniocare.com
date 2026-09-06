import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import SignupLearnMore from "../components/SignupLearnMore.jsx";
import SolutionFlow from "../components/SolutionFlow.jsx";
import {
  productBySlug,
  productHref,
  products,
  productsPath,
  signupHrefForProduct,
} from "../data/products.js";
import NotFound from "./NotFound.jsx";

export function HashRedirect({ to }) {
  const { hash } = useLocation();
  const hashed = productBySlug(hash.slice(1));
  if (hashed) return <Navigate to={productHref(hashed)} replace />;
  return <Navigate to={`${to}${hash}`} replace />;
}

export function LegacyProductRedirect() {
  const { slug } = useParams();
  const product = productBySlug(slug);
  return <Navigate to={product ? productHref(product) : productsPath} replace />;
}

function ProductPage({ product }) {
  const metrics = product.metrics || [];
  const useCases = product.useCases || [];
  return (
    <>
      <PageHero ruled title={product.title}>
        <h4>{product.kicker}</h4>
        <p className="lede">{product.lede}</p>
        <div className="home-hero-actions">
          <a className="btn sky" href={signupHrefForProduct(product)} target="_blank" rel="noopener noreferrer">
            Sign up
          </a>
          {product.href ? (
            <a className="btn light" href={product.href} target="_blank" rel="noopener noreferrer">
              {product.hrefLabel || "Visit site"}
            </a>
          ) : null}
        </div>
      </PageHero>
      <section className="section product-section">
        <div className="wrap">
          <div className="grid-2 is-top product-intro">
            <div>
              <p>{product.intro}</p>
              {product.body ? <p>{product.body}</p> : null}
            </div>
            <aside className="product-highlights">
              <h2>Highlights</h2>
              <ul>
                {product.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </aside>
          </div>
          {metrics.length ? (
            <div className="product-metrics">
              <p className="product-metrics-kicker">Key metrics</p>
              <h2>What this solution improves</h2>
              <p className="product-metrics-note">Directional view only. Not quantified results.</p>
              <ul className="product-metrics-grid">
                {metrics.map((metric) => (
                  <li
                    className={`product-metric is-${metric.direction}`}
                    key={metric.label}
                    aria-label={`${metric.label}, trending ${metric.direction}`}
                  >
                    <strong>{metric.label}</strong>
                    <span className="product-metric-dir" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        {metric.direction === "up" ? (
                          <>
                            <path
                              d="M4.5 19.5 16.2 7.8"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3.2"
                              strokeLinecap="square"
                            />
                            <path fill="currentColor" d="M21 3v11l-3.6-3.6L10 3z" />
                          </>
                        ) : (
                          <>
                            <path
                              d="M4.5 4.5 16.2 16.2"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3.2"
                              strokeLinecap="square"
                            />
                            <path fill="currentColor" d="M21 21V10l-3.6 3.6L10 21z" />
                          </>
                        )}
                      </svg>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {useCases.length ? (
            <div className="product-usecases">
              <p className="product-metrics-kicker">Use cases</p>
              <h2>How teams use this solution</h2>
              <ul className="product-usecase-grid">
                {useCases.map((item) => (
                  <li className="product-usecase" key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}

function ProductsHub() {
  return (
    <>
      <PageHero title="Solutions">
        <p className="lede">
          Ingenio Care solutions help patients get care, enable providers, and make the network easier
          to operate—from access and apps to specialty front doors.
        </p>
      </PageHero>
      <section className="section soft solution-flow-section">
        <div className="wrap">
          <h2>Ingenio Care Apps</h2>
          <p className="lede">
            Growgent.ai and the Digital Front Door feed the referral network. The Marketplace
            connects that demand through the Provider App and Chrome extension—both connected via FHIR.
          </p>
          <SolutionFlow />
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <div className="grid-cards product-card-grid">
            {products.map((product) => (
              <article className="card is-compact" key={product.slug}>
                <div className="card-body">
                  <h4>
                    <Link to={productHref(product)}>{product.label}</Link>
                  </h4>
                  <p>{product.kicker}</p>
                  <p>{product.lede}</p>
                  <SignupLearnMore
                    learnMoreTo={productHref(product)}
                    signupHref={signupHrefForProduct(product)}
                    spread
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default function Products() {
  const { slug } = useParams();
  const { hash } = useLocation();

  if (!slug && hash) {
    const hashed = productBySlug(hash.slice(1));
    if (hashed) return <Navigate to={productHref(hashed)} replace />;
  }

  if (slug) {
    const product = productBySlug(slug);
    if (!product) return <NotFound />;
    return <ProductPage product={product} />;
  }

  return <ProductsHub />;
}
