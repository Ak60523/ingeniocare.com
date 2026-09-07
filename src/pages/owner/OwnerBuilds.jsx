import { useEffect, useRef, useState } from "react";
import { api } from "../../api";
import NavIcon from "../../components/NavIcons.jsx";

const logCache = new Map();

function statusClass(status) {
  const s = String(status || "").toUpperCase();
  if (s === "SUCCEED" || s === "SUCCESS") return "ok";
  if (s === "FAILED" || s === "CANCELLED") return "fail";
  if (s === "RUNNING" || s === "PROVISIONING" || s === "DEPLOYING") return "info";
  return "muted";
}

function fmt(iso) {
  if (!iso) return "—";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleString();
}

function BuildRow({ build, onDeleted, onError }) {
  const key = `${build.branch}:${build.jobId}`;
  const [busy, setBusy] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const fetching = useRef(false);
  const copiedTimer = useRef(null);

  async function copyLog() {
    if (fetching.current) return;
    setCopyError("");
    setBusy(true);
    fetching.current = true;
    try {
      let text = logCache.get(key);
      if (!text) {
        const res = await api.ownerBuildLog(build.branch, build.jobId);
        text = res.logText || "(empty log)";
        logCache.set(key, text);
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const message = err.message || String(err);
      setCopyError(message);
      onError(message);
    } finally {
      setBusy(false);
      fetching.current = false;
    }
  }

  async function onDelete() {
    if (
      !window.confirm(
        `Delete Amplify build job ${build.jobId} on branch “${build.branch}”?` +
          (statusClass(build.status) === "info" ? " In-progress jobs will be stopped first." : "")
      )
    ) {
      return;
    }
    setDeleteBusy(true);
    setCopyError("");
    try {
      await api.deleteOwnerBuild(build.branch, build.jobId);
      logCache.delete(key);
      onDeleted();
    } catch (err) {
      const message = err.message || String(err);
      setCopyError(message);
      onError(message);
    } finally {
      setDeleteBusy(false);
    }
  }

  return (
    <tr>
      <td className="sticky-col">
        <span className={`chip ${statusClass(build.status)}`}>{build.status}</span>
      </td>
      <td className="mono">{build.branch}</td>
      <td className="mono">{build.jobId}</td>
      <td className="mono">{build.commitId ? build.commitId.slice(0, 7) : "—"}</td>
      <td className="cell-clip" title={build.commitMessage || undefined}>
        {build.commitMessage || "—"}
      </td>
      <td>{fmt(build.startTime)}</td>
      <td>{fmt(build.endTime)}</td>
      <td className="owner-row-actions">
        <button
          className={`icon-btn${copied ? " is-ok" : ""}`}
          type="button"
          disabled={busy || deleteBusy}
          aria-label="Copy build log"
          title={copyError || (copied ? "Copied" : busy ? "Fetching log…" : "Copy build log")}
          onClick={() => void copyLog()}
        >
          <NavIcon name={copied ? "check" : "copy"} size={16} />
        </button>
        {build.consoleUrl ? (
          <a href={build.consoleUrl} target="_blank" rel="noopener noreferrer">
            Open
          </a>
        ) : (
          "—"
        )}
        <button className="btn ghost" type="button" disabled={deleteBusy || busy} onClick={() => void onDelete()}>
          {deleteBusy ? "Deleting…" : "Delete"}
        </button>
      </td>
    </tr>
  );
}

export default function OwnerBuilds() {
  const [items, setItems] = useState([]);
  const [appId, setAppId] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    setBusy(true);
    setError("");
    try {
      const res = await api.ownerBuilds();
      setItems(res.items || []);
      setAppId(res.appId || "");
      setInfo(res.note || "");
      if (res.error && !(res.items || []).length) setError(res.error);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="owner-page owner-page-wide">
      <header className="owner-page-head">
        <div>
          <h1>Builds</h1>
          <p>
            Amplify Hosting deploy jobs and status
            {appId ? ` · app ${appId}` : ""}
          </p>
        </div>
        <button className="btn ghost" type="button" disabled={busy} onClick={() => void load()}>
          Refresh
        </button>
      </header>

      {error ? <p className="form-error">{error}</p> : null}
      {info ? <p className="owner-notice">{info}</p> : null}

      <section className="owner-card owner-card-flush">
        <div className="table-scroll">
          <table className="owner-table">
            <thead>
              <tr>
                <th className="sticky-col">Status</th>
                <th>Branch</th>
                <th>Job</th>
                <th>Commit</th>
                <th>Message</th>
                <th>Started</th>
                <th>Finished</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((build) => (
                <BuildRow
                  key={`${build.branch}-${build.jobId}`}
                  build={build}
                  onDeleted={() => void load()}
                  onError={(message) => setError(message)}
                />
              ))}
              {!items.length && !error ? (
                <tr>
                  <td colSpan="8">{busy ? "Loading…" : "No builds found yet."}</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
