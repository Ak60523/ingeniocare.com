import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../AuthContext.jsx";
import { useSettings } from "../../SettingsContext.jsx";

export default function OwnerSettings() {
  const { canManageTenants, canManageUsers } = useAuth();
  const { openSettings } = useSettings();

  useEffect(() => {
    openSettings();
  }, [openSettings]);

  if (canManageTenants) return <Navigate to="/tenants" replace />;
  if (canManageUsers) return <Navigate to="/users" replace />;
  return <Navigate to="/" replace />;
}
