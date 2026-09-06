import { Link } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";

export default function Terms() {
  return (
    <>
      <PageHero title="Terms of Use" />
      <section className="section">
        <div className="wrap article">
          <h2>Terms of Use</h2>
          <p>
            These Terms of Use govern your access to and use of the Ingenio Care website. By using
            this site, you agree to these terms.
          </p>
          <p>
            <strong>Informational Use.</strong> Content on this website is for general information
            about Ingenio Care and its network. It is not medical advice, a diagnosis, or a
            substitute for care from a qualified clinician.
          </p>
          <p>
            <strong>Acceptable Use.</strong> You may not misuse the site, attempt to disrupt its
            operation, or use it to send unsolicited communications. We may update or discontinue
            any part of the site at any time.
          </p>
          <p>
            <strong>Intellectual Property.</strong> The Ingenio Care name, logo, and site content
            are owned by Ingenio Care or its licensors. You may not copy or reuse them without
            permission, except as allowed by law.
          </p>
          <p>
            <strong>Privacy.</strong> How we collect and use information is described in our{" "}
            <Link to="/privacy-policy">Privacy Policy</Link>.
          </p>
          <p>
            <strong>Changes.</strong> We may revise these terms from time to time. Continued use of
            the site after changes are posted constitutes acceptance of the updated terms.
          </p>
          <p>
            Questions about these terms can be sent to{" "}
            <a href="mailto:support@ingeniocare.com?subject=Terms%20of%20Use">
              support@ingeniocare.com
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
