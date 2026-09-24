import { IconBase, type IconProps } from './icon-base';

/** Außenhautsicherung: Fenster mit aufgesetztem Zusatzschloss. */
export function IconAussenhautsicherung(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect className="fill-area-muted" stroke="none" x={6} y={5} width={26} height={38} rx={2} />
      <rect x={6} y={5} width={26} height={38} rx={2} />
      <path d="M19 5v38M6 24h26" />
      <path d="M32 17h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7" />
      <circle cx={36.5} cy={24} r={2.5} />
    </IconBase>
  );
}
