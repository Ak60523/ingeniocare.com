export default function HomeHeroGraphic({ src = "/assets/images/home-hero.jpg", position }) {
  return (
    <div className="home-hero-graphic" aria-hidden="true">
      <img src={src} alt="" style={position ? { objectPosition: position } : undefined} />
      <div className="home-hero-shade" />
    </div>
  );
}
