import { Link } from "react-router-dom";
import PageHero from "./PageHero.jsx";
import TalkToIngenioButton from "./TalkToIngenioButton.jsx";
import { partnershipProducts, productHref } from "../data/products.js";
import { sectionHero } from "../siteNav.js";

function otherPartnership(product) {
  return partnershipProducts.find((item) => item.id !== product.id) || null;
}

function AccessLoop({ product }) {
  const steps = product.loop || [];
  if (!steps.length) return null;
  return (
    <section className="section soft access-loop-section">
      <div className="wrap">
        <p className="product-metrics-kicker">Care loop</p>
        <h2>{product.loopTitle}</h2>
        {product.loopLede ? <p className="lede">{product.loopLede}</p> : null}
        <ol className="access-loop">
          {steps.map((step) => (
            <li className={`access-loop-step is-${step.id}`} key={step.id}>
              <span className="access-loop-card">
                <strong>{step.title}</strong>
              </span>
            </li>
          ))}
        </ol>
        {product.loopReturn ? (
          <p className="access-loop-return">
            <span aria-hidden="true">↩</span> {product.loopReturn}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function AccessOutcomes({ product }) {
  const outcomes = product.outcomes || [];
  if (!outcomes.length) return null;
  return (
    <section className="section access-outcomes-section">
      <div className="wrap">
        <p className="product-metrics-kicker">What changes</p>
        <h2>{product.outcomesTitle || "One platform. Three outcomes."}</h2>
        <ol className="access-outcomes">
          {outcomes.map((item, index) => (
            <li key={item.title}>
              <span className="pillar-step">{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function AccessPillars({ product }) {
  const pillars = product.pillars || [];
  if (!pillars.length) return null;
  return (
    <section className="section access-pillars-section">
      <div className="wrap">
        <p className="product-metrics-kicker">For providers</p>
        <h2>{product.pillarsTitle}</h2>
        {product.pillarsLede ? <p className="lede">{product.pillarsLede}</p> : null}
        <ol className="access-pillars">
          {pillars.map((pillar) => (
            <li key={pillar.title}>
              <span className="pillar-step">{pillar.step}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.lede}</p>
              <ul>
                {pillar.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function AccessCapabilities({ product }) {
  const capabilities = product.capabilities || [];
  if (!capabilities.length) return null;
  return (
    <section className="section access-capabilities-section">
      <div className="wrap">
        <p className="product-metrics-kicker">For ACOs</p>
        <h2>{product.capabilitiesTitle}</h2>
        {product.capabilitiesLede ? <p className="lede">{product.capabilitiesLede}</p> : null}
        <ol className="access-capabilities">
          {capabilities.map((item, index) => (
            <li key={item.title}>
              <span className="pillar-step">{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function AccessCallout({ note, className = "" }) {
  if (!note) return null;
  return (
    <aside className={`access-callout ${className}`.trim()}>
      {note.kicker ? <p className="product-metrics-kicker">{note.kicker}</p> : null}
      <h2>{note.headline}</h2>
      <p>{note.body}</p>
    </aside>
  );
}

export default function AccessPartnershipPage({ product }) {
  const other = otherPartnership(product);

  return (
    <>
      <PageHero ruled title={product.title} image={sectionHero.solutions} imagePosition="58% 26%">
        <h4>{product.kicker}</h4>
        <p className="lede">{product.lede}</p>
        <div className="home-hero-actions">
          <TalkToIngenioButton />
          {other ? (
            <Link className="btn light" to={productHref(other)}>
              {other.label}
            </Link>
          ) : null}
        </div>
      </PageHero>

      <section className="section access-intro-section">
        <div className="wrap grid-2 is-top">
          <div>
            {product.promise ? <p className="access-promise">{product.promise}</p> : null}
            <p>{product.intro}</p>
            {product.body ? <p>{product.body}</p> : null}
          </div>
          <AccessCallout note={product.cms} />
        </div>
      </section>

      <AccessOutcomes product={product} />
      <AccessLoop product={product} />
      <AccessPillars product={product} />
      <AccessCapabilities product={product} />

      {product.economics ? (
        <section className="section alt access-economics-section">
          <div className="wrap">
            <AccessCallout note={product.economics} className="is-wide" />
          </div>
        </section>
      ) : null}

      <section className="section product-section">
        <div className="wrap">
          <div className="grid-2 is-top product-intro">
            <div>
              <p className="product-metrics-kicker">
                {product.layout === "access-aco" ? "For the ACO" : "For the practice"}
              </p>
              <h2>
                {product.layout === "access-aco"
                  ? "A care option for aligned beneficiaries — without a competing stack"
                  : "Deliver more ACCESS care without another infrastructure layer"}
              </h2>
              <p>
                {product.layout === "access-aco"
                  ? "Ingenio helps providers and ACOs deliver more care, to more Medicare patients, without adding another layer of infrastructure."
                  : "Ingenio can help a practice become an ACCESS participant, engage patients through the Ingenio app, receive referrals, and manage the ACCESS workflow."}
              </p>
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
          {product.useCases?.length ? (
            <div className="product-usecases">
              <p className="product-metrics-kicker">In practice</p>
              <h2>How this works in a care team</h2>
              <ul className="product-usecase-grid">
                {product.useCases.map((item) => (
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

      <section className="section navy access-close">
        <div className="wrap">
          <h2>Talk with Ingenio about ACCESS</h2>
          <p>
            Bring ACCESS-enabled chronic care into the care team you already have — connected through
            a patient-owned digital front door.
          </p>
          <div className="home-hero-actions">
            <TalkToIngenioButton />
            {other ? (
              <Link className="btn light" to={productHref(other)}>
                {other.label}
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
