import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "./api";
import { canManageContent, canManageTenants, canManageUsers, normalizeAppRole } from "./roles";

const AuthContext = createContext(null);

function applySession(data, setUser, setMemberships, setTenantId) {
  const nextUser = data.user || null;
  if (nextUser) nextUser.role = normalizeAppRole(nextUser.role);
  setUser(nextUser);
  setMemberships(data.memberships || []);
  const tenantId = data.tenantId || data.memberships?.[0]?.tenantId || null;
  if (tenantId) localStorage.setItem("ingenio-tenant", String(tenantId));
  setTenantId(tenantId ? String(tenantId) : null);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [tenantId, setTenantId] = useState(() => localStorage.getItem("ingenio-tenant"));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("ingenio-token");
    if (!token) {
      setReady(true);
      return;
    }
    api
      .me()
      .then((data) => applySession(data, setUser, setMemberships, setTenantId))
      .catch(() => {
        localStorage.removeItem("ingenio-token");
        localStorage.removeItem("ingenio-tenant");
        setUser(null);
        setMemberships([]);
        setTenantId(null);
      })
      .finally(() => setReady(true));
  }, []);

  const value = useMemo(() => {
    const role = normalizeAppRole(user?.role);
    const active = memberships.find((item) => String(item.tenantId) === String(tenantId)) || memberships[0] || null;
    return {
      user,
      ready,
      role,
      memberships,
      tenantId: active?.tenantId || tenantId,
      tenantRole: active?.role || null,
      tenantName: active?.tenantName || null,
      canManageTenants: canManageTenants(role),
      canManageUsers: canManageUsers(role),
      canManageContent: canManageContent(role),
      setSession(data) {
        if (data.token) localStorage.setItem("ingenio-token", data.token);
        applySession(data, setUser, setMemberships, setTenantId);
      },
      selectTenant(id) {
        localStorage.setItem("ingenio-tenant", String(id));
        setTenantId(String(id));
      },
      signOut() {
        localStorage.removeItem("ingenio-token");
        localStorage.removeItem("ingenio-tenant");
        setUser(null);
        setMemberships([]);
        setTenantId(null);
      },
    };
  }, [memberships, ready, tenantId, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
