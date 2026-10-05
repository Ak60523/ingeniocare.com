import { Link } from "react-router-dom";
import MgHero from "../../components/MgHero.jsx";
import { chronicReferralHref, chronicReferralPath, patientAppHref } from "../../data/mgLinks.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import { useMedicalGroupBasePath, useMgPath } from "../../siteMode.js";

export default function MgChronic() {
  const base = useMedicalGroupBasePath();
  const mgPath = useMgPath();

  usePageMeta({
    title: "Chronic Care | Ingenio Medical Group",
    description:
      "AI-enabled chronic care between visits - virtual support, care plans, and coordination so conditions stay managed. Helps employers, plans, and providers score high on VBC.",
  });

  return (
    <>
      <MgHero
        icon="chronic"
        title="Chronic care that does not stop between visits"
        lede="Patient and AI-enabled virtual support keeps chronic conditions on plan - check-ins, medications, and clear next steps so today’s care protects tomorrow’s health."
        image="/assets/images/chronic-couple-running.jpg"
        imageAlt="Older couple running outdoors together"
      />

      <section className="section">
        <div className="wrap grid-2">
          <div>
            <h2>Manage chronic care with virtual and in-person consults as needed. Keep it managed every day, effortlessly.</h2>
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
            <img src="/assets/images/chronic-visit.jpg" alt="Patient on a virtual visit for ongoing chronic care" />
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap grid-2 reverse">
          <div className="media-block is-people">
            <img
              src="/assets/images/chronic-access.jpg"
              alt="Clinician checking blood pressure with a patient at home"
            />
          </div>
          <div>
            <h2>Medicare Access</h2>
            <p>
              Original Medicare patients can get technology-supported chronic care through CMS ACCESS -
              lifestyle support, monitoring, and medication follow-up, with updates back to the primary
              clinician. A patient can be in more than one track.
            </p>
            <p className="mg-access-line">
              <strong className="mg-highlight">Free to the patient. Perfect for ACO.</strong>
              <a className="btn sky" href={chronicReferralHref} target="_blank" rel="noopener noreferrer">
                Enroll Now
              </a>
            </p>
            <ul>
              <li>
                <strong>Early cardio-kidney-metabolic.</strong> High blood pressure, or two or more of
                high cholesterol, obesity with central obesity, and prediabetes.
              </li>
              <li>
                <strong>Cardio-kidney-metabolic.</strong> Diabetes, chronic kidney disease (stage 3a or
                3b), and atherosclerotic cardiovascular disease.
              </li>
              <li>
                <strong>Musculoskeletal.</strong> Chronic musculoskeletal pain.
              </li>
              <li>
                <strong>Behavioral health.</strong> Depression and anxiety.
              </li>
            </ul>
            <p>
              Heart failure, COPD, substance use disorder, and tobacco cessation tracks start April
              2027.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid-2">
          <div>
            <h2>Chronic Care Management</h2>
            <p>
              CCM is the between-visit work for Medicare patients who already have two or more chronic
              conditions expected to last at least a year, when those conditions raise the risk of
              death, a serious flare, or loss of function. Check-ins, medications, and the care plan
              stay with the primary clinician.
            </p>
            <p>CMS examples include, and are not limited to:</p>
            <ul>
              <li>High blood pressure, heart disease, and atrial fibrillation</li>
              <li>Diabetes</li>
              <li>COPD and asthma</li>
              <li>Arthritis</li>
              <li>Depression and substance use disorders</li>
              <li>Alzheimer’s disease and related dementia</li>
              <li>Cancer</li>
              <li>Glaucoma</li>
              <li>HIV and AIDS</li>
            </ul>
          </div>
          <div className="media-block is-people">
            <img
              src="/assets/images/chronic-ccm.jpg"
              alt="Patient and family member on a between-visit check-in with a clinician"
            />
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <h2>Better access, quality, and cost for everyone.</h2>
          <p className="lede">
            Besides keeping patients healthier, we help employers, plans, and providers close
            chronic-care gaps and score high on value-based care - with measurable engagement and
            fewer deferred follow-ups.
          </p>
          <ul className="mg-pillars mg-pillars-row">
            <li>
              <h3>Employees</h3>
              <p>Virtual and in-person consults as needed, so chronic care stays managed every day without another afternoon in a waiting room.</p>
            </li>
            <li>
              <h3>Medicare</h3>
              <p>Medicare Access is free to the patient. CCM keeps check-ins, medications, and the care plan with the primary clinician between visits.</p>
            </li>
            <li>
              <h3>Plans</h3>
              <p>Better access, quality, and cost - with fewer deferred follow-ups and chronic-care gaps that show up in the record.</p>
            </li>
          </ul>
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
