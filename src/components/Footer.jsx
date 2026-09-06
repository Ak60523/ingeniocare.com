import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-row">
          <div className="footer-left">
            <a href="mailto:hello@ingeniocare.com">hello@ingeniocare.com</a>
            <span className="footer-sep" aria-hidden="true">
              |
            </span>
            <a href="tel:+16306570303">+1.630.657.0303</a>
          </div>
          <p className="footer-address">1900 S Highland Ave, Suite 105, Lombard, IL 60148</p>
          <nav className="footer-links" aria-label="Legal">
            <Link to="/terms-of-use">Terms of Use</Link>
            <span className="footer-sep" aria-hidden="true">
              |
            </span>
            <Link to="/privacy-policy">Privacy Policy</Link>
          </nav>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Ingenio Care. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
