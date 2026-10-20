import { IconBase, type IconProps } from '../icons/icon-base';

/** Ort: Tropfenform mit Kreis innen. Einsatz: Standort, Filiale, Anfahrt. */
export function GlyphOrt({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M24 41L13.9 25.5A12 12 0 1 1 34.1 25.5Z" />
      <circle cx="24" cy="19" r="4.5" />
    </IconBase>
  );
}
