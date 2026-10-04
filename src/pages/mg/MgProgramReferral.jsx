import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ccmReferralHref, medicareAccessReferralHref } from "../../data/mgLinks.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";

const PROGRAMS = {
  "medicare-access": {
    title: "Medicare Access referral",
    href: medicareAccessReferralHref,
    label: "Medicare Access Program",
    learnTo: "/medicare-access",
  },
  ccm: {
    title: "CCM referral",
    href: ccmReferralHref,
    label: "Chronic Care Management (CCM) Program",
    learnTo: "/ccm",
  },
};

export default function MgProgramReferral({ program }) {
  const config = PROGRAMS[program];

  usePageMeta({
    title: config ? `${config.title} | Ingenio Medical Group` : "Referral | Ingenio Medical Group",
    description: config
      ? `Refer a patient into the ${config.label} at Ingenio Medical Group.`
      : "Patient referral into Ingenio Medical Group programs.",
  });

  useEffect(() => {
    if (!config?.href) return;
    window.location.replace(config.href);
  }, [config]);

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
        <h1>Continuing to {config.label}</h1>
        <p>Opening the patient referral in the Ingenio Care patient app…</p>
        <p>
          <a className="btn sky" href={config.href}>
            Continue
          </a>{" "}
          <Link className="btn light" to={config.learnTo}>
            Learn more first
          </Link>
        </p>
      </div>
    </section>
  );
}
