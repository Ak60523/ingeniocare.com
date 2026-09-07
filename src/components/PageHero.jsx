import HomeHeroGraphic from "./HomeHeroGraphic.jsx";
import NewsFlash from "./NewsFlash.jsx";
import SocialLinks from "./SocialLinks.jsx";

export default function PageHero({ title, children, variant, aside, ruled, kicker, image, imagePosition, titleClassName }) {
  const home = variant === "home";
  const photo = image || (home ? "/assets/images/home-hero.jpg" : null);
  const headingClass = [ruled ? "is-ruled" : "", titleClassName].filter(Boolean).join(" ") || undefined;
  const classes = ["page-hero", photo ? "page-hero-photo" : "", home ? "page-hero-home" : "", variant === "article" ? "is-article" : ""]
    .filter(Boolean)
    .join(" ");
  return (
    <>
      <section className={classes}>
        {photo ? (
          <div className="page-hero-media" aria-hidden="true">
            <div className="wrap page-hero-media-inner">
              <HomeHeroGraphic src={photo} position={imagePosition} />
            </div>
          </div>
        ) : null}
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
      <div className="page-hero-social">
        <div className="wrap page-hero-social-inner">
          <SocialLinks compact />
        </div>
      </div>
      {home ? <NewsFlash /> : null}
    </>
  );
}
