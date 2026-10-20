import { IconBase, type IconProps } from '../icons/icon-base';

/** Bild fehlt: Bildrahmen mit Bergkontur und Sonne, diagonal durchgestrichen. Einsatz: Platzhalter ohne Bild. */
export function GlyphBildFehlt({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M9 9H39V39H9Z" />
      <path d="M9 32L18 23L25 30L30 25L39 34" />
      <circle cx="30" cy="17" r="3" />
      <path d="M6 6L42 42" />
    </IconBase>
  );
}
