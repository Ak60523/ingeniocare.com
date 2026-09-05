import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("ingenio-token");
    if (!token) return;
    api
      .me()
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem("ingenio-token");
        setUser(null);
      });
  }, []);

  const value = useMemo(
    () => ({
      user,
      setSession(nextUser, token) {
        localStorage.setItem("ingenio-token", token);
        setUser(nextUser);
      },
      signOut() {
        localStorage.removeItem("ingenio-token");
        setUser(null);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
