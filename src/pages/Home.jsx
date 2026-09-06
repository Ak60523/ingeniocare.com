import { Link } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import { segmentHref } from "../data/segments.js";

export default function Home() {
  return (
    <>
      <PageHero variant="home" title="AI-Powered Care That Keeps Patients and Care Teams Connected">
        <p className="home-hero-lede">
          Ingenio Care brings digital health, clinical expertise, and intelligent care coordination
          into one patient-centered network.
        </p>
        <div className="home-hero-actions">
          <Link className="btn sky" to="/solutions">
            See Solutions
          </Link>
          <Link className="btn light" to={segmentHref({ slug: "plans" })}>
            For Plans
          </Link>
          <Link className="btn light" to={segmentHref({ slug: "providers" })}>
            For Providers
          </Link>
          <Link className="btn light" to={segmentHref({ slug: "employers" })}>
            For Employers
          </Link>
        </div>
      </PageHero>
      <section className="section alt home-intro" id="pillars">
        <div className="wrap">
          <h2>A Digital Health Network That Coordinates Care When It’s Needed</h2>
          <p className="lede">
            Ingenio Care connects patients to the right clinicians, helps close care gaps, coordinates
            referrals, and supports care beyond the clinical encounter—while reducing administrative
            burden for healthcare organizations.
          </p>
          <ol className="home-pillars">
            <li>
              <span className="pillar-step">01</span>
              <h3>Patient empowerment</h3>
              <p>
                Connect patients to available care and help them navigate to the right provider at the
                right time.
              </p>
            </li>
            <li>
              <span className="pillar-step">02</span>
              <h3>Provider enablement</h3>
              <p>
                Give clinicians the referrals, visibility, and care-team communication they need to
                care for patients across the journey.
              </p>
            </li>
            <li>
              <span className="pillar-step">03</span>
              <h3>Care coordination and continuity</h3>
              <p>
                Keep referrals, care plans, and follow-up connected so patients stay in a continuous
                journey across settings—not a series of disconnected visits.
              </p>
            </li>
            <li>
              <span className="pillar-step">04</span>
              <h3>Better outcomes</h3>
              <p>
                Close care gaps, strengthen continuity, and support care beyond the clinical encounter.
              </p>
            </li>
            <li>
              <span className="pillar-step">05</span>
              <h3>Lower cost</h3>
              <p>
                Improve utilization by matching patients to the right provider, keeping them engaged,
                and supporting care-plan adherence.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid-2">
          <div>
            <h2>A Patient-Centric Digital Health Network</h2>
            <h4>A patient-centric platform to optimize healthcare.</h4>
            <p>
              Healthcare costs keep rising, even after a decade of population-health and PCP-centric
              programs. Ingenio Care focuses on a narrower job: find the patient who needs care, and
              deliver it quickly through a coordinated provider network—not another disconnected
              portal.
            </p>
          </div>
          <div className="media-block is-illustration">
            <img src="/assets/images/delivery-network.png" alt="Digital health network" />
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="wrap grid-2 reverse">
          <div className="media-block is-illustration">
            <img src="/assets/images/patient-access.png" alt="Patient access" />
          </div>
          <div>
            <h2>Solve Patient Access</h2>
            <h4>Connect patients to the right provider when care is needed.</h4>
            <p>
              When access is slow, conditions worsen and cost shows up later—in the ER, out of
              network, and in avoidable follow-up. Today’s model hides unused capacity and stretches
              referrals across phone trees, so it takes too long to get an appointment.
            </p>
            <p>
              Ingenio Care connects patients to available clinicians in real time, including unused
              sessions across the network. Instant virtual consults can sit in front of home care,
              SNFs, ERs, clinics, and hospitals—so the first step is a visit, not another hold. Faster
              access is how quality and cost both move in the right direction.
            </p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap grid-2">
          <div>
            <h2>Increase Provider Efficiency and Income</h2>
            <h4>Give clinicians time back, a fuller panel, and a clearer path to earnings.</h4>
            <p>
              Too much of the visit is spent reconstructing history and entering data that
              administrators need but the patient does not. An AI physician assistant surfaces what is
              clinically relevant and drafts the note and coding support, so the physician spends that
              time with the same patient—or with the next one.
            </p>
            <p>
              Providers on the Ingenio Care network can fill unused sessions with inbound demand,
              expand their panel, and raise income without adding a matching load of phone tag. Quality
              and cost scorecards apply across specialties, so bonuses follow the care that was
              actually delivered—not only what the primary care office documented.
            </p>
          </div>
          <div className="media-block is-illustration">
            <img src="/assets/images/provider-efficiency.png" alt="Provider efficiency" />
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="wrap grid-2 reverse">
          <div className="media-block is-illustration">
            <img src="/assets/images/platform.png" alt="Authorizations platform" />
          </div>
          <div>
            <h2>Seamless Authorizations / Utilization Management</h2>
            <h4>Move pre-auth into the care stream.</h4>
            <p>
              Prior auth pulls physicians off the patient and delays care. Ingenio Care is built to
              sit between plans and providers, sharing data in-stream so AI can help complete the
              request. The aim is fewer stalled cases—and, over time, plan guidance that arrives
              during the visit, not after.
            </p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap grid-2">
          <div>
            <h2>Care Orchestration to Optimize Delivery</h2>
            <h4>Use the clinicians, sites, and pharmacies you already have.</h4>
            <p>
              Every patient journey begins with a real-time virtual consult. A substantial share of
              cases can be resolved through that digital gateway before anyone is sent to a clinic or
              hospital.
            </p>
            <p>
              The care plan is owned by the physician responsible for care. The PCP coordinates
              wellness and chronic care; when the condition requires it, a specialist owns the plan
              and recovery.
            </p>
            <p>
              For high-cost, frequent surgeries, the network can offer surgeon-led, fixed-price
              bundles instead of hospital-led packages. Differentiated process and tools are how those
              bundles stay higher quality and lower cost than what is widely available today.
            </p>
            <p>
              Pharmacy becomes a practical hub for coordination and medication adherence, instead of a
              remote, centrally located care-coordinator pool that rarely reaches the patient.
            </p>
          </div>
          <div className="media-block is-illustration">
            <img src="/assets/images/care-orchestration.png" alt="Care orchestration" />
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="wrap grid-2 reverse">
          <div className="media-block is-illustration">
            <img src="/assets/images/cost-quality.png" alt="Quality and cost of care" />
          </div>
          <div>
            <h2>Quality and Cost of Care</h2>
            <h4>Better access, continuity, and use of capacity.</h4>
            <p>
              The model combines economics, operations, and technology: use idle capacity, keep the
              network tightly coordinated, and align incentives so patients, providers, and payers
              move in the same direction.
            </p>
            <p>
              <Link to="/solutions">See the solutions that make the network work</Link>.{" "}
              <Link to="/customers">See who we serve</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
