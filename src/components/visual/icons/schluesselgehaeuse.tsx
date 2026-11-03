import { IconBase, type IconProps } from './icon-base';

/** Funkschlüsselgehäuse als Explosionsansicht: zwei Schalen mit Führungslinien und Klappbart. */
export function IconSchluesselgehaeuse(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect className="fill-area-muted" stroke="none" x={6} y={26.5} width={26} height={9} rx={4} />
      <rect x={6} y={12.5} width={26} height={9} rx={4} />
      <rect x={6} y={26.5} width={26} height={9} rx={4} />
      <circle cx={12} cy={16} r={1.5} />
      <circle cx={17} cy={18} r={1.5} />
      <path d="M12 21.5V26.5M26 21.5V26.5" strokeDasharray="2 2" />
      <path d="M32 29H42V33H38L37 31L36 33H32Z" />
    </IconBase>
  );
}
