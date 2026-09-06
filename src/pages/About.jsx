import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import { productHref } from "../data/products.js";
import { sectionHero } from "../siteNav.js";

const COM_SITE_VIMEO_SRC =
  "https://player.vimeo.com/video/933065640?h=bbde7e8fd4&title=0&byline=0&portrait=0&dnt=1";
const COM_SITE_VIMEO_POSTER = "/assets/images/why-ingenio-care.jpg";

const leadership = [
  {
    name: "Alex Kumar, MBA",
    role: "Founder and CEO",
    image: "/assets/images/alex.png",
    photoClass: "is-alex",
    bio: "Alex Kumar is a healthcare innovator and entrepreneur with expertise in care models, business strategy, data sciences, and software. He was a founding member of two startups, leading operations and technology at Accretive Health (now R1RCM) and Mphasis, and later served as Chief Strategy and Technology Officer of R1RCM.",
  },
  {
    name: "Dr. Yogi Ahluwalia",
    role: "Strategic Advisor",
    image: "/assets/images/yogi.png",
    photoClass: "is-yogi",
    bio: "Former Chairman of Psychiatry at Mount Sinai Hospital Medical Center of Chicago, Dr. Ahluwalia has dedicated his career to advancing psychiatric care and improving patient outcomes. At Ingenio Care he leads clinical work on behavioral health and care models for underserved communities.",
  },
  {
    name: "Lauren Doolin",
    role: "SVP, Delivery",
    bio: "Lauren Doolin brings healthcare operations and data expertise to Ingenio Care. She helped launch the Total Cost of Care division at Accretive Health, focused on transforming health systems into accountable care organizations, and later led strategic client work in provider markets at Humedica. At Ingenio Care she connects care delivery with data so the network can improve access, quality, and cost together.",
  },
];

const clinicalAdvisors = [
  {
    name: "Dr. Deepak Mital",
    image: "/assets/images/deepak-mital.jpg",
    bio: "Dr. Deepak Mital, MD, MBA, FACS, is a transplant surgeon with more than 30 years of experience in kidney and pancreas transplantation in the Chicago area. He is Surgical Director of the Kidney Transplant Program at UI Health and a Clinical Professor of Surgery at the University of Illinois College of Medicine. Dr. Mital advises Ingenio Care on high-acuity specialty pathways and multidisciplinary care that keeps complex patients connected before and after major procedures.",
  },
  {
    name: "Dr. Krishna Jain",
    image: "/assets/images/krishna-jain.jpg",
    bio: "Dr. Jain is Chief Medical Officer for APEX and founder of Limb Preservation Centers of America®. He is a board-certified vascular surgeon who has been intimately involved in the growth of office-based endovascular labs (OBLs) throughout the U.S. since 2007. Dr. Jain is collaborating with us to build a national population health solution for patients with high risk of foot ulcer and limb amputation.",
  },
  {
    name: "Dr. Robert Wagner",
    image: "/assets/images/robert-wagner.jpg",
    bio: "Dr. Robert Wagner has deep expertise in both clinical and operational aspects of healthcare. His primary focus is to improve the health of patients and communities through innovation. As an advisor to Ingenio Care, Rob plays a critical role in the development of our solutions as well as their implementation.",
  },
  {
    name: "Dr. Robert Parker",
    image: "/assets/images/robert-parker.jpeg",
    bio: "Dr. Bob Parker is a primary care physician with a strong background in managed care. He is a physician leader with a history of clinical innovations. Dr. Parker advises the company on design, development, and testing of the solution from both the provider and payer perspective.",
  },
  {
    name: "Dr. Pradeep Thapar",
    image: "/assets/images/pradeep-thapar.jpg",
    photoClass: "is-edge-crop",
    bio: "Dr. Thapar is a board-certified general adult psychiatrist and child and adolescent psychiatrist trained at the University of Illinois at Chicago and Northwestern University. Dr. Thapar is collaborating with Ingenio Care on patient access for behavioral health and to build the Ingenio collaborative care network in Orland Park.",
  },
  {
    name: "Dr. Rajeev Kumar",
    image: "/assets/images/rajeev-kumar.jpg",
    photoClass: "is-edge-crop",
    bio: "Dr. Rajeev Kumar specializes in geriatrics and home healthcare. Rajeev is a thought leader in geriatric care and the development of home healthcare models at UnitedHealthcare. Dr. Kumar is collaborating with us to develop home health, assisted living, and SNF models.",
  },
  {
    name: "Dr. Puja Sethi",
    image: "/assets/images/puja-sethi.jpeg",
    bio: "Dr. Sethi has over 10 years of experience as a practicing physician. Dr. Sethi is board-certified in sleep medicine. Dr. Sethi is collaborating with us on care model innovation, and how to optimize processes that improve quality while reducing physicians' administrative burden.",
  },
];

const nonClinicalAdvisors = [
  {
    name: "Sanjiv Anand, MBA",
    image: "/assets/images/sanjiv.jpeg",
    bio: "Sanjiv has an impressive track record of driving growth and transformation in the healthcare sector, successfully scaling multiple companies. He has held leadership roles at Hewitt Associates, Xerox, and Bswift/Aetna. Sanjiv is collaborating with Ingenio Care to develop the overall care model, especially from the health plan perspective. Sanjiv holds an MBA from Northwestern University and a B.Tech from IIT Madras.",
  },
  {
    name: "Paul Lavin, MBA",
    image: "/assets/images/paul-lavin.jpg",
    bio: "Paul Lavin has extensive experience in healthcare and technology innovation. He has held key leadership roles, including Lead Independent Director at Guidewire Software, Executive Director at First Health Group, and President & CEO of American Health Holding. Paul's background spans roles at BearingPoint, Prudential Financial, and Mercer. He holds an MBA and a BS from The Wharton School at the University of Pennsylvania.",
  },
  {
    name: "Anil Lal, MBA, MPH",
    image: "/assets/images/anil-lal.jpeg",
    bio: "An executive at the University of Chicago leading their radiation oncology group, Anil has extensive experience in healthcare development and management. Anil is collaborating with us to develop unique features of the Ingenio Care Network and to integrate outpatient services within the patient's care plan. Anil has an MBBS, MBA, and MPH from the University of Minnesota.",
  },
  {
    name: "Duane Lisowski, MBA",
    image: "/assets/images/duane.jpeg",
    bio: "Mr. Lisowski has over 20 years of operational leadership experience in the healthcare industry. With a healthcare MBA from Duke University, Duane's prior experience includes R1RCM, City of Hope, and Envision Health, among others. Duane is collaborating with Ingenio Care to develop models in RCM and value-based care.",
  },
  {
    name: "Rahul Kalsi",
    bio: "Rahul Kalsi is a government affairs professional with extensive federal, state, and local advocacy experience in healthcare and public policy. He is Principal of Rahul Kalsi Government Affairs and previously served as Director of Government Affairs at Nicor Gas and in legislative affairs for Cook County Government, including work with Cook County Health. Rahul advises Ingenio Care on government affairs, healthcare policy, and engagement with state and local stakeholders.",
  },
  {
    name: "Patrick Childress",
    bio: "Patrick Childress is a technology and market infrastructure executive. He began his career as a floor broker, trader, and market maker in Eurodollars at the CME and later served as managing director of Global Access Partners, focused on cross-border exchange transactions. Patrick advises Ingenio Care on corporate development, partnerships, and market strategy. He holds a BA in finance, investments, and banking from the University of Illinois College of Commerce.",
  },
];

function WhyVideo() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(event) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <aside className="about-video">
        <div className="about-video-frame">
          <img src={COM_SITE_VIMEO_POSTER} alt="" />
          <button
            type="button"
            className="about-video-trigger"
            aria-label="Play Why Ingenio Care video"
            onClick={() => setOpen(true)}
          >
            <span className="about-video-play" aria-hidden="true" />
          </button>
        </div>
        <button type="button" className="about-video-caption" onClick={() => setOpen(true)}>
          Watch the video
        </button>
      </aside>
      {open ? (
        <div className="about-video-backdrop" onClick={() => setOpen(false)}>
          <div
            className="about-video-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Why Ingenio Care"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="about-video-close" onClick={() => setOpen(false)} aria-label="Close video">
              ×
            </button>
            <div className="about-video-modal-frame">
              <iframe
                title="Why Ingenio Care"
                src={`${COM_SITE_VIMEO_SRC}&autoplay=1`}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function advisorInitials(name) {
  return name
    .replace(/^(dr|mr|ms|mrs)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function AdvisorGrid({ advisors, className = "" }) {
  return (
    <div className={`grid-cards advisor-grid${className ? ` ${className}` : ""}`}>
      {advisors.map((advisor) => (
        <article className="card advisor-card" key={advisor.name}>
          <div className={`advisor-photo${advisor.photoClass ? ` ${advisor.photoClass}` : ""}`}>
            {advisor.image ? (
              <img src={advisor.image} alt={advisor.name} />
            ) : (
              <span className="advisor-initials" aria-hidden="true">
                {advisorInitials(advisor.name)}
              </span>
            )}
          </div>
          <div className="card-body">
            <h4>{advisor.name}</h4>
            {advisor.role ? <p className="advisor-role">{advisor.role}</p> : null}
            <p>{advisor.bio}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function About() {
  const { hash } = useLocation();
  const initialHash = useRef(true);

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      initialHash.current = false;
      return;
    }
    if (initialHash.current) {
      initialHash.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [hash]);

  return (
    <>
      <PageHero title="About Us" image={sectionHero.about} imagePosition="58% 26%">
        <h4>AI-Enabled, Patient-Centric Digital Health Network</h4>
      </PageHero>
      <section className="section about-section" id="company">
        <div className="wrap">
          <p>
            Ingenio Care is an AI-powered digital health company. We are building a
            patient-centric network in which providers collaborate to deliver high-quality care
            efficiently, while increasing their income. The work is organized around the same five
            jobs we describe on the <Link to="/#pillars">home page</Link>: patient empowerment,
            provider enablement, care coordination and continuity, better outcomes, and lower cost.
          </p>
          <p>
            <strong>Patient empowerment</strong> is solved in the{" "}
            <Link to={productHref({ slug: "patient-app" })}>Patient App</Link>: a conversational AI
            assistant, pricing transparency, a digital health pass, and data sharing—built in close
            alignment with CMS innovation—so patients can find care, understand cost, and stay on the
            plan after discharge.
          </p>
          <p>
            <strong>Provider enablement</strong> is solved in the{" "}
            <Link to={productHref({ slug: "provider-app" })}>Provider App</Link>: inbound and outbound
            referrals, an AI physician assistant for notes and coding, AI-assisted care planning, and
            prior authorization in the same workflow so the visit is not consumed by administration.
          </p>
          <p>
            <strong>Care coordination and continuity</strong> is the two apps working together. The
            treating physician owns the plan in the Provider App; the Patient App keeps the next step
            visible after discharge, imaging, or a specialty visit so follow-up does not fall through.
          </p>
          <p>
            <strong>Better outcomes</strong> follow from timely access and a plan that actually gets
            completed: instant access through both apps, then a clear path after the encounter instead
            of a gap that shows up later in the ER.
          </p>
          <p>
            <strong>Lower cost</strong> comes from better provider matching, patient engagement, and
            care-plan adherence—so the right visit happens the first time, and the plan is actually
            followed.
          </p>
        </div>
      </section>
      <section className="section alt about-section" id="why-ingenio-care">
        <div className="wrap">
          <h2>Why Ingenio Care</h2>
          <div className="about-why-body">
            <WhyVideo />
            <p>
              The story starts in 2004, when Alex Kumar joined the founding team at Accretive Health,
              now R1RCM. It was his first exposure to healthcare. “I quickly recognized that this
              sector continued to be fragmented and lacked the discipline of the rest of the economy,”
              he says. They had a great team of seasoned operators, domain experts, and innovators.
              They began by questioning simple things: Why can we not collect payment upfront? Why keep
              archives indefinitely? How do we know the claim is right, and that we were paid what we
              were supposed to be paid? Over the next two to three years, that work became the
              foundation of R1RCM and of the payment integrity industry around it.
            </p>
            <p>
              As leader of the Investment for Growth group, the question turned to cost and quality.
              Misaligned incentives, lack of integrated data, little transparency, and inefficient
              process plagued the space. “We started with the hypothesis that the cost of care could
              come down by 25%,” Alex says. They ran a pilot with better data, streamlined process, and
              analytics. The pilot proved the potential, and that proof helped lead to huge investments
              in this space over the last decade.
            </p>
            <p>
              The issues still are not solved. Access is poor, cost is going up exponentially, and the
              consumer is facing higher premiums and out-of-pocket costs. “Recognizing that AI could be
              a key catalyst to bring about change, I started on this journey to solve the challenge,”
              Alex says. Ingenio Care has made great progress in understanding those challenges and
              developing the models and technology to create efficiency. With AI, now may be the time.
              “I strongly believe that we are headed in the right direction, and I will continue to
              work to bring about meaningful change to improve access and quality while reducing cost.”
            </p>
          </div>
        </div>
      </section>
      <section className="section about-section" id="leadership">
        <div className="wrap">
          <h2>Leadership</h2>
          <p>
            Ingenio Care’s leadership team brings clinical, operating, and data expertise to the
            build-out of a patient-centric digital health network.
          </p>
          <AdvisorGrid advisors={leadership} />
        </div>
      </section>
      <section className="section alt about-section" id="advisory-board">
        <div className="wrap">
          <h2>Advisory Board</h2>
          <p>
            Ingenio Care works with clinicians and healthcare operators to shape the next generation
            of care delivery. The group brings clinical, RCM, value-based care, and administration
            expertise together so the network can make providers more efficient while delivering
            higher-quality care at a progressively lower cost.
          </p>
          <div id="physician-advisory-board">
            <AdvisorGrid advisors={clinicalAdvisors} />
          </div>
          <hr className="advisor-split" />
          <div id="healthcare-advisory-board">
            <AdvisorGrid advisors={nonClinicalAdvisors} />
          </div>
        </div>
      </section>
      <section className="section about-invest-close">
        <div className="wrap">
          <h2>Invest with Us</h2>
          <p>
            Early-stage participation in a startup with a TAM of over $500B. If you are with an
            early-stage VC firm,{" "}
            <a href="mailto:alex.kumar@ingeniocare.com?subject=Investor%20Interest">contact us</a>.
            We will be happy to walk you through the opportunity.
          </p>
        </div>
      </section>
    </>
  );
}
