import { Link } from "react-router-dom";
import MgHero from "../../components/MgHero.jsx";
import MgSectionIcon from "../../components/MgSectionIcon.jsx";
import {
  chronicReferralPath,
  patientAppHref,
  specialtyReferralPath,
} from "../../data/mgLinks.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import { useMedicalGroupBasePath, useMgPath } from "../../siteMode.js";

const connectedCareSteps = [
  { title: "AI / App", body: "Start in the patient app - guidance, history, and the next right step." },
  { title: "Virtual", body: "See a clinician by video when that is the fastest, safest first visit." },
  { title: "In-person access", body: "When hands-on care is needed, we coordinate with local practices." },
];

export default function MgHome() {
  const base = useMedicalGroupBasePath();
  const mgPath = useMgPath();

  usePageMeta({
    title: "Ingenio Medical Group",
    description:
      "Connected care from AI and app to virtual and in-person access - wellness, chronic, and specialty care with value-based outcomes.",
    type: "website",
  });

  return (
    <>
      <MgHero
        icon="home"
        title="Connected care that stays with you"
        lede="From the AI-powered app to virtual visits and in-person access - then quality outcomes that stay affordable. Wellness, chronic, and specialty care on one journey."
        image="/assets/images/about-hero.jpg"
        imageAlt="Ingenio Medical Group care team of medical professionals"
      >
        <ol className="mg-flow">
          {connectedCareSteps.map((step, index) => (
            <li key={step.title}>
              <span className="mg-flow-step">{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </MgHero>

      <section className="section" id="wellness">
        <div className="wrap grid-2 reverse">
          <div className="media-block is-people">
            <img src="/assets/images/wellness-family.jpg" alt="Multi-generational family staying well together" />
          </div>
          <div>
            <h2 className="mg-section-heading">
              <MgSectionIcon name="wellness" />
              <span>Wellness</span>
            </h2>
            <p>
              Preventive visits, immunizations, and screenings - often covered for insured patients -
              so you stay ahead of problems instead of catching them late.
            </p>
            <p>Most plans cover it with zero copay. We charge Medicare rates to uninsured.</p>
            <div className="mg-hero-actions">
              <a className="btn sky" href={patientAppHref} target="_blank" rel="noopener noreferrer">
                Start in the patient app
              </a>
              <Link className="btn navy" to={mgPath("wellness")}>
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt" id="chronic">
        <div className="wrap grid-2">
          <div>
            <h2 className="mg-section-heading">
              <MgSectionIcon name="chronic" />
              <span>Chronic</span>
            </h2>
            <p>
              Ongoing conditions need support between visits. Virtual check-ins, shared plans, and
              clear next steps so today’s care protects tomorrow’s health.
            </p>
            <div className="mg-hero-actions">
              <Link className="btn sky" to={chronicReferralPath(base)}>
                Refer a patient
              </Link>
              <Link className="btn navy" to={mgPath("chronic")}>
                Learn more
              </Link>
            </div>
          </div>
          <div className="media-block is-people">
            <img src="/assets/images/chronic-couple-running.jpg" alt="Older couple running outdoors together" />
          </div>
        </div>
      </section>

      <section className="section" id="specialty">
        <div className="wrap grid-2 reverse">
          <div className="media-block is-people">
            <img src="/assets/images/assisted-living.jpg" alt="Clinician providing specialty and ongoing care" />
          </div>
          <div>
            <h2 className="mg-section-heading">
              <MgSectionIcon name="specialty" />
              <span>Specialty care</span>
            </h2>
            <p>
              Faster specialty access with a clear reason for referral, a shared record, and
              coordination when an in-person exam or procedure is the right next step.
            </p>
            <div className="mg-hero-actions">
              <Link className="btn sky" to={specialtyReferralPath(base)}>
                Refer a patient
              </Link>
              <Link className="btn navy" to={mgPath("specialty")}>
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt mg-value">
        <div className="wrap grid-2 mg-value-inner">
          <div>
            <h2>Value-based care</h2>
            <p className="lede">
              Better access, continuous plans, and the right site of care - so quality rises and total
              cost of care moves in the right direction for patients, providers, and plans.
            </p>
          </div>
          <div className="media-block is-people">
            <img src="/assets/images/employer.jpg" alt="People benefiting from coordinated value-based care" />
          </div>
        </div>
      </section>
    </>
  );
}
