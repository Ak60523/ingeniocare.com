import { patientAppHref, planAppHref, providerAppHref } from "../data/mgLinks.js";
import MgSectionIcon from "./MgSectionIcon.jsx";

export default function MgHero({
  icon = "home",
  title,
  lede,
  mediaActions,
  image = "/assets/images/about-hero.jpg",
  imageAlt = "Medical professionals on the Ingenio Medical Group care team",
  className = "",
  children,
}) {
  const classes = ["mg-hero", children ? "has-below" : "", className].filter(Boolean).join(" ");
  return (
    <section className={classes}>
      <div className={`mg-hero-media${mediaActions ? " has-action" : ""}`}>
        <img src={image} alt={imageAlt} />
        <div className="mg-hero-shade" aria-hidden="true" />
        {mediaActions ? <div className="mg-hero-media-action">{mediaActions}</div> : null}
      </div>
      <div className="wrap mg-hero-inner">
        <div className="mg-hero-copy">
          <p className="mg-hero-brand">Ingenio Medical Group</p>
          <h1 className="mg-hero-title">
            <MgSectionIcon name={icon} />
            <span className="mg-hero-title-text">{title}</span>
          </h1>
          {lede ? (
            typeof lede === "string" ? (
              <p className="mg-hero-lede">{lede}</p>
            ) : (
              <div className="mg-hero-lede">{lede}</div>
            )
          ) : null}
          <div className="mg-hero-actions">
            <a className="btn sky" href={patientAppHref} target="_blank" rel="noopener noreferrer">
              Get care
            </a>
            <a className="btn light" href={providerAppHref} target="_blank" rel="noopener noreferrer">
              Enroll
            </a>
            <a className="btn navy" href={planAppHref} target="_blank" rel="noopener noreferrer">
              For plans
            </a>
          </div>
        </div>
      </div>
      {children ? <div className="wrap mg-hero-below">{children}</div> : null}
    </section>
  );
}
