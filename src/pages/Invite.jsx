import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext.jsx";
import PageHero from "../components/PageHero.jsx";

export default function Invite() {
  const { token } = useParams();
  const { user, setSession } = useAuth();
  const navigate = useNavigate();
  const [invite, setInvite] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .invite(token)
      .then(setInvite)
      .catch((err) => setError(err.message));
  }, [token]);

  async function accept() {
    setBusy(true);
    try {
      const data = await api.acceptInvite(token);
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
      <PageHero title="Workspace invite" />
      <section className="section">
        <div className="wrap auth-box">
          {error ? <p className="form-error">{error}</p> : null}
          {invite ? (
            <>
              <p>
                You were invited to <strong>{invite.tenantName}</strong> as <strong>{invite.role}</strong>.
              </p>
              {invite.expired ? <p>This invite has expired.</p> : null}
              {invite.accepted ? <p>This invite was already accepted.</p> : null}
              {!user ? (
                <p>
                  <Link className="btn" to="/m/account">
                    Sign in to accept
                  </Link>
                </p>
              ) : !invite.expired && !invite.accepted ? (
                <button className="btn" type="button" disabled={busy} onClick={accept}>
                  {busy ? "Joining…" : "Accept invite"}
                </button>
              ) : null}
            </>
          ) : !error ? (
            <p>Loading invite…</p>
          ) : null}
        </div>
      </section>
    </>
  );
}
