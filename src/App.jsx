import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import ConsoleShell from "./components/ConsoleShell.jsx";
import Layout from "./components/Layout.jsx";
import RequireRole from "./components/RequireRole.jsx";
import Home from "./pages/Home.jsx";
import Products, { HashRedirect, LegacyProductRedirect } from "./pages/Products.jsx";
import Customers from "./pages/Customers.jsx";
import About from "./pages/About.jsx";
import News from "./pages/News.jsx";
import Article from "./pages/Article.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import SignIn from "./pages/SignIn.jsx";
import CreateAccount from "./pages/CreateAccount.jsx";
import Invite from "./pages/Invite.jsx";
import NotFound from "./pages/NotFound.jsx";
import {
  BlogPage,
  BlogPostPage,
  PaperDetailPage,
  PapersPage,
  PodcastDetailPage,
  PodcastsPage,
} from "./pages/ContentPages.jsx";
import OwnerTenants from "./pages/owner/OwnerTenants.jsx";
import OwnerUsers from "./pages/owner/OwnerUsers.jsx";
import OwnerSettings from "./pages/owner/OwnerSettings.jsx";
import OwnerBuilds from "./pages/owner/OwnerBuilds.jsx";
import OwnerErrors from "./pages/owner/OwnerErrors.jsx";
import OwnerCursor from "./pages/owner/OwnerCursor.jsx";
import OwnerDataModel from "./pages/owner/OwnerDataModel.jsx";
import { canManageContent, canManageTenants, canManageUsers } from "./roles";

export default function App() {
  return (
    <Routes>
      <Route element={<ConsoleShell />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/solutions" element={<Products />} />
          <Route path="/solutions/:slug" element={<Products />} />
          <Route path="/network" element={<Navigate to="/" replace />} />
          <Route path="/network/products" element={<HashRedirect to="/solutions" />} />
          <Route path="/products" element={<HashRedirect to="/solutions" />} />
          <Route path="/products/:slug" element={<LegacyProductRedirect />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:slug" element={<Customers />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/news" element={<News />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/blogs" element={<Navigate to="/blog" replace />} />
          <Route path="/papers" element={<PapersPage />} />
          <Route path="/papers/:slug" element={<PaperDetailPage />} />
          <Route path="/podcasts" element={<PodcastsPage />} />
          <Route path="/podcasts/:slug" element={<PodcastDetailPage />} />
          <Route path="/podcast" element={<Navigate to="/podcasts" replace />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/terms-of-use" element={<Terms />} />
          <Route path="/physician-advisory-board" element={<Navigate to="/about-us#advisory-board" replace />} />
          <Route path="/healthcare-advisory-board" element={<Navigate to="/about-us#advisory-board" replace />} />
          <Route path="/m/account" element={<SignIn />} />
          <Route path="/m/create-account" element={<CreateAccount />} />
          <Route path="/invite/:token" element={<Invite />} />
          <Route path="/:slug" element={<Article />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route
          element={
            <RequireRole allow={canManageTenants}>
              <Outlet />
            </RequireRole>
          }
        >
          <Route path="/tenants" element={<OwnerTenants />} />
          <Route path="/builds" element={<OwnerBuilds />} />
          <Route path="/errors" element={<OwnerErrors />} />
          <Route path="/cursor" element={<OwnerCursor />} />
          <Route path="/data-model" element={<OwnerDataModel />} />
        </Route>

        <Route
          element={
            <RequireRole allow={canManageUsers}>
              <Outlet />
            </RequireRole>
          }
        >
          <Route path="/users" element={<OwnerUsers />} />
        </Route>

        <Route
          element={
            <RequireRole allow={canManageContent}>
              <Outlet />
            </RequireRole>
          }
        >
          <Route path="/settings" element={<OwnerSettings />} />
        </Route>
      </Route>
    </Routes>
  );
}
