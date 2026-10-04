import MgHero from "../../components/MgHero.jsx";
import TalkToIngenioButton from "../../components/TalkToIngenioButton.jsx";
import { usePageMeta } from "../../hooks/usePageMeta.js";

export default function MgContact() {
  usePageMeta({
    title: "Contact | Ingenio Medical Group",
    description: "Connect with Ingenio Medical Group via web text or phone — 24/7.",
  });

  return (
    <MgHero
      fill
      className="is-contact"
      icon="contact"
      title="Contact us"
      lede="Connect via web text or phone — 24/7."
      image="/assets/images/customers-hero.jpg"
      mediaActions={<TalkToIngenioButton className="btn sky">Connect Now</TalkToIngenioButton>}
      actions={
        <p className="mg-contact-details">
          <a href="mailto:hello@ingenio.care">hello@ingenio.care</a>
          <span aria-hidden="true"> · </span>
          <a href="tel:+16306570303">+1.630.657.0303</a>
          <br />
          <span>1900 S Highland Ave, Suite 105, Lombard, IL 60148</span>
        </p>
      }
    />
  );
}
