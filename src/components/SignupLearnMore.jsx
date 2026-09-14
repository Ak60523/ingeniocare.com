import { Link } from "react-router-dom";
import { providerSignupHref } from "../data/products.js";
import TalkToIngenioButton from "./TalkToIngenioButton.jsx";

export default function SignupLearnMore({
  learnMoreTo,
  signupHref = providerSignupHref,
  signupLabel = "Sign up",
  openReceptionist = false,
  tone = "on-dark",
  spread = false,
}) {
  const learnClass = tone === "on-paper" ? "btn ghost" : "btn light";
  const external = /^https?:\/\//i.test(signupHref);
  const signup = openReceptionist ? (
    <TalkToIngenioButton>{signupLabel}</TalkToIngenioButton>
  ) : (
    <a
      className="btn sky"
      href={signupHref}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {signupLabel}
    </a>
  );
  const learnMore = learnMoreTo ? (
    <Link className={learnClass} to={learnMoreTo}>
      Learn more
    </Link>
  ) : null;

  return (
    <div className={spread ? "home-hero-actions is-spread" : "home-hero-actions"}>
      {spread ? learnMore : signup}
      {spread ? signup : learnMore}
    </div>
  );
}
