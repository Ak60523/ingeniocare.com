export function getMgHeaderNav(base = "/ingenio") {
  const root = base.replace(/\/$/, "");
  const path = (segment = "") => (segment ? `${root}/${segment}` : root || "/");
  return [
    { id: "home", to: path(), label: "Home", exact: true },
    { id: "care", to: path("care"), label: "Care" },
    { id: "medicare", to: path("medicare-access"), label: "Medicare Access" },
    { id: "ccm", to: path("ccm"), label: "CCM" },
    { id: "about", to: path("about"), label: "About" },
    { id: "contact", to: path("contact"), label: "Contact" },
  ];
}
