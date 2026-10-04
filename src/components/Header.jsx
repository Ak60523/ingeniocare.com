import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { patientAppHref } from "../data/mgLinks.js";
import { growgentSignupHref } from "../data/products.js";
import { getMgHeaderNav } from "../mgSiteNav.js";
import { headerNav, isSitePathActive } from "../siteNav.js";
import { useMedicalGroupBasePath, useMedicalGroupSite } from "../siteMode.js";

export default function Header() {
  const medicalGroup = useMedicalGroupSite();
  const mgBase = useMedicalGroupBasePath();
  const { user, signOut } = useAuth();
  const { pathname, hash } = useLocation();
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const navRef = useRef(null);
  const navItems = useMemo(
    () => (medicalGroup ? getMgHeaderNav(mgBase) : headerNav),
    [medicalGroup, mgBase]
  );

  useEffect(() => {
    function onClick(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  function closeAll() {
    setOpen(false);
    setOpenMenu(null);
  }

  function linkClass(to, isActive) {
    const href = String(to || "");
    if (href.includes("#")) {
      const [path, itemHash] = href.split("#");
      return pathname === path && hash === `#${itemHash}` ? "active" : undefined;
    }
    return isActive ? "active" : undefined;
  }

  return (
    <>
      {medicalGroup ? (
        <div className="banner mg-banner">
          <a href={patientAppHref} target="_blank" rel="noopener noreferrer">
            Get care in the patient app →
          </a>
        </div>
      ) : (
        <div className="banner">
          <a href={growgentSignupHref} target="_blank" rel="noopener noreferrer">
            Sign up for an AI Receptionist at Growgent.ai →
          </a>
        </div>
      )}
      <header className="site-header">
        <div className={`wrap header-inner${open ? " nav-open" : ""}`} ref={navRef}>
          <Link
            className="brand"
            to={medicalGroup ? mgBase || "/" : "/"}
            onClick={closeAll}
            aria-label={medicalGroup ? "Ingenio Medical Group" : "Ingenio Care"}
          >
            {medicalGroup ? (
              <span className="brand-mark" aria-hidden="true">
                <img src="/assets/images/about-hero.jpg" alt="" />
                <span className="brand-mark-fade" />
                <span className="brand-mark-ing">ING</span>
                <span className="brand-mark-plus">+</span>
              </span>
            ) : (
              <img src="/assets/images/logo.png" alt="Ingenio Care" />
            )}
            {medicalGroup ? <span className="brand-text">Ingenio Medical Group</span> : null}
          </Link>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </button>
          <nav className="nav">
            {navItems.map((item) => {
              if (item.children?.length) {
                const sectionActive = isSitePathActive(pathname, item);
                const expanded = openMenu === item.id;
                const mega = item.children.some((child) => child.links?.length);
                return (
                  <div
                    key={item.id}
                    className={`nav-more${expanded ? " open" : ""}${mega ? " is-mega" : ""}`}
                  >
                    <button
                      type="button"
                      className={sectionActive ? "active" : undefined}
                      aria-expanded={expanded}
                      aria-haspopup="menu"
                      onClick={() => setOpenMenu((current) => (current === item.id ? null : item.id))}
                    >
                      {item.label}
                    </button>
                    <div className={`nav-more-menu${mega ? " is-mega" : ""}`} role="menu">
                      {mega
                        ? item.children.map((child) => (
                            <div key={child.id} className="nav-mega-col">
                              <NavLink
                                to={child.to}
                                end={child.exact}
                                role="menuitem"
                                className={({ isActive }) =>
                                  `nav-mega-heading${isActive ? " active" : ""}`
                                }
                                onClick={closeAll}
                              >
                                {child.label}
                              </NavLink>
                              {(child.links || []).map((link) => (
                                <NavLink
                                  key={link.id}
                                  to={link.to}
                                  role="menuitem"
                                  className={({ isActive }) => linkClass(link.to, isActive)}
                                  onClick={closeAll}
                                >
                                  {link.label}
                                </NavLink>
                              ))}
                            </div>
                          ))
                        : item.children.map((child) => (
                            <NavLink
                              key={child.id}
                              to={child.to}
                              end={child.exact}
                              role="menuitem"
                              className={({ isActive }) => (isActive ? "active" : undefined)}
                              onClick={closeAll}
                            >
                              {child.label}
                            </NavLink>
                          ))}
                    </div>
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.id}
                  to={item.to}
                  end={item.exact || item.to === "/" || item.to === mgBase}
                  className={({ isActive }) => (isActive ? "active" : undefined)}
                  onClick={closeAll}
                >
                  {item.label}
                </NavLink>
              );
            })}
            {medicalGroup ? (
              <a
                className="nav-account"
                href={patientAppHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeAll}
              >
                Get care
              </a>
            ) : user ? (
              <button
                className="nav-account"
                type="button"
                onClick={() => {
                  closeAll();
                  signOut();
                }}
              >
                Sign Out
              </button>
            ) : (
              <NavLink className="nav-account" to="/m/account" onClick={closeAll}>
                Sign In
              </NavLink>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
