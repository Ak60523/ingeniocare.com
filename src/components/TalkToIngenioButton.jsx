import { openReceptionist } from "../utils/openReceptionist.js";

export default function TalkToIngenioButton({ className = "btn sky", children = "Talk to Ingenio" }) {
  return (
    <button type="button" className={className} onClick={openReceptionist}>
      {children}
    </button>
  );
}
