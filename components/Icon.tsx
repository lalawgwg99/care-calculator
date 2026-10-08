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
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3.5h12V21l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4L6 21V3.5z" />
      <path d="M9.5 8.5h5M9.5 12h5" />
    </>
  ),
  stethoscope: (
    <>
      <path d="M6 3.5v5a4 4 0 0 0 8 0v-1" />
      <path d="M10 3.5v6a4 4 0 0 0 8 0V7" />
      <path d="M14 14.5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-2" />
      <circle cx="4" cy="10.5" r="1.5" />
    </>
  ),
  share: (
    <>
      <path d="M12 15V3.5" />
      <path d="M8 7.5L12 3.5l4 4" />
      <path d="M5 12v7.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V12" />
    </>
  ),
  building: (
    <>
      <path d="M4 20V7l8-4 8 4v13" />
      <path d="M4 20h16" />
      <path d="M9 20v-5h6v5" />
      <path d="M9 10.5h.01M15 10.5h.01" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4h2.5l2.2 11h11.6l2.2-8H6.5" />
      <circle cx="9.5" cy="19.5" r="1.5" />
      <circle cx="16.5" cy="19.5" r="1.5" />
    </>
  ),
  bottle: (
    <>
      <path d="M10 3h4" />
      <path d="M10.5 3v3L8 8.5V20a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 16 20V8.5L13.5 6V3" />
      <path d="M8 12.5h8" />
    </>
  ),
  x: <path d="M6 6l12 12M18 6L6 18" />,
  pen: (
    <>
      <path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1z" />
      <path d="M14.5 6.5l3 3" />
    </>
  ),
  utensils: (
    <>
      <path d="M5 3v5.5a2 2 0 0 0 4 0V3" />
      <path d="M7 3v3.5" />
      <path d="M7 10.5V21" />
      <path d="M17 3c-1.6 2.6-1.6 6.2 0 8.8V21" />
      <path d="M17 3v5" />
    </>
  ),
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />,
  zap: <path d="M13 2.5L4.5 13.5H11L10 21.5l8.5-11H12L13 2.5z" />,
  droplet: <path d="M12 3s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11z" />,
  thermometer: (
    <>
      <path d="M10 5a2 2 0 0 1 4 0v8.3a4 4 0 1 1-4 0V5z" />
      <path d="M12 9.5v5" />
    </>
  ),
  wind: (
    <>
      <path d="M3 8h8.5a2.8 2.8 0 1 0-2.8-2.8" />
      <path d="M3 12.5h13.5a2.8 2.8 0 1 1-2.8 2.8" />
      <path d="M3 17h6" />
    </>
  ),
  bandage: (
    <>
      <rect x="3.2" y="8" width="17.6" height="8" rx="4" transform="rotate(-30 12 12)" />
      <path d="M10.6 11.4h.01M13.4 12.6h.01" />
    </>
  ),
  toilet: (
    <>
      <rect x="7" y="2.5" width="10" height="4" rx="1.5" />
      <rect x="6" y="8" width="12" height="13" rx="6" />
      <ellipse cx="12" cy="14.5" rx="3.8" ry="4.3" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.8" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.5 9.3a2.5 2.5 0 1 1 3.4 2.4c-.8.3-.9 1-.9 1.8" />
      <path d="M12 17h.01" />
    </>
  ),
  printer: (
    <>
      <path d="M7 8V3.5h10V8" />
      <rect x="4" y="8" width="16" height="8" rx="2" />
      <path d="M7 13.5h10V21H7z" />
    </>
  ),
  thumbsUp: (
    <>
      <path d="M7 11.5V20H4.5A1.5 1.5 0 0 1 3 18.5v-5.5A1.5 1.5 0 0 1 4.5 11.5H7z" />
      <path d="M7 11.5l3.8-7c1.5 0 2.4 1 2.1 2.4L12 11.5h7.5A1.5 1.5 0 0 1 21 13.3l-1.2 5.2a1.5 1.5 0 0 1-1.5 1.5H7" />
    </>
  ),
  sprout: (
    <>
      <path d="M12 21v-8" />
      <path d="M12 13c0-4 3-7 8-7 0 4-3 7-8 7z" />
      <path d="M12 13c0-4-3-7-8-7 0 4 3 7 8 7z" />
    </>
  ),
  flame: (
    <>
      <path d="M12 21.5c3.8 0 6.5-2.7 6.5-6.5 0-3-1.8-5-3.2-6.6-.9-1-1.8-2.3-2-4.4-2.9 1.9-4.3 4.3-4.8 6.6-.8-.4-1.4-1.1-1.8-2.1C5.9 9.7 5.5 11 5.5 12.5 5.5 18.8 8.2 21.5 12 21.5z" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5" />
      <path d="M12 7.5h.01" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M15.8 15.8L20.5 20.5" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5z" />
      <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20" />
    </>
  ),
  link: (
    <>
      <path d="M10 14a4 4 0 0 0 6 0l2.5-2.5a4 4 0 0 0-6-6L11 7" />
      <path d="M14 10a4 4 0 0 0-6 0l-2.5 2.5a4 4 0 0 0 6 6L13 17" />
    </>
  ),
  megaphone: (
    <>
      <path d="M4 10.5v3A1.5 1.5 0 0 0 5.5 15H7l4 4.5v-14L7 10H5.5A1.5 1.5 0 0 0 4 11.5v-1z" />
      <path d="M15 9.5a3.5 3.5 0 0 1 0 5" />
      <path d="M17.8 7.2a7 7 0 0 1 0 9.6" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.5 2.3 3.8 5.2 3.8 8.5s-1.3 6.2-3.8 8.5c-2.5-2.3-3.8-5.2-3.8-8.5s1.3-6.2 3.8-8.5z" />
    </>
  ),
  square: <rect x="5" y="5" width="14" height="14" rx="3" />,
  minus: <path d="M5 12h14" />,
  ribbon: (
    <>
      <path d="M12 4c3 0 5 2.2 5 5 0 3-3 4.5-5 7-2-2.5-5-4-5-7 0-2.8 2-5 5-5z" />
      <path d="M9.5 13.5L7 21l2.8-1.2L12 21" />
      <path d="M14.5 13.5L17 21l-2.8-1.2L12 21" />
    </>
  ),
  syringe: (
    <>
      <path d="M8 12l5-5 3 3-5 5H8v-3z" />
      <path d="M16 8l5-5" />
      <path d="M10.5 11.5l1 1" />
      <path d="M8 12L5 15" />
      <path d="M3.5 13.5L5 15" />
    </>
  ),
  bone: <path d="M17 10c.7-.7 1.7 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .8.7 1.8 0 2.5l-7 7c-.7.7-1.7 0-2.5 0a2.5 2.5 0 0 0 0 5c.3 0 .5.2.5.5a2.5 2.5 0 1 0 5 0c0-.8-.7-1.8 0-2.5l7-7z" />,
  kidney: (
    <>
      <path d="M15 4c-4.5 0-9 4-9 8.5S10.5 21 15 21c2 0 3-1.2 3-2.8 0-2.2-2.2-2.6-2.2-5.2S18 8.6 18 6.8C18 5.2 17 4 15 4z" />
      <path d="M15 9.5c-1.5 1-2.5 2-2.5 3.5" />
    </>
  ),
  run: (
    <>
      <circle cx="15.5" cy="4.5" r="2" />
      <path d="M13 8.5c-2 0-3.5 1-4.5 2.5L6 14" />
      <path d="M13 8.5c1.5.5 3 2 3.5 3.5l2 3.5" />
      <path d="M13 8.5L9 12l-4 1.5" />
      <path d="M12 12l-1 4-3.5 4" />
      <path d="M12 12l2.5 3 1 5.5" />
    </>
  ),
  chair: (
    <>
      <path d="M7 3v9" />
      <path d="M7 12h11v2H7z" />
      <path d="M8 14v7M17 14v7" />
      <path d="M5 5.5h4" />
    </>
  ),
  footprints: (
    <>
      <ellipse cx="9" cy="8" rx="2.4" ry="3.4" />
      <ellipse cx="15.5" cy="15.5" rx="2.4" ry="3.4" />
    </>
  ),
  balance: (
    <>
      <circle cx="12" cy="4.5" r="2" />
      <path d="M12 7v6" />
      <path d="M5 10h14" />
      <path d="M12 13l-3 7.5" />
      <path d="M12 13c2 0 3 1 4 2.5" />
    </>
  ),
  meditation: (
    <>
      <circle cx="12" cy="5.5" r="2.2" />
      <path d="M12 8.5c-1 2-2.5 3-4.5 3.5" />
      <path d="M12 8.5c1 2 2.5 3 4.5 3.5" />
      <path d="M4 17c2.5-2 5-3 8-3s5.5 1 8 3" />
      <path d="M7 20c2-1.2 3.5-1.8 5-1.8s3 .6 5 1.8" />
    </>
  ),
  music: (
    <>
      <circle cx="8" cy="17.5" r="2.8" />
      <path d="M10.8 17.5V6l9-2v11.5" />
      <path d="M10.8 8.5l9-2" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="6.5" width="12.5" height="11" rx="2.5" />
      <path d="M15.5 10.5l5.5-3v9l-5.5-3" />
    </>
  ),
  dice: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="9" cy="9" r="0.6" />
      <circle cx="15" cy="9" r="0.6" />
      <circle cx="12" cy="12" r="0.6" />
      <circle cx="9" cy="15" r="0.6" />
      <circle cx="15" cy="15" r="0.6" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M4 8l8 6 8-6" />
    </>
  ),
  coffee: (
    <>
      <path d="M5 9h12v6a5 5 0 0 1-5 5H9a4 4 0 0 1-4-4V9z" />
      <path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17" />
      <path d="M8.5 5.5c0-1 .8-1 .8-2M12 5.5c0-1 .8-1 .8-2" />
    </>
  ),
  wrench: (
    <>
      <path d="M14.5 6.5a4 4 0 0 0-5.6 4.8L4 16.2V20h3.8l4.9-4.9a4 4 0 0 0 4.8-5.6l-2.7 2.7-2.5-2.5 2.2-3.2z" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3.5" y="8" width="17" height="12" rx="2.5" />
      <path d="M9 8V6.5A1.5 1.5 0 0 1 10.5 5h3A1.5 1.5 0 0 1 15 6.5V8" />
      <path d="M3.5 13h17" />
    </>
  ),
  car: (
    <>
      <path d="M4 16v-4l2-4.5A2 2 0 0 1 7.8 6h8.4a2 2 0 0 1 1.8 1.5L20 12v4" />
      <path d="M4 12h16" />
      <circle cx="8" cy="16.5" r="1.8" />
      <circle cx="16" cy="16.5" r="1.8" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8" />
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
