import MgHero from "../../components/MgHero.jsx";
import { patientAppHref, planAppHref, platformHref, providerAppHref } from "../../data/mgLinks.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";

const practiceSteps = [
  {
    title: "AI / App",
    body: "Start in the patient app. You get guidance, your history, and the next right step, including reminders, visit prep, and a record the care team already shares.",
  },
  {
    title: "Virtual",
    body: "See a clinician by video when that is the fastest, safest first visit. Wellness, chronic check-ins, and questions that do not need an exam room.",
  },
  {
    title: "In-person access",
    body: "When you need an exam, immunization, screening, or procedure, we coordinate with local practices so the plan and history stay intact.",
  },
];

const leadership = [
  {
    name: "Dr. Deepak Mital",
    role: "Medical Director",
    image: "/assets/images/deepak-mital.jpg",
    bio: "Dr. Deepak Mital, MD, MBA, FACS, is a transplant surgeon with more than 30 years of experience in kidney and pancreas transplantation in the Chicago area. He is Surgical Director of the Kidney Transplant Program at UI Health and a Clinical Professor of Surgery at the University of Illinois College of Medicine. He guides high-acuity specialty pathways and the multidisciplinary care that keeps complex patients connected before and after major procedures.",
  },
  {
    name: "Dr. Ravi Badlani",
    role: "Medical Director",
    bio: "Dr. Ravi Badlani, MD, is a board-certified internist who has practiced primary care in Chicago since 1997. He earned his medical degree and completed internal medicine residency at Virginia Commonwealth University and is certified by the American Board of Internal Medicine. A board member of the Independent Physicians' ACO of Chicago, he focuses on preventive care and the day-to-day management of chronic conditions.",
  },
];

function AdvisorCard({ person }) {
  return (
    <article className="card advisor-card">
      <div className={`advisor-photo${person.photoClass ? ` ${person.photoClass}` : ""}`}>
        {person.image ? (
          <img src={person.image} alt={person.name} />
        ) : (
          <span className="advisor-initials" aria-hidden="true">
            {person.name
              .replace(/^Dr\.\s*/, "")
              .split(/\s+/)
              .slice(0, 2)
              .map((part) => part[0])
              .join("")}
          </span>
        )}
      </div>
      <div className="card-body">
        <h4>{person.name}</h4>
        <p className="advisor-role">{person.role}</p>
        <p>{person.bio}</p>
      </div>
    </article>
  );
}

export default function MgAbout() {
  usePageMeta({
    title: "About | Ingenio Medical Group",
    description:
      "Ingenio Medical Group is a virtual-first primary and specialty practice coordinated with in-person care, powered by ingeniocare.ai.",
  });

  return (
    <>
      <MgHero
        icon="about"
        title="About Ingenio Medical Group"
        lede="We are a virtual-first medical group for primary and specialty care. We work with in-person practices. We do not replace the relationships that already matter."
        image="/assets/images/why-ingenio-care.jpg"
        imageAlt="Ingenio Care clinicians and care model"
      />

      <section className="section">
        <div className="wrap">
          <h2>How we practice</h2>
          <p className="lede">
            Care starts with a virtual visit whenever that is safe and useful. When you need an exam,
            procedure, or local services, we coordinate with in-person practices so your plan and history
            stay intact.
          </p>
          <ol className="mg-flow is-detail">
            {practiceSteps.map((step, index) => (
              <li key={step.title}>
                <span className="mg-flow-step">{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section alt" id="medical-directors">
        <div className="wrap">
          <h2>Founding Partners</h2>
          <div className="grid-cards advisor-grid">
            {leadership.map((director) => (
              <AdvisorCard key={director.name} person={director} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="partners">
        <div className="wrap">
          <h2>Partners: how we work with them</h2>
          <ul className="mg-pillars mg-pillars-row">
            <li>
              <h3>For patients</h3>
              <p>
                Get care through{" "}
                <a href={patientAppHref} target="_blank" rel="noopener noreferrer">
                  patient.ingeniocare.ai
                </a>
                .
              </p>
            </li>
            <li>
              <h3>For providers</h3>
              <p>
                Join our virtual medical group, powered by the ingeniocare.ai platform, at{" "}
                <a href={providerAppHref} target="_blank" rel="noopener noreferrer">
                  provider.ingeniocare.ai
                </a>
                .
              </p>
            </li>
            <li>
              <h3>For plans</h3>
              <p>
                Partner through{" "}
                <a href={planAppHref} target="_blank" rel="noopener noreferrer">
                  plan.ingeniocare.ai
                </a>
                .
              </p>
            </li>
          </ul>
          <a
            className="mg-mso-tile"
            href={platformHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="mg-mso-tile-logo"
              src="/assets/images/logo.png"
              alt="Ingenio Care"
            />
            <div className="mg-mso-tile-copy">
              <p className="mg-mso-tile-kicker">MSO partnership</p>
              <h3>Ingenio Care</h3>
              <p>
                Ingenio Medical Group is powered by Ingenio Care as our MSO partner — the technology
                behind the patient, provider, and plan apps that keep care connected.
              </p>
            </div>
            <span className="btn light">Learn more</span>
          </a>
        </div>
      </section>
    </>
  );
}
