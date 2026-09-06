import HomeHeroGraphic from "./HomeHeroGraphic.jsx";
import NewsFlash from "./NewsFlash.jsx";

export default function PageHero({ title, children, variant, aside, ruled, kicker, image, imagePosition }) {
  const home = variant === "home";
  const photo = image || (home ? "/assets/images/home-hero.jpg" : null);
  const headingClass = ruled ? "is-ruled" : undefined;
  const classes = ["page-hero", photo ? "page-hero-photo" : "", home ? "page-hero-home" : ""]
    .filter(Boolean)
    .join(" ");
  return (
    <>
      <section className={classes}>
        {photo ? <HomeHeroGraphic src={photo} position={imagePosition} /> : null}
        <div className="wrap page-hero-inner">
          {kicker ? <p className="page-hero-kicker">{kicker}</p> : null}
          {aside ? (
            <div className="page-hero-top">
              <h1 className={headingClass}>{title}</h1>
              <div className="page-hero-aside">{aside}</div>
            </div>
          ) : (
            <h1 className={headingClass}>{title}</h1>
          )}
          {children}
        </div>
      </section>
      {home ? <NewsFlash /> : null}
    </>
  );
}
