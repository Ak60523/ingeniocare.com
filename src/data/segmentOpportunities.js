const defaultFramework = {
  keys: ["growth", "quality", "efficiency"],
  labels: {
    growth: "Growth",
    quality: "Quality",
    efficiency: "Operating efficiency",
  },
  lede: (segment) =>
    `Growth, quality, and operating efficiency for ${segment.label.toLowerCase()}—with a combined view of potential improvement and a sample story for each product.`,
  dashNote: "Directional, illustrative estimates—not a guarantee. Combined view across products for this audience.",
};

const frameworksById = {
  employers: {
    keys: ["productivity", "cost", "efficiency"],
    labels: {
      productivity: "Productivity",
      cost: "Cost reduction",
      efficiency: "Operating efficiency",
    },
    lede: () =>
      "Employee productivity, claims cost, and benefits administration—with a combined view of potential improvement and a sample story for each product.",
    dashNote:
      "Directional estimates. Cost reduction and operating efficiency are the main movers; productivity follows from faster, completed care.",
  },
  plans: {
    keys: ["quality", "access", "cost"],
    labels: {
      quality: "Quality",
      access: "Access",
      cost: "Cost",
    },
    lede: () =>
      "Quality, access, and cost—the measures that support higher reimbursement—with a combined view of potential improvement and a sample story for each product.",
    dashNote:
      "Directional estimates of quality, access, and cost performance that support quality bonuses and value-based reimbursement.",
  },
  patient: {
    keys: ["access", "quality", "efficiency"],
    labels: {
      access: "Access",
      quality: "Quality",
      efficiency: "Time saved",
    },
    lede: () =>
      "Access, quality, and time saved for patients—with a combined view of potential improvement and a sample story for each product.",
    dashNote: "Directional, illustrative estimates—not a guarantee. Combined view across products for this audience.",
  },
  "assisted-living": {
    keys: ["access", "quality", "efficiency"],
    labels: {
      access: "Access",
      quality: "Quality",
      efficiency: "Operating efficiency",
    },
    lede: () =>
      "Access, quality, and operating efficiency for post-acute settings—with a combined view of potential improvement and a sample story for each product.",
    dashNote: "Directional, illustrative estimates—not a guarantee. Combined view across products for this audience.",
  },
};

const opportunities = {
  employers: [
    {
      productId: "plan-app",
      productivity:
        "Employees spend fewer hours hunting for an in-network visit, so delayed care interrupts work less often.",
      cost: "Keep more care inside the contracted network and out of the ER and out-of-network specialists, where self-funded claims actually spike.",
      efficiency:
        "Cut the back-and-forth of benefit questions, authorizations, and referral status that currently lands on HR and the TPA.",
      story: {
        title: "A Midwest manufacturer stopped waiting weeks for in-network visits",
        body: "HR kept hearing the same complaint: employees could not get a specialist appointment inside the plan. After the Plan App became the front door, staff could see open in-network capacity and book from the same place they checked benefits. Avoidable ER use for non-emergent issues dropped, and the benefits team spent less time chasing faxed referrals.",
      },
    },
    {
      productId: "patient-app",
      productivity:
        "Fewer abandoned referrals and stalled recoveries means people get back to baseline work sooner.",
      cost: "Completed screenings and follow-up catch issues before they become high-cost claims.",
      efficiency: "Fewer after-hours calls to HR and fewer employees navigating three portals to figure out what to do next.",
      story: {
        title: "A hospital-system employer closed gaps that were sitting in inboxes",
        body: "Annual wellness and specialist follow-up were offered, but completion lagged. The Patient App surfaced open slots and reminder tasks on one timeline. Employees who had stalled after an imaging order finished the next step the same week instead of restarting the referral months later.",
      },
    },
    {
      productId: "marketplace",
      productivity: "Same-week in-network visits replace days of phone tag that pull people off the floor.",
      cost: "Match employees to unused contracted capacity so demand is absorbed in-network instead of leaking to higher-cost sites of care.",
      efficiency: "Replace directory hunting and call-center queues with a bookable view of who is actually available.",
      story: {
        title: "Open afternoon clinics finally showed up as real appointments",
        body: "A self-funded group had contracted capacity that employees never found. The Marketplace listed same-week primary and specialty openings. Utilization moved into the contracted network, and the broker could show leadership that access—not another vendor pamphlet—was what changed.",
      },
    },
  ],
  plans: [
    {
      productId: "plan-app",
      quality:
        "Care-gap closure and continuous chronic and post-acute management support quality scores that drive Stars bonuses and value-based reimbursement.",
      access:
        "Members book in-network care they already have, which is what access and “getting needed care” measures actually reward.",
      cost: "Leakage to out-of-network and retail sites of care drops when the next available in-network clinician is visible—protecting medical cost and MLR.",
      story: {
        title: "A regional Medicare Advantage plan shortened the path from ‘I need a doctor’ to a booked visit",
        body: "Members knew they had coverage; they did not know who was open this week. The Plan App paired benefit context with in-network routing. Care-gap work moved off paper lists, specialty leakage slowed, and quality and access measures had a completed visit behind them instead of another directory call.",
      },
    },
    {
      productId: "marketplace",
      quality:
        "Matching clinical need to the right site of care reduces ER-default visits that drag quality scores and reimbursement together.",
      access:
        "Contracted panels that still have capacity become the first answer, so the plan can show real access instead of a static directory.",
      cost: "Unused in-network slots replace higher-cost out-of-network, retail, and emergency use.",
      story: {
        title: "Unused specialist slots became the plan’s first answer, not the last",
        body: "A mid-size plan paid for a specialty network that looked full from the member’s point of view. The Marketplace exposed open sessions. Customer service could offer a bookable option on the first call, UM saw fewer “couldn’t get an appointment” exceptions, and in-network use supported both cost and access performance.",
      },
    },
  ],
  "health-systems": [
    {
      productId: "marketplace",
      growth: "Keep referrals and new visits inside the system by making in-system capacity visible and bookable.",
      quality: "Patients reach the right service line faster, with fewer incomplete packets and leaked specialty encounters.",
      efficiency: "Access teams stop working from stale lists; schedulers see what is actually open across locations.",
      story: {
        title: "A multi-hospital system stopped losing specialty referrals at the fax machine",
        body: "Orthopedics and cardiology were leaking because referring clinics could not see openings. The Marketplace put in-system availability in front of the referring team. Those referrals stayed inside the enterprise, and access leaders could see which locations still had unused sessions.",
      },
    },
    {
      productId: "digital-front-doors",
      growth: "Capture specialty demand at the moment of need instead of losing it to a competitor with a shorter hold time.",
      quality: "Route patients to the right specialist with context, so the first visit is useful instead of a repeat intake.",
      efficiency: "Digital intake and referral routing cut phone trees and incomplete orders that clog specialty clinics.",
      story: {
        title: "GI access stopped being a 40-minute hold",
        body: "A health system’s GI line was the bottleneck. A digital front door collected the reason for referral, insurance, and preferred site, then offered the next available session. No-shows fell because patients left with a real time, and the call center handled exceptions instead of every request.",
      },
    },
    {
      productId: "provider-app",
      growth: "Referring and receiving clinicians stay on the same patient, which keeps downstream procedures and follow-up in-system.",
      quality: "Shared context reduces dropped handoffs after discharge and after specialty consults.",
      efficiency: "Less phone tag between offices; documentation and next steps travel with the referral.",
      story: {
        title: "Hospitalists and clinic physicians finally saw the same next step",
        body: "Discharge follow-up used to vanish into voicemail. In the Provider App, the receiving clinic saw the plan, the open slot, and the reason for the visit. Readmission-prone patients were on a calendar before they left the floor.",
      },
    },
    {
      productId: "patient-app",
      growth: "Patients stay attached to the system between encounters instead of googling a new clinic.",
      quality: "Clear instructions and reminders improve adherence after procedures and hospital stays.",
      efficiency: "Fewer ‘what do I do next?’ calls to the operator and fewer repeat registrations.",
      story: {
        title: "Post-op patients stopped calling the tower for basic next steps",
        body: "A surgical service loaded discharge tasks into the Patient App: wound check, PT, and the surgeon’s follow-up. Patients completed the sequence without a new referral packet, and clinic staff spent the morning on exceptions rather than repeating the same instructions.",
      },
    },
  ],
  "home-health": [
    {
      productId: "patient-app",
      growth: "Agencies keep patients on service through clearer visit plans and fewer drop-offs after the first week.",
      quality: "Patients and caregivers see daily tasks, so missed visits and silent deterioration are easier to catch.",
      efficiency: "Intake and reminder work moves off the nurse’s voicemail and onto a shared timeline.",
      story: {
        title: "A home-health agency cut the ‘we couldn’t reach the family’ loop",
        body: "Start-of-care stalled when families missed calls. The Patient App showed the visit window, the nurse’s next step, and who to contact. Completed starts rose in the first week, and coordinators stopped rebuilding the same schedule from sticky notes.",
      },
    },
    {
      productId: "provider-app",
      growth: "Referring physicians send more cases when they can see that home-based work actually happened.",
      quality: "Attending clinicians get timely updates instead of learning about a change in condition at the ER.",
      efficiency: "Fewer faxes and fewer duplicate assessments between the agency and the clinic.",
      story: {
        title: "A PCP panel started referring again after they could see the home visits",
        body: "Physicians had stopped sending patients to home health because feedback never came back. The Provider App showed visit completion and open questions. Referrals returned, and the agency spent less time on ‘status please’ calls.",
      },
    },
    {
      productId: "digital-front-doors",
      growth: "When a home patient needs specialty input, the agency can route them without losing the case to an unrelated ER.",
      quality: "Faster specialty access from the home setting prevents avoidable declines.",
      efficiency: "Staff do not restart a full referral from a blank form every time a new need appears.",
      story: {
        title: "Wound-care consults no longer waited on a new paper packet",
        body: "A home-health team needed a wound specialist mid-episode. The digital front door reused the existing record and offered the next available consult. The patient stayed on the home-health plan instead of bouncing through the emergency department for access.",
      },
    },
  ],
  "assisted-living": [
    {
      productId: "digital-front-doors",
      access: "Night and weekend clinical questions reach an available clinician without a transfer off site.",
      quality: "Faster clinical input reduces avoidable hospital trips for issues that can be handled on site.",
      efficiency: "Overnight requests stop depending on whoever answers the community phone.",
      story: {
        title: "A skilled nursing wing stopped defaulting to 911 for after-hours questions",
        body: "Overnight staff had one play: send the resident out. A digital front door connected them to an available clinician with the chart context. Avoidable transfers fell on evenings and weekends, and families saw a documented next step instead of a surprise ER bill.",
      },
    },
    {
      productId: "patient-app",
      access: "Families and designated contacts can see the next clinical step instead of waiting on the next shift.",
      quality: "Residents and designated contacts track medications, visits, and follow-up in one place.",
      efficiency: "Front desk and nursing spend less time repeating status to multiple relatives.",
      story: {
        title: "One daughter stopped calling three shifts for the same update",
        body: "Family communication was the hidden workload. The Patient App gave the designated contact the visit summary and the next appointment. Call volume to the nurses’ station dropped, and the care team used that time on residents rather than repeating the story.",
      },
    },
    {
      productId: "provider-app",
      access: "Outside physicians can act on a usable facility handoff instead of a one-line after-hours request.",
      quality: "Receiving clinicians get enough context that the encounter actually changes the plan.",
      efficiency: "Less duplicate intake between the community, hospice, and the clinic.",
      story: {
        title: "Hospice and the attending finally worked from the same note",
        body: "A resident’s goals of care changed, but the clinic chart and the facility binder did not match. The Provider App carried the updated plan to the next clinician. Medications and visit frequency aligned within a day instead of after another preventable crisis.",
      },
    },
  ],
  fqhc: [
    {
      productId: "growgent-ai",
      growth: "After-hours and overflow calls become booked visits instead of missed demand.",
      quality: "Patients reach the right service line on the first contact, including follow-up and screening outreach.",
      efficiency: "The front desk is not the bottleneck for every ring; the AI receptionist covers nights, lunch, and spikes.",
      story: {
        title: "A community clinic filled the slots that used to die on voicemail",
        body: "Lunch and closing time were when patients called. Growgent.ai answered, booked, and tagged no-show outreach. Filled sessions rose without a new FTE, and the front desk started the day with a schedule instead of a voicemail pile.",
      },
    },
    {
      productId: "provider-app",
      growth: "Inbound network demand lands on clinicians who still have capacity, expanding the panel without a new building.",
      quality: "Referrals arrive with context so the visit is not wasted on reconstructing history.",
      efficiency: "Less sticky-note referral tracking and less after-hours documentation.",
      story: {
        title: "Specialty referrals stopped living in a binder at the checkout desk",
        body: "An FQHC sent patients to specialists and rarely learned what happened. The Provider App kept outbound and inbound referrals in one list. Loop-closure improved, and care managers stopped reconstructing status from three EHRs.",
      },
    },
    {
      productId: "patient-app",
      growth: "Patients who often miss visits stay attached through reminders and a simpler next step.",
      quality: "Care-gap lists turn into completed screenings and follow-up instead of paper outreach.",
      efficiency: "Fewer walk-in bottlenecks caused by people who could not get through on the phone.",
      story: {
        title: "Reminder lists became completed mammograms, not another mail merge",
        body: "Outreach used to be letters. The Patient App put the open imaging slot and the reason on the patient’s phone. Completion of overdue screenings improved, and medical assistants spent outreach time on people who still needed a human call.",
      },
    },
    {
      productId: "marketplace",
      growth: "The clinic can send and receive patients across the community network without losing them to a distant system.",
      quality: "Patients get to available services—behavioral health, dental, specialty—without months of wait.",
      efficiency: "Staff stop maintaining unofficial ‘who is taking patients’ spreadsheets.",
      story: {
        title: "Behavioral-health wait times stopped being a rumor",
        body: "The FQHC knew counseling was full, but not where else in the network was open. The Marketplace showed real openings. Patients left with a booked visit, and the referral coordinator retired the handwritten list on the wall.",
      },
    },
  ],
  patient: [
    {
      productId: "patient-app",
      access: "People can complete the next step in-network instead of stalling after the visit.",
      quality: "Fewer delayed diagnoses and missed follow-ups when instructions live in one place.",
      efficiency: "Less time on hold, fewer duplicate forms, and fewer repeat stories at every office.",
      story: {
        title: "A caregiver coordinated three clinicians without a three-ring binder",
        body: "Mom’s PCP, specialist, and home nurse each had a different version of the plan. The Patient App put referrals, meds, and visits on one timeline. The family stopped being the fax machine, and the next appointment was booked before the previous one ended.",
      },
    },
    {
      productId: "marketplace",
      access: "Patients find open capacity instead of giving up and going to the ER.",
      quality: "Faster access to the right site of care improves outcomes for time-sensitive needs.",
      efficiency: "No more calling five offices to learn who is closed to new patients.",
      story: {
        title: "Same-week primary care replaced an unnecessary ER night",
        body: "A patient with a new symptom could not get a clinic slot for 18 days. The Marketplace showed a same-week opening in-network. The visit happened in clinic, not in the emergency department, and the record followed them to the specialist.",
      },
    },
    {
      productId: "digital-front-doors",
      access: "Specialty demand is captured instead of abandoned after a long hold.",
      quality: "The specialist sees the reason for referral before the patient walks in.",
      efficiency: "Patients are not re-entering insurance and history on every portal.",
      story: {
        title: "A dermatology referral did not reset at the front desk",
        body: "The digital front door carried photos, the PCP note, and insurance into the specialty clinic. The first visit was a treatment decision, not another intake. The patient did not have to start over when the first date was rescheduled.",
      },
    },
  ],
  providers: [
    {
      productId: "provider-app",
      growth: "Inbound network referrals fill unused sessions and expand the panel without extra marketing spend.",
      quality: "Cleaner packets and shared context mean the visit time goes to clinical work.",
      efficiency: "Inbound and outbound referrals stop living in fax queues and voicemail.",
      story: {
        title: "An independent cardiology group filled the holes in Thursday afternoons",
        body: "The calendar had gaps while the community waited. Network referrals arrived in the Provider App with history attached. Those slots filled, and the office manager stopped printing fax cover sheets for every outbound consult.",
      },
    },
    {
      productId: "growgent-ai",
      growth: "Missed calls become appointments; after-hours demand is not donated to the competitor who answers.",
      quality: "Patients get a consistent first answer instead of a full mailbox.",
      efficiency: "Front-desk staff handle exceptions, not every ring and reminder.",
      story: {
        title: "A two-physician practice stopped losing Monday morning to voicemail",
        body: "The AI receptionist booked, rescheduled, and captured the reason for visit overnight. Monday opened with a full schedule instead of a callback list, and the nurses used the morning for rooming rather than phone tag.",
      },
    },
    {
      productId: "marketplace",
      growth: "Practices that still have capacity become visible to referring clinicians and patients.",
      quality: "Better matching of need to specialty reduces wasted first visits.",
      efficiency: "Less time explaining ‘we are closed to new patients’ when another site in the group is open.",
      story: {
        title: "A multi-site group routed new patients to the office that actually had room",
        body: "One location was slammed; another had openings nobody advertised. The Marketplace showed both. New patients landed where the capacity was, and the busy site’s hold time came down without hiring another scheduler.",
      },
    },
    {
      productId: "digital-front-doors",
      growth: "Specialists receive a steadier, more complete inbound stream from the network.",
      quality: "First visits start with the right studies and history already in hand.",
      efficiency: "Referral coordinators are not rebuilding packets for every sender.",
      story: {
        title: "Ortho intake stopped asking for the MRI that already existed",
        body: "Digital Front Doors required the imaging and the reason for referral up front. The surgeon’s first visit was a plan, not a scavenger hunt. Staff time shifted from incomplete charts to surgical scheduling.",
      },
    },
  ],
};

const impactBySegment = {
  employers: {
    "plan-app": { productivity: 6, cost: 11, efficiency: 10 },
    "patient-app": { productivity: 7, cost: 8, efficiency: 10 },
    marketplace: { productivity: 6, cost: 10, efficiency: 9 },
  },
  plans: {
    "plan-app": { quality: 11, access: 10, cost: 10 },
    marketplace: { quality: 9, access: 12, cost: 10 },
  },
  "health-systems": {
    marketplace: { growth: 14, quality: 8, efficiency: 8 },
    "digital-front-doors": { growth: 10, quality: 11, efficiency: 8 },
    "provider-app": { growth: 8, quality: 8, efficiency: 12 },
    "patient-app": { growth: 6, quality: 9, efficiency: 8 },
  },
  "home-health": {
    "patient-app": { growth: 8, quality: 11, efficiency: 9 },
    "provider-app": { growth: 10, quality: 9, efficiency: 8 },
    "digital-front-doors": { growth: 6, quality: 10, efficiency: 8 },
  },
  "assisted-living": {
    "digital-front-doors": { access: 11, quality: 12, efficiency: 9 },
    "patient-app": { access: 7, quality: 8, efficiency: 10 },
    "provider-app": { access: 8, quality: 10, efficiency: 8 },
  },
  fqhc: {
    "growgent-ai": { growth: 13, quality: 7, efficiency: 12 },
    "provider-app": { growth: 8, quality: 9, efficiency: 10 },
    "patient-app": { growth: 7, quality: 11, efficiency: 8 },
    marketplace: { growth: 7, quality: 9, efficiency: 8 },
  },
  patient: {
    "patient-app": { access: 10, quality: 11, efficiency: 9 },
    marketplace: { access: 12, quality: 8, efficiency: 10 },
    "digital-front-doors": { access: 9, quality: 9, efficiency: 10 },
  },
  providers: {
    "provider-app": { growth: 12, quality: 8, efficiency: 11 },
    "growgent-ai": { growth: 14, quality: 6, efficiency: 13 },
    marketplace: { growth: 10, quality: 7, efficiency: 8 },
    "digital-front-doors": { growth: 8, quality: 10, efficiency: 9 },
  },
};

const BAR_CEILING = 16;

function average(values) {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function emptyImpact(keys) {
  return Object.fromEntries(keys.map((key) => [key, 8]));
}

export function metricFrameworkFor(segment) {
  return frameworksById[segment?.id] || defaultFramework;
}

export function barShare(value) {
  return Math.min(100, Math.round(((Number(value) || 0) / BAR_CEILING) * 100));
}

export function opportunitiesForSegment(segment) {
  const rows = opportunities[segment?.id] || [];
  const impacts = impactBySegment[segment?.id] || {};
  const framework = metricFrameworkFor(segment);
  const byId = Object.fromEntries(rows.map((row) => [row.productId, row]));
  return (segment?.productIds || [])
    .map((productId) => {
      const row = byId[productId];
      if (!row) return null;
      return { ...row, impact: impacts[productId] || emptyImpact(framework.keys) };
    })
    .filter(Boolean);
}

export function potentialDashboard(rows, framework) {
  const keys = framework?.keys || defaultFramework.keys;
  const stats = Object.fromEntries(
    keys.map((key) => [key, average(rows.map((row) => Number(row.impact?.[key]) || 0))])
  );
  return {
    ...stats,
    overall: average(keys.map((key) => stats[key])),
  };
}
