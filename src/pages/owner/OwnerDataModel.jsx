import { useEffect, useState } from "react";
import { api } from "../../api";

function cellValue(value) {
  if (value == null) return "—";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  const text = String(value);
  return text.length > 80 ? `${text.slice(0, 80)}…` : text;
}

export default function OwnerDataModel() {
  const [tables, setTables] = useState([]);
  const [selected, setSelected] = useState("");
  const [tab, setTab] = useState("data");
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const meta = tables.find((table) => table.name === selected) || null;

  useEffect(() => {
    api
      .dataModel()
      .then((data) => {
        setTables(data.tables || []);
        if (data.tables?.[0]) setSelected(data.tables[0].name);
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setBusy(true);
    setError("");
    api
      .dataModelRows(selected, offset)
      .then((data) => {
        setRows(data.rows || []);
        setTotal(data.total || 0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setBusy(false));
  }, [offset, selected]);

  const columns = meta?.columns?.map((col) => col.name) || (rows[0] ? Object.keys(rows[0]) : []);

  return (
    <div className="owner-page owner-page-wide">
      <header className="owner-page-head">
        <div>
          <h1>Data Model</h1>
          <p>Explore Postgres tables, columns, and live rows. Secrets stay redacted.</p>
        </div>
      </header>

      {error ? <p className="form-error">{error}</p> : null}

      <div className="data-model">
        <aside className="owner-card data-model-nav">
          <h2>Tables</h2>
          <ul className="data-model-list">
            {tables.map((table) => (
              <li key={table.name}>
                <button
                  type="button"
                  className={table.name === selected ? "is-active" : undefined}
                  onClick={() => {
                    setSelected(table.name);
                    setOffset(0);
                    setTab("data");
                  }}
                >
                  <strong>{table.label}</strong>
                  <span>
                    {table.name} · {table.rowCount}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div>
          {meta ? (
            <>
              <section className="owner-card">
                <h2>{meta.label}</h2>
                <p className="form-note">{meta.description}</p>
                <p>
                  <span className="chip">{meta.name}</span>{" "}
                  <span className="chip muted">{total} rows</span>
                </p>
                <div className="data-model-tabs">
                  {["data", "schema"].map((id) => (
                    <button
                      key={id}
                      type="button"
                      className={tab === id ? "is-active" : undefined}
                      onClick={() => setTab(id)}
                    >
                      {id === "data" ? "Data" : "Schema"}
                    </button>
                  ))}
                </div>
              </section>

              {tab === "schema" ? (
                <section className="owner-card">
                  <table className="owner-table">
                    <thead>
                      <tr>
                        <th>Column</th>
                        <th>Type</th>
                        <th>Nullable</th>
                      </tr>
                    </thead>
                    <tbody>
                      {meta.columns.map((col) => (
                        <tr key={col.name}>
                          <td>
                            {col.name}
                            {col.secret ? " (redacted)" : ""}
                          </td>
                          <td>{col.type}</td>
                          <td>{col.nullable ? "yes" : "no"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              ) : (
                <section className="owner-card">
                  {busy ? <p className="form-note">Loading rows…</p> : null}
                  <div className="table-scroll">
                    <table className="owner-table">
                      <thead>
                        <tr>
                          {columns.map((col) => (
                            <th key={col}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, index) => (
                          <tr key={row.id || index}>
                            {columns.map((col) => (
                              <td key={col}>{cellValue(row[col])}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="owner-row-actions">
                    <button
                      className="btn ghost"
                      type="button"
                      disabled={offset === 0}
                      onClick={() => setOffset(Math.max(0, offset - 25))}
                    >
                      Previous
                    </button>
                    <button
                      className="btn ghost"
                      type="button"
                      disabled={offset + 25 >= total}
                      onClick={() => setOffset(offset + 25)}
                    >
                      Next
                    </button>
                    <span className="form-note">
                      {total ? `${offset + 1}–${Math.min(offset + 25, total)} of ${total}` : "0 rows"}
                    </span>
                  </div>
                </section>
              )}
            </>
          ) : (
            <section className="owner-card">
              <p className="form-note">Select a table.</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
