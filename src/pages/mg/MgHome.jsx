import { Link } from "react-router-dom";
import MgHero from "../../components/MgHero.jsx";
import {
  ccmReferralPath,
  medicareAccessReferralPath,
  patientAppHref,
  planAppHref,
  providerAppHref,
} from "../../data/mgLinks.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import { useMedicalGroupBasePath } from "../../siteMode.js";

export default function MgHome() {
  const base = useMedicalGroupBasePath();
  const root = base || "";

  usePageMeta({
    title: "Ingenio Medical Group",
    description:
      "Virtual-first primary and specialty care, coordinated with in-person practices. Medicare Access and Chronic Care Management, powered by ingeniocare.ai.",
    type: "website",
  });

  return (
    <>
      <MgHero
        title="Care that starts where you are — and stays connected"
        lede="Ingenio Medical Group is a virtual-first practice for primary and specialty care, coordinated with in-person clinics when you need them. Same care team. Clear next steps. Your health record travels with you."
        image="/assets/images/about-hero.jpg"
        imageAlt="Ingenio Medical Group care team of medical professionals"
        actions={
          <>
            <a className="btn sky" href={patientAppHref} target="_blank" rel="noopener noreferrer">
              Get care
            </a>
            <a className="btn light" href={providerAppHref} target="_blank" rel="noopener noreferrer">
              Join as a provider
            </a>
            <a className="btn light" href={planAppHref} target="_blank" rel="noopener noreferrer">
              For plans
            </a>
          </>
        }
      />

      <section className="section mg-intro">
        <div className="wrap mg-intro-grid">
          <div>
            <h2>A medical practice built for real life</h2>
            <p className="lede">
              See a clinician by video when it’s convenient. When an exam, procedure, or local visit is
              needed, we coordinate with in-person practices so you are not starting over.
            </p>
          </div>
          <ul className="mg-pillars">
            <li>
              <h3>Primary care</h3>
              <p>Ongoing relationship, wellness, and the first stop for new concerns.</p>
            </li>
            <li>
              <h3>Specialty care</h3>
              <p>Virtual specialty visits with clear handoffs when in-person care is the right next step.</p>
            </li>
            <li>
              <h3>Care that continues</h3>
              <p>Plans, meds, and follow-up stay visible so nothing gets lost between visits.</p>
            </li>
          </ul>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap grid-2">
          <div>
            <h2>Medicare Access</h2>
            <p>
              Our new Medicare Access Model for chronic care — virtual visits, navigation, and
              coordination so Medicare members get care sooner and stay on plan.
            </p>
            <div className="mg-hero-actions">
              <Link className="btn sky" to={medicareAccessReferralPath(base)}>
                Refer a patient
              </Link>
              <Link className="btn navy" to={`${root}/medicare-access`}>
                Learn more
              </Link>
            </div>
          </div>
          <div>
            <h2>Chronic Care Management</h2>
            <p>
              CCM keeps chronic conditions on a shared plan between visits — check-ins, meds, and next
              steps so today’s care protects tomorrow’s health.
            </p>
            <div className="mg-hero-actions">
              <Link className="btn sky" to={ccmReferralPath(base)}>
                Refer a patient
              </Link>
              <Link className="btn navy" to={`${root}/ccm`}>
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
