import PageHero from "../components/PageHero.jsx";

const advisors = [
  {
    name: "Sanjiv Anand",
    image: "/assets/images/sanjiv.jpeg",
    bio: "Sanjeev has an impressive track record of driving growth and transformation in the healthcare sector, successfully scaling multiple companies. He has held leadership roles at Hewitt Associates, Xerox, and Bswift/Aetna. Sanjeev is collaborating with Ingenio Care to develop overall care model, specially from the health plan perspective. Sanjeev holds an MBA from Northwestern University and a B. Tech from IIT Madras.",
  },
  {
    name: "Paul Lavin",
    image: "/assets/images/paul-lavin.jpg",
    bio: "Paul Lavin has extensive experience in healthcare and technology innovation. He has held key leadership roles, including Lead Independent Director at Guidewire Software, Executive Director at First Health Group, and President & CEO of American Health Holding. Paul's background spans roles at BearingPoint, Prudential Financial, and Mercer. He holds an MBA and a BS from The Wharton School at the University of Pennsylvania.",
  },
  {
    name: "Anil Lal",
    image: "/assets/images/anil-lal.jpeg",
    bio: "An executive with University of Chicago leading their Radiology Oncology group, Anil has extensive experience in healthcare development and management. Anil is collaborating with us to develop unique features of Ingenio care Network and to integrate outpatient services within the patients care plan. Anil has MBBS, MBA and MPH from the University of Minnesota",
  },
  {
    name: "Duane Lisowski",
    image: "/assets/images/duane.jpeg",
    bio: "Mr. Lisowski has over 20 year of operational leadership experience in healthcare industry. With a healthcare MBA from Duke University, Duane's prior experience includes R1RCM, City of Hope and Envision Health among others. Duane is collaborating with Ingenio Care to develop models in the area of RCM and Value-based care.",
  },
];

export default function HealthcareBoard() {
  return (
    <>
      <PageHero title="Healthcare Advisory Board">
        <h4>Innovating AI Enabled Patient Centric Care Delivery</h4>
      </PageHero>
      <section className="section">
        <div className="wrap article">
          <p>
            Ingenio Care has created a team of Healthcare Advisors from with a high level of
            expertise in healthcare delivery from across a cross section of healthcare domains,
            including RCM, Value Based Care and Administration. Healthcare Advisors collaborate with
            physician advisors to build patient centric economic and operating model to synergize
            patient, payer and provider continuum.
          </p>
          <p className="quote">
            "Although our healthcare system is complex and everchanging, we believe that it is
            possible to simplify it through innovative operating models, Use of Artificial
            Intelligence and use of advanced analytics techniques.
          </p>
          <p className="quote">We will love to partner with you create the futuristic Healthcare Network."</p>
        </div>
      </section>
      <section className="section alt">
        <div className="wrap">
          <h2>Healthcare Industry Advisors</h2>
          <div className="grid-cards" style={{ marginTop: "2rem" }}>
            {advisors.map((advisor) => (
              <article className="card" key={advisor.name}>
                <img className="portrait" src={advisor.image} alt={advisor.name} />
                <div className="card-body">
                  <h4>{advisor.name}</h4>
                  <p>{advisor.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
