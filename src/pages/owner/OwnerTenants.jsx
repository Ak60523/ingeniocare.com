import { useEffect, useState } from "react";
import { api } from "../../api";
import { useAuth } from "../../AuthContext.jsx";

const fields = [
  ["name", "Workspace name"],
  ["slug", "Slug"],
  ["brandName", "Brand name"],
  ["supportEmail", "Support email"],
  ["supportPhone", "Support phone"],
];

export default function OwnerTenants() {
  const { canManageTenants, setSession, selectTenant } = useAuth();
  const [tenants, setTenants] = useState([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [drafts, setDrafts] = useState({});
  const [openId, setOpenId] = useState("");

  async function load() {
    try {
      const data = await api.tenants();
      setTenants(data.tenants || []);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function draftFor(tenant) {
    return drafts[tenant.id] || tenant;
  }

  async function save(tenant) {
    setBusyId(tenant.id);
    try {
      const data = await api.updateTenant(tenant.id, draftFor(tenant));
      setTenants((current) => current.map((item) => (item.id === tenant.id ? data.tenant : item)));
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId("");
    }
  }

  async function addWorkspace(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    setBusyId("new");
    try {
      const data = await api.createTenant(String(form.get("name") || ""));
      setSession(data);
      if (data.tenant?.id) selectTenant(data.tenant.id);
      event.target.reset();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="owner-page">
      <header className="owner-page-head">
        <div>
          <h1>Tenants</h1>
          <p>Owner manages every workspace. Switch, edit, and add tenants from here.</p>
        </div>
      </header>

      {error ? <p className="form-error">{error}</p> : null}

      {canManageTenants ? (
        <form className="owner-card owner-inline-form" onSubmit={addWorkspace}>
          <label>
            New workspace
            <input name="name" placeholder="e.g. Oak Brook Clinic" required />
          </label>
          <button className="btn" type="submit" disabled={busyId === "new"}>
            {busyId === "new" ? "Creating…" : "Add workspace"}
          </button>
        </form>
      ) : null}

      <div className="owner-card">
        <table className="owner-table">
          <thead>
            <tr>
              <th>Workspace</th>
              <th>Slug</th>
              <th>Support</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => {
              const draft = draftFor(tenant);
              const open = String(openId) === String(tenant.id);
              return (
                <tr key={tenant.id}>
                  <td>
                    <strong>{tenant.name}</strong>
                    {tenant.brandName && tenant.brandName !== tenant.name ? (
                      <div className="form-note">{tenant.brandName}</div>
                    ) : null}
                  </td>
                  <td>{tenant.slug || "—"}</td>
                  <td>{tenant.supportEmail || tenant.supportPhone || "—"}</td>
                  <td>
                    <button className="btn ghost" type="button" onClick={() => setOpenId(open ? "" : tenant.id)}>
                      {open ? "Close" : "Edit"}
                    </button>
                    {open ? (
                      <div className="owner-edit-grid">
                        {fields.map(([key, label]) => (
                          <label key={key}>
                            {label}
                            <input
                              value={draft[key] || ""}
                              disabled={!canManageTenants}
                              onChange={(event) =>
                                setDrafts((current) => ({
                                  ...current,
                                  [tenant.id]: { ...draft, [key]: event.target.value },
                                }))
                              }
                            />
                          </label>
                        ))}
                        {canManageTenants ? (
                          <button className="btn" type="button" disabled={busyId === tenant.id} onClick={() => save(tenant)}>
                            {busyId === tenant.id ? "Saving…" : "Save"}
                          </button>
                        ) : null}
                      </div>
                    ) : null}
                  </td>
                </tr>
              );
            })}
            {!tenants.length ? (
              <tr>
                <td colSpan="4">No workspaces yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
