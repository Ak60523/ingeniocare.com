import { useState } from "react";
import MgHero from "../../components/MgHero.jsx";
import { api } from "../../api.js";
import { patientAppHref } from "../../data/mgLinks.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";

export default function MgContact() {
  usePageMeta({
    title: "Contact | Ingenio Medical Group",
    description: "Contact Ingenio Medical Group about care, Medicare Access, or Chronic Care Management.",
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.contact({ name, email, message, newsletter: false });
      setDone(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <MgHero
        title="Contact us"
        lede="Questions about care, Medicare Access, or Chronic Care Management? Send a note — or open the patient app to get started."
        image="/assets/images/products/patient-companion-home.jpg"
        actions={
          <a className="btn sky" href={patientAppHref} target="_blank" rel="noopener noreferrer">
            Open patient app
          </a>
        }
      />

      <section className="section">
        <div className="wrap mg-contact">
          <form className="mg-contact-form" onSubmit={onSubmit}>
            <label>
              Name
              <input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
            </label>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </label>
            <label>
              Message
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} />
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            {done ? <p className="form-success">Thanks — we received your message.</p> : null}
            <button className="btn sky" type="submit" disabled={busy}>
              {busy ? "Sending…" : "Send message"}
            </button>
          </form>
          <aside className="mg-contact-aside">
            <h2>Other ways to reach us</h2>
            <p>
              <a href="mailto:hello@ingenio.care">hello@ingenio.care</a>
            </p>
            <p>
              <a href="tel:+16306570303">+1.630.657.0303</a>
            </p>
            <p>1900 S Highland Ave, Suite 105, Lombard, IL 60148</p>
          </aside>
        </div>
      </section>
    </>
  );
}
