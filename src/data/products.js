export const products = [
  {
    id: "patient-app",
    slug: "patient-app",
    label: "Patient App",
    title: "Patient App",
    kicker: "Conversational AI, pricing transparency, and a digital health pass",
    lede: "The Patient App gives people a conversational AI assistant, clear pricing, a digital health pass, and data sharing—aligned with CMS innovation—so they can access care and stay on the plan between visits.",
    intro:
      "Patients can find the right provider, see what care is likely to cost, and stay engaged after a visit. A conversational AI assistant is the front door: it answers questions, points to next steps, and keeps the journey moving without adding work for care teams.",
    body:
      "The app carries a digital health pass so history, referrals, and follow-up travel with the patient instead of restarting at every handoff. Data sharing keeps the care team on the same record. Design is kept in close alignment with CMS innovation so navigation, transparency, and post-discharge follow-up fit how programs actually pay for access and quality. Family contacts can see the same window of care, so home-based and post-acute follow-up does not restart from voicemail.",
    points: [
      "Conversational AI assistant for questions, navigation, and next steps.",
      "Care on demand / virtual visit with in-network clinicians.",
      "Pricing transparency before the patient chooses a site of care.",
      "Digital health pass that carries history, referrals, and follow-up.",
      "Data sharing so patients and care teams see the same record.",
      "Close alignment with CMS innovation models and programs.",
      "Post-discharge support so the plan continues after the hospital or clinic visit.",
    ],
    metrics: [
      { label: "Access to care", direction: "up" },
      { label: "Care-plan follow-through", direction: "up" },
      { label: "Time to next visit", direction: "down" },
      { label: "Missed follow-up", direction: "down" },
    ],
    useCases: [
      {
        title: "Finish the next step after imaging",
        body: "A patient leaves radiology without a booked follow-up. The Patient App shows the open slot, the referral status, and a reminder—so the visit happens the same week instead of restarting months later.",
      },
      {
        title: "Stay on the plan after a procedure",
        body: "Discharge tasks—wound check, PT, and the surgeon follow-up—live on one timeline. Patients complete the sequence without calling the clinic to ask what to do next.",
      },
      {
        title: "Keep family in the loop at home",
        body: "A designated contact sees the visit window and who to reach. Coordinators stop rebuilding the schedule from voicemail, and the patient stays on service through the first week.",
      },
    ],
  },
  {
    id: "provider-app",
    slug: "provider-app",
    label: "Provider App",
    title: "Provider App",
    kicker: "Referrals, visibility, and care-team collaboration",
    lede: "The Provider App gives clinicians the referrals, patient context, and communication they need to deliver care across the journey.",
    intro:
      "Participating providers can receive inbound demand, coordinate outbound referrals, and see more of the patient’s path—without adding administrative burden.",
    body:
      "A large share of clinic time is spent on intake, phone tag, and status checks that do not change the clinical decision. The Provider App puts inbound referrals, outbound coordination, and care-team visibility on the same thread so follow-up does not disappear between locations. Practices can fill unused sessions with patients who already need care, and referring clinicians can see that home visits, specialty consults, and the next step actually happened.",
    points: [
      "Receive real-time referrals and connect with patients who need care.",
      "Fill open sessions with inbound network demand.",
      "Coordinate inbound and outbound referrals with less friction.",
      "Share visibility with care teams so follow-up does not fall through.",
      "Seamless intake with eligibility, authorization, referrals, and medical necessity.",
      "AI documentation and coding.",
      "Pricing transparency in-network, at the point of care.",
      "Integrated Medicare access, CCM, and RPM.",
    ],
    metrics: [
      { label: "Completed inbound referrals", direction: "up" },
      { label: "Care-team visibility", direction: "up" },
      { label: "Referral leakage", direction: "down" },
      { label: "Administrative burden", direction: "down" },
    ],
    useCases: [
      {
        title: "Fill open clinic sessions with inbound demand",
        body: "A participating practice sees real-time referrals from the network and books patients who already need care, instead of leaving afternoon capacity idle.",
      },
      {
        title: "Keep referring and receiving teams aligned",
        body: "The outbound referral includes context, and the receiving clinician sends the plan back. Follow-up does not disappear between locations.",
      },
      {
        title: "Close the loop with home-based care",
        body: "A PCP can see that home visits actually happened. Referrals return to the agency, and staff spend less time on “status please” calls.",
      },
    ],
  },
  {
    id: "plan-app",
    slug: "plan-app",
    label: "Plan App",
    title: "Plan App",
    kicker: "Help members use the right benefits and providers",
    lede: "The Plan App helps health-plan members navigate benefits, access appropriate care, and stay connected to the programs available to them.",
    intro:
      "Health plans can give members a clearer path to in-network care while improving utilization and reducing the cost of coordinating benefits and follow-up.",
    body:
      "Members often know they have coverage, but not who is open this week or how to use a program they already pay for. The Plan App pairs benefits with bookable in-network options so the first interaction becomes a visit instead of a directory hunt. Care managers can point to a next step patients can complete, which keeps specialty and primary care inside the network and trims the call-queue work of repeating the same instructions.",
    points: [
      "Help members understand benefits and find in-network options.",
      "Direct patients toward appropriate resources and available capacity.",
      "Pricing transparency so members see cost before they choose care.",
      "Patient navigation to the right in-network provider at the right time.",
      "Bill checking so charges can be reviewed before they are paid.",
      "Population health and MLR support to keep members in coordinated care.",
      "Support care-gap closure and continuity after the encounter.",
      "Reduce avoidable administrative work for plans and providers.",
    ],
    metrics: [
      { label: "In-network utilization", direction: "up" },
      { label: "Program engagement", direction: "up" },
      { label: "Out-of-network leakage", direction: "down" },
      { label: "Cost of coordination", direction: "down" },
    ],
    useCases: [
      {
        title: "Members book in-network care they already have",
        body: "A member knows they have coverage but not who is open this week. The Plan App pairs benefits with available in-network clinicians so the first call becomes a booked visit.",
      },
      {
        title: "Employees use the plan instead of the ER",
        body: "Self-funded staff see open in-network capacity from the same place they check benefits. Non-emergent issues stop defaulting to urgent care and out-of-network specialists.",
      },
      {
        title: "Care managers close gaps without repeating directories",
        body: "Program outreach points to a bookable next step. Care-gap work moves off paper lists and into a path the member can actually complete.",
      },
    ],
  },
  {
    id: "growgent-ai",
    slug: "growgent-ai",
    label: "Growgent.ai",
    title: "Growgent.ai",
    kicker: "AI growth engine for clinics and small businesses",
    href: "https://growgent.ai",
    hrefLabel: "Visit Growgent.ai",
    lede: "Growgent.ai is an AI voice-agent and growth platform that answers inquiries, books appointments, and helps organizations reach patients and customers around the clock.",
    intro:
      "Built for clinics, pharmacies, and other high-volume service organizations, Growgent.ai combines an AI receptionist with marketing and outreach agents so teams can respond faster, miss fewer calls, and fill available capacity.",
    body:
      "Phones that go unanswered at lunch, overnight, or during overflow are missed visits—not a lack of demand. Growgent.ai answers inquiries 24/7, books the appointment, and captures why the person called so the morning panel is already full. Outreach agents can offer unused sessions back to patients who missed a screening or follow-up, which fills capacity without adding front-desk headcount and works alongside the Ingenio Care network.",
    points: [
      "AI Receptionist handles phone and web inquiries 24/7, answers routine questions, and books appointments.",
      "AI Marketer and Promoter support targeted outreach, re-engagement, and filling open capacity.",
      "Operator dashboards help route people to the right point of service without a large call center.",
      "Works alongside the Ingenio Care network to improve access and reduce front-desk burden.",
    ],
    metrics: [
      { label: "Appointments booked", direction: "up" },
      { label: "After-hours capture", direction: "up" },
      { label: "Missed calls", direction: "down" },
      { label: "Front-desk load", direction: "down" },
    ],
    useCases: [
      {
        title: "After-hours calls still become visits",
        body: "A clinic’s phones go unanswered at night and over lunch. The AI receptionist books the appointment and captures the reason for visit so the morning panel is already full.",
      },
      {
        title: "Overflow does not bounce to voicemail",
        body: "When the front desk is at capacity, web and phone inquiries still get an answer, a scheduled slot, and routing to the right service line.",
      },
      {
        title: "Fill unused sessions with outreach",
        body: "Open capacity is offered back to patients who missed a visit or screening. The marketer and promoter agents re-engage people without adding headcount.",
      },
    ],
  },
  {
    id: "marketplace",
    slug: "marketplace",
    label: "Marketplace",
    title: "Marketplace",
    kicker: "Match patients with available care in the network",
    lede: "The Ingenio Care Marketplace connects demand with available provider capacity so patients can reach the right service at the right time.",
    intro:
      "Instead of leaving patients to navigate a fragmented directory, the Marketplace makes in-network care visible and bookable—helping organizations keep care coordinated and utilization inside the network.",
    body:
      "Capacity is often sitting unused while patients and referring clinics hunt by phone. The Marketplace surfaces providers, services, and open sessions so the next step is a real appointment, not another callback. Health systems keep specialty referrals in-system, plans offer a bookable in-network option on the first call, and self-funded groups finally use contracted clinic time employees could not find on their own.",
    points: [
      "Surface available providers, services, and appointment capacity in one place.",
      "Help patients and referring clinicians find the right next step without extra phone tag.",
      "Keep referrals and follow-up inside a coordinated care network.",
      "Improve utilization by matching need with unused or underused capacity.",
    ],
    metrics: [
      { label: "Capacity filled", direction: "up" },
      { label: "In-network matching", direction: "up" },
      { label: "Time to appointment", direction: "down" },
      { label: "Out-of-network use", direction: "down" },
    ],
    useCases: [
      {
        title: "Keep specialty referrals inside the system",
        body: "Referring clinics see which in-system sessions are actually open. Orthopedics and cardiology stop leaking because the next available visit is visible, not sitting on a fax.",
      },
      {
        title: "Unused specialist slots become the first answer",
        body: "Customer service offers a bookable in-network option on the first call. “Couldn’t get an appointment” exceptions drop because capacity was never the real constraint.",
      },
      {
        title: "Employees find contracted care they already pay for",
        body: "A self-funded group had unused clinic time employees never found. The Marketplace lists same-week openings so utilization moves into the contracted network.",
      },
    ],
  },
  {
    id: "digital-front-doors",
    slug: "digital-front-doors",
    label: "Digital Front Doors - Specialty Care",
    title: "Digital Front Doors — Specialty Care",
    kicker: "A faster path from need to the right specialist",
    lede: "Digital Front Doors for specialty care help patients and referring clinicians reach the right specialist, with less delay and less administrative back-and-forth.",
    intro:
      "Specialty access is often the slowest step in the journey. Ingenio Care’s digital front door routes patients to available specialty capacity, coordinates the referral, and keeps both sides informed until care is delivered.",
    body:
      "A long hold, an incomplete packet, or a missing insurance check is how specialty demand leaks to a competitor or the ER. The digital front door collects reason for referral, coverage, and site preference, then offers the next available session so patients leave with a time—not another callback. Home-health and facility teams can route a new specialty need from the existing record, which keeps the patient on the current plan instead of starting over.",
    points: [
      "Give patients a clear entry point for specialty needs.",
      "Route referrals to the right specialist with available capacity.",
      "Reduce wait time, leakage, and incomplete referral packets.",
      "Keep specialty care connected to the broader care plan and follow-up.",
    ],
    metrics: [
      { label: "Specialty access", direction: "up" },
      { label: "Complete referrals", direction: "up" },
      { label: "Wait time", direction: "down" },
      { label: "Referral leakage", direction: "down" },
    ],
    useCases: [
      {
        title: "Get into specialty care without the hold time",
        body: "A GI line that used to mean a long wait collects reason for referral, coverage, and site preference, then offers the next session. Patients leave with a real time, not another callback.",
      },
      {
        title: "Route a new need from home health",
        body: "A wound specialist is needed mid-episode. The digital front door reuses the existing record and books the consult so the patient stays on the home-health plan instead of the ER.",
      },
      {
        title: "Answer after-hours facility questions on site",
        body: "Overnight staff connect to an available clinician with chart context. Avoidable transfers fall, and families see a documented next step instead of a surprise hospital trip.",
      },
    ],
  },
  {
    id: "provider-partnerships",
    slug: "provider-partnerships",
    group: "partnership",
    layout: "access-provider",
    label: "ACCESS for Providers",
    title: "Extend Your Care Team With Medicare ACCESS",
    kicker: "Become ACCESS-ready without building another layer of infrastructure",
    lede: "Technology-enabled chronic care for your Medicare patients — connected to your providers, your ACO and your care strategy.",
    intro:
      "Ingenio helps Medicare providers launch, operate and scale ACCESS-enabled care with a patient-owned digital health platform that connects patients, clinicians and care teams.",
    body: "We help providers deliver more care, to more Medicare patients, without adding another layer of infrastructure. Become an ACCESS participant, extend care beyond the office, and keep the patient’s PCP and specialists in the loop.",
    promise: "Your patients. Your care team. Extended through ACCESS.",
    ctaLabel: "Talk to Ingenio",
    outcomesTitle: "One platform. Three outcomes.",
    outcomes: [
      {
        title: "More Patient Access",
        body: "Give Medicare patients convenient, technology-supported chronic care beyond the walls of the practice.",
      },
      {
        title: "Better Care Coordination",
        body: "Connect ACCESS care with PCPs, specialists and ACO care teams — including HIPAA-compliant updates at key clinical moments.",
      },
      {
        title: "Better Outcomes",
        body: "Engage patients continuously and manage toward measurable health outcomes, not another disconnected program.",
      },
    ],
    loopTitle: "Your patients. Your care team. Extended through ACCESS.",
    loopLede:
      "CMS requires ACCESS organizations to provide care updates to PCPs and referring clinicians at key clinical moments using HIPAA-compliant electronic methods. That loop is built into Ingenio.",
    loop: [
      { id: "aco", title: "ACO / PCP" },
      { id: "door", title: "Ingenio Patient Digital Front Door" },
      { id: "access", title: "ACCESS-enabled chronic care" },
      { id: "patient", title: "Patient" },
    ],
    loopReturn: "Care updates, coordination and outcomes return to the ACO / PCP.",
    pillarsTitle: "Four pillars of ACCESS for providers",
    pillarsLede: "Launch, engage, coordinate and measure — without standing up a separate stack.",
    pillars: [
      {
        step: "01",
        title: "Launch",
        lede: "Become ACCESS-ready without building the infrastructure yourself.",
        points: [
          "Medicare enrollment guidance",
          "Clinical program setup",
          "Physician and clinical director workflow",
          "ACCESS patient enrollment",
          "Eligibility",
          "Documentation",
          "CMS workflow support",
        ],
      },
      {
        step: "02",
        title: "Engage",
        lede: "Give every patient a digital front door to their care.",
        points: [
          "Patient-owned Ingenio health wallet",
          "Mobile app",
          "AI health navigation",
          "Chronic-care engagement",
          "Reminders and follow-up",
          "Family and caregiver involvement",
          "Virtual care",
          "Health data and device integration",
          "Referrals and scheduling",
        ],
      },
      {
        step: "03",
        title: "Coordinate",
        lede: "Connect ACCESS care to the patient’s existing care team.",
        points: [
          "PCP communication",
          "Specialist coordination",
          "Referral management",
          "Care-plan follow-up",
          "Care updates",
          "Shared patient context",
          "Provider inbox",
          "ACO care-management integration",
        ],
      },
      {
        step: "04",
        title: "Measure",
        lede: "Turn better engagement into measurable outcomes.",
        points: [
          "ACCESS outcome tracking",
          "Patient engagement",
          "Clinical measures",
          "Care-plan adherence",
          "Escalation",
          "Reporting",
          "Performance visibility",
        ],
      },
    ],
    points: [
      "Become an ACCESS participant without building a separate operating stack.",
      "Extend chronic care beyond the office through the Ingenio patient app.",
      "Monitor and manage chronic conditions with ongoing patient engagement.",
      "Coordinate with the patient’s PCP and specialists, and receive referrals.",
      "Track outcomes and manage the ACCESS workflow with less administrative burden.",
    ],
    cms: {
      kicker: "How ACCESS fits",
      headline: "ACCESS is not simply another FFS reimbursement program.",
      body: "CMS describes ACCESS as an alternative to traditional fee-for-service billing for participating organizations, with Outcome-Aligned Payments tied to measurable outcomes. Ingenio is the bridge between ACCESS, traditional primary care, and ACO care management — so ACCESS complements the care you already deliver.",
    },
    metrics: [
      { label: "Patient access", direction: "up" },
      { label: "Care-plan adherence", direction: "up" },
      { label: "Administrative burden", direction: "down" },
      { label: "Avoidable utilization", direction: "down" },
    ],
    useCases: [
      {
        title: "Extend chronic care after the visit",
        body: "A Medicare patient leaves the office with a care plan that used to stall at home. The Ingenio app keeps engagement, reminders, and follow-up on the same thread the ACCESS team uses.",
      },
      {
        title: "Keep the PCP in the ACCESS loop",
        body: "When a clinical moment requires an update, the PCP and referring clinician receive HIPAA-compliant context instead of a fax that never arrives.",
      },
      {
        title: "Take ACCESS referrals without extra staff",
        body: "Inbound ACCESS and ACO referrals land in the provider workflow with eligibility, enrollment, and next steps already attached.",
      },
    ],
  },
  {
    id: "aco-partnerships",
    slug: "aco-partnerships",
    group: "partnership",
    layout: "access-aco",
    label: "ACCESS for ACOs",
    title: "Extend your care team without expanding your headcount",
    kicker: "ACCESS as a complement to ACO and other risk-bearing arrangements",
    lede: "Your ACO does not have to become the ACCESS care organization. Ingenio is the technology and ACCESS network layer that connects your attributed patients to technology-supported chronic care.",
    intro:
      "ACCESS gives ACOs another tool for managing chronic disease. Ingenio connects that capability to the ACO’s existing provider network and patient population — so you can extend the care team, keep the PCP informed, and give beneficiaries another way to access care.",
    body: "CMS explicitly says ACCESS is designed to complement ACO and other risk-bearing arrangements. ACOs can refer aligned beneficiaries to ACCESS participants, and CMS describes ACCESS as a way to give risk-bearing entities new care options for their patients.",
    promise: "Your patients. Your care team. Extended through ACCESS.",
    ctaLabel: "Talk to Ingenio",
    outcomesTitle: "One platform. Three outcomes.",
    outcomes: [
      {
        title: "More Patient Access",
        body: "Give aligned Medicare beneficiaries another way to receive technology-supported chronic care.",
      },
      {
        title: "Better Care Coordination",
        body: "Keep the PCP, specialists, ACCESS provider and patient connected — without standing up a parallel care-management stack.",
      },
      {
        title: "Better Outcomes",
        body: "Improve chronic-condition outcomes and pursue better quality and lower avoidable utilization.",
      },
    ],
    loopTitle: "Your patients. Your care team. Extended through ACCESS.",
    loopLede:
      "Ingenio is the digital front door and coordination layer between the ACO, ACCESS-enabled chronic care, and the patient — with care updates returning to the PCP.",
    loop: [
      { id: "aco", title: "ACO / PCP" },
      { id: "door", title: "Ingenio Patient Digital Front Door" },
      { id: "access", title: "ACCESS-enabled chronic care" },
      { id: "patient", title: "Patient" },
    ],
    loopReturn: "Care updates, coordination and outcomes return to the ACO / PCP.",
    capabilitiesTitle: "How Ingenio extends the ACO care team",
    capabilitiesLede:
      "Identify the patients, connect them to ACCESS care, keep everyone informed, and measure what changes.",
    capabilities: [
      {
        title: "Identify",
        body: "Find Medicare beneficiaries who may benefit from technology-supported chronic care.",
      },
      {
        title: "Connect",
        body: "Route patients to the right ACCESS provider or program in the Ingenio network.",
      },
      {
        title: "Engage",
        body: "Keep patients connected through their own digital health account.",
      },
      {
        title: "Coordinate",
        body: "Keep the PCP, specialists, ACCESS provider and patient connected.",
      },
      {
        title: "Measure",
        body: "Track outcomes and identify patients who need additional intervention.",
      },
      {
        title: "Improve",
        body: "Help the ACO pursue better quality and lower avoidable utilization.",
      },
    ],
    points: [
      "Identify eligible and high-value patients who may benefit from ACCESS-enabled chronic care.",
      "Connect them to appropriate ACCESS providers without making the ACO the ACCESS organization.",
      "Extend the ACO’s care team and keep the PCP informed at key clinical moments.",
      "Coordinate care across providers and give beneficiaries another way to access care.",
      "Improve chronic-condition outcomes and support quality and total-cost performance.",
    ],
    cms: {
      kicker: "CMS design",
      headline: "ACCESS is designed to complement ACOs — not replace them.",
      body: "CMS describes ACCESS as giving patients more choice, providers new partners, and Original Medicare a way to pay organizations developing technology-supported care. ACOs can refer aligned beneficiaries to ACCESS participants. Ingenio is how that referral, engagement, and care-update loop actually runs.",
    },
    economics: {
      kicker: "Value-based strategy",
      headline: "ACCESS can complement your existing value-based strategy.",
      body: "Sophisticated ACOs will ask how ACCESS interacts with existing Medicare economics. CMS currently says that for 2026 and 2027, ACCESS Outcome-Aligned Payments are anticipated not to affect MSSP and ACO REACH benchmark and performance-year calculations; beginning in 2028, ACCESS expenditures will be included. That is a window to add a chronic-care capability now, as a complement to the ACO — not a competing program.",
    },
    metrics: [
      { label: "Chronic-care engagement", direction: "up" },
      { label: "Care-team coordination", direction: "up" },
      { label: "Avoidable utilization", direction: "down" },
      { label: "Quality performance", direction: "up" },
    ],
    useCases: [
      {
        title: "Refer aligned beneficiaries into ACCESS",
        body: "Care managers identify high-need chronic patients and route them to an ACCESS provider through Ingenio, while the PCP stays on the care-update loop.",
      },
      {
        title: "Extend the team without hiring a new panel",
        body: "The ACO keeps its network and care-management model. Ingenio supplies the patient digital front door, ACCESS routing, and coordination layer.",
      },
      {
        title: "See who needs another intervention",
        body: "Engagement, adherence, and outcome signals surface patients who are stalling — so the ACO can intervene before utilization shows up downstream.",
      },
    ],
  },
];

export const productsPath = "/solutions";
export const solutionsPath = productsPath;
export const growgentSignupHref = "https://growgent.ai";
export const planSignupHref = "https://ingeniocare.ai/home/plan";
export const providerSignupHref = "https://ingeniocare.ai/home/provider";

export const appProducts = products.filter((product) => product.group !== "partnership");
export const partnershipProducts = products.filter((product) => product.group === "partnership");

const planSignupIds = new Set(["plans", "employers", "plan-app"]);

export function networkSignupHref(id) {
  return planSignupIds.has(id) ? planSignupHref : providerSignupHref;
}

export function signupHrefForProduct(product) {
  if (product?.id === "growgent-ai") return product.href || growgentSignupHref;
  return networkSignupHref(product?.id);
}

export function signupLabelForProduct(product) {
  if (product?.ctaLabel) return product.ctaLabel;
  return "Sign up";
}

export function productBySlug(slug) {
  return products.find((product) => product.slug === slug) || null;
}

export function productHref(product) {
  return `${productsPath}/${product.slug}`;
}
