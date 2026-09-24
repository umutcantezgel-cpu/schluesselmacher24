import { IconBase, type IconProps } from './icon-base';

/** Schutzbeschlag: Langschild mit Drücker und Zylinderabdeckung (Ziehschutz). */
export function IconSchutzbeschlag(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect className="fill-area-muted" stroke="none" x={18} y={5} width={16} height={38} rx={8} />
      <rect x={18} y={5} width={16} height={38} rx={8} />
      <circle cx={26} cy={14} r={3} />
      <path d="M23 14H9" />
      <circle cx={26} cy={32} r={5} />
      <path d="M26 30v4" />
    </IconBase>
  );
}
