import { useEffect, useState } from "react";
import { api } from "../../api";

export default function OwnerErrors() {
  const [errors, setErrors] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const data = await api.ownerErrors();
    setErrors(data.errors || []);
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  async function clearAll() {
    if (!window.confirm("Clear all captured API errors?")) return;
    setBusy(true);
    setError("");
    try {
      await api.clearOwnerErrors();
      setErrors([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="owner-page">
      <header className="owner-page-head">
        <div>
          <h1>Errors</h1>
          <p>API failures captured from this server.</p>
        </div>
        <button className="btn ghost" type="button" disabled={busy || !errors.length} onClick={clearAll}>
          Clear
        </button>
      </header>

      {error ? <p className="form-error">{error}</p> : null}

      {!errors.length ? (
        <section className="owner-card">
          <p className="owner-notice">No failed API jobs recorded.</p>
        </section>
      ) : (
        errors.map((item) => (
          <section className="owner-card" key={item.id}>
            <h2>{item.message}</h2>
            <p className="form-note">
              {item.method || "—"} {item.path || "—"} ·{" "}
              {item.createdAt ? new Date(item.createdAt).toLocaleString() : "—"}
            </p>
            {item.stack ? <pre className="owner-log">{item.stack}</pre> : null}
          </section>
        ))
      )}
    </div>
  );
}
