import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../AuthContext.jsx";
import { isNavActive, technicalItems } from "../consoleNav.js";
import { useSettings } from "../SettingsContext.jsx";
import { roleLabel } from "../roles";
import NavIcon from "./NavIcons.jsx";

function initials(user) {
  const source = user?.name || user?.email || "?";
  const local = String(source).split("@")[0] || source;
  return local.slice(0, 2).toUpperCase();
}

export default function AccountMenu({ variant = "rail", collapsed = false, onNavigate }) {
  const {
    user,
    role,
    memberships,
    tenantId,
    tenantName,
    canManageTenants,
    canManageUsers,
    canManageContent,
    setSession,
    selectTenant,
    signOut,
  } = useAuth();
  const { open: settingsOpen, openSettings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const wrapRef = useRef(null);
  const menuId = useId();

  useEffect(() => {
    function onPointer(event) {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    function onKey(event) {
      if (event.key === "Escape" && !addOpen) setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [addOpen]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  const displayName = user?.name || user?.email?.split("@")[0] || "Account";
  const roleText = roleLabel(role);
  const hasWorkspaces = memberships.length > 0;
  const showWorkspaceMenu = hasWorkspaces || canManageTenants;
  const technical = canManageTenants ? technicalItems : [];
  const hasLinks = canManageUsers || canManageContent || technical.length > 0 || showWorkspaceMenu;

  function go(event) {
    setOpen(false);
    onNavigate?.(event);
  }

  async function createWorkspace(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await api.createTenant(name);
      setSession(data);
      if (data.tenant?.id) selectTenant(data.tenant.id);
      setAddOpen(false);
      setName("");
      navigate("/tenants");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div
        className={`account-menu-wrap is-${variant}${collapsed ? " is-collapsed" : ""}${open ? " is-open" : ""}`}
        ref={wrapRef}
      >
        <button
          className={variant === "header" ? "header-account-btn" : "owner-account-btn"}
          type="button"
          title={variant === "rail" ? undefined : "Account menu"}
          aria-label={
            variant === "rail"
              ? `Account menu, ${displayName}. Role: ${roleText}${tenantName ? `. Workspace: ${tenantName}` : ""}`
              : "Account menu"
          }
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={menuId}
          aria-describedby={variant === "rail" ? `${menuId}-hover` : undefined}
          id={`${menuId}-button`}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="owner-avatar">{initials(user)}</span>
          {variant === "header" ? (
            <span className="header-account-copy">
              <strong>{displayName}</strong>
              <span>{roleText}</span>
            </span>
          ) : null}
          {variant === "rail" && !collapsed ? (
            <span className="owner-account-copy">
              <strong>{displayName}</strong>
            </span>
          ) : null}
        </button>
        {variant === "rail" ? (
          <div className="owner-account-hover" id={`${menuId}-hover`} role="tooltip">
            <div>
              <span>Role</span>
              <b>{roleText}</b>
            </div>
            {tenantName ? (
              <div>
                <span>Workspace</span>
                <b>{tenantName}</b>
              </div>
            ) : null}
          </div>
        ) : null}

        {open ? (
          <div className="account-menu" id={menuId} role="menu" aria-labelledby={`${menuId}-button`}>
            <div className="account-menu-header" role="presentation">
              <div className="account-menu-email">{user?.email || displayName}</div>
              <div className="account-menu-meta">{tenantName ? `${roleText} · ${tenantName}` : roleText}</div>
            </div>

            {showWorkspaceMenu ? (
              <>
                <div className="account-menu-label" role="presentation">
                  Workspace
                </div>
                {hasWorkspaces
                  ? memberships.map((item) => {
                      const selected = String(item.tenantId) === String(tenantId);
                      return (
                        <button
                          key={item.membershipId || item.tenantId}
                          type="button"
                          role="menuitem"
                          className={`account-menu-item${selected ? " is-selected" : ""}`}
                          onClick={() => {
                            selectTenant(item.tenantId);
                            setOpen(false);
                          }}
                        >
                          <span className="account-menu-item-main">
                            <span>{item.tenantName}</span>
                            <span className="account-menu-item-note">{item.role}</span>
                          </span>
                          {selected ? <span aria-hidden="true">✓</span> : null}
                        </button>
                      );
                    })
                  : null}
                {canManageTenants ? (
                  <>
                    <button
                      type="button"
                      role="menuitem"
                      className="account-menu-item"
                      onClick={() => {
                        setOpen(false);
                        setError("");
                        setAddOpen(true);
                      }}
                    >
                      <NavIcon name="plus" />
                      Add workspace
                    </button>
                    <Link
                      role="menuitem"
                      className={`account-menu-item${isNavActive(location.pathname, { to: "/tenants" }) ? " is-selected" : ""}`}
                      to="/tenants"
                      onClick={go}
                    >
                      <NavIcon name="tenants" />
                      Tenants
                    </Link>
                  </>
                ) : null}
                <div className="account-menu-separator" role="separator" />
              </>
            ) : null}

            {canManageUsers ? (
              <Link
                role="menuitem"
                className={`account-menu-item${isNavActive(location.pathname, { to: "/users" }) ? " is-selected" : ""}`}
                to="/users"
                onClick={go}
              >
                <NavIcon name="users" />
                Users
              </Link>
            ) : null}

            {canManageContent ? (
              <button
                type="button"
                role="menuitem"
                className={`account-menu-item${settingsOpen ? " is-selected" : ""}`}
                onClick={() => {
                  setOpen(false);
                  openSettings();
                  onNavigate?.();
                }}
              >
                <NavIcon name="settings" />
                Design
              </button>
            ) : null}

            {technical.length ? (
              <>
                {canManageUsers || canManageContent ? <div className="account-menu-separator" role="separator" /> : null}
                <div className="account-menu-label" role="presentation">
                  Technical
                </div>
                {technical.map((item) => (
                  <Link
                    key={item.to}
                    role="menuitem"
                    className={`account-menu-item${isNavActive(location.pathname, item) ? " is-selected" : ""}`}
                    to={item.to}
                    onClick={go}
                  >
                    <NavIcon name={item.icon} />
                    {item.label}
                  </Link>
                ))}
              </>
            ) : null}

            {hasLinks ? <div className="account-menu-separator" role="separator" /> : null}

            <button type="button" role="menuitem" className="account-menu-item" onClick={signOut}>
              <NavIcon name="logout" />
              Sign out
            </button>
          </div>
        ) : null}
      </div>

      {addOpen
        ? createPortal(
            <div className="dialog-backdrop" onClick={() => !busy && setAddOpen(false)}>
              <form
                className="dialog"
                onClick={(event) => event.stopPropagation()}
                onSubmit={createWorkspace}
              >
                <h3>Add workspace</h3>
                <p className="form-note">
                  Create another workspace you own. You can switch between workspaces from this menu.
                </p>
                <label>
                  Workspace name
                  <input value={name} onChange={(event) => setName(event.target.value)} required autoFocus />
                </label>
                {error ? <p className="form-error">{error}</p> : null}
                <div className="dialog-actions">
                  <button className="btn light-ink" type="button" disabled={busy} onClick={() => setAddOpen(false)}>
                    Cancel
                  </button>
                  <button className="btn" type="submit" disabled={busy || !name.trim()}>
                    {busy ? "Creating…" : "Create"}
                  </button>
                </div>
              </form>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
