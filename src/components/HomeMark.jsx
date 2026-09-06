const marks = {
  access: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </>
  ),
  orchestration: (
    <>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="12" cy="18" r="2.5" />
      <path d="M8 7.5 10.8 15" />
      <path d="M16 7.5 13.2 15" />
    </>
  ),
  economics: (
    <>
      <path d="M4 18V7" />
      <path d="M10 18V4" />
      <path d="M16 18v-8" />
      <path d="M22 18v-5" />
    </>
  ),
  efficiency: (
    <>
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
    </>
  ),
  utilization: (
    <>
      <path d="M4 19h16" />
      <path d="M7 16v-5" />
      <path d="M12 16V8" />
      <path d="M17 16v-8" />
    </>
  ),
  value: (
    <>
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.6-7 10-7 10z" />
    </>
  ),
  navigation: (
    <>
      <polygon points="12 3 20 20 12 16 4 20" />
    </>
  ),
  coordination: (
    <>
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <circle cx="12" cy="6" r="2.5" />
      <path d="M7.8 16.1 10.6 8.6" />
      <path d="M16.2 16.1 13.4 8.6" />
    </>
  ),
  engagement: (
    <>
      <path d="M21 12a8 8 0 0 1-8 8H7l-4 3V12a8 8 0 1 1 18 0z" />
    </>
  ),
  collaboration: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="3" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  longitudinal: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  pharmacy: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </>
  ),
  patient: (
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M6.5 19a5.5 5.5 0 0 1 11 0" />
    </>
  ),
  providers: (
    <>
      <path d="M12 3v6" />
      <path d="M9 6h6" />
      <circle cx="12" cy="14" r="2.4" />
      <path d="M7 21a5 5 0 0 1 10 0" />
    </>
  ),
  systems: (
    <>
      <path d="M4 20V9l8-5 8 5v11" />
      <path d="M9 20v-6h6v6" />
    </>
  ),
  plans: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </>
  ),
  employers: (
    <>
      <rect x="3" y="8" width="18" height="12" rx="1.5" />
      <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </>
  ),
  postacute: (
    <>
      <path d="M4 12 12 5l8 7" />
      <path d="M6 11v9h12v-9" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  community: (
    <>
      <circle cx="8" cy="9" r="2.4" />
      <circle cx="16" cy="9" r="2.4" />
      <path d="M3.5 19a4.5 4.5 0 0 1 9 0" />
      <path d="M11.5 19a4.5 4.5 0 0 1 9 0" />
    </>
  ),
};

export default function HomeMark({ name }) {
  return (
    <svg
      className="home-mark-svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {marks[name]}
    </svg>
  );
}
