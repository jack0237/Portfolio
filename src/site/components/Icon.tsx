// Icônes Lucide (ISC), trait 1,5 px, extrémités carrées (ASSETS.md 8).
// Les flèches sont des SVG : Mona Sans ne contient ni → ni ↗.
const PATHS = {
  "arrow-right": "M5 12h14M12 5l7 7-7 7",
  "arrow-left": "m12 19-7-7 7-7M19 12H5",
  "arrow-up-right": "M7 7h10v10M7 17 17 7",
  "arrow-down": "M12 5v14M19 12l-7 7-7-7",
  "arrow-up": "m5 12 7-7 7 7M12 19V5",
  menu: "M4 5h16M4 12h16M4 19h16",
  x: "M18 6 6 18M6 6l12 12",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      className={className ? `icon ${className}` : "icon"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

export function Crosses() {
  return (
    <span className="crosses" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}
