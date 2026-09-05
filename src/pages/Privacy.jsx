import PageHero from "../components/PageHero.jsx";

export default function Privacy() {
  return (
    <>
      <PageHero title="Privacy Policy" />
      <section className="section">
        <div className="wrap article">
          <h2>Privacy Policy</h2>
          <p>
            At Ingenio Healthcare, we take the privacy of our website visitors very seriously. This
            Privacy Policy explains what information we collect and how we use it.
          </p>
          <p>
            <strong>Information We Collect</strong> When you visit our website, we may collect
            information such as your IP address, browser type, and the pages you visit. We use this
            information to analyze trends, administer the site, track user's movements around the
            site, and gather demographic information about our user base as a whole. We do not link
            this automatically collected data to any personal information.
          </p>
          <p>
            We also collect personal information that you provide to us when you fill out a contact
            form, sign up for our newsletter, or request a consultation. This may include your name,
            email address, and phone number.
          </p>
          <p>
            <strong>How We Use Your Information:</strong>
          </p>
          <p>
            We use the information we collect to improve our website, respond to your inquiries, and
            send you relevant information about our consulting services. We do not sell or share your
            personal information with third parties except as required by law or as necessary to
            provide our services to you.
          </p>
          <p>
            <strong>Cookies</strong> We use cookies on our website to help us analyze how visitors
            use the site. Cookies are small text files that are stored on your computer when you visit
            certain web pages. We use cookies to understand what content is popular, which helps us
            improve our website.
          </p>
          <p>
            <strong>Security:</strong>
          </p>
          <p>
            We take reasonable precautions to protect the personal information we collect from
            unauthorized access, use, and disclosure. However, no data transmission over the Internet
            or wireless network can be guaranteed to be 100% secure. As a result, we cannot guarantee
            the security of any information you transmit to us, and you do so at your own risk.
          </p>
          <p>
            <strong>Changes to This Privacy Policy:</strong>
          </p>
          <p>
            We reserve the right to modify this Privacy Policy at any time. If we make material
            changes to this policy, we will notify you by email or by posting a notice on our
            website.
          </p>
          <p>
            Contact Us If you have any questions or concerns about our Privacy Policy, please contact
            us at{" "}
            <a href="mailto:support@ingeniohc.com?subject=Privacy%20Inquiry">
              support@ingeniohc.com
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
