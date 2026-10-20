import { IconBase, type IconProps } from '../icons/icon-base';

/** Uhr: Kreis mit Zeigern auf 12 und 3 Uhr. Einsatz: Uhrzeit, Dauer, Öffnungszeiten. */
export function GlyphUhr({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <circle cx="24" cy="24" r="16" />
      <path d="M24 14V24H33" />
    </IconBase>
  );
}
