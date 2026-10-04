export function getMgHeaderNav(base = "/ingenio") {
  const root = base.replace(/\/$/, "");
  const path = (segment = "") => (segment ? `${root}/${segment}` : root || "/");
  return [
    { id: "home", to: path(), label: "Home", exact: true },
    { id: "wellness", to: path("wellness"), label: "Wellness" },
    { id: "chronic", to: path("chronic"), label: "Chronic" },
    { id: "specialty", to: path("specialty"), label: "Specialty" },
    { id: "about", to: path("about"), label: "About" },
    { id: "contact", to: path("contact"), label: "Contact" },
  ];
}
