import { productHref, products } from "./products.js";

export const customersPath = "/customers";

export { productHref };

export const segments = [
  {
    id: "patient",
    slug: "patient",
    label: "Patient",
    title: "For Patients",
    chip: true,
    kicker: "Access, navigation, and a single front door to care",
    lede: "Patients should not have to chase appointments, decode referrals, or wait weeks to reach the right clinician.",
    intro:
      "Ingenio Care gives patients a digital path into a coordinated care network. Instead of calling multiple offices, waiting on hold, or restarting the story at every handoff, patients can find available care, stay on their plan between visits, and reach the right specialist without getting lost in the referral process.",
    body: "The Patient App is the front door: it helps people understand what to do next, keeps referrals visible, and connects them to in-network capacity as soon as it is available. That reduces delayed care, missed follow-up, and avoidable emergency visits.",
    points: [
      "Find available primary, specialty, and follow-up care without calling around.",
      "See referral status, next steps, and care-plan activities in one place.",
      "Reach the right specialist through a clear digital front door, not a fax trail.",
      "Stay engaged between visits so gaps in care close instead of compounding.",
      "Get routed to capacity that is actually open, which shortens wait time.",
    ],
    image: "/assets/images/patient-access.png",
    imageAlt: "Patient access",
    primarySolutionId: "patient-app",
    productIds: ["patient-app", "marketplace", "digital-front-doors"],
  },
  {
    id: "providers",
    slug: "providers",
    label: "Providers",
    title: "For Providers",
    chip: true,
    kicker: "Referrals, visibility, and less administrative burden",
    lede: "Participating providers receive inbound demand, coordinate referrals, and keep more of the patient’s journey in view—without adding front-desk work.",
    intro:
      "Ingenio Care helps clinicians expand their panel, fill available capacity, and collaborate across the care team. Too much of a practice day is spent on intake, phone tag, and documentation that does not change the clinical decision. AI support handles routine inquiries and paperwork so providers can spend more time on care.",
    body: "The Provider App is the operating layer for participating clinicians: inbound referrals, outbound coordination, and shared visibility with the care team. Growgent.ai adds a 24/7 AI receptionist so after-hours and overflow calls still turn into booked visits.",
    points: [
      "Receive real-time referrals from the network and connect with patients who need care.",
      "Fill unused appointment capacity instead of leaving it idle.",
      "Coordinate inbound and outbound referrals with less phone tag and incomplete packets.",
      "Share visibility with care teams so follow-up does not fall through after the visit.",
      "Use AI receptionist, outreach, and documentation tools to reduce administrative load.",
    ],
    image: "/assets/images/provider-efficiency.png",
    imageAlt: "Provider efficiency",
    primarySolutionId: "provider-app",
    productIds: ["provider-app", "growgent-ai", "marketplace", "digital-front-doors"],
  },
  {
    id: "plans",
    slug: "plans",
    label: "Plans",
    hubTitle: "Health Plans",
    hubImage: "/assets/images/health-plans.jpg",
    hubSummary:
      "Help members navigate their benefits, access appropriate care, and stay connected to the programs and providers available to them.",
    title: "For Health Plans",
    chip: true,
    hubCard: true,
    hubOrder: 2,
    kicker: "Help members use the right benefits and stay in-network",
    lede: "Health plans can give members a clearer path to appropriate care while improving utilization and lowering the cost of coordinating benefits and follow-up.",
    intro:
      "Members often know they have coverage, but not how to use it. Ingenio Care connects them to in-network capacity, supports care-gap closure, and keeps specialty and primary care on the same journey—so plans can improve access without adding administrative friction for members or participating providers.",
    body: "The Plan App is built for this: benefit navigation, in-network routing, and program engagement in one member experience. The Marketplace sits behind it so the next step is an available clinician, not another call center queue.",
    points: [
      "Help members understand benefits and find in-network options they can actually book.",
      "Direct patients toward appropriate resources and unused provider capacity.",
      "Support Medicare and other programs that stall when access is slow.",
      "Keep specialty referrals inside the network instead of leaking to out-of-network care.",
      "Reduce avoidable administrative work for plans and participating providers.",
    ],
    image: "/assets/images/health-plans.jpg",
    imageAlt: "Health plans",
    primarySolutionId: "plan-app",
    productIds: ["plan-app", "marketplace"],
  },
  {
    id: "employers",
    slug: "employers",
    label: "Employers",
    hubTitle: "Self-Funded Employers",
    title: "For Self-Funded Employers",
    hubCard: true,
    chip: true,
    hubOrder: 1,
    kicker: "Faster access for employees and more control over healthcare spend",
    lede: "Self-funded employers need employees to get the right care quickly—without the delays, leakage, and administrative cost that drive claims up.",
    intro:
      "When access is slow, employees wait, conditions worsen, and cost shows up later in urgent and specialty claims. Ingenio Care gives employees a simpler way to navigate care while helping employers improve utilization and keep more care in a coordinated, cost-aware network.",
    body: "Employees use the same digital front door as other Ingenio Care patients: find available care, stay on the plan between visits, and reach specialists without starting over. Employers get a path to better access and utilization without standing up another disconnected vendor portal.",
    points: [
      "Give employees a single place to find care, understand next steps, and book available visits.",
      "Shorten the time from an identified need to an in-network appointment.",
      "Reduce avoidable ER and out-of-network use caused by access gaps.",
      "Keep referrals and follow-up visible so care does not stall after the first visit.",
      "Support utilization and cost goals with coordinated access, not another layer of paperwork.",
    ],
    image: "/assets/images/employer.jpg",
    imageAlt: "Self-funded employers",
    hubImage: "/assets/images/employer.jpg",
    hubSummary:
      "Give employees a simpler way to access and navigate care while helping employers improve utilization and manage healthcare costs.",
    primarySolutionId: "plan-app",
    productIds: ["plan-app", "patient-app", "marketplace"],
  },
  {
    id: "health-systems",
    slug: "health-systems",
    label: "Health Systems",
    hubTitle: "Health Systems",
    title: "For Health Systems",
    hubCard: true,
    chip: true,
    hubOrder: 3,
    kicker: "Keep more of the patient journey inside the system",
    lede: "Health systems lose patients in the handoffs between access, referral, specialty, and follow-up. Ingenio Care extends the system beyond its walls so care stays coordinated.",
    intro:
      "A health system already has clinicians, capacity, and programs. The gap is usually the journey: patients cannot get in quickly, referrals leak, and follow-up depends on phone trees. Ingenio Care adds a digital front door, a market place for available services, and provider tools that keep the system’s own network in view.",
    body: "The Marketplace makes in-system capacity visible and bookable. Digital Front Doors speed specialty access. The Provider App keeps referring and receiving teams aligned so the patient does not disappear between locations.",
    points: [
      "Give patients a faster way into the system without adding call-center volume.",
      "Surface available services and appointment capacity across the enterprise.",
      "Keep referrals in-network and complete, with fewer leaked specialty visits.",
      "Coordinate follow-up after discharge, clinic visits, and specialty consults.",
      "Reduce the administrative cost of moving a patient from need to scheduled care.",
    ],
    image: "/assets/images/health-systems.jpg",
    imageAlt: "Health systems",
    hubImage: "/assets/images/health-systems.jpg",
    hubSummary:
      "Extend the health system beyond its walls with better access, referral coordination, follow-up, and continuity across the patient journey.",
    primarySolutionId: "marketplace",
    productIds: ["marketplace", "digital-front-doors", "provider-app", "patient-app"],
  },
  {
    id: "home-health",
    slug: "home-health",
    label: "Home Health",
    hubTitle: "Home Health",
    title: "For Home Health",
    hubCard: true,
    chip: true,
    hubOrder: 4,
    kicker: "Coordinate transitions, visits, and the clinicians around the home",
    lede: "Home health works when the patient, the home-based team, and the referring physician stay on the same plan. Ingenio Care keeps those handoffs visible.",
    intro:
      "Home-based care fails in the gaps: a discharge without a visit, a change in condition that nobody sees, or a physician who cannot tell what happened at home. Ingenio Care coordinates transitions, services, and communication between patients, home-based teams, physicians, and other providers.",
    body: "Patients and families get a clear next step through the Patient App. Referring and attending clinicians keep context through the Provider App. When a specialty or follow-up visit is needed, Digital Front Doors route the patient to available capacity instead of starting a new referral from scratch.",
    points: [
      "Coordinate hospital-to-home and clinic-to-home transitions with a shared next step.",
      "Keep physicians informed about home-based services, visits, and follow-up needs.",
      "Give patients and caregivers a way to reach the right team without calling multiple offices.",
      "Route new clinical needs to available primary or specialty capacity quickly.",
      "Reduce missed visits and fragmented communication across agencies and practices.",
    ],
    image: "/assets/images/home-health.jpg",
    imageAlt: "Home health",
    hubImage: "/assets/images/home-health.jpg",
    hubSummary:
      "Coordinate transitions, services, and communication between patients, home-based care teams, physicians, and other providers.",
    primarySolutionId: "patient-app",
    productIds: ["patient-app", "provider-app", "digital-front-doors"],
  },
  {
    id: "assisted-living",
    slug: "assisted-living",
    label: "Post-Acute",
    hubTitle: "Assisted Living, SNF & Hospice",
    title: "For Assisted Living, SNF & Hospice",
    hubCard: true,
    chip: true,
    hubOrder: 5,
    kicker: "Connect residents with the right clinical resources, without delay",
    lede: "Facilities, families, and outside clinicians often operate on separate timelines. Ingenio Care connects residents to appropriate care and keeps those parties aligned.",
    intro:
      "When a resident needs a clinician, the default is still a phone tree, a transport delay, or an avoidable transfer. Ingenio Care connects assisted living, skilled nursing, and hospice settings with the broader care network so residents reach the right resource while facilities, families, and outside providers stay informed.",
    body: "Digital Front Doors give staff a faster path to specialty and urgent clinical input. The Patient App helps families see next steps. Participating providers receive the context they need instead of a one-line request after hours.",
    points: [
      "Connect residents to available clinicians and specialty input without a long phone chase.",
      "Reduce avoidable transfers by getting the right clinical next step in motion sooner.",
      "Keep facilities, families, and outside providers on the same follow-up plan.",
      "Share enough context with receiving clinicians to make the encounter useful.",
      "Coordinate hospice, SNF, and assisted-living handoffs with the rest of the care team.",
    ],
    image: "/assets/images/assisted-living.jpg",
    imageAlt: "Assisted living, skilled nursing, and hospice",
    hubImage: "/assets/images/assisted-living.jpg",
    hubSummary:
      "Connect residents with appropriate clinical resources while improving coordination between facilities, families, and outside providers.",
    primarySolutionId: "digital-front-doors",
    productIds: ["digital-front-doors", "patient-app", "provider-app"],
  },
  {
    id: "fqhc",
    slug: "fqhc",
    label: "FQHCs",
    hubTitle: "FQHCs & Community Providers",
    title: "For FQHCs & Community Providers",
    hubCard: true,
    chip: true,
    hubOrder: 6,
    kicker: "Expand access without expanding the front desk",
    lede: "Community providers are asked to see more patients, close more gaps, and still answer every call. Ingenio Care adds AI-enabled access and coordination so the clinic can keep up.",
    intro:
      "FQHCs and community clinics already do the access work that the rest of the system depends on. The constraint is usually staff time: phones, scheduling, no-shows, and referral follow-up. Ingenio Care expands access and reduces administrative burden with AI-enabled scheduling, navigation, follow-up, and care coordination.",
    body: "Growgent.ai is the dedicated solution for this setting: an AI receptionist that answers inquiries, books appointments, and supports outreach around the clock. The Provider App then keeps inbound demand and referrals inside the clinic’s workflow instead of on a sticky note.",
    points: [
      "Answer phones and web inquiries 24/7 so after-hours and overflow calls still get booked.",
      "Schedule and reschedule visits without adding front-desk headcount.",
      "Help patients navigate to the right service line, including specialty and follow-up.",
      "Close care gaps with outreach that reaches people who missed a visit or screening.",
      "Receive and send referrals with enough context to keep care in the community when possible.",
    ],
    image: "/assets/images/fqhc.png",
    imageAlt: "FQHCs and community providers",
    hubImage: "/assets/images/fqhc.png",
    hubSummary:
      "Expand access and reduce administrative burden with AI-enabled scheduling, navigation, follow-up, and care coordination.",
    primarySolutionId: "growgent-ai",
    productIds: ["growgent-ai", "provider-app", "patient-app", "marketplace"],
  },
];

export const hubSegments = segments
  .filter((segment) => segment.hubCard)
  .sort((a, b) => (a.hubOrder || 99) - (b.hubOrder || 99));
export const chipSegments = segments.filter((segment) => segment.chip);

export function segmentBySlug(slug) {
  return segments.find((segment) => segment.slug === slug) || null;
}

export function segmentHref(segment) {
  return `${customersPath}/${segment.slug}`;
}

export function productsForSegment(segment) {
  const ids = new Set(segment?.productIds || []);
  return products.filter((product) => ids.has(product.id));
}

export function primarySolutionFor(segment) {
  return products.find((product) => product.id === segment?.primarySolutionId) || productsForSegment(segment)[0] || null;
}
