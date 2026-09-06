import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function RequireRole({ allow, children }) {
  const { user, ready, role } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <section className="section">
        <div className="wrap">
          <p>Loading…</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return <Navigate to="/m/account" replace state={{ from: location.pathname }} />;
  }

  if (allow && !allow(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
