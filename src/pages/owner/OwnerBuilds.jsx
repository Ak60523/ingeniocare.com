import { useEffect, useState } from "react";
import { api } from "../../api";

function formatUptime(sec) {
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  if (hours) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function OwnerBuilds() {
  const [build, setBuild] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .ownerBuilds()
      .then((data) => setBuild(data.build))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="owner-page">
      <header className="owner-page-head">
        <div>
          <h1>Builds</h1>
          <p>Runtime and git status for this Ingenio Care deployment.</p>
        </div>
      </header>

      {error ? <p className="form-error">{error}</p> : null}

      <section className="owner-card">
        <h2>Current process</h2>
        {!build ? (
          <p className="form-note">Loading…</p>
        ) : (
          <dl className="owner-meta">
            <div>
              <dt>App</dt>
              <dd>
                {build.name} {build.version}
              </dd>
            </div>
            <div>
              <dt>Node</dt>
              <dd>{build.node}</dd>
            </div>
            <div>
              <dt>Environment</dt>
              <dd>{build.env}</dd>
            </div>
            <div>
              <dt>Database</dt>
              <dd>{build.database}</dd>
            </div>
            <div>
              <dt>Started</dt>
              <dd>{build.startedAt ? new Date(build.startedAt).toLocaleString() : "—"}</dd>
            </div>
            <div>
              <dt>Uptime</dt>
              <dd>{formatUptime(build.uptimeSec || 0)}</dd>
            </div>
          </dl>
        )}
      </section>

      <section className="owner-card">
        <h2>Git</h2>
        {!build?.git ? (
          <p className="form-note">No git metadata available on this host.</p>
        ) : (
          <dl className="owner-meta">
            <div>
              <dt>Branch</dt>
              <dd>{build.git.branch}</dd>
            </div>
            <div>
              <dt>Commit</dt>
              <dd>{build.git.hash}</dd>
            </div>
            <div>
              <dt>Message</dt>
              <dd>{build.git.subject}</dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>{build.git.date}</dd>
            </div>
          </dl>
        )}
      </section>
    </div>
  );
}
