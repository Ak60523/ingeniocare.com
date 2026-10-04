import { Link } from "react-router-dom";
import MgHero from "../../components/MgHero.jsx";
import { patientAppHref, planAppHref, platformHref, providerAppHref } from "../../data/mgLinks.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import { useMgPath } from "../../siteMode.js";

export default function MgAbout() {
  const mgPath = useMgPath();
  usePageMeta({
    title: "About | Ingenio Medical Group",
    description:
      "Ingenio Medical Group is a virtual-first primary and specialty practice coordinated with in-person care, powered by ingeniocare.ai.",
  });

  return (
    <>
      <MgHero
        title="About Ingenio Medical Group"
        lede="We are a virtual-first medical group for primary and specialty care — built to work with in-person practices, not replace the relationships that already matter."
        image="/assets/images/why-ingenio-care.jpg"
        imageAlt="Ingenio Care clinicians and care model"
        actions={
          <>
            <a className="btn sky" href={patientAppHref} target="_blank" rel="noopener noreferrer">
              Patient app
            </a>
            <Link className="btn light" to={mgPath("contact")}>
              Contact us
            </Link>
          </>
        }
      />

      <section className="section">
        <div className="wrap">
          <h2>How we practice</h2>
          <p className="lede">
            Care starts with a virtual visit whenever that is safe and useful. When you need an exam,
            procedure, or local services, we coordinate with in-person practices so your plan and history
            stay intact.
          </p>
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
                Join our virtual medical group — powered by the ingeniocare.ai platform — at{" "}
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
          <p style={{ marginTop: "1.5rem" }}>
            The clinical practice is Ingenio Medical Group. The technology behind patient, provider, and
            plan apps is{" "}
            <a href={platformHref} target="_blank" rel="noopener noreferrer">
              ingeniocare.ai
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
