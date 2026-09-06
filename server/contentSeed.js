export const seedSiteContent = [
  {
    type: "blog",
    slug: "patient-access-without-the-wait",
    title: "Patient access without the wait",
    subtitle: "How unused provider capacity becomes same-day care",
    summary:
      "Instant access to the right clinician changes cost, quality, and patient trust. Here is how Ingenio Care unlocks unused capacity.",
    hashtags: ["patient-access", "digital-health", "care-coordination"],
    status: "published",
    gated: 0,
    publishedAt: "2025-10-20T12:00:00Z",
    body: `
      <p>Patients still wait days or weeks for a visit while clinicians have unused slots every day. That mismatch is one of the most expensive problems in U.S. healthcare.</p>
      <p>Ingenio Care connects a patient to an in-network provider in real time, then keeps the record, referral, and follow-up in one place. The result is faster care without adding headcount.</p>
      <h3>What changes for patients</h3>
      <ul>
        <li>Same-day virtual consults with a local, in-network clinician</li>
        <li>A single health record that follows the patient, not the clinic</li>
        <li>Clear next steps after every encounter</li>
      </ul>
      <h3>What changes for providers</h3>
      <p>Unused capacity becomes booked capacity. Documentation and coding sit in the workflow instead of after hours. Specialists receive cleaner referrals with context already attached.</p>
    `,
  },
  {
    type: "blog",
    slug: "ai-scribe-that-gives-physicians-time-back",
    title: "An AI scribe that gives physicians time back",
    subtitle: "Documentation should not compete with the visit",
    summary:
      "Providers spend too much of each encounter on notes. Ingenio Care’s physician assistant drafts documentation so clinicians can stay with the patient.",
    hashtags: ["ai", "providers", "documentation"],
    status: "published",
    gated: 0,
    publishedAt: "2025-09-12T12:00:00Z",
    body: `
      <p>Most physician-facing software asks clinicians to become data-entry clerks. Ingenio Care does the opposite: it brings relevant history forward and drafts the note while the visit happens.</p>
      <p>That is not a replacement for clinical judgment. It is a way to return minutes to every encounter — minutes that become another patient seen, or a conversation that would otherwise be cut short.</p>
      <h3>In practice</h3>
      <ul>
        <li>Relevant history surfaces before the clinician asks</li>
        <li>Notes and coding are drafted in-stream</li>
        <li>Care-plan suggestions stay tied to the treating physician</li>
      </ul>
    `,
  },
  {
    type: "whitepaper",
    slug: "patient-centric-care-orchestration",
    title: "Patient-centric care orchestration",
    subtitle: "A model for access, coordination, and value-based delivery",
    summary:
      "A deeper guide to Ingenio Care’s Patient Care Orchestration Model — how access, unused capacity, and aligned incentives reduce cost while improving outcomes.",
    hashtags: ["whitepaper", "value-based-care", "pcom"],
    status: "published",
    gated: 1,
    publishedAt: "2025-08-01T12:00:00Z",
    body: `
      <p>Healthcare has invested heavily in population health, engagement, and PCP-centric programs. Outcomes improved only at the margin. Ingenio Care’s thesis is narrower: find the patient who needs care now, and deliver that care with speed and a closely knit network.</p>
      <h3>The model</h3>
      <p>The Patient Care Orchestration Model (PCOM) starts with real-time access, then assigns a physician-owned care plan, then coordinates every downstream step — referral, authorization, pharmacy, and follow-up — on the same record.</p>
      <h3>Why it is different</h3>
      <p>It does not add a central care-coordinator army. It uses existing providers, unused capacity, and AI to remove friction. Bundles are surgeon-led. Pharmacy becomes a coordination point. Payers see utilization in-stream instead of after the fact.</p>
      <p>Request the full paper to see the operating model, the economic model, and the measures we use in IPA, employer, and health-plan pilots.</p>
    `,
  },
  {
    type: "podcast",
    slug: "care-when-its-needed",
    title: "Care when it's needed",
    subtitle: "Episode 1: Patient-centric access without adding headcount",
    summary:
      "A conversation on unused provider capacity, same-day access, and how Ingenio Care coordinates care when patients need it.",
    hashtags: ["podcast", "patient-access", "digital-health"],
    status: "published",
    gated: 0,
    publishedAt: "2026-09-01T12:00:00Z",
    body: `
      <p>This episode looks at the mismatch between patients waiting for care and clinicians with unused time every day.</p>
      <h3>In this conversation</h3>
      <ul>
        <li>Why access still fails even when capacity exists</li>
        <li>How a patient-centric network routes people to in-network care in real time</li>
        <li>What changes for providers when documentation and referrals stay in the visit</li>
      </ul>
      <p>Listen for a practical view of care coordination that starts with the patient who needs care now.</p>
    `,
  },
  {
    type: "blog",
    slug: "finish-the-next-step-after-imaging",
    title: "Finish the next step after imaging",
    subtitle: "The visit after radiology should not restart months later",
    summary:
      "A common Ingenio Care use case: the Patient App turns an imaging order into a booked follow-up, so the next step happens the same week instead of stalling in an inbox.",
    hashtags: ["patient-app", "care-coordination", "follow-up", "use-case"],
    status: "draft",
    gated: 0,
    publishedAt: null,
    body: `
      <p>A patient leaves radiology with films in the system and no appointment on the calendar. The specialist still needs to see the result. The primary-care office is waiting on a callback. Weeks later, the referral is rebuilt from scratch.</p>
      <p>That is not a clinical failure. It is an access and coordination failure. Ingenio Care’s Patient App is built for this moment: show the open slot, the referral status, and a reminder so the visit happens while the finding is still useful.</p>
      <h3>What the patient sees</h3>
      <p>The app carries a digital health pass—history, the imaging order, and the reason for follow-up—so the next clinician is not starting from a blank intake. Pricing and in-network options are visible before the patient chooses a site of care.</p>
      <h3>What the care team sees</h3>
      <ul>
        <li>Referral status on one timeline instead of three voicemails</li>
        <li>An available session matched to the order, not a directory hunt</li>
        <li>Family or caregiver contacts who can complete the next step without calling the clinic</li>
      </ul>
      <h3>Why this use case matters</h3>
      <p>Delayed follow-up after imaging is how treatable findings become late presentations. It is also how health systems lose the downstream visit to another site that happened to answer the phone.</p>
      <h3>Where Ingenio Care fits</h3>
      <p>The Patient App is the front door. The Marketplace supplies the bookable capacity. Together they close the gap between “the study is done” and “the next clinician has a time.”</p>
    `,
  },
  {
    type: "blog",
    slug: "after-hours-calls-that-still-become-visits",
    title: "After-hours calls that still become visits",
    subtitle: "Missed rings are missed appointments, not a lack of demand",
    summary:
      "A Growgent.ai use case for clinics and community practices: the AI receptionist answers overnight and at lunch, books the slot, and hands the morning panel a full schedule instead of a voicemail pile.",
    hashtags: ["growgent-ai", "providers", "access", "use-case"],
    status: "draft",
    gated: 0,
    publishedAt: null,
    body: `
      <p>Phones that go unanswered at lunch, overnight, or during overflow are not a staffing anecdote. They are unused capacity on one side of the market and delayed care on the other.</p>
      <p>Growgent.ai is Ingenio Care’s AI receptionist and growth engine for this use case. It answers inquiries 24/7, books the appointment, and captures why the person called so the morning panel is already full.</p>
      <h3>What happens on the call</h3>
      <ul>
        <li>Routine questions get an answer without a callback list</li>
        <li>The visit is scheduled against real open sessions</li>
        <li>The reason for visit travels with the booking so rooming is not a scavenger hunt</li>
      </ul>
      <h3>What happens when the front desk is full</h3>
      <p>Overflow does not bounce to voicemail. Web and phone inquiries still get a scheduled slot and routing to the right service line. Staff handle exceptions—not every ring.</p>
      <h3>Filling unused sessions</h3>
      <p>Open capacity can be offered back to patients who missed a visit or screening. Outreach agents re-engage people without adding front-desk headcount, and the same inventory sits alongside the Ingenio Care network.</p>
      <h3>Who this is for</h3>
      <p>Independent practices, FQHCs, and small groups that cannot staff a call center at 9 p.m. The use case is simple: the patient who called after hours should still have a visit in the morning.</p>
    `,
  },
  {
    type: "blog",
    slug: "fill-open-sessions-with-inbound-demand",
    title: "Fill open clinic sessions with inbound demand",
    subtitle: "Unused afternoon capacity is a network problem, not a marketing problem",
    summary:
      "A Provider App use case: participating practices see real-time network referrals and book patients who already need care, instead of leaving sessions idle.",
    hashtags: ["provider-app", "referrals", "capacity", "use-case"],
    status: "draft",
    gated: 0,
    publishedAt: null,
    body: `
      <p>Many clinics have holes in the afternoon calendar while the community waits days for a new-patient visit. The demand exists. It is sitting in another office’s fax queue, a health-plan directory, or a referral that never got scheduled.</p>
      <p>The Provider App makes inbound network demand visible to clinicians who still have capacity. Referrals arrive with context. The receiving practice books the patient who already needs care.</p>
      <h3>Inbound, not another marketing campaign</h3>
      <p>This is not a lead-gen funnel. Patients are already in the Ingenio Care network. The job is matching them to an open session with the right specialty, coverage, and site of care.</p>
      <h3>What referring and receiving teams share</h3>
      <ul>
        <li>The outbound referral includes history and the reason for the visit</li>
        <li>The receiving clinician sends the plan back on the same thread</li>
        <li>Follow-up does not disappear between locations</li>
      </ul>
      <h3>Closing the loop with home-based care</h3>
      <p>A PCP can see that home visits actually happened. Referrals return to the agency. Staff spend less time on “status please” calls that do not change the clinical decision.</p>
      <h3>What changes for the practice</h3>
      <p>Unused sessions become booked sessions. Documentation and coding support sit in the visit. Quality and cost scorecards can follow care that was actually delivered—not only what the primary-care office documented.</p>
    `,
  },
  {
    type: "blog",
    slug: "use-the-plan-instead-of-the-er",
    title: "Help employees use the plan instead of the ER",
    subtitle: "When in-network care is visible, non-emergent issues stop defaulting to the emergency department",
    summary:
      "A Plan App use case for self-funded employers: staff see open in-network capacity from the same place they check benefits, so access gaps do not become urgent-care and out-of-network claims.",
    hashtags: ["plan-app", "employers", "in-network", "use-case"],
    status: "draft",
    gated: 0,
    publishedAt: null,
    body: `
      <p>Self-funded employers hear the same complaint: employees cannot get a specialist appointment inside the plan. When access is slow, people wait, conditions worsen, and cost shows up later in urgent and specialty claims.</p>
      <p>The Plan App is the front door for this use case. It pairs benefits with bookable in-network options so the first interaction becomes a visit instead of a directory hunt.</p>
      <h3>What the employee does</h3>
      <p>They open the same place they check coverage. They see who is actually available this week. They book. Pricing transparency sits next to the choice of site, so the decision is not a surprise bill later.</p>
      <h3>What HR and the TPA stop doing</h3>
      <ul>
        <li>Repeating “call this number” for every non-emergent issue</li>
        <li>Chasing faxed referrals that never land on a calendar</li>
        <li>Explaining after the fact why the ER was the only door that answered</li>
      </ul>
      <h3>Care managers and care-gap work</h3>
      <p>Program outreach can point to a next step the member can complete. Care-gap lists move off paper and into a path that ends in a booked visit, not another mail merge.</p>
      <h3>The employer outcome</h3>
      <p>Utilization moves into the contracted network. Avoidable emergency use for issues that belong in clinic declines because access—not another vendor pamphlet—is what changed.</p>
    `,
  },
  {
    type: "whitepaper",
    slug: "keeping-specialty-referrals-in-system",
    title: "Keeping specialty referrals inside the health system",
    subtitle: "An operating model for matching demand to unused in-system capacity",
    summary:
      "A proposed paper on the Marketplace use case for health systems: make in-system sessions visible and bookable so orthopedics, cardiology, and other specialty referrals stop leaking at the fax machine.",
    hashtags: ["whitepaper", "marketplace", "health-systems", "referral-leakage", "use-case"],
    status: "draft",
    gated: 1,
    publishedAt: null,
    body: `
      <p>Health systems already employ or contract the specialists patients need. The leakage still happens. Referring clinics cannot see which sessions are open. Access teams work from stale lists. The patient who needed orthopedics this week finds a competitor who answered the phone.</p>
      <p>This paper describes a specific Ingenio Care use case: the Marketplace as an inventory of available in-system capacity, not another provider directory.</p>
      <h3>The problem in operating terms</h3>
      <p>Referral leakage is usually diagnosed as a loyalty or “keepage” issue. The daily failure is more concrete. The referring clinician does not have a bookable next step. The packet is incomplete. The receiving clinic is closed to new patients at one site while another site in the same group has openings nobody advertised.</p>
      <h3>What the Marketplace changes</h3>
      <ul>
        <li>Providers, services, and open sessions are visible in one place</li>
        <li>Referring teams offer a real appointment instead of a fax and a hope</li>
        <li>Access leaders can see which locations still have unused sessions</li>
      </ul>
      <h3>Matching need to unused capacity</h3>
      <p>Capacity is often sitting unused while patients and referring clinics hunt by phone. The Marketplace surfaces that inventory so the next step is a scheduled visit. New patients land where the capacity is, and the busy site’s hold time comes down without hiring another scheduler.</p>
      <h3>Plans and employers on the same inventory</h3>
      <p>The same bookable view serves health-plan customer service and self-funded groups. “Couldn’t get an appointment” exceptions drop when contracted capacity is no longer invisible.</p>
      <h3>Measures that matter</h3>
      <p>Time to in-system appointment. Share of specialty referrals that stay inside the enterprise. Filled vs idle specialty sessions. Completeness of the inbound packet. These are operating measures, not a new population-health dashboard.</p>
      <h3>Takeaways</h3>
      <ul>
        <li>Leakage is often an availability problem, not a brand problem</li>
        <li>Directories do not fill sessions; bookable inventory does</li>
        <li>Referring and receiving sites need the same picture of what is open</li>
        <li>Ingenio Care’s Marketplace is the matching layer for that inventory</li>
      </ul>
      <p>Request the full paper for the operating sequence, the roles on access teams, and how Marketplace sits with the Provider App and Digital Front Doors.</p>
    `,
  },
  {
    type: "whitepaper",
    slug: "digital-front-door-for-specialty-access",
    title: "A digital front door for specialty access",
    subtitle: "How complete referrals and bookable sessions replace hold times and leaked demand",
    summary:
      "A proposed paper on Digital Front Doors for specialty care: collect the reason for referral, coverage, and site preference, then offer the next available session so patients leave with a time—not another callback.",
    hashtags: ["whitepaper", "digital-front-doors", "specialty-care", "access", "use-case"],
    status: "draft",
    gated: 1,
    publishedAt: null,
    body: `
      <p>Specialty access is often the slowest step in the journey. A long hold, an incomplete packet, or a missing insurance check is how demand leaks to a competitor—or to the emergency department.</p>
      <p>Ingenio Care’s Digital Front Doors for specialty care are a use case, not a slogan: route the patient to available specialty capacity, coordinate the referral, and keep both sides informed until care is delivered.</p>
      <h3>The GI-line problem</h3>
      <p>A health system’s GI (or ortho, derm, cardiology) phone line becomes the bottleneck. Every request is a conversation. Patients abandon the hold. Those who get through still leave without a time because imaging, coverage, or the reason for referral is missing.</p>
      <h3>What the front door collects first</h3>
      <ul>
        <li>Reason for referral and relevant studies already done</li>
        <li>Coverage and site preference</li>
        <li>Enough history that the first visit is a treatment decision, not another intake</li>
      </ul>
      <h3>What the patient leaves with</h3>
      <p>The next available session. A real time. Context that follows if the date is rescheduled. No-shows fall when people are not asked to call back later to “see what we can do.”</p>
      <h3>Home-health and facility routing</h3>
      <p>When a home patient needs a wound specialist mid-episode, the front door reuses the existing record. Overnight staff in a community can connect to an available clinician with chart context instead of defaulting to 911 for questions that belong on site.</p>
      <h3>Specialists on the receiving end</h3>
      <p>Inbound volume is steadier and more complete. Referral coordinators are not rebuilding packets for every sender. First visits start with the right studies in hand.</p>
      <h3>Takeaways</h3>
      <ul>
        <li>Specialty delay is often incomplete intake plus hidden capacity</li>
        <li>A digital front door should end in a booked session, not a ticket</li>
        <li>The same door can serve clinics, home health, and facilities without a new paper packet</li>
        <li>Call centers should handle exceptions, not every specialty request</li>
      </ul>
      <p>Request the full paper for the referral data model, the handoff to Marketplace capacity, and implementation notes for service-line access teams.</p>
    `,
  },
  {
    type: "whitepaper",
    slug: "closing-the-loop-in-home-based-care",
    title: "Closing the loop in home-based care",
    subtitle: "Visibility between agencies, referring physicians, and families",
    summary:
      "A proposed paper on the home-health use case: the Patient App and Provider App keep visit plans, completions, and specialty needs on one record so cases do not drop after the first week or bounce to the ER.",
    hashtags: ["whitepaper", "home-health", "patient-app", "provider-app", "use-case"],
    status: "draft",
    gated: 1,
    publishedAt: null,
    body: `
      <p>Home-based care fails in the gaps: the family missed the start-of-care call, the attending never learned the visit happened, and a new specialty need mid-episode restarts as a blank referral—or an emergency-department visit.</p>
      <p>This paper treats Ingenio Care as the coordination layer for that use case. The Patient App is the shared timeline. The Provider App is how referring physicians see that the work occurred. Digital Front Doors reuse the record when a new specialty input is required.</p>
      <h3>Start of care without the voicemail loop</h3>
      <p>Agencies lose the first week when families cannot be reached. The Patient App shows the visit window, the nurse’s next step, and who to contact. Coordinators stop rebuilding the schedule from sticky notes.</p>
      <h3>Why physicians stop referring—and how they start again</h3>
      <p>Attending clinicians send fewer cases when feedback never comes back. The Provider App shows visit completion and open questions. Referrals return because the loop is visible, not because the agency hired more liaisons to make “status please” calls.</p>
      <h3>A new need mid-episode</h3>
      <p>Wound care, behavioral health, or a specialty consult should not require a full paper packet. The digital front door carries the existing record and offers the next available consult so the patient stays on the home-health plan.</p>
      <h3>Families and designated contacts</h3>
      <p>One timeline for medications, visits, and follow-up reduces the hidden workload of repeating status to multiple relatives. That time returns to residents and patients rather than the nurses’ station phone.</p>
      <h3>Assisted living and after-hours questions</h3>
      <p>The same pattern applies when overnight facility staff have one play: send the resident out. Connecting to an available clinician with chart context is a safer default than an automatic transfer for issues that can be handled on site.</p>
      <h3>Takeaways</h3>
      <ul>
        <li>Home-health leakage is often a visibility failure, not a clinical one</li>
        <li>Referring physicians refer when they can see completed visits</li>
        <li>Mid-episode specialty needs should reuse the current record</li>
        <li>Patient, provider, and front-door products have to sit on the same journey</li>
      </ul>
      <p>Request the full paper for the role map across agency, clinic, and family; the measures for start-of-care and loop closure; and how post-acute teams join the Ingenio Care network.</p>
    `,
  },
  {
    type: "whitepaper",
    slug: "self-funded-access-without-the-leakage",
    title: "Self-funded access without the leakage",
    subtitle: "How employers shorten time-to-care and keep utilization in a coordinated network",
    summary:
      "A proposed paper for self-funded employers: use the Plan App, Patient App, and Marketplace so employees reach in-network care quickly instead of leaking to urgent care, out-of-network specialists, and the ER.",
    hashtags: ["whitepaper", "employers", "plan-app", "value-based-care", "use-case"],
    status: "draft",
    gated: 1,
    publishedAt: null,
    body: `
      <p>Self-funded employers do not lack vendors. They lack a path from “I need a clinician this week” to an in-network visit that actually occurs. Access delays become avoidable emergency use, out-of-network specialty claims, and abandoned referrals the plan already pays for.</p>
      <p>This paper is a use-case guide for that buyer: Ingenio Care as the coordinated front door, not another disconnected portal.</p>
      <h3>The three leaks</h3>
      <ul>
        <li>Time: employees wait because contracted capacity is invisible</li>
        <li>Site: non-emergent issues default to the ER or retail clinics</li>
        <li>Follow-through: imaging, wellness, and specialist visits stall after the first order</li>
      </ul>
      <h3>Plan App as benefits plus a bookable next step</h3>
      <p>Members often know they have coverage and not who is open. Pairing benefit context with in-network routing turns the first call into a booked visit. Care managers stop repeating directories.</p>
      <h3>Patient App for the sequence after the visit</h3>
      <p>Discharge tasks, screenings, and specialist follow-up live on one timeline. Employees who stall after an imaging order can finish the next step the same week. Family contacts can see the window of care without calling HR.</p>
      <h3>Marketplace for contracted capacity that was never found</h3>
      <p>Self-funded groups often pay for clinic time employees never see. Listing same-week primary and specialty openings moves utilization into the contracted network. Brokers can show leadership that access changed—not that another pamphlet shipped.</p>
      <h3>What this is not</h3>
      <p>It is not a new TPA. It is not a population-health overlay that leaves scheduling untouched. The operating bet is narrower: find the employee who needs care now, and deliver that care through a coordinated network with unused capacity made visible.</p>
      <h3>Takeaways</h3>
      <ul>
        <li>Employer cost follows access failure as much as unit price</li>
        <li>Benefits navigation without bookable capacity still ends in the ER</li>
        <li>Follow-up completion is part of the same use case as the first appointment</li>
        <li>Plan App, Patient App, and Marketplace should be bought as one journey</li>
      </ul>
      <p>Request the full paper for the buyer checklist, the measures HR and finance should watch, and how Ingenio Care sits beside the existing TPA and carrier.</p>
    `,
  },
];
