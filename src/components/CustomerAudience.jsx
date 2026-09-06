import { Link } from "react-router-dom";
import SignupLearnMore from "./SignupLearnMore.jsx";
import { networkSignupHref } from "../data/products.js";
import { hubSegments, segmentHref } from "../data/segments.js";

export default function CustomerAudience() {
  return (
    <div className="grid-cards customer-audience">
      {hubSegments.map((segment) => {
        const pageHref = segmentHref(segment);
        return (
          <article className="card is-compact" key={segment.id}>
            <Link className="customer-audience-media" to={pageHref}>
              <img src={segment.hubImage || segment.image} alt="" />
            </Link>
            <div className="card-body">
              <h4>
                <Link to={pageHref}>{segment.hubTitle || segment.title}</Link>
              </h4>
              <p>{segment.hubSummary || segment.lede}</p>
              <ul>
                {segment.points.slice(0, 4).map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <SignupLearnMore
                learnMoreTo={pageHref}
                signupHref={networkSignupHref(segment.id)}
                spread
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}
