export function openReceptionist() {
  const api = typeof window !== "undefined" ? window.GrowgentFrontdeskFab : null;
  if (api && typeof api.open === "function") {
    api.open();
    return;
  }
  const fab = document.getElementById("growgent-frontdesk-fab")?.shadowRoot?.querySelector("button.fab");
  fab?.click();
}
