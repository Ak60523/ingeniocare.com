import { useEffect } from "react";
import { useAuth } from "../AuthContext.jsx";
import { useSettings } from "../SettingsContext.jsx";
import NavIcon from "./NavIcons.jsx";
import SettingsForm from "./SettingsForm.jsx";

const TABS = [
  { id: "colors", label: "Colors", note: "Click a section on the page, or edit site-wide colors." },
  { id: "fonts", label: "Fonts", note: "Fonts and sizes from header to footer on this page." },
];

export default function SettingsRail() {
  const { canManageContent } = useAuth();
  const { open, closeSettings, tab, setTab, selectedSection, clearSection } = useSettings();
  const active = TABS.find((item) => item.id === tab) || TABS[0];
  const note = selectedSection
    ? `${selectedSection.label}. ${tab === "fonts" ? "Fonts and sizes" : "Colors"} used in this section.`
    : active.note;

  useEffect(() => {
    if (!open) return undefined;
    function onKey(event) {
      if (event.key === "Escape") closeSettings();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeSettings, open]);

  useEffect(() => {
    if (!open || !canManageContent) return undefined;
    document.body.classList.add("settings-rail-open");
    return () => document.body.classList.remove("settings-rail-open");
  }, [canManageContent, open]);

  if (!open || !canManageContent) return null;

  return (
    <div className="settings-rail-root">
      <aside className="settings-rail" role="complementary" aria-labelledby="settings-rail-title">
        <header className="settings-rail-head">
          <div>
            <h2 id="settings-rail-title">Design</h2>
            <p>{note}</p>
          </div>
          <button
            className="settings-rail-close"
            type="button"
            title="Close design"
            aria-label="Close design"
            onClick={closeSettings}
          >
            <NavIcon name="close" />
          </button>
        </header>
        <div className="settings-rail-tabs" role="tablist" aria-label="Design">
          {TABS.map((item) => {
            const selected = item.id === tab;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`design-tab-${item.id}`}
                aria-selected={selected}
                aria-controls={`design-panel-${item.id}`}
                tabIndex={selected ? 0 : -1}
                className={selected ? "is-active" : undefined}
                onClick={() => setTab(item.id)}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <div className="settings-rail-body">
          {selectedSection ? (
            <button className="settings-section-clear" type="button" onClick={clearSection}>
              Show all site styles
            </button>
          ) : null}
          <div
            id={tab === "fonts" ? "design-panel-fonts" : "design-panel-colors"}
            role="tabpanel"
            aria-labelledby={tab === "fonts" ? "design-tab-fonts" : "design-tab-colors"}
          >
            <SettingsForm tab={tab === "fonts" ? "fonts" : "colors"} />
          </div>
        </div>
      </aside>
    </div>
  );
}
