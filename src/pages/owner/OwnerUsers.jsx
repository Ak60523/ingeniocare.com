import { useEffect, useState } from "react";
import { api } from "../../api";
import { useAuth } from "../../AuthContext.jsx";
import { canManageMember, roleLabel } from "../../roles";

export default function OwnerUsers() {
  const { user, role, tenantId, tenantName, tenantRole, memberships, selectTenant } = useAuth();
  const actorRole = tenantRole === "owner" || role === "owner" ? "owner" : role;
  const [members, setMembers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    if (!tenantId) return;
    try {
      const data = await api.members(tenantId);
      setMembers(data.members || []);
      setInvites(data.invites || []);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, [tenantId]);

  async function onInvite(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    setBusy(true);
    try {
      const data = await api.inviteMember(tenantId, {
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        role: form.get("role"),
      });
      setNotice(data.inviteUrl ? `Invite created: ${data.inviteUrl}` : "Invite created");
      setInviteOpen(false);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function saveEdit(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    setBusy(true);
    try {
      await api.updateMember(editing.membershipId, {
        name: form.get("name"),
        phone: form.get("phone"),
        role: form.get("role"),
      });
      setNotice("User updated");
      setEditing(null);
      await load();
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
          <h1>Users</h1>
          <p>Invite workspace members and manage name, phone, and role — same owner workflow as Scriptive.</p>
        </div>
        {memberships.length > 1 ? (
          <label>
            Workspace
            <select value={tenantId || ""} onChange={(event) => selectTenant(event.target.value)}>
              {memberships.map((item) => (
                <option key={item.membershipId} value={item.tenantId}>
                  {item.tenantName}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </header>

      {error ? <p className="form-error">{error}</p> : null}
      {notice ? <p className="owner-notice">{notice}</p> : null}

      <section className="owner-card">
        <div className="owner-card-head">
          <h2>Workspace users</h2>
          <span className="form-note">{tenantName || "Current workspace"}</span>
        </div>
        <table className="owner-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {members.map((member) => {
              const manageable = canManageMember(actorRole, member.role);
              return (
                <tr key={member.membershipId}>
                  <td>{member.name || "—"}</td>
                  <td>{member.email}</td>
                  <td>{member.phone || "—"}</td>
                  <td>{roleLabel(member.role)}</td>
                  <td>
                    <span className={`chip ${member.status === "active" ? "ok" : "muted"}`}>{member.status}</span>
                  </td>
                  <td className="owner-row-actions">
                    {manageable ? (
                      <>
                        <button
                          className="btn ghost"
                          type="button"
                          disabled={String(member.userId) === String(user.id)}
                          onClick={() =>
                            api
                              .updateMember(member.membershipId, {
                                status: member.status === "active" ? "inactive" : "active",
                              })
                              .then(load)
                              .catch((err) => setError(err.message))
                          }
                        >
                          {member.status === "active" ? "Deactivate" : "Activate"}
                        </button>
                        <button className="btn ghost" type="button" onClick={() => setEditing(member)}>
                          Edit
                        </button>
                        <button
                          className="btn ghost"
                          type="button"
                          onClick={() => {
                            const password = window.prompt(`New password for ${member.email}`);
                            if (!password) return;
                            api
                              .resetMemberPassword(member.membershipId, password)
                              .then(() => setNotice("Password updated"))
                              .catch((err) => setError(err.message));
                          }}
                        >
                          Reset
                        </button>
                      </>
                    ) : null}
                  </td>
                </tr>
              );
            })}
            {!members.length ? (
              <tr>
                <td colSpan="6">No users yet</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>

      <section className="owner-card">
        <div className="owner-card-head">
          <h2>Pending invites</h2>
          <button className="btn" type="button" onClick={() => setInviteOpen(true)}>
            + Add
          </button>
        </div>
        <table className="owner-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Expires</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {invites.map((invite) => (
              <tr key={invite.id}>
                <td>{invite.name || "—"}</td>
                <td>{invite.email}</td>
                <td>{invite.phone || "—"}</td>
                <td>{roleLabel(invite.role)}</td>
                <td>{invite.expiresAt ? new Date(invite.expiresAt).toLocaleDateString() : "—"}</td>
                <td className="owner-row-actions">
                  <button
                    className="btn ghost"
                    type="button"
                    onClick={() =>
                      api
                        .resendInvite(invite.id)
                        .then((data) => setNotice(data.inviteUrl ? `Invite resent: ${data.inviteUrl}` : "Invite resent"))
                        .catch((err) => setError(err.message))
                    }
                  >
                    Resend
                  </button>
                  <button
                    className="btn ghost"
                    type="button"
                    onClick={() =>
                      api
                        .revokeInvite(invite.id)
                        .then(load)
                        .catch((err) => setError(err.message))
                    }
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
            {!invites.length ? (
              <tr>
                <td colSpan="6">No pending invites</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>

      {inviteOpen ? (
        <div className="dialog-backdrop" onClick={() => !busy && setInviteOpen(false)}>
          <form className="dialog" onClick={(event) => event.stopPropagation()} onSubmit={onInvite}>
            <h3>Invite user</h3>
            <label>
              Name
              <input name="name" />
            </label>
            <label>
              Email
              <input name="email" type="email" required />
            </label>
            <label>
              Phone
              <input name="phone" />
            </label>
            <label>
              Role
              <select name="role" defaultValue="member">
                {actorRole === "owner" ? <option value="owner">owner</option> : null}
                <option value="admin">admin</option>
                <option value="member">member</option>
              </select>
            </label>
            <div className="dialog-actions">
              <button className="btn light-ink" type="button" onClick={() => setInviteOpen(false)}>
                Cancel
              </button>
              <button className="btn" type="submit" disabled={busy}>
                {busy ? "Sending…" : "Invite"}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {editing ? (
        <div className="dialog-backdrop" onClick={() => !busy && setEditing(null)}>
          <form className="dialog" onClick={(event) => event.stopPropagation()} onSubmit={saveEdit}>
            <h3>Edit user</h3>
            <label>
              Name
              <input name="name" defaultValue={editing.name || ""} />
            </label>
            <label>
              Phone
              <input name="phone" defaultValue={editing.phone || ""} />
            </label>
            <label>
              Role
              <select name="role" defaultValue={editing.role}>
                {actorRole === "owner" ? <option value="owner">owner</option> : null}
                <option value="admin">admin</option>
                <option value="member">member</option>
              </select>
            </label>
            <div className="dialog-actions">
              <button className="btn light-ink" type="button" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button className="btn" type="submit" disabled={busy}>
                {busy ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
