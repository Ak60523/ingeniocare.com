import { Link } from "react-router-dom";
import MgHero from "../../components/MgHero.jsx";
import { patientAppHref, specialtyReferralPath } from "../../data/mgLinks.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import { useMedicalGroupBasePath } from "../../siteMode.js";

export default function MgSpecialty() {
  const base = useMedicalGroupBasePath();

  usePageMeta({
    title: "Specialty Care | Ingenio Medical Group",
    description:
      "Specialty care when you need it - coordinated, prioritized, and easy to follow. Shop economic services to keep deductibles low while plans, employers, and ACOs succeed on shared savings.",
  });

  return (
    <>
      <MgHero
        icon="specialty"
        title="Specialty care when you need it"
        lede="Care that is coordinated and prioritized - making it easy to follow, with help shopping for economic services so your deductible stays low."
        image="/assets/images/assisted-living.jpg"
        imageAlt="Clinician providing specialty care with patients"
      />

      <section className="section">
        <div className="wrap grid-2">
          <div>
            <h2>Coordinated and prioritized</h2>
            <p>
              Specialty access works when the next step is clear and the right visit comes first.
              We coordinate referrals, prioritize urgency, and keep the plan easy to follow so
              patients are not left sorting hold music and paperwork alone.
            </p>
            <ul>
              <li>Clear reason for referral and next step</li>
              <li>Priority routing when care cannot wait</li>
              <li>Shared record across the care team</li>
              <li>Follow-up that does not restart from a blank form</li>
            </ul>
          </div>
          <div className="media-block is-people">
            <img src="/assets/images/solutions-hero.jpg" alt="Patient meeting with a specialty care team" />
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap grid-2 reverse">
          <div className="media-block is-people">
            <img src="/assets/images/health-systems.jpg" alt="Clinicians helping a patient choose affordable specialty care" />
          </div>
          <div>
            <h2>Shop for care that protects your deductible</h2>
            <p>
              We help patients compare economic specialty options - in-network, appropriate site of
              care - so the path forward is clinically right and financially lighter.
            </p>
            <ul>
              <li>Guidance toward lower-cost, high-value services</li>
              <li>Transparency before you choose a site of care</li>
              <li>Coordination that keeps specialty care inside the network</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Shared savings that work for everyone</h2>
          <p className="lede">
            While patients get specialty care that is easier to follow and easier on the deductible,
            we help plans, employers, and ACOs do well on shared savings programs - with in-network
            utilization, clearer access, and less leakage.
          </p>
          <ul className="mg-pillars mg-pillars-row">
            <li>
              <h3>Plans</h3>
              <p>Appropriate specialty use and lower avoidable cost.</p>
            </li>
            <li>
              <h3>Employers</h3>
              <p>Employees get care sooner without blowing through deductibles.</p>
            </li>
            <li>
              <h3>ACOs</h3>
              <p>Stay on track for shared savings with coordinated specialty pathways.</p>
            </li>
          </ul>
          <div className="mg-hero-actions" style={{ marginTop: "1.5rem" }}>
            <Link className="btn sky" to={specialtyReferralPath(base)}>
              Refer into specialty
            </Link>
            <a className="btn light" href={patientAppHref} target="_blank" rel="noopener noreferrer">
              Open patient app
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
