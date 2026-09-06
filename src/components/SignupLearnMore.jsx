import { Link } from "react-router-dom";
import { providerSignupHref } from "../data/products.js";

export default function SignupLearnMore({
  learnMoreTo,
  signupHref = providerSignupHref,
  tone = "on-dark",
  spread = false,
}) {
  const learnClass = tone === "on-paper" ? "btn ghost" : "btn light";
  const signup = (
    <a className="btn sky" href={signupHref} target="_blank" rel="noopener noreferrer">
      Sign up
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
