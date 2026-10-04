export const patientAppHref = "https://patient.ingeniocare.ai";
export const providerAppHref = "https://provider.ingeniocare.ai";
export const planAppHref = "https://plan.ingeniocare.ai";
export const platformHref = "https://ingeniocare.ai";

export function medicareAccessReferralPath(base = "/ingenio") {
  const root = base.replace(/\/$/, "");
  return `${root}/refer/medicare-access`;
}

export function ccmReferralPath(base = "/ingenio") {
  const root = base.replace(/\/$/, "");
  return `${root}/refer/ccm`;
}

/** Patient referral / enrollment into MG programs (patient app entry). */
export const medicareAccessReferralHref =
  `${patientAppHref}/home/patient?referral=medicare-access&program=medicare-access`;
export const ccmReferralHref =
  `${patientAppHref}/home/patient?referral=ccm&program=ccm`;
