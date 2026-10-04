import { Link } from "react-router-dom";
import MgHero from "../../components/MgHero.jsx";
import { ccmReferralPath } from "../../data/mgLinks.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import { useMedicalGroupBasePath, useMgPath } from "../../siteMode.js";

export default function MgCcm() {
  const base = useMedicalGroupBasePath();
  const mgPath = useMgPath();

  usePageMeta({
    title: "Chronic Care Management | Ingenio Medical Group",
    description:
      "Chronic Care Management (CCM) from Ingenio Medical Group — support between visits so chronic conditions stay on plan.",
  });

  return (
    <>
      <MgHero
        title="Chronic Care Management"
        lede="CCM is the care that happens between visits — check-ins, medication support, and a shared plan so chronic conditions do not quietly become crises."
        image="/assets/images/products/patient-ai-companion.png"
        imageAlt="Patient companion for chronic care"
        actions={
          <>
            <Link className="btn sky" to={ccmReferralPath(base)}>
              Refer a patient
            </Link>
            <Link className="btn light" to={mgPath("contact")}>
              Ask about CCM
            </Link>
          </>
        }
      />

      <section className="section">
        <div className="wrap grid-2">
          <div>
            <h2>Care that does not stop at the exam room door</h2>
            <p>
              If you live with two or more chronic conditions, the hard part is often the weeks between
              appointments. Ingenio Medical Group CCM keeps you connected to a care team that watches
              the plan with you.
            </p>
            <ul>
              <li>A living care plan you and your clinicians can see</li>
              <li>Reminders and check-ins that match your schedule</li>
              <li>Help with medications, symptoms, and when to book a visit</li>
              <li>Coordination with virtual and in-person clinicians</li>
            </ul>
          </div>
          <div>
            <h2>Who it is for</h2>
            <p>
              Adults managing ongoing conditions who want clearer support between visits — especially
              Medicare members who qualify for chronic care management services.
            </p>
            <p>
              Eligibility and coverage depend on your plan. Contact us or start in the patient app to
              see if CCM is a fit.
            </p>
            <div className="mg-hero-actions">
              <Link className="btn sky" to={ccmReferralPath(base)}>
                Refer into CCM
              </Link>
              <Link className="btn navy" to={mgPath("medicare-access")}>
                Medicare Access
              </Link>
              <Link className="btn light" to={mgPath("contact")}>
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
