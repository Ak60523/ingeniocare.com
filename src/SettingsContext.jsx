import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import { resolvePageSection } from "./pageSections.js";

const SettingsContext = createContext(null);

const IGNORE =
  ".settings-rail, .owner-rail, .design-fab, .growgent-fab, .growgent-fab-panel, .account-menu, a, button, input, textarea, select, label";

function DesignSectionOutline({ node }) {
  const [box, setBox] = useState(null);

  useEffect(() => {
    if (!node) {
      setBox(null);
      return undefined;
    }
    function sync() {
      const rect = node.getBoundingClientRect();
      setBox({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }
    sync();
    window.addEventListener("scroll", sync, true);
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync, true);
      window.removeEventListener("resize", sync);
    };
  }, [node]);

  if (!box) return null;
  return (
    <div
      className="design-target-outline"
      aria-hidden="true"
      style={{
        top: box.top,
        left: box.left,
        width: box.width,
        height: box.height,
      }}
    />
  );
}

function DesignSectionPicker() {
  const { canManageContent } = useAuth();
  const { open, selectSection, clearSection, selectedNode } = useSettings();
  const { pathname } = useLocation();
  const ready = useRef(false);

  useEffect(() => {
    if (!ready.current) {
      ready.current = true;
      return;
    }
    clearSection();
  }, [clearSection, pathname]);

  useEffect(() => {
    if (!open || !canManageContent) return undefined;
    function onClick(event) {
      if (event.target.closest(IGNORE)) return;
      const section = resolvePageSection(event.target);
      if (!section) return;
      selectSection(section);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [canManageContent, open, selectSection]);

  return <DesignSectionOutline node={open ? selectedNode : null} />;
}

export function SettingsProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("colors");
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const clearSection = useCallback(() => {
    setSelectedSection(null);
    setSelectedNode(null);
  }, []);

  const openSettings = useCallback(() => setOpen(true), []);
  const closeSettings = useCallback(() => {
    setOpen(false);
    setSelectedSection(null);
    setSelectedNode(null);
  }, []);
  const toggleSettings = useCallback(() => {
    setOpen((value) => {
      if (value) {
        setSelectedSection(null);
        setSelectedNode(null);
      }
      return !value;
    });
  }, []);

  const selectSection = useCallback((section) => {
    setSelectedSection({
      id: section.id,
      label: section.label,
      colors: section.colors,
      fonts: section.fonts,
    });
    setSelectedNode(section.node);
    setOpen(true);
  }, []);

  const value = useMemo(
    () => ({
      open,
      tab,
      setTab,
      selectedSection,
      selectedNode,
      selectSection,
      clearSection,
      openSettings,
      closeSettings,
      toggleSettings,
    }),
    [clearSection, closeSettings, open, openSettings, selectSection, selectedNode, selectedSection, tab, toggleSettings]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
      <DesignSectionPicker />
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
