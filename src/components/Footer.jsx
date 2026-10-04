import { Link } from "react-router-dom";
import SocialLinks from "./SocialLinks.jsx";
import { platformHref } from "../data/mgLinks.js";
import { useMedicalGroupSite } from "../siteMode.js";

export default function Footer() {
  const medicalGroup = useMedicalGroupSite();

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-row">
          <div className="footer-left">
            <a href={medicalGroup ? "mailto:hello@ingenio.care" : "mailto:hello@ingeniocare.com"}>
              {medicalGroup ? "hello@ingenio.care" : "hello@ingeniocare.com"}
            </a>
            <span className="footer-sep" aria-hidden="true">
              |
            </span>
            <a href="tel:+16306570303">+1.630.657.0303</a>
          </div>
          <p className="footer-address">1900 S Highland Ave, Suite 105, Lombard, IL 60148</p>
          <div className="footer-social">
            <SocialLinks />
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © 2026 {medicalGroup ? "Ingenio Medical Group" : "Ingenio Care"}. All rights reserved.
            {medicalGroup ? (
              <>
                {" "}
                Powered by{" "}
                <a href={platformHref} target="_blank" rel="noopener noreferrer">
                  ingeniocare.ai
                </a>
                .
              </>
            ) : null}
          </p>
          <nav className="footer-links" aria-label="Legal">
            <Link to="/terms-of-use">Terms of Use</Link>
            <span className="footer-sep" aria-hidden="true">
              |
            </span>
            <Link to="/privacy-policy">Privacy Policy</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
