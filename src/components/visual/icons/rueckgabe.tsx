import { IconBase, type IconProps } from './icon-base';

/** Rückgabe: Paket mit Rücksendepfeil. */
export function IconRueckgabe(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect className="fill-area-muted" stroke="none" x={13} y={21} width={28} height={21} rx={2} />
      <rect x={13} y={21} width={28} height={21} rx={2} />
      <path d="M13 28h28M24 21v10h6V21" />
      <path d="M35 17v-3a4 4 0 0 0-4-4H9M13 6l-4 4 4 4" />
    </IconBase>
  );
}
