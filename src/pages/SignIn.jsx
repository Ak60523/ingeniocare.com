import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext.jsx";
import PageHero from "../components/PageHero.jsx";

export default function SignIn() {
  const { user, setSession } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const form = new FormData(event.target);
    try {
      const data = await api.login({
        email: form.get("email"),
        password: form.get("password"),
      });
      setSession(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHero title={user ? "My Account" : "Account sign in"} />
      <section className="section">
        <div className="wrap">
          <div className="auth-box">
            {user ? (
              <>
                <p>Signed in as {user.name} ({user.email}).</p>
                <p>Account records are stored in Aurora.</p>
              </>
            ) : (
              <>
                <p>
                  Sign in to your account to access your profile, history, and any private pages
                  you've been granted access to.
                </p>
                <form className="form" onSubmit={onSubmit}>
                  <div>
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" required />
                  </div>
                  <div>
                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="password" required />
                  </div>
                  <button className="btn" type="submit" disabled={busy}>
                    {busy ? "Signing in…" : "Sign in"}
                  </button>
                  {error ? <p className="form-error">{error}</p> : null}
                  <p>
                    Not a member? <Link to="/m/create-account">Create account.</Link>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
