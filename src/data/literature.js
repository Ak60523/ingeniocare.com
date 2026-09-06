export const literatureSources = [
  {
    id: "patel2018",
    authors: "Patel MP, Schettini P, O’Leary CP, et al.",
    title: "Closing the Referral Loop: an Analysis of Primary Care Referrals to Specialists in a Large Health System",
    venue: "J Gen Intern Med. 2018;33(9):1476-1485",
    href: "https://doi.org/10.1007/s11606-018-4392-z",
  },
  {
    id: "amn2022",
    authors: "AMN Healthcare / Merritt Hawkins",
    title: "2022 Survey of Physician Appointment Wait Times and Medicare and Medicaid Acceptance Rates",
    venue: "AMN Healthcare, 2022",
    href: "https://www.amnhealthcare.com/siteassets/amn-insights/physician/survey-of-physician-appointment-wait-times-and-medicare-and-medicaid-acceptance-rates.pdf",
  },
  {
    id: "weinick2010",
    authors: "Weinick RM, Burns RM, Mehrotra A.",
    title: "Many Emergency Department Visits Could Be Managed at Urgent Care Centers and Retail Clinics",
    venue: "Health Aff (Millwood). 2010;29(9):1630-1636",
    href: "https://doi.org/10.1377/hlthaff.2009.0748",
  },
  {
    id: "sinsky2016",
    authors: "Sinsky C, Colligan L, Li L, et al.",
    title: "Allocation of Physician Time in Ambulatory Practice: A Time and Motion Study in 4 Specialties",
    venue: "Ann Intern Med. 2016;165(11):753-760",
    href: "https://doi.org/10.7326/M16-0961",
  },
  {
    id: "parikh2010",
    authors: "Parikh A, Gupta K, Wilson AC, Fields K, Cosgrove NM, Kostis JB.",
    title: "The Effectiveness of Outpatient Appointment Reminder Systems in Reducing No-Show Rates",
    venue: "Am J Med. 2010;123(6):542-548",
    href: "https://doi.org/10.1016/j.amjmed.2009.11.022",
  },
  {
    id: "hasvold2011",
    authors: "Hasvold PE, Wootton R.",
    title: "Use of Telephone and SMS Reminders to Improve Attendance at Hospital Appointments: A Systematic Review",
    venue: "J Telemed Telecare. 2011;17(7):358-364",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3188816/",
  },
  {
    id: "advisory2024",
    authors: "Dailey E, Wagner C.",
    title: "Are Employed PCPs More Likely to Refer Within Their Health Systems?",
    venue: "Advisory Board, 2024",
    href: "https://www.advisory.com/topics/physician-alignment/2024/09/employed-pcp-referrals",
  },
  {
    id: "ijmi2023",
    authors: "Hah H, et al.",
    title: "Consultants’ and Referrers’ Perceived Barriers to Closing the Cross-Institutional Referral Loop",
    venue: "Int J Med Inform. 2023;183:105265",
    href: "https://doi.org/10.1016/j.ijmedinf.2023.105265",
  },
];

export const literatureMetrics = {
  referralIncomplete: {
    value: "65%",
    bar: 65,
    label: "Specialty referrals not documented as completed",
    detail: "Only 34.8% of analyzed referral scheduling attempts had a documented completed specialist visit.",
    sourceId: "patel2018",
  },
  waitDays: {
    value: "26 days",
    bar: 26,
    label: "Average new-patient physician wait",
    detail: "Mean wait across five specialties in 15 large U.S. metro markets, up 24% since 2004.",
    sourceId: "amn2022",
  },
  waitIncrease: {
    value: "24%",
    bar: 24,
    label: "Increase in new-patient wait times since 2004",
    detail: "Average wait rose from 20.9 days in 2004 to 26.0 days in 2022.",
    sourceId: "amn2022",
  },
  divertibleEd: {
    value: "14–27%",
    bar: 27,
    label: "ED visits potentially manageable in lower-acuity settings",
    detail: "National estimate of emergency visits that could be seen at retail clinics or urgent care.",
    sourceId: "weinick2010",
  },
  ehrTime: {
    value: "49%",
    bar: 49,
    label: "Physician office time on EHR and desk work",
    detail: "Direct observation: 49.2% of the office day on EHR/desk work vs 27% in face-to-face care.",
    sourceId: "sinsky2016",
  },
  noShowNone: {
    value: "23%",
    bar: 23,
    label: "No-show rate with no appointment reminder",
    detail: "23.1% missed visits with no reminder vs 13.6% with a staff reminder call.",
    sourceId: "parikh2010",
  },
  reminderRelative: {
    value: "34%",
    bar: 34,
    label: "Relative drop in non-attendance with reminders",
    detail: "Systematic review: weighted mean relative change in non-attendance was 34% of baseline.",
    sourceId: "hasvold2011",
  },
  oonReferralRevenue: {
    value: "45%",
    bar: 45,
    label: "Employed-PCP specialty referral revenue leaving the system",
    detail: "Advisory Board analysis: only 55% of employed-PCP specialty referral revenue stayed in-network.",
    sourceId: "advisory2024",
  },
  referralAdminTime: {
    value: "10%",
    bar: 10,
    label: "Referring clinicians’ clinic time on referral management",
    detail: "Cited estimate that about 10% of referrers’ clinic time is spent managing referrals; 30–50% of specialty referrals are not completed.",
    sourceId: "ijmi2023",
  },
};

const dashboardBySegment = {
  employers: ["divertibleEd", "waitDays", "referralIncomplete"],
  plans: ["divertibleEd", "waitDays", "referralIncomplete"],
  "health-systems": ["oonReferralRevenue", "referralIncomplete", "ehrTime"],
  "home-health": ["referralIncomplete", "divertibleEd", "ehrTime"],
  "assisted-living": ["divertibleEd", "waitDays", "ehrTime"],
  fqhc: ["noShowNone", "waitDays", "ehrTime"],
  patient: ["waitDays", "divertibleEd", "referralIncomplete"],
  providers: ["waitDays", "referralIncomplete", "ehrTime"],
};

const productMetrics = {
  "plan-app": { growth: "waitIncrease", quality: "divertibleEd", efficiency: "referralIncomplete" },
  "patient-app": { growth: "reminderRelative", quality: "divertibleEd", efficiency: "noShowNone" },
  "provider-app": { growth: "referralIncomplete", quality: "waitDays", efficiency: "ehrTime" },
  marketplace: { growth: "oonReferralRevenue", quality: "waitDays", efficiency: "referralIncomplete" },
  "digital-front-doors": { growth: "waitIncrease", quality: "waitDays", efficiency: "referralAdminTime" },
  "growgent-ai": { growth: "reminderRelative", quality: "noShowNone", efficiency: "ehrTime" },
};

export function metricById(id) {
  return literatureMetrics[id] || null;
}

export function sourceById(id) {
  return literatureSources.find((source) => source.id === id) || null;
}

export function dashboardMetricsForSegment(segmentId) {
  return (dashboardBySegment[segmentId] || ["referralIncomplete", "waitDays", "ehrTime"])
    .map(metricById)
    .filter(Boolean);
}

export function metricsForProduct(productId) {
  const keys = productMetrics[productId] || {
    growth: "waitDays",
    quality: "referralIncomplete",
    efficiency: "ehrTime",
  };
  return {
    growth: metricById(keys.growth),
    quality: metricById(keys.quality),
    efficiency: metricById(keys.efficiency),
  };
}

export function sourcesForIds(ids) {
  const unique = [...new Set(ids.filter(Boolean))];
  return unique.map(sourceById).filter(Boolean);
}
