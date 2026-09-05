import PageHero from "../components/PageHero.jsx";

const advisors = [
  {
    name: "Dr. Yogi Ahluwalia",
    image: "/assets/images/yogi.png",
    bio: "Former Chairman of Psychiatry at Mount Sinai Hospital Medical Center of Chicago, Dr. Ahluwalia has dedicated his career to advancing psychiatric care and improving patient outcomes. Dr. Ahluwalia is collaborating with us to build models for behavioral health and underserved communities.",
  },
  {
    name: "Dr. Krishna Jain",
    image: "/assets/images/krishna-jain.jpg",
    bio: "Dr. Jain is Chief Medical Officer for APEX and founder of Limb Preservation Centers of America®. He is a board-certified vascular surgeon who has been intimately involved in the growth of office-based endovascular labs (OBLs) throughout the U.S. since 2007. Dr. Jain is collaborating with us build a national population health solution for patients with high risk of foot ulcer and limb amputation",
  },
  {
    name: "Dr. Robert Wagner",
    image: "/assets/images/robert-wagner.jpg",
    bio: "Dr. Robert Wagner has deep expertise in both clinical and operational aspects of healthcare. His primary focus is to improve the health of patients and communities through innovation. As an advisor to Ingenio Care, Rob plays critical role in the development of our solutions as well as its implementation.",
  },
  {
    name: "Dr. Robert Parker",
    image: "/assets/images/robert-parker.jpeg",
    bio: "Dr. Bob Parker is a primary care physician with a strong background in managed care. He is physician leader with history of clinical innovations. Dr. Parker advises the company on design development and testing of the solution from both the provider and payer perspective.",
  },
  {
    name: "Dr. Pradeep Thapar",
    image: "/assets/images/pradeep-thapar.jpg",
    bio: "Dr. Thapar is a Board-Certified General Adult Psychiatrist and Child & Adolescent Psychiatrist Trained at the University of Illinois at Chicago and Northwestern University. Dr. Thapar is collaborating with Ingenio Care on patient access for behavioral health and to build Ingenio collaborative care network in Orland Park.",
  },
  {
    name: "Dr. Rajeev Kumar",
    image: "/assets/images/rajeev-kumar.jpg",
    bio: "Dr. Rajeev Kumar is a specializes in Geriatrics and Home Healthcare. Rajeev is a thought leader in Geriatric Care and the development of Home Healthcare models at United healthcare. Dr. Kumar is collaborating with us to develop Home Health, Assisted Living, SKNF models",
  },
  {
    name: "Dr. Puja Sethi",
    image: "/assets/images/puja-sethi.jpeg",
    bio: "Dr. Sethi has over 10 year of experience as practicing physician. Dr. Sethi is Board Certified Sleep Medicine. Dr Sethi is collaborating with us on care model innovation, and how to optimize processes that improve quality while reducing physician's administrative burden.",
  },
];

export default function PhysicianBoard() {
  return (
    <>
      <PageHero title="Physician Advisory Board">
        <h4>Innovating AI Enabled Patient Centric Network</h4>
      </PageHero>
      <section className="section">
        <div className="wrap article">
          <p>
            Ingenio Care has created a team of Physician to collaborate on next generation of
            healthcare delivery model. Our solution will evolve with a direct input and refinement by
            a diverse group of physicians. The goal of this team will be to evolve a patient centric
            solution that will make providers more efficient while delivering higher quality of care
            at a progressively lower cost.
          </p>
          <p className="quote">
            Physicians are the key to both quality and cost of any healthcare system. If we are to
            meet the challenges facing of healthcare system, we have to build an ecosystem, a network
            that enables them to bring their best to patient care.
          </p>
          <p className="quote">We intend to</p>
        </div>
      </section>
      <section className="section alt">
        <div className="wrap">
          <h2>Physician Advisors</h2>
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
