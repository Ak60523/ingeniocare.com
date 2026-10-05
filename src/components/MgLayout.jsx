import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";

const MG_ICON = "/assets/images/ingenio-care-icon.jpg";
const DEFAULT_ICON = "/assets/images/favicon.jpg";

function paintChat(color) {
  const btn = document.getElementById("growgent-frontdesk-fab")?.shadowRoot?.querySelector("button.fab");
  if (btn) btn.style.backgroundColor = color;
  return !!btn;
}

export default function MgLayout() {
  useEffect(() => {
    document.body.classList.add("site-mg");
    const iconLink = document.head.querySelector('link[rel="icon"]');
    const previousHref = iconLink?.getAttribute("href") || DEFAULT_ICON;
    if (iconLink) iconLink.setAttribute("href", MG_ICON);
    let n = 0;
    const timer = setInterval(() => {
      if (paintChat("#38bdf8") || ++n > 25) clearInterval(timer);
    }, 200);
    return () => {
      clearInterval(timer);
      paintChat("");
      document.body.classList.remove("site-mg");
      if (iconLink) iconLink.setAttribute("href", previousHref);
    };
  }, []);

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
