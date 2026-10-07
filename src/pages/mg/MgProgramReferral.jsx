import { Link } from "react-router-dom";
import MgLaunchActions from "../../components/MgLaunchActions.jsx";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import { useMgPath } from "../../siteMode.js";

const PROGRAMS = {
  chronic: {
    title: "Chronic care referral",
    label: "Chronic Care Program",
    learnSegment: "chronic",
  },
  specialty: {
    title: "Specialty care referral",
    label: "Specialty Care Program",
    learnSegment: "specialty",
  },
};

export default function MgProgramReferral({ program }) {
  const config = PROGRAMS[program];
  const mgPath = useMgPath();

  usePageMeta({
    title: config ? `${config.title} | Ingenio Medical Group` : "Referral | Ingenio Medical Group",
    description:
      "Ingenio Medical Group is coming soon. Patients can find providers and connect on ingeniocare.ai. Providers can inquire about joining.",
  });

  if (!config) {
    return (
      <section className="section">
        <div className="wrap center">
          <h1>Referral link not found</h1>
          <p>
            <Link className="btn sky" to="/">
              Return Home
            </Link>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="wrap center">
        <h1>Coming soon</h1>
        <p>
          The {config.label} at Ingenio Medical Group is not open yet. Patients can find a provider
          and connect on ingeniocare.ai. Providers can inquire about joining.
        </p>
        <MgLaunchActions />
        <p>
          <Link className="btn navy" to={mgPath(config.learnSegment)}>
            Learn about {config.label}
          </Link>
        </p>
      </div>
    </section>
  );
}
