import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";

const MG_ICON = "/assets/images/ingenio-care-icon.jpg";
const DEFAULT_ICON = "/assets/images/favicon.jpg";

export default function MgLayout() {
  useEffect(() => {
    document.body.classList.add("site-mg");
    const iconLink = document.head.querySelector('link[rel="icon"]');
    const previousHref = iconLink?.getAttribute("href") || DEFAULT_ICON;
    if (iconLink) iconLink.setAttribute("href", MG_ICON);
    return () => {
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
