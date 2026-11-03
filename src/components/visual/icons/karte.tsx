import { IconBase, type IconProps } from './icon-base';

/** Karte: gefaltete Karte aus drei Feldern im Zickzack, mit einem Punkt im Mittelfeld. */
export function IconKarte(props: IconProps) {
  return (
    <IconBase {...props}>
      <path className="fill-area-muted" stroke="none" d="M17 8L31 12V40L17 36Z" />
      <path d="M6 12L17 8L31 12L42 8V36L31 40L17 36L6 40Z" />
      <path d="M17 8V36M31 12V40" />
      <circle cx={24} cy={24} r={2} />
    </IconBase>
  );
}
