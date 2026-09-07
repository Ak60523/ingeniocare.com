import { Outlet } from "react-router-dom";
import Footer from "./Footer.jsx";
import GrowgentFab from "./GrowgentFab.jsx";
import Header from "./Header.jsx";

export default function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <GrowgentFab />
    </>
  );
}
