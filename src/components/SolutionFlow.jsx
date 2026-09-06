import { Link } from "react-router-dom";
import { productHref } from "../data/products.js";
import NavIcon from "./NavIcons.jsx";

const COLUMNS = [
  {
    id: "access",
    lane: "Access",
    boxes: [
      {
        id: "patient-app",
        title: "Patient App",
        icon: "customers",
        benefit: "Find care and stay connected between visits",
        to: productHref({ slug: "patient-app" }),
      },
      {
        id: "growgent-ai",
        title: "Growgent.ai",
        icon: "sparkle",
        benefit: "24/7 AI receptionist that books visits",
        to: productHref({ slug: "growgent-ai" }),
      },
      {
        id: "digital-front-doors",
        title: "Digital Front Door",
        icon: "door",
        benefit: "Faster path to the right specialist",
        to: productHref({ slug: "digital-front-doors" }),
      },
    ],
  },
  {
    id: "network",
    lane: "Care network",
    boxes: [
      {
        id: "marketplace",
        title: "Marketplace",
        icon: "store",
        benefit: "Match patients with available capacity",
        to: productHref({ slug: "marketplace" }),
      },
      {
        id: "referral-network",
        title: "Referral Network",
        icon: "network",
        benefit: "Keep referrals complete and in-network",
        to: productHref({ slug: "marketplace" }),
      },
    ],
  },
  {
    id: "providers",
    lane: "Providers",
    boxes: [
      {
        id: "provider-app",
        title: "Provider App",
        icon: "phone",
        benefit: "Referrals and care-team context in one app",
        to: productHref({ slug: "provider-app" }),
      },
      {
        id: "chrome-plugin",
        title: "Chrome extension",
        icon: "plugin",
        benefit: "Network tools inside the clinical workflow",
        to: productHref({ slug: "provider-app" }),
      },
      {
        id: "fhir",
        title: "FHIR",
        icon: "link",
        benefit: "Share data across apps without extra systems",
        to: productHref({ slug: "provider-app" }),
      },
    ],
  },
];

function FlowBox({ box }) {
  const inner = (
    <>
      <span className="solution-flow-icon">
        <NavIcon name={box.icon} />
      </span>
      <span className="solution-flow-copy">
        <strong>{box.title}</strong>
        {box.benefit ? <span className="solution-flow-benefit">{box.benefit}</span> : null}
      </span>
    </>
  );

  if (box.to) {
    return (
      <Link className={`solution-flow-box is-${box.id}`} to={box.to}>
        {inner}
      </Link>
    );
  }

  return <div className={`solution-flow-box is-${box.id}`}>{inner}</div>;
}

function FlowColumn({ column, position }) {
  return (
    <section className={`solution-flow-col is-${position}`} aria-label={column.lane}>
      <h3 className="solution-flow-lane">{column.lane}</h3>
      <div className="solution-flow-boxes">
        {column.boxes.map((box) => (
          <FlowBox key={box.id} box={box} />
        ))}
      </div>
    </section>
  );
}

export default function SolutionFlow() {
  return (
    <div className="solution-flow">
      <div className="solution-flow-watermark" aria-hidden="true">
        <img src="/assets/images/tornado-watermark.png" alt="" />
      </div>
      <FlowColumn column={COLUMNS[0]} position="start" />
      <div className="solution-flow-spine" aria-hidden="true" />
      <FlowColumn column={COLUMNS[1]} position="mid" />
      <div className="solution-flow-spine" aria-hidden="true" />
      <FlowColumn column={COLUMNS[2]} position="end" />
    </div>
  );
}
