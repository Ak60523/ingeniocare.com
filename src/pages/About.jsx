import PageHero from "../components/PageHero.jsx";

export default function About() {
  return (
    <>
      <PageHero title="About Us">
        <h4>Ai Enabled, Patient Centric Digital Health Network</h4>
      </PageHero>
      <section className="section">
        <div className="wrap grid-2">
          <div>
            <p>
              Ingenio Care is an Ai powered Digital health company. We are building a patient
              centric healthcare network in which providers seamlessly collaborate to delivery high
              quality care, efficiently while increasing their income meaningfully. The network plans
              to achieve that by using Ai enabled solution to orchestrate care efficiently and
              effectively delivered though provider collaboration. Key areas of our focus include:
            </p>
            <ul>
              <li>Patient Access that is instant by leveraging unused provider capacity</li>
              <li>Ai Enabled Physican Assistant for Patient Notes and Coding</li>
              <li>Ai Enabled Physician Assistant for Care Planning and orchestration</li>
              <li>Ai Enabled Prior Authorization Solution</li>
              <li>Ai Enabled Post Discharge Robot</li>
            </ul>
            <p className="quote">
              "Although our healthcare system is complex and everchanging, we believe that it is
              possible to simplify it through innovative operating models, Use of Artificial
              Intelligence and use of advanced analytics techniques.
            </p>
            <p className="quote">We will love to partner with you create the futuristic Healthcare Network."</p>
          </div>
          <div className="media-block">
            <img src="/assets/images/alex.png" alt="Alex Kumar, Founder and CEO" />
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="wrap article">
          <h4>Alex Kumar, Founder and CEO</h4>
          <p>
            Mr. Kumar is a highly accomplished innovator and entrepreneur with a strong focus on
            healthcare. He possesses extensive expertise in healthcare models, business strategy,
            data sciences, and software technologies. He has a proven track record of delivering
            disruptive healthcare solutions through conceptualizing new ideas and leveraging
            proficient agile software development methodologies.
          </p>
          <p>
            Throughout his career, Mr. Kumar has provided strategic guidance to early-stage companies
            and developed an analytics/AI-driven healthcare delivery model to tackle cost and quality
            issues that plagued the US healthcare system. As a founding member of two startups, he
            has led operations and technology innovation, both of which are now publicly traded with
            a market capitalization exceeding $2 billion.
          </p>
          <p>
            Moreover, as the leader of the Investment for Growth (IFG) initiative at R1RCM, Mr. Kumar
            developed a cost/quality offering that included an economic model, operating model, and
            an end-to-end technology platform with a commitment to reducing healthcare costs by 25%
            while enhancing the quality of care. This offering was the first of its kind in the
            industry.
          </p>
          <p>
            As the Chief Strategy and Technology Officer of R1RCM, Mr. Kumar designed and developed a
            groundbreaking end-to-end revenue cycle platform that delivered significant yield and
            revenue improvement for healthcare providers. This platform was the first of its kind in
            the healthcare industry.
          </p>
          <p>
            Before his entrepreneurial pursuits, Mr. Kumar worked for Accenture and PWC after
            graduating from the Indian Institute of Management, Ahmedabad.
          </p>
        </div>
      </section>
    </>
  );
}
