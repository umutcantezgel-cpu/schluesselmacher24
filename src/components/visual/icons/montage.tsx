import { IconBase, type IconProps } from './icon-base';

/** Montage: Schraubendreher an der Befestigungsschraube eines Beschlags. */
export function IconMontage(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect className="fill-area-muted" stroke="none" x={6} y={5} width={14} height={38} rx={7} />
      <rect x={6} y={5} width={14} height={38} rx={7} />
      <circle cx={13} cy={12} r={2.5} />
      <path d="M11.5 25.6a2.5 2.5 0 1 1 3 0V29h-3z" />
      <circle cx={13} cy={36} r={2.5} />
      <path d="M11.5 37.5l3-3" />
      <path d="M16 33l10-10" />
      <rect x={28} y={8} width={7} height={16} rx={3} transform="rotate(45 31.5 16)" />
    </IconBase>
  );
}
