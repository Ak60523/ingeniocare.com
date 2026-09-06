import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "./api";
import { DEFAULT_APPEARANCE, applyAppearance, sanitizeAppearance } from "./theme";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [appearance, setAppearance] = useState(DEFAULT_APPEARANCE);

  useEffect(() => {
    applyAppearance(appearance);
  }, [appearance]);

  useEffect(() => {
    api
      .siteSettings()
      .then((data) => setAppearance(sanitizeAppearance(data.appearance)))
      .catch(() => {});
  }, []);

  const value = useMemo(
    () => ({
      appearance,
      preview(next) {
        applyAppearance(next);
      },
      revert() {
        applyAppearance(appearance);
      },
      async save(next) {
        const data = await api.updateSiteSettings(sanitizeAppearance(next));
        const saved = sanitizeAppearance(data.appearance);
        setAppearance(saved);
        return saved;
      },
      async reset() {
        const data = await api.updateSiteSettings(DEFAULT_APPEARANCE);
        const saved = sanitizeAppearance(data.appearance);
        setAppearance(saved);
        return saved;
      },
    }),
    [appearance]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
