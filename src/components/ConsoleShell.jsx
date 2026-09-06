import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { useSettings } from "../SettingsContext.jsx";
import { RAIL_COLLAPSED, RAIL_EXPANDED, isConsolePath, readNavExpanded, writeNavExpanded } from "../consoleNav.js";
import AccountMenu from "./AccountMenu.jsx";
import NavIcon from "./NavIcons.jsx";
import SettingsPages from "./SettingsPages.jsx";

export default function ConsoleShell() {
  const { ready, canManageTenants, canManageUsers, canManageContent } = useAuth();
  const { open: settingsOpen, toggleSettings } = useSettings();
  const location = useLocation();
  const [expanded, setExpanded] = useState(readNavExpanded);
  const [compact, setCompact] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 900px)").matches : false
  );

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    function sync() {
      setCompact(media.matches);
    }
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const showRail = ready && (canManageUsers || canManageContent);
  if (!showRail) return <Outlet />;

  const site = !isConsolePath(location.pathname);
  const collapsed = !expanded && !compact;

  function toggleRail() {
    setExpanded((value) => {
      const next = !value;
      writeNavExpanded(next);
      return next;
    });
  }

  return (
    <div className={`owner-shell${site ? " is-site" : ""}${collapsed ? " is-collapsed" : ""}`}>
      <aside className="owner-rail" style={{ width: collapsed ? RAIL_COLLAPSED : RAIL_EXPANDED }}>
        <div className="owner-rail-top">
          <Link className="owner-rail-brand" to="/" title="Ingenio Care">
            <img src="/assets/images/logo.png" alt="" />
            {collapsed ? null : (
              <div>
                <strong>Ingenio Care</strong>
                <span>{canManageTenants ? "Owner console" : "Admin console"}</span>
              </div>
            )}
          </Link>
          <button
            className="owner-rail-toggle"
            type="button"
            title={collapsed ? "Expand menu" : "Collapse menu"}
            aria-label={collapsed ? "Expand menu" : "Collapse menu"}
            aria-expanded={!collapsed}
            onClick={toggleRail}
          >
            <NavIcon name="chevron" />
          </button>
        </div>

        <nav className="owner-nav" aria-label={canManageTenants ? "Owner" : "Admin"}>
          {canManageContent ? (
            <>
              {collapsed ? null : <p className="owner-nav-group">Pages</p>}
              <SettingsPages collapsed={collapsed} />
            </>
          ) : null}
        </nav>

        <AccountMenu variant="rail" collapsed={collapsed} />
      </aside>

      <div className="owner-main">
        {canManageContent
          ? createPortal(
              <button
                className={`design-fab${settingsOpen ? " is-open" : ""}`}
                type="button"
                title="Design"
                aria-label="Design"
                aria-pressed={settingsOpen}
                onClick={toggleSettings}
              >
                <NavIcon name="settings" />
                Design
              </button>,
              document.body
            )
          : null}
        <Outlet />
      </div>
    </div>
  );
}
