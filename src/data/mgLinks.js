export const patientAppHref = "https://patient.ingeniocare.ai";
export const patientLoginHref = `${patientAppHref}/home/patient?login=1`;
export const patientJoinHref = `${patientAppHref}/home/patient?join=1`;
export const providerAppHref = "https://provider.ingeniocare.ai";
export const planAppHref = "https://plan.ingeniocare.ai";
export const platformHref = "https://ingeniocare.ai";
/** Live network: find a provider and connect. The medical group itself is not open yet. */
export const findProvidersHref = "https://ingeniocare.ai/home";
export const providerInquiryHref =
  "mailto:hello@ingenio.care?subject=Joining%20Ingenio%20Medical%20Group";

export function chronicReferralPath(base = "/ingenio") {
  const root = base.replace(/\/$/, "");
  return `${root}/refer/chronic`;
}

export function specialtyReferralPath(base = "/ingenio") {
  const root = base.replace(/\/$/, "");
  return `${root}/refer/specialty`;
}

/** Patient app program ids stay medicare-access / ccm until the app renames them. */
export const chronicReferralHref =
  `${patientAppHref}/home/patient?referral=medicare-access&program=medicare-access`;
export const specialtyReferralHref =
  `${patientAppHref}/home/patient?referral=ccm&program=ccm`;
