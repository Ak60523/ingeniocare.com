import { Link } from "react-router-dom";
import MgHero from "../../components/MgHero.jsx";
import { medicareAccessReferralPath } from "../../data/mgLinks.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import { useMedicalGroupBasePath, useMgPath } from "../../siteMode.js";

export default function MgMedicareAccess() {
  const base = useMedicalGroupBasePath();
  const mgPath = useMgPath();

  usePageMeta({
    title: "Medicare Access | Ingenio Medical Group",
    description:
      "Medicare Access is Ingenio Medical Group’s new Medicare Access Model for chronic care — virtual visits, coordination, and support that keeps members on plan.",
  });

  return (
    <>
      <MgHero
        title="Medicare Access"
        lede="Medicare Access is our new Medicare Access Model for chronic care — helping Medicare members get timely virtual and coordinated care so chronic conditions stay managed, not deferred."
        image="/assets/images/products/patient-check-in.png"
        imageAlt="Patient check-in"
        actions={
          <>
            <Link className="btn sky" to={medicareAccessReferralPath(base)}>
              Refer a patient
            </Link>
            <Link className="btn light" to={mgPath("contact")}>
              Ask about enrollment
            </Link>
          </>
        }
      />

      <section className="section">
        <div className="wrap">
          <h2>A Medicare Access Model built for chronic care</h2>
          <p className="lede">
            Chronic care fails when access is slow and follow-up is fragmented. Medicare Access brings
            virtual-first visits, clear next steps, and ongoing coordination so members reach care sooner
            and stay on the plan their clinicians set.
          </p>
          <ul className="mg-pillars mg-pillars-row">
            <li>
              <h3>Faster first visit</h3>
              <p>Start with a virtual visit when that is clinically appropriate — often the same day.</p>
            </li>
            <li>
              <h3>Guided next steps</h3>
              <p>Know who to see next, what to bring, and how in-person care connects to your plan.</p>
            </li>
            <li>
              <h3>Your record, portable</h3>
              <p>History and plans stay with you in the patient app so you are not retelling everything.</p>
            </li>
          </ul>
          <div className="mg-hero-actions" style={{ marginTop: "1.5rem" }}>
            <Link className="btn sky" to={medicareAccessReferralPath(base)}>
              Refer into Medicare Access
            </Link>
            <Link className="btn navy" to={mgPath("ccm")}>
              Also see Chronic Care Management
            </Link>
            <Link className="btn light" to={mgPath("contact")}>
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
