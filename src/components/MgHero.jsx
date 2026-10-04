import MgSectionIcon from "./MgSectionIcon.jsx";

export default function MgHero({
  icon = "home",
  title,
  lede,
  actions,
  mediaActions,
  actionsOnMedia = false,
  image = "/assets/images/about-hero.jpg",
  imageAlt = "Medical professionals on the Ingenio Medical Group care team",
  fill = false,
  className = "",
  children,
}) {
  const onMedia = mediaActions ?? (actionsOnMedia ? actions : null);
  const inCopy = mediaActions ? actions : actionsOnMedia ? null : actions;
  const classes = [
    "mg-hero",
    fill ? "is-fill" : "",
    children ? "has-below" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <section className={classes}>
      <div className="wrap mg-hero-inner">
        <div className="mg-hero-copy">
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
          {inCopy ? <div className="mg-hero-actions">{inCopy}</div> : null}
        </div>
        <div className={`mg-hero-media${onMedia ? " has-action" : ""}`}>
          <img src={image} alt={imageAlt} />
          {onMedia ? <div className="mg-hero-media-action">{onMedia}</div> : null}
        </div>
      </div>
      {children ? <div className="wrap mg-hero-below">{children}</div> : null}
    </section>
  );
}
