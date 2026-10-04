import { Link } from "react-router-dom";
import MgHero from "../../components/MgHero.jsx";
import { chronicReferralPath, patientAppHref } from "../../data/mgLinks.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import { useMedicalGroupBasePath, useMgPath } from "../../siteMode.js";

export default function MgChronic() {
  const base = useMedicalGroupBasePath();
  const mgPath = useMgPath();

  usePageMeta({
    title: "Chronic Care | Ingenio Medical Group",
    description:
      "AI-enabled chronic care between visits — virtual support, care plans, and coordination so conditions stay managed. Helps employers, plans, and providers score high on VBC.",
  });

  return (
    <>
      <MgHero
        icon="chronic"
        title="Chronic care that does not stop between visits"
        lede="Patient and AI-enabled virtual support keeps chronic conditions on plan — check-ins, medications, and clear next steps so today’s care protects tomorrow’s health."
        image="/assets/images/chronic-couple-running.jpg"
        imageAlt="Older couple running outdoors together"
        actions={
          <>
            <Link className="btn sky" to={chronicReferralPath(base)}>
              Refer a patient
            </Link>
            <Link className="btn light" to={mgPath("contact")}>
              Ask about enrollment
            </Link>
          </>
        }
      />

      <section className="section">
        <div className="wrap grid-2">
          <div>
            <h2>Virtual care for ongoing conditions</h2>
            <p>
              Chronic care fails when access is slow and follow-up is fragmented. Ingenio Medical
              Group brings virtual-first visits, a living care plan, and AI-assisted engagement so
              members reach care sooner and stay on the plan their clinicians set.
            </p>
            <ul>
              <li>Same-day or scheduled virtual visits when appropriate</li>
              <li>Reminders and check-ins that match the patient’s schedule</li>
              <li>Help with medications, symptoms, and when to book a visit</li>
              <li>Shared record across the care team</li>
            </ul>
          </div>
          <div className="media-block is-people">
            <img src="/assets/images/home-health.jpg" alt="In-home support for patients with chronic conditions" />
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap grid-2 reverse">
          <div className="media-block is-people">
            <img src="/assets/images/customers-hero.jpg" alt="Care team coordinating chronic care for a member" />
          </div>
          <div>
            <h2>Medicare Access and CCM, connected</h2>
            <p className="lede">
              Technology-supported chronic care for Medicare and multi-condition patients — including
              Medicare Access pathways and Chronic Care Management — without another layer of
              paperwork for the patient or the practice.
            </p>
            <ul className="mg-pillars mg-pillars-row">
              <li>
                <h3>Faster first visit</h3>
                <p>Start virtually when clinically appropriate — often the same day.</p>
              </li>
              <li>
                <h3>Between-visit support</h3>
                <p>CCM-style engagement so conditions do not quietly become crises.</p>
              </li>
              <li>
                <h3>PCP stays in the loop</h3>
                <p>Care updates return to the primary clinician and referring team.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Better outcomes. Stronger VBC scores.</h2>
          <p className="lede">
            Besides keeping patients healthier, we help employers, plans, and providers close
            chronic-care gaps and score high on value-based care — with measurable engagement and
            fewer deferred follow-ups.
          </p>
          <div className="mg-hero-actions">
            <Link className="btn sky" to={chronicReferralPath(base)}>
              Refer into chronic care
            </Link>
            <a className="btn light" href={patientAppHref} target="_blank" rel="noopener noreferrer">
              Open patient app
            </a>
            <Link className="btn navy" to={mgPath("specialty")}>
              Specialty care
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
