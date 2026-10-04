export default function MgHero({
  brand = "Ingenio Medical Group",
  title,
  lede,
  actions,
  image = "/assets/images/about-hero.jpg",
  imageAlt = "Medical professionals on the Ingenio Medical Group care team",
}) {
  return (
    <section className="mg-hero">
      <div className="wrap mg-hero-inner">
        <div className="mg-hero-copy">
          <p className="mg-hero-brand">{brand}</p>
          <h1>{title}</h1>
          {lede ? <p className="mg-hero-lede">{lede}</p> : null}
          {actions ? <div className="mg-hero-actions">{actions}</div> : null}
        </div>
        <div className="mg-hero-media">
          <img src={image} alt={imageAlt} />
        </div>
      </div>
    </section>
  );
}
