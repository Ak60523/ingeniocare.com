import { useState } from "react";
import { api } from "../api";
import PageHero from "../components/PageHero.jsx";

export default function Contact() {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setStatus("");
    setBusy(true);
    const form = new FormData(event.target);
    try {
      await api.contact({
        name: form.get("name"),
        email: form.get("email"),
        message: form.get("message"),
        newsletter: form.get("newsletter") === "on",
      });
      setStatus("Thank you. Your message was saved to Aurora.");
      event.target.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHero title="Contact Us">
        <h4>Drop us a line!</h4>
      </PageHero>
      <section className="section">
        <div className="wrap">
          <form className="form" onSubmit={onSubmit}>
            <div>
              <label htmlFor="name">Name*</label>
              <input id="name" name="name" required />
            </div>
            <div>
              <label htmlFor="email">Email*</label>
              <input id="email" name="email" type="email" required />
            </div>
            <div>
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="6" />
            </div>
            <label className="row">
              <input type="checkbox" name="newsletter" />
              <span>Sign up for our email list for updates, promotions, and more.</span>
            </label>
            <button className="btn" type="submit" disabled={busy}>
              {busy ? "Sending…" : "Send"}
            </button>
            <p className="form-note">Submissions are stored in Amazon Aurora MySQL.</p>
          </form>
          {error ? <p className="form-error">{error}</p> : null}
          {status ? <p className="success show">{status}</p> : null}
        </div>
      </section>
    </>
  );
}
