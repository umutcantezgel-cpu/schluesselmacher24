import { IconBase, type IconProps } from '../icons/icon-base';

/** Bild hochladen: Bildrahmen mit Bergkontur, Pfeil nach oben aus der rechten oberen Ecke. Einsatz: Datei oder Foto hochladen. */
export function GlyphBildHochladen({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M6 16H32V42H6Z" />
      <path d="M6 36L13 29L19 35L24 30L32 38" />
      <path d="M38 24V6" />
      <path d="M32 12L38 6L44 12" />
    </IconBase>
  );
}
