import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function icon(props: IconProps) {
  return {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
    ...props,
  };
}

const solid = { fill: "currentColor", stroke: "none" } as const;

export function SparkleIcon(props: IconProps) {
  return (
    <svg {...icon(props)} {...solid}>
      <path d="M12 2.6c.85 4.35 2.3 5.85 6.7 6.75-4.4.9-5.85 2.4-6.7 6.75-.85-4.35-2.3-5.85-6.7-6.75 4.4-.9 5.85-2.4 6.7-6.75Z" />
      <path d="M18.6 14.2c.4 2.05 1.1 2.75 3.15 3.15-2.05.4-2.75 1.1-3.15 3.15-.4-2.05-1.1-2.75-3.15-3.15 2.05-.4 2.75-1.1 3.15-3.15Z" />
    </svg>
  );
}

export function SparkleSmallIcon(props: IconProps) {
  return (
    <svg {...icon(props)} {...solid}>
      <path d="M12 2.6c.85 4.35 2.3 5.85 6.7 6.75-4.4.9-5.85 2.4-6.7 6.75-.85-4.35-2.3-5.85-6.7-6.75 4.4-.9 5.85-2.4 6.7-6.75Z" />
    </svg>
  );
}

export function PanelIcon(props: IconProps) {
  return (
    <svg {...icon(props)}>
      <rect x="3" y="4" width="18" height="16" rx="3.5" />
      <path d="M9.5 4v16" />
      <path d="M6 8v8" strokeWidth="2.4" />
    </svg>
  );
}

export function EditIcon(props: IconProps) {
  return (
    <svg {...icon(props)} {...solid}>
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Z" />
      <path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z" />
    </svg>
  );
}

export function HistoryIcon(props: IconProps) {
  return (
    <svg {...icon(props)} {...solid}>
      <path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6a7 7 0 1 1 7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.95 8.95 0 1 0 13 3Z" />
      <path d="M12 7.5V12l3.5 2.1.8-1.3L13 11.1V7.5Z" />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg {...icon(props)}>
      <path d="M12 3.5v11" />
      <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
      <path d="M4.5 17v1.5A2.5 2.5 0 0 0 7 21h10a2.5 2.5 0 0 0 2.5-2.5V17" />
    </svg>
  );
}

export function TagIcon(props: IconProps) {
  return (
    <svg {...icon(props)}>
      <path d="M3.5 11.4V4.5A1 1 0 0 1 4.5 3.5h6.9a1 1 0 0 1 .7.3l8.1 8.1a1 1 0 0 1 0 1.4l-6.9 6.9a1 1 0 0 1-1.4 0l-8.1-8.1a1 1 0 0 1-.3-.7Z" />
      <circle cx="8" cy="8" r="1.3" />
    </svg>
  );
}

export function SchoolIcon(props: IconProps) {
  return (
    <svg {...icon(props)}>
      <path d="M12 4 2.5 8.5 12 13l9.5-4.5L12 4Z" />
      <path d="M6.5 10.7V16c0 1.6 2.5 2.8 5.5 2.8s5.5-1.2 5.5-2.8v-5.3" />
      <path d="M21.5 8.5v5.2" />
    </svg>
  );
}

export function GearIcon(props: IconProps) {
  return (
    <svg {...icon(props)} strokeWidth={1.6}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.14.35.4.64.73.83H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...icon(props)} strokeWidth={1.9}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...icon(props)} strokeWidth={2}>
      <path d="m6 9.5 6 6 6-6" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...icon(props)} strokeWidth={1.9}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...icon(props)} strokeWidth={1.9}>
      <path d="m6.5 6.5 11 11" />
      <path d="m17.5 6.5-11 11" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...icon(props)} strokeWidth={2.2}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg {...icon(props)}>
      <path d="M4.5 7h15" />
      <path d="M9.5 7V4.5h5V7" />
      <path d="M6.5 7l.8 12.1a1 1 0 0 0 1 .9h7.4a1 1 0 0 0 1-.9L17.5 7" />
      <path d="M10.5 11v5.5" />
      <path d="M13.5 11v5.5" />
    </svg>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <svg {...icon(props)} strokeWidth={2}>
      <path d="M12 19V5" />
      <path d="m6 11 6-6 6 6" />
    </svg>
  );
}

export function PaperclipIcon(props: IconProps) {
  return (
    <svg {...icon(props)}>
      <path d="M20 11.5 12.3 19a4.6 4.6 0 0 1-6.5-6.5l8-8a3 1 0 0 1 4.3 4.3l-8 8a1.4 1.4 0 0 1-2-2l7.3-7.3" />
    </svg>
  );
}

export function BoltIcon(props: IconProps) {
  return (
    <svg {...icon(props)}>
      <path d="M13.5 3 5.8 13.2h4.6L10 21l7.7-10.2h-4.6L13.5 3Z" />
    </svg>
  );
}

export function PowerIcon(props: IconProps) {
  return (
    <svg {...icon(props)}>
      <path d="M12 3v8" />
      <path d="M7.4 6.3a7.2 7.2 0 1 0 9.2 0" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg {...icon(props)}>
      <path d="M7.5 16.5 16.5 7.5" />
      <path d="M9.5 7.5h7v7" />
    </svg>
  );
}

export function AppsIcon(props: IconProps) {
  return (
    <svg {...icon(props)}>
      <path d="M4 8.5 12 4l8 4.5-8 4.5-8-4.5Z" />
      <path d="m4 12.5 8 4.5 8-4.5" />
      <path d="m4 16.5 8 4.5 8-4.5" />
    </svg>
  );
}
