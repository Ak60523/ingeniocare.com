import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { headerNav, isSitePathActive } from "../siteNav.js";
import { growgentSignupHref } from "../data/products.js";

export default function Header() {
  const { user, signOut } = useAuth();
  const { pathname, hash } = useLocation();
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const navRef = useRef(null);

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
      <div className="banner">
        <a href={growgentSignupHref} target="_blank" rel="noopener noreferrer">
          Sign up for an AI Receptionist at Growgent.ai →
        </a>
      </div>
      <header className="site-header">
        <div className={`wrap header-inner${open ? " nav-open" : ""}`} ref={navRef}>
          <Link className="brand" to="/" onClick={closeAll}>
            <img src="/assets/images/logo.png" alt="Ingenio Care" />
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
            {headerNav.map((item) => {
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
                  end={item.exact || item.to === "/"}
                  className={({ isActive }) => (isActive ? "active" : undefined)}
                  onClick={closeAll}
                >
                  {item.label}
                </NavLink>
              );
            })}
            {user ? (
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
