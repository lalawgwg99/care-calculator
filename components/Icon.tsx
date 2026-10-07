// CarePilot 共用線性圖標：取代全站 emoji 圖標用。
// Apple 風格：1.8px 描邊、圓角端點、currentColor，質感統一。

const PATHS: Record<string, React.ReactNode> = {
  scale: (
    <>
      <path d="M12 3v18" />
      <path d="M5 7h14" />
      <path d="M7 7l-3 7a3.5 3.5 0 0 0 7 0L8 7" />
      <path d="M17 7l-3 7a3.5 3.5 0 0 0 7 0l-3-7" />
      <path d="M8 21h8" />
    </>
  ),
  landmark: (
    <>
      <path d="M3 9.5L12 4l9 5.5" />
      <path d="M5 9.5V18" />
      <path d="M9.5 9.5V18" />
      <path d="M14.5 9.5V18" />
      <path d="M19 9.5V18" />
      <path d="M3 18.5h18" />
      <path d="M3 21h18" />
    </>
  ),
  scroll: (
    <>
      <path d="M7 4h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7" />
      <path d="M7 4a2 2 0 0 0-2 2v14a2 2 0 0 1-2 2" />
      <path d="M7 4a2 2 0 0 1 2-2h0" />
      <path d="M10 10h6M10 14h6" />
    </>
  ),
  coins: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v6c0 1.66 3.13 3 7 3s7-1.34 7-3V6" />
      <path d="M5 12v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
      <path d="M9.5 12l2 2 3.5-4" />
    </>
  ),
  heart: <path d="M12 20.5S3.5 15.5 3.5 9.5A4.5 4.5 0 0 1 8 5c1.5 0 3 .8 4 2.2A4.5 4.5 0 0 1 16 5a4.5 4.5 0 0 1 4.5 4.5c0 6-8.5 11-8.5 11z" />,
  clipboard: (
    <>
      <rect x="6" y="4.5" width="12" height="16" rx="2.5" />
      <path d="M9 4.5V3h6v1.5" />
      <rect x="9" y="2" width="6" height="3.5" rx="1" />
      <path d="M9.5 11h5M9.5 14.5h5M9.5 18h3" />
    </>
  ),
  check: <path d="M4.5 12.5l5 5 10-11" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5.5" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-5.3-6.5-10.5A6.5 6.5 0 0 1 12 4a6.5 6.5 0 0 1 6.5 6.5C18.5 15.7 12 21 12 21z" />
      <circle cx="12" cy="10.5" r="2.3" />
    </>
  ),
  bulb: (
    <>
      <path d="M9.5 18h5" />
      <path d="M10.5 21h3" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.8.6 1.5 1.4 1.8 2.1h3.4c.3-.7 1-1.5 1.8-2.1A6 6 0 0 0 12 3z" />
    </>
  ),
  calculator: (
    <>
      <rect x="6" y="3" width="12" height="18" rx="2.5" />
      <path d="M9 7.5h6" />
      <path d="M9.5 12h.01M12 12h.01M14.5 12h.01M9.5 15.5h.01M12 15.5h.01M14.5 15.5h.01" />
    </>
  ),
  brain: (
    <>
      <path d="M9.5 4.5A2.5 2.5 0 0 1 11 7a2.5 2.5 0 0 1 4.5-1.5A2.5 2.5 0 0 1 18 8c1.5.5 2 2 1.5 3.5A2.5 2.5 0 0 1 18 15a2.5 2.5 0 0 1-4.5 1.5A2.5 2.5 0 0 1 9 15a2.5 2.5 0 0 1-1.5-3.5A2.5 2.5 0 0 1 6 8c0-1 .5-2 1.5-2.5A2.5 2.5 0 0 1 9.5 4.5z" />
      <path d="M12 4.5V20" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4L12 4z" />
      <path d="M18.5 15.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1z" />
    </>
  ),
  pill: (
    <>
      <rect x="3.5" y="8.5" width="17" height="7" rx="3.5" transform="rotate(-45 12 12)" />
      <path d="M8.5 15.5l7-7" />
    </>
  ),
  phone: (
    <>
      <path d="M5 4h4l1.5 4.5L8 10a12 12 0 0 0 6 6l1.5-2.5L20 15v4a1.5 1.5 0 0 1-1.5 1.5C10.5 20.5 3.5 13.5 3.5 5.5A1.5 1.5 0 0 1 5 4z" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4L2.5 20h19L12 4z" />
      <path d="M12 10v4.5" />
      <path d="M12 17.5h.01" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8" />
      <path d="M17.5 14.2a6.5 6.5 0 0 1 4 5.8" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
      <path d="M4 10h16" />
      <path d="M8.5 3v4M15.5 3v4" />
    </>
  ),
  chat: (
    <>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H9l-5 4v-11z" />
      <path d="M8.5 9.5h7M8.5 12.5h4" />
    </>
  ),
  chart: (
    <>
      <path d="M4 4v16h16" />
      <path d="M8.5 16v-5M13 16V8M17.5 16v-3" />
    </>
  ),
  home: (
    <>
      <path d="M4 11l8-7 8 7" />
      <path d="M6 9.5V20h12V9.5" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 12a8 8 0 1 1-2.3-5.6" />
      <path d="M20 3.5V8h-4.5" />
    </>
  ),
  note: (
    <>
      <path d="M6 3.5h8L19 8.5V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-15.5a1 1 0 0 1 1-1z" />
      <path d="M13.5 3.5V9H19" />
      <path d="M8.5 13h7M8.5 16.5h5" />
    </>
  ),
  hospital: (
    <>
      <path d="M5 20V8l7-4.5L19 8v12" />
      <path d="M4 20h16" />
      <path d="M12 9v6M9 12h6" />
    </>
  ),
  hand: (
    <>
      <path d="M8 12V5.5a1.5 1.5 0 0 1 3 0V11m0-5.5v-1a1.5 1.5 0 0 1 3 0V11m0-4.5a1.5 1.5 0 0 1 3 0V12m0-2.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1.8a6 6 0 0 1-4.7-2.3L3 15.6a1.6 1.6 0 0 1 2.4-2.1L8 16" />
    </>
  ),
  star: <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.5 9.7l5.9-.8L12 3.5z" />,
  doc: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
};

export type IconName = keyof typeof PATHS;

export default function Icon({
  name,
  size = 20,
  className = "",
  strokeWidth = 1.8,
}: {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
