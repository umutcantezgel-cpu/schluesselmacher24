import { IconBase, type IconProps } from './icon-base';

/** Zylindermaß: Länge außen und innen, gemessen ab Mitte Stulpschraube. */
export function IconZylinderMass(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        className="fill-area-muted"
        stroke="none"
        d="M7 18h34a2 2 0 0 1 2 2v9h-3v8a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-8H5v-9a2 2 0 0 1 2-2z"
      />
      <path d="M7 18h34a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-1v8a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-8H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z" />
      <path d="M8 29h12M28 29h12M20 18v11M28 18v11" />
      <circle cx={24} cy={34} r={2} />
      <path d="M5 5v8M24 5v8M43 5v8M6 9h17M25 9h17" />
      <path d="M8.5 6.5L6 9l2.5 2.5M20.5 6.5L23 9l-2.5 2.5M27.5 6.5L25 9l2.5 2.5M39.5 6.5L42 9l-2.5 2.5" />
    </IconBase>
  );
}
