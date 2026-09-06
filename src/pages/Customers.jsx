import { Link, useParams } from "react-router-dom";
import CustomerAudience from "../components/CustomerAudience.jsx";
import PageHero from "../components/PageHero.jsx";
import { networkSignupHref, providerSignupHref, productHref } from "../data/products.js";
import {
  barShare,
  metricFrameworkFor,
  opportunitiesForSegment,
  potentialDashboard,
} from "../data/segmentOpportunities.js";
import {
  productsForSegment,
  segmentBySlug,
} from "../data/segments.js";
import { sectionHero } from "../siteNav.js";
import NotFound from "./NotFound.jsx";

function ProviderInvite() {
  return (
    <section className="section navy providers-invite">
      <div className="wrap grid-2 is-top">
        <div>
          <h2>We invite providers to join our network</h2>
          <h4>Take the next step towards a patient centric, higher quality and efficient healthcare network.</h4>
          <ul>
            <li>Receive real-time referrals from our network for patients to expand your panel.</li>
            <li>Ai driven documentation coding and claims processing.</li>
            <li>Ai driven patient care suggestions.</li>
            <li>Seamless outbound and inbound referrals</li>
            <li>Get patient feedback and improve continuity of care.</li>
            <li>And the best thing is that the enrollment is FREE.</li>
          </ul>
          <a className="btn sky" href={providerSignupHref} target="_blank" rel="noopener noreferrer">
            Enroll Today and start getting new patients
          </a>
        </div>
        <div className="media-block">
          <a href={providerSignupHref} target="_blank" rel="noopener noreferrer">
            <img src="/assets/images/enroll.jpg" alt="Provider enrollment" />
          </a>
        </div>
      </div>
    </section>
  );
}

function CustomersHub() {
  return (
    <>
      <PageHero title="Customers" image={sectionHero.customers} imagePosition="58% 26%">
        <h4 className="is-title-case">
          Driving Network Efficiency to improve Access and Quality while reducing cost - Across the
          healthcare continuum.
        </h4>
        <p className="lede">
          Ingenio Care sits at the center of a coordinated care network—connecting patients, payors,
          and providers.
        </p>
      </PageHero>
      <section className="section">
        <div className="wrap">
          <CustomerAudience />
        </div>
      </section>
    </>
  );
}

export default function Customers() {
  const { slug } = useParams();
  if (!slug) return <CustomersHub />;

  const segment = segmentBySlug(slug);
  if (!segment) return <NotFound />;

  const offerings = productsForSegment(segment);
  const opportunities = opportunitiesForSegment(segment);
  const framework = metricFrameworkFor(segment);
  const potential = opportunities.length ? potentialDashboard(opportunities, framework) : null;
  const signupHref = networkSignupHref(segment.id);

  return (
    <>
      <PageHero title={segment.title} image={sectionHero.customers} imagePosition="58% 26%">
        <h4>{segment.kicker}</h4>
        <p className="lede">{segment.lede}</p>
      </PageHero>
      <section className="section">
        <div className="wrap grid-2 is-top">
          <div>
            <p>{segment.intro}</p>
            {segment.body ? <p>{segment.body}</p> : null}
            <ul>
              {segment.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="home-hero-actions">
              <a className="btn sky" href={signupHref} target="_blank" rel="noopener noreferrer">
                Sign up
              </a>
            </div>
          </div>
          <div className="media-block">
            <img src={segment.image} alt={segment.imageAlt} />
          </div>
        </div>
      </section>
      <section className="section alt opportunity-section">
        <div className="wrap">
          <p className="opportunity-kicker">Opportunity by product</p>
          <h2>Where Ingenio Care moves the needle</h2>
          <p className="opportunity-lede">{framework.lede(segment)}</p>
          {potential ? (
            <div className="opportunity-dash" aria-label="Total potential improvement">
              <div className="opportunity-dash-head">
                <h3>Total potential improvement</h3>
                <p>{framework.dashNote}</p>
              </div>
              <div className="opportunity-dash-stats">
                <div className="opportunity-stat is-overall">
                  <span>Overall</span>
                  <strong>{potential.overall}%</strong>
                </div>
                {framework.keys.map((key) => (
                  <div className="opportunity-stat" key={key}>
                    <span>{framework.labels[key]}</span>
                    <strong>{potential[key]}%</strong>
                    <div className="opportunity-bar" aria-hidden="true">
                      <i style={{ width: `${barShare(potential[key])}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {opportunities.length ? (
            opportunities.map((row) => {
              const product = offerings.find((item) => item.id === row.productId);
              if (!product) return null;
              return (
                <article className="opportunity-product" key={row.productId}>
                  <div className="opportunity-product-head">
                    <h3>
                      <Link to={productHref(product)}>{product.label}</Link>
                    </h3>
                    <p>{product.kicker}</p>
                  </div>
                  <div className="opportunity-grid">
                    {framework.keys.map((key) => (
                      <div key={key}>
                        <h4>{framework.labels[key]}</h4>
                        <p className="opportunity-metric">{row.impact[key]}%</p>
                        <p>{row[key]}</p>
                      </div>
                    ))}
                  </div>
                  {row.story ? (
                    <blockquote className="opportunity-story">
                      <strong>Sample story.</strong> {row.story.title}. {row.story.body}
                    </blockquote>
                  ) : null}
                </article>
              );
            })
          ) : (
            <div className="grid-cards product-card-grid">
              {offerings.map((product) => (
                <article className="card is-compact" key={product.slug}>
                  <div className="card-body">
                    <h4>
                      <Link to={productHref(product)}>{product.label}</Link>
                    </h4>
                    <p>{product.kicker}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      {segment.id === "providers" ? <ProviderInvite /> : null}
    </>
  );
}
