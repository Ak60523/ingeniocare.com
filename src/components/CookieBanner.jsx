import { useState } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(() => !localStorage.getItem("ingenio-cookies"));

  if (!visible) return null;

  return (
    <aside className="cookie show" aria-live="polite">
      <h4>This website uses cookies.</h4>
      <p>
        We use cookies to analyze website traffic and optimize your website experience. By accepting
        our use of cookies, your data will be aggregated with all other user data.
      </p>
      <button
        className="btn"
        type="button"
        onClick={() => {
          localStorage.setItem("ingenio-cookies", "1");
          setVisible(false);
        }}
      >
        Accept
      </button>
    </aside>
  );
}
