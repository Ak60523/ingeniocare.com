import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";

export default function MgLayout() {
  useEffect(() => {
    document.body.classList.add("site-mg");
    return () => document.body.classList.remove("site-mg");
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
