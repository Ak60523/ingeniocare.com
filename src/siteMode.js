import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export function isMedicalGroupHost(hostname = typeof window !== "undefined" ? window.location.hostname : "") {
  return hostname === "ingenio.care" || hostname === "www.ingenio.care";
}

/** On ingenio.care the MG site is at `/`. Elsewhere (local / ingeniocare.com) it lives under `/ingenio`. */
export function medicalGroupBasePath(hostname) {
  return isMedicalGroupHost(hostname) ? "" : "/ingenio";
}

export function useMedicalGroupSite() {
  const { pathname } = useLocation();
  return useMemo(() => {
    if (isMedicalGroupHost()) return true;
    return pathname === "/ingenio" || pathname.startsWith("/ingenio/");
  }, [pathname]);
}

export function useMedicalGroupBasePath() {
  return useMemo(() => medicalGroupBasePath(), []);
}

/** Build an MG-internal path (`/care` on ingenio.care, `/ingenio/care` elsewhere). */
export function useMgPath() {
  const base = useMedicalGroupBasePath();
  return useMemo(() => {
    const root = base.replace(/\/$/, "");
    return (segment = "") => {
      if (!segment) return root || "/";
      return `${root}/${String(segment).replace(/^\//, "")}`;
    };
  }, [base]);
}
