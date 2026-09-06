import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext.jsx";
import PageHero from "../components/PageHero.jsx";

export default function CreateAccount() {
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const form = new FormData(event.target);
    try {
      const data = await api.register({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
      });
      setSession(data);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHero title="Create account" />
      <section className="section">
        <div className="wrap">
          <div className="auth-box">
            <p>Create an account to access member pages and updates from Ingenio Care.</p>
            <form className="form" onSubmit={onSubmit}>
              <div>
                <label htmlFor="name">Name</label>
                <input id="name" name="name" required />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" minLength="8" required />
              </div>
              <button className="btn" type="submit" disabled={busy}>
                {busy ? "Creating…" : "Create account"}
              </button>
              {error ? <p className="form-error">{error}</p> : null}
              <p>
                Already a member? <Link to="/m/account">Sign in.</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
