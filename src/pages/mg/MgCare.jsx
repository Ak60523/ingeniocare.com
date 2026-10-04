import { Link } from "react-router-dom";
import MgHero from "../../components/MgHero.jsx";
import { patientAppHref, providerAppHref } from "../../data/mgLinks.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import { useMgPath } from "../../siteMode.js";

export default function MgCare() {
  const mgPath = useMgPath();
  usePageMeta({
    title: "Care | Ingenio Medical Group",
    description:
      "Virtual-first primary and specialty care from Ingenio Medical Group, coordinated with in-person practices.",
  });

  return (
    <>
      <MgHero
        title="Primary and specialty care, virtual first"
        lede="Start with a visit that fits your day. When you need hands-on care, we coordinate with in-person practices so your history and plan travel with you."
        image="/assets/images/products/marketplace-find-provider.jpg"
        imageAlt="Finding the right clinician"
        actions={
          <>
            <a className="btn sky" href={patientAppHref} target="_blank" rel="noopener noreferrer">
              Open patient app
            </a>
            <Link className="btn light" to={mgPath("contact")}>
              Contact us
            </Link>
          </>
        }
      />

      <section className="section">
        <div className="wrap grid-2">
          <div>
            <h2>Virtual primary care</h2>
            <p>
              A lasting relationship with a primary clinician for check-ups, new symptoms, medication
              questions, and guidance on what to do next — without the phone tree.
            </p>
            <ul>
              <li>Same-day or scheduled video visits</li>
              <li>Care plans you can see and follow</li>
              <li>Help coordinating labs, imaging, and referrals</li>
            </ul>
          </div>
          <div className="media-block">
            <img src="/assets/images/products/patient-care-plan.png" alt="Care plan in the patient app" />
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap grid-2 reverse">
          <div className="media-block">
            <img src="/assets/images/products/provider-my-consults.png" alt="Provider consults" />
          </div>
          <div>
            <h2>Specialty care when you need it</h2>
            <p>
              Specialty visits start virtually when clinically appropriate. If an in-person exam or
              procedure is needed, we connect you with a practice that already has your story.
            </p>
            <ul>
              <li>Clear reason for referral and next step</li>
              <li>Shared record across the care team</li>
              <li>Follow-up that does not restart from a blank form</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Coordinated with in-person practices</h2>
          <p className="lede">
            Virtual care is the front door — not a dead end. Local clinics, home health, and facilities
            stay in the loop so transitions are planned, not improvised.
          </p>
          <div className="mg-hero-actions">
            <a className="btn sky" href={patientAppHref} target="_blank" rel="noopener noreferrer">
              Get care
            </a>
            <a className="btn light" href={providerAppHref} target="_blank" rel="noopener noreferrer">
              Providers: join the group
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
