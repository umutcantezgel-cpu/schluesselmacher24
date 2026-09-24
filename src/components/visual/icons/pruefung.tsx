import { IconBase, type IconProps } from './icon-base';

/** Prüfung: Lupe über der Zahnung eines Schlüssels. */
export function IconPruefung(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle className="fill-area-muted" stroke="none" cx={28} cy={20} r={10} />
      <path d="M15.11 17H33l3 3-3 3h-2l-1.5-2-1.5 2h-2l-1.5-2-1.5 2h-7.89a5.5 5.5 0 1 1 0-6z" />
      <circle cx={8.5} cy={20} r={1.5} />
      <circle cx={28} cy={20} r={10} />
      <rect x={36.1} y={25.6} width={9} height={5} rx={2.5} transform="rotate(45 35.07 27.07)" />
    </IconBase>
  );
}
