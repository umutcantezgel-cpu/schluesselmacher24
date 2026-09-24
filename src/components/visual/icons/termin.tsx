import { IconBase, type IconProps } from './icon-base';

/** Termin: Kalenderblatt mit markiertem Tag. */
export function IconTermin(props: IconProps) {
  return (
    <IconBase {...props}>
      <path className="fill-area-muted" stroke="none" d="M7 18v-6a3 3 0 0 1 3-3h28a3 3 0 0 1 3 3v6z" />
      <rect x={7} y={9} width={34} height={33} rx={3} />
      <path d="M7 18h34M16 5v7M32 5v7" />
      <circle cx={15} cy={25} r={0.5} />
      <circle cx={24} cy={25} r={0.5} />
      <circle cx={33} cy={25} r={0.5} />
      <circle cx={15} cy={33} r={0.5} />
      <circle cx={24} cy={33} r={0.5} />
      <circle className="fill-area" stroke="none" cx={33} cy={33} r={3.5} />
    </IconBase>
  );
}
