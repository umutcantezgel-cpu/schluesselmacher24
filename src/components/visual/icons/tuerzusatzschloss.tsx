import { IconBase, type IconProps } from './icon-base';

/** Türzusatzschloss: aufgesetzter Schlosskasten, Riegel greift in den Schließkasten. */
export function IconTuerzusatzschloss(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect className="fill-area-muted" stroke="none" x={6} y={13} width={22} height={22} rx={3} />
      <rect x={6} y={13} width={22} height={22} rx={3} />
      <circle cx={16} cy={24} r={4} />
      <path d="M16 22v4M28 21h6M28 27h6" />
      <rect x={34} y={15} width={8} height={18} rx={2} />
    </IconBase>
  );
}
