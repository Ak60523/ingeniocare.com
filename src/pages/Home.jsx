import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <section className="hero" style={{ backgroundImage: "url('/assets/images/hero.jpg')" }}>
        <div className="wrap hero-inner">
          <p className="kicker">Ai Enabled, Patient Centric Digital Health Network</p>
          <ul>
            <li>Provide Instant Patient Access</li>
            <li>Increase Provider Efficiency</li>
            <li>Seamless Care Coordination</li>
            <li>Continuity of care</li>
            <li>Customized Care Plan</li>
          </ul>
          <h1>Welcome to Ingenio Care</h1>
          <p>
            Efficient Patient Centric Digital Health Network to Improve Quality of Care While Reducing
            Cost by Over 25% and Increasing Provider Income.
          </p>
          <Link className="btn light" to="/network">
            Find out more
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h3>News Flash</h3>
          <div className="news-item">
            <Link to="/7-08-2025-ingenio-care-1">
              Advisory Board expands with top clinical and business experts guiding Ingenio Care’s
              AI-enabled platform for connected, patient-centric care
            </Link>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap grid-2">
          <div>
            <h2>A Patient Centric Digital Health Network</h2>
            <p>
              We are building an Ai enabled patient centric digital health network to provide
              personalized care for each patient. The network is built upon our proprietary platform
              to implement processes that will minimize the administrative burden and seamlessly
              connect patient to the providers, while enabling plans to monitor and provide oversite
              on utilization.
            </p>
            <ul>
              <li>
                Our platform leverages an AI-enabled Patient Care Orchestration Model (PCOM) to
                facilitate care delivery when needed, of the type of care needed with a higher quality
                while reducing cost.
              </li>
              <li>
                Our patient access solution optimizes patient-physician engagement making patient
                access instant by tapping unused provider capacity. The solution seamlessly connects
                providers to patients over an Ai powered channel which leverages Ai for documentation
                and delivers real-time suggestions to physicians. We expect our model to reduce cost
                of care while increasing physician income.
              </li>
              <li>
                Eventually our network will create efficiency throughout the care continuum by
                removing barriers, adoption of best-in-class protocols and patient centric provider
                incentives.
              </li>
            </ul>
          </div>
          <div>
            <h4>Our Approach</h4>
            <p>
              <em>
                Built on an AI-enabled Patient-centric Care Orchestration Model, our solution is
                designed to:
              </em>
            </p>
            <ul>
              <li>improve efficiency</li>
              <li>reduce utilization</li>
              <li>reduce average unit price</li>
            </ul>
            <Link className="btn" to="/contact-us">
              Schedule a call
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="center">Serving Our customers, Our Partners</h2>
          <div className="grid-cards" style={{ marginTop: "2rem" }}>
            <article className="card">
              <img src="/assets/images/employer.jpg" alt="Self-Insured Employers" />
              <div className="card-body">
                <h4>Self-Insured Employers</h4>
                <p>
                  When your colleagues run into a health concern during a busy day, who do they turn
                  to? They do not have easy options. Our healthcare network will provide them an
                  instant virtual consult with the right specialist within the plan who can guide them
                  to efficiently address their concern. No additional cost to the employer or the
                  employee!
                </p>
              </div>
            </article>
            <article className="card">
              <img src="/assets/images/health-plans.jpg" alt="Health Plans" />
              <div className="card-body">
                <h4>Health Plans</h4>
                <p>
                  For Health Plans, we create instant virtual visits for members by connecting to a
                  local provider within the network. Once connected, our platform can guide the
                  patient through the plan's network, while the plan provides timely and seamless Ai
                  assisted utilization management.
                </p>
              </div>
            </article>
            <article className="card">
              <img src="/assets/images/health-systems.jpg" alt="Health Systems" />
              <div className="card-body">
                <h4>Health Systems</h4>
                <p>
                  Our key solution for health plans is to connect patients with the right provider
                  instantly and efficiently. By using our solution health system can achieve a great
                  capacity utilization and provider efficiency resulting in increased net operating
                  margin. Our end-to-end care model can further deliver higher quality/ cost efficient
                  care with greater value-based reimbursements.
                </p>
              </div>
            </article>
            <article className="card">
              <img src="/assets/images/home-health.jpg" alt="Home Health" />
              <div className="card-body">
                <h4>Home Health</h4>
                <p>
                  When in home health setting, patients may often need to talk to a provider with
                  specific questions or to address a symptom. We help home health patients with
                  real-time access to providers who can guide them to the right solution saving
                  potential admission. We are also building an Ai bot powered with patient specific
                  instructions to monitor patient progress and send instant alerts to attending
                  providers, if needed.
                </p>
              </div>
            </article>
            <article className="card">
              <img src="/assets/images/assisted-living.jpg" alt="Assisted Living, SKNF, and Hospice" />
              <div className="card-body">
                <h4>Assisted Living/ SKNF/Hospice</h4>
                <p>
                  We work with you to develop care plans for your residents that leverage virtual
                  visits, combined with in-person visits to deliver a high-quality patient experience.
                </p>
                <p>
                  We support customized care plan with real-time access to specialty care, for example
                  behavior health provider, to address unexpected events. Our model uses nurses
                  available onsite to deliver complete healthcare solution.
                </p>
              </div>
            </article>
            <article className="card">
              <img src="/assets/images/fqhc.png" alt="FQHC" />
              <div className="card-body">
                <h4>FQHC</h4>
                <p>
                  When caring for underserved population, finding timely specialist consultation is a
                  challenge. Our network of providers brings a virtual specialist consult to your
                  patient instantly making care coordination a breeze. Our Ai documenter can further
                  improve productivity of your providers.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section navy">
        <div className="wrap grid-2">
          <div>
            <h2>We invite providers to join our network</h2>
            <h4>Take the next step towards a patient centric, higher quality and efficient healthcare network.</h4>
            <ul>
              <li>Receive real-time referrals from our network for patients to expand your panel.</li>
              <li>Ai driven documentation coding and claims processing.</li>
              <li>Ai driven patient care suggestions.</li>
              <li>Seamless outbound and inbound referrals</li>
              <li>Get patient feedback and improve continuity of care.</li>
              <li>And the best thing is that the enrollment is FREE.</li>
            </ul>
            <a className="btn gold" href="https://ingeniocare.ai" target="_blank" rel="noopener noreferrer">
              Enroll Today and start getting new patients
            </a>
          </div>
          <div className="media-block">
            <a href="https://ingeniocare.ai" target="_blank" rel="noopener noreferrer">
              <img src="/assets/images/enroll.jpg" alt="Provider enrollment" />
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid-2 reverse">
          <div className="media-block">
            <img src="/assets/images/invest.jpg" alt="Invest with Ingenio Care" />
          </div>
          <div>
            <h2>Invest with Us.</h2>
            <h4>An exciting opportunity to participate at an early stage in a Startup with TAM of over $500B.</h4>
            <p>
              <Link to="/4-19-2024-ingenio-care-1">
                News: Ingenio Care Closes Pre-Seed Funding to Launch AI-Enabled, Patient-Centric
                Digital Health Network Pilots Now Open for IPAs, Employers, and Health Plans
              </Link>
            </p>
            <p>
              We are taking bold steps to solving some of the most complex challenges facing our
              healthcare system with an innovative approach that enables providers to seamlessly
              engage with patients. Our approach is fundamentally different than our competitors.
              While there are risks, we believe returns will be exponential. If you are with an
              early-stage VC firm, <Link to="/contact-us">contact us</Link>. we will be happy to walk
              you through the opportunity.
            </p>
            <p>
              <a className="btn" href="mailto:alex.kumar@ingeniocare.com?subject=Investor%20Interest">
                <strong>Contact us</strong>
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
