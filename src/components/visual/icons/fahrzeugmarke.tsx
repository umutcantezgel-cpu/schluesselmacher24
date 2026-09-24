import { IconBase, type IconProps } from './icon-base';

/** Fahrzeugfront ohne Markenzeichen – steht für Marke und Modell. */
export function IconFahrzeugmarke(props: IconProps) {
  return (
    <IconBase {...props}>
      <path className="fill-area-muted" stroke="none" d="M14.5 21l3-8.5a2 2 0 0 1 1.9-1.5h9.2a2 2 0 0 1 1.9 1.5l3 8.5z" />
      <path d="M13 22l3.6-10.2A3 3 0 0 1 19.4 10h9.2a3 3 0 0 1 2.8 1.8L35 22" />
      <rect x={7} y={22} width={34} height={14} rx={3} />
      <path d="M10 36v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3M32 36v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3" />
      <circle cx={13.5} cy={28.5} r={2} />
      <circle cx={34.5} cy={28.5} r={2} />
      <path d="M20 30.5h8M9.5 19.5l3.5 1.5M38.5 19.5L35 21" />
    </IconBase>
  );
}
