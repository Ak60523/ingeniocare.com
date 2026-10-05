import MgHero from "../../components/MgHero.jsx";
import { planAppHref } from "../../data/mgLinks.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";

export default function MgSpecialty() {
  usePageMeta({
    title: "Specialty Care | Ingenio Medical Group",
    description:
      "Specialty care when you need it, coordinated and easy to follow. Shop economic services to keep deductibles low while plans, employers, and ACOs succeed on shared savings.",
  });

  return (
    <>
      <MgHero
        icon="specialty"
        title="Specialty care when you need it"
        lede="Care that is coordinated and easy to follow, with help shopping for economic services so your deductible stays low."
        image="/assets/images/specialty-hero.jpg"
        imageAlt="Specialist on a virtual consult with a patient at home"
      />

      <section className="section">
        <div className="wrap grid-2">
          <div>
            <h2>On Demand Specialty Consults</h2>
            <p className="lede">
              Virtual specialty consults when a specialist should weigh in sooner — so patients get
              guidance without waiting weeks for an in-person slot.
            </p>
          </div>
          <div className="media-block is-people">
            <img
              src="/assets/images/specialty-ondemand.jpg"
              alt="Middle-aged patient on an on-demand virtual specialty consult"
            />
          </div>
        </div>
        <div className="wrap">
          <ul className="mg-pillars mg-pillars-row">
            <li>
              <h3>CKD</h3>
              <p>Kidney care guidance between visits.</p>
            </li>
            <li>
              <h3>Urology</h3>
              <p>Faster specialty input on common urology needs.</p>
            </li>
            <li>
              <h3>Oncology</h3>
              <p>Specialist consults to keep cancer care moving.</p>
            </li>
            <li>
              <h3>Cardiology</h3>
              <p>Heart care questions answered without the wait.</p>
            </li>
            <li>
              <h3>Behavioral Health</h3>
              <p>Timely mental health specialty support.</p>
            </li>
            <li>
              <h3>Neurology</h3>
              <p>Neurology consults when symptoms cannot wait.</p>
            </li>
          </ul>
        </div>
      </section>

      <section className="section alt">
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
            <img
              src="/assets/images/specialty-coordinated.jpg"
              alt="Care team coordinating a specialty referral"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid-2 reverse">
          <div className="media-block is-people">
            <img
              src="/assets/images/specialty-shop.jpg"
              alt="Patient and care navigator comparing affordable specialty care options"
            />
          </div>
          <div>
            <h2>Shop for care that protects your deductible</h2>
            <p>
              We help patients compare economic specialty options, in network and at an appropriate site of
              care, so the path forward is clinically right and costs less.
            </p>
            <ul>
              <li>Guidance toward lower-cost, high-value services</li>
              <li>Transparency before you choose a site of care</li>
              <li>Coordination that keeps specialty care inside the network</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <h2>Shared savings that work for everyone</h2>
          <p className="lede">
            While patients get specialty care that is easier to follow and easier on the deductible,
            we help plans, employers, and ACOs do well on shared savings programs, with in-network
            utilization, clearer access, and less leakage.
          </p>
          <ul className="mg-pillars mg-pillars-row">
            <li>
              <h3>Plans</h3>
              <p>Appropriate specialty use and lower avoidable cost.</p>
              <div className="mg-hero-actions">
                <a className="btn navy" href={planAppHref} target="_blank" rel="noopener noreferrer">
                  Learn more
                </a>
              </div>
            </li>
            <li>
              <h3>Employers</h3>
              <p>Employees get care sooner without blowing through deductibles.</p>
              <div className="mg-hero-actions">
                <a className="btn navy" href={planAppHref} target="_blank" rel="noopener noreferrer">
                  Learn more
                </a>
              </div>
            </li>
            <li>
              <h3>ACOs</h3>
              <p>Stay on track for shared savings with coordinated specialty pathways.</p>
              <div className="mg-hero-actions">
                <a className="btn navy" href={planAppHref} target="_blank" rel="noopener noreferrer">
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
