import { useEffect, useState } from "react";
import { api } from "../../api";

function fmt(iso) {
  if (!iso) return "—";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleString();
}

function severityClass(severity) {
  const s = String(severity || "").toLowerCase();
  if (s === "error") return "fail";
  if (s === "warn" || s === "warning") return "warn";
  return "muted";
}

function DetailLine({ label, value }) {
  return (
    <p className="owner-detail-line">
      <span>{label}</span>
      {value || "—"}
    </p>
  );
}

export default function OwnerErrors() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [source, setSource] = useState("");
  const [severity, setSeverity] = useState("");
  const [q, setQ] = useState("");
  const [qDraft, setQDraft] = useState("");
  const [selected, setSelected] = useState(null);
  const [checkedIds, setCheckedIds] = useState(new Set());
  const [detailBusy, setDetailBusy] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const allVisibleSelected = items.length > 0 && items.every((row) => checkedIds.has(String(row.id)));
  const someVisibleSelected = items.some((row) => checkedIds.has(String(row.id))) && !allVisibleSelected;

  async function load() {
    setBusy(true);
    setError("");
    try {
      const res = await api.ownerErrors({
        limit: 50,
        offset: 0,
        source: source || undefined,
        severity: severity || undefined,
        q: q || undefined,
      });
      const next = res.items || [];
      setItems(next);
      setTotal(res.total || 0);
      const visible = new Set(next.map((row) => String(row.id)));
      setCheckedIds((prev) => {
        const kept = [...prev].filter((id) => visible.has(id));
        return kept.length === prev.size ? prev : new Set(kept);
      });
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load();
  }, [source, severity, q]);

  useEffect(() => {
    if (!selected) return undefined;
    function onKey(event) {
      if (event.key === "Escape") setSelected(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selected]);

  async function openDetail(row) {
    setDetailBusy(true);
    setError("");
    try {
      const res = await api.ownerError(row.id);
      setSelected(res.item || row);
    } catch (err) {
      setError(err.message);
      setSelected(row);
    } finally {
      setDetailBusy(false);
    }
  }

  function toggleChecked(id) {
    const key = String(id);
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleSelectAllVisible() {
    setCheckedIds((prev) => {
      if (!items.length) return prev;
      if (items.every((row) => prev.has(String(row.id)))) {
        const next = new Set(prev);
        for (const row of items) next.delete(String(row.id));
        return next;
      }
      const next = new Set(prev);
      for (const row of items) next.add(String(row.id));
      return next;
    });
  }

  async function onDelete(row) {
    if (!window.confirm(`Delete this error log?\n\n${row.code ? `[${row.code}] ` : ""}${row.message}`)) {
      return;
    }
    setDeleteBusy(true);
    setError("");
    try {
      await api.deleteOwnerError(row.id);
      if (String(selected?.id) === String(row.id)) setSelected(null);
      setCheckedIds((prev) => {
        const key = String(row.id);
        if (!prev.has(key)) return prev;
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteBusy(false);
    }
  }

  async function onDeleteSelected() {
    const ids = [...checkedIds];
    if (!ids.length) return;
    if (!window.confirm(`Delete ${ids.length} selected error log${ids.length === 1 ? "" : "s"}?`)) {
      return;
    }
    setDeleteBusy(true);
    setError("");
    try {
      await api.deleteOwnerErrors(ids);
      if (selected && ids.includes(String(selected.id))) setSelected(null);
      setCheckedIds(new Set());
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteBusy(false);
    }
  }

  return (
    <div className="owner-page owner-page-wide">
      <header className="owner-page-head">
        <div>
          <h1>Error logs</h1>
          <p>
            Application errors from the API, workers, and clients
            {total ? ` · ${total} total` : ""}
          </p>
        </div>
        <div className="owner-head-actions">
          {checkedIds.size > 0 ? (
            <button className="btn" type="button" disabled={deleteBusy || busy} onClick={() => void onDeleteSelected()}>
              {deleteBusy ? "Deleting…" : `Delete selected (${checkedIds.size})`}
            </button>
          ) : null}
          <button className="btn ghost" type="button" disabled={busy || deleteBusy} onClick={() => void load()}>
            Refresh
          </button>
        </div>
      </header>

      {error ? <p className="form-error">{error}</p> : null}

      <div className="owner-filters">
        <label>
          Source
          <select value={source} onChange={(event) => setSource(event.target.value)}>
            <option value="">All</option>
            <option value="api">api</option>
            <option value="client">client</option>
            <option value="worker">worker</option>
          </select>
        </label>
        <label>
          Severity
          <select value={severity} onChange={(event) => setSeverity(event.target.value)}>
            <option value="">All</option>
            <option value="error">error</option>
            <option value="warn">warn</option>
          </select>
        </label>
        <label>
          Search
          <input
            value={qDraft}
            onChange={(event) => setQDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") setQ(qDraft.trim());
            }}
          />
        </label>
        <button className="btn" type="button" disabled={busy} onClick={() => setQ(qDraft.trim())}>
          Search
        </button>
      </div>

      <section className="owner-card owner-card-flush">
        <div className="table-scroll">
          <table className="owner-table">
            <thead>
              <tr>
                <th className="check-col">
                  {items.length > 0 ? (
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = someVisibleSelected;
                      }}
                      onChange={toggleSelectAllVisible}
                      disabled={deleteBusy}
                      aria-label="Select all visible error logs"
                    />
                  ) : null}
                </th>
                <th>When</th>
                <th>Severity</th>
                <th>Source</th>
                <th>Path</th>
                <th>Message</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {busy && !items.length ? (
                <tr>
                  <td colSpan="7">Loading…</td>
                </tr>
              ) : !items.length ? (
                <tr>
                  <td colSpan="7">No error logs yet.</td>
                </tr>
              ) : (
                items.map((row) => (
                  <tr
                    key={row.id}
                    className={`is-clickable${checkedIds.has(String(row.id)) ? " is-selected" : ""}`}
                    onClick={() => void openDetail(row)}
                  >
                    <td className="check-col" onClick={(event) => event.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={checkedIds.has(String(row.id))}
                        onChange={() => toggleChecked(row.id)}
                        disabled={deleteBusy}
                        aria-label={`Select error log ${row.id}`}
                      />
                    </td>
                    <td className="nowrap">{fmt(row.createdAt)}</td>
                    <td>
                      <span className={`chip ${severityClass(row.severity)}`}>{row.severity}</span>
                    </td>
                    <td>{row.source}</td>
                    <td className="cell-clip">
                      {row.method ? `${row.method} ` : ""}
                      {row.path || "—"}
                    </td>
                    <td className="cell-clip">
                      {row.code ? `[${row.code}] ` : ""}
                      {row.message}
                    </td>
                    <td className="owner-row-actions" onClick={(event) => event.stopPropagation()}>
                      <button className="btn ghost" type="button" disabled={deleteBusy} onClick={() => void onDelete(row)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selected ? (
        <div className="owner-drawer-backdrop" onClick={() => setSelected(null)}>
          <aside className="owner-drawer" onClick={(event) => event.stopPropagation()} aria-label="Error detail">
            <header className="owner-drawer-head">
              <h2>Error detail</h2>
              <button className="btn ghost" type="button" onClick={() => setSelected(null)}>
                Close
              </button>
            </header>
            {detailBusy ? <p className="form-note">Loading…</p> : null}
            <p className="form-note">{fmt(selected.createdAt)}</p>
            <div className="owner-chip-row">
              <span className={`chip ${severityClass(selected.severity)}`}>{selected.severity}</span>
              <span className="chip muted">{selected.source}</span>
              {selected.code ? <span className="chip muted">{selected.code}</span> : null}
            </div>
            <p className="owner-pre-wrap">{selected.message}</p>
            <DetailLine label="Path" value={[selected.method, selected.path].filter(Boolean).join(" ")} />
            <DetailLine label="Request ID" value={selected.requestId} />
            <DetailLine label="Tenant" value={selected.tenantId != null ? String(selected.tenantId) : ""} />
            <DetailLine label="User" value={selected.userId != null ? String(selected.userId) : ""} />
            <DetailLine label="ID" value={String(selected.id)} />
            {selected.context ? (
              <>
                <h3>Context</h3>
                <pre className="owner-log">{JSON.stringify(selected.context, null, 2)}</pre>
              </>
            ) : null}
            {selected.stack ? (
              <>
                <h3>Stack</h3>
                <pre className="owner-log">{selected.stack}</pre>
              </>
            ) : null}
            <div className="dialog-actions">
              <button className="btn light-ink" type="button" onClick={() => setSelected(null)}>
                Close
              </button>
              <button className="btn" type="button" disabled={deleteBusy} onClick={() => void onDelete(selected)}>
                {deleteBusy ? "Deleting…" : "Delete"}
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
