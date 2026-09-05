import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Network from "./pages/Network.jsx";
import About from "./pages/About.jsx";
import News from "./pages/News.jsx";
import Article from "./pages/Article.jsx";
import Contact from "./pages/Contact.jsx";
import Privacy from "./pages/Privacy.jsx";
import PhysicianBoard from "./pages/PhysicianBoard.jsx";
import HealthcareBoard from "./pages/HealthcareBoard.jsx";
import SignIn from "./pages/SignIn.jsx";
import CreateAccount from "./pages/CreateAccount.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/network" element={<Network />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/news" element={<News />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/physician-advisory-board" element={<PhysicianBoard />} />
        <Route path="/healthcare-advisory-board" element={<HealthcareBoard />} />
        <Route path="/blogs" element={<SignIn />} />
        <Route path="/m/account" element={<SignIn />} />
        <Route path="/m/create-account" element={<CreateAccount />} />
        <Route path="/:slug" element={<Article />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
