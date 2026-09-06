import HomeHeroGraphic from "./HomeHeroGraphic.jsx";
import NewsFlash from "./NewsFlash.jsx";

export default function PageHero({ title, children, variant, aside, ruled }) {
  const home = variant === "home";
  const headingClass = ruled ? "is-ruled" : undefined;
  return (
    <>
      <section className={home ? "page-hero page-hero-home" : "page-hero"}>
        {home ? <HomeHeroGraphic /> : null}
        <div className="wrap page-hero-inner">
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
