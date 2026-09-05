import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

const primary = [
  ["/", "Home"],
  ["/network", "Network"],
  ["/blogs", "Blogs"],
  ["/news", "News"],
  ["/about-us", "About Us"],
];

const moreLinks = [
  ["/physician-advisory-board", "Physician Advisory Board"],
  ["/healthcare-advisory-board", "Healthcare Advisory Board"],
  ["/contact-us", "Contact Us"],
];

export default function Header() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);

  useEffect(() => {
    function onClick(event) {
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      <div className="banner">
        <a href="https://ingeniocare.ai" target="_blank" rel="noopener noreferrer">
          <p>Join us at HLTH Conference in Vegas October 19-22. Digital Health booth 1760-46</p>
        </a>
      </div>
      <header className="site-header">
        <div className={`wrap header-inner${open ? " nav-open" : ""}`}>
          <Link className="brand" to="/" onClick={() => setOpen(false)}>
            <img src="/assets/images/logo.png" alt="Ingenio Care" />
            <span>Ingenio Care, Inc.</span>
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
            {primary.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) => (isActive ? "active" : undefined)}
                onClick={() => setOpen(false)}
              >
                {label}
              </NavLink>
            ))}
            <div className={`nav-more${moreOpen ? " open" : ""}`} ref={moreRef}>
              <button type="button" onClick={() => setMoreOpen((value) => !value)}>
                More
              </button>
              <div className="nav-more-menu">
                {moreLinks.map(([to, label]) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) => (isActive ? "active" : undefined)}
                    onClick={() => {
                      setMoreOpen(false);
                      setOpen(false);
                    }}
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
            {user ? (
              <button className="account-link" type="button" onClick={signOut}>
                Sign Out
              </button>
            ) : (
              <NavLink className="account-link" to="/m/account" onClick={() => setOpen(false)}>
                Sign In
              </NavLink>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
