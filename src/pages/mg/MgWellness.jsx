import MgHero from "../../components/MgHero.jsx";
import { planAppHref, providerAppHref } from "../../data/mgLinks.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";

export default function MgWellness() {
  usePageMeta({
    title: "Wellness | Ingenio Medical Group",
    description:
      "AI-enabled virtual wellness visits for immunizations, screenings, and preventive tests. Most plans cover it with zero copay. We charge Medicare rates to uninsured.",
  });

  return (
    <>
      <MgHero
        icon="wellness"
        title="Keep up with wellness"
        lede={
          <>
            <p>
              Patient and AI-enabled virtual care supports wellness visits so preventive care fits
              real life, instead of another afternoon in a waiting room.
            </p>
            <p>Most plans cover it with zero copay. We charge Medicare rates to uninsured.</p>
          </>
        }
        image="/assets/images/wellness-family.jpg"
        imageAlt="Multi-generational family of parents, children, and grandparents staying well together"
      />

      <section className="section">
        <div className="wrap grid-2">
          <div>
            <h2>AI-enabled wellness visits</h2>
            <p>
              Patients get a clear path to stay current on preventive care. Virtual support and a
              conversational assistant help schedule, prepare for, and follow through on wellness
              visits, so nothing important slips between appointments.
            </p>
            <p>Most plans cover it with zero copay. We charge Medicare rates to uninsured.</p>
            <ul>
              <li>Virtual wellness visits when clinically appropriate</li>
              <li>AI-assisted reminders and next steps in the patient app</li>
              <li>Shared record so your care team sees what was completed</li>
            </ul>
          </div>
          <div className="media-block is-people">
            <img src="/assets/images/wellness-visit.jpg" alt="Couple on a virtual wellness visit with a clinician" />
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap grid-2 reverse">
          <div className="media-block is-people">
            <img src="/assets/images/wellness-screening.jpg" alt="Clinician finishing an immunization with a patient and parent" />
          </div>
          <div>
            <h2>Immunizations, screenings, and more</h2>
            <p>
              Stay current on immunizations, recommended screenings, and other categories of
              preventive tests. For most insured patients, many of these services are covered at
              little or no out-of-pocket cost.
            </p>
            <p>Most plans cover it with zero copay. We charge Medicare rates to uninsured.</p>
            <ul>
              <li>Immunizations and vaccine catch-up</li>
              <li>Age- and risk-based screenings</li>
              <li>Other preventive labs and tests your plan covers</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Healthy patients. Stronger VBC scores.</h2>
          <p className="lede">
            Besides keeping patients healthy, we help employers, plans, and providers close
            preventive-care gaps and score high on value-based care measures, with less chase and
            clearer completion.
          </p>
          <ul className="mg-pillars mg-pillars-row">
            <li>
              <h3>Employers</h3>
              <p>Workforce wellness that is easy to complete and easy to measure.</p>
              <div className="mg-hero-actions">
                <a className="btn navy" href={planAppHref} target="_blank" rel="noopener noreferrer">
                  Learn more
                </a>
              </div>
            </li>
            <li>
              <h3>Plans</h3>
              <p>Higher preventive utilization and quality scores without more call-center load.</p>
              <div className="mg-hero-actions">
                <a className="btn navy" href={planAppHref} target="_blank" rel="noopener noreferrer">
                  Learn more
                </a>
              </div>
            </li>
            <li>
              <h3>Providers</h3>
              <p>Gap closure that shows up in the record, ready for VBC reporting.</p>
              <div className="mg-hero-actions">
                <a className="btn navy" href={providerAppHref} target="_blank" rel="noopener noreferrer">
                  Learn more
                </a>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
