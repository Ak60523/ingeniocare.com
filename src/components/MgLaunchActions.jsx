import { findProvidersHref, providerInquiryHref } from "../data/mgLinks.js";

export default function MgLaunchActions({ className = "mg-hero-actions" }) {
  return (
    <div className={className}>
      <a className="btn sky" href={findProvidersHref} target="_blank" rel="noopener noreferrer">
        Find a provider
      </a>
      <a className="btn light" href={providerInquiryHref}>
        Inquire about joining
      </a>
    </div>
  );
}
