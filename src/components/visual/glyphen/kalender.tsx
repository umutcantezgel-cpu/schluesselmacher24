import { IconBase, type IconProps } from '../icons/icon-base';

/** Kalender: Blatt mit Aufhängeringen, Kopfzeile und Tagesfeldern. Einsatz: Termin, Datum, Zeitraum. */
export function GlyphKalender({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M8 10H40V40H8Z" />
      <path d="M16 6V13M32 6V13" />
      <path d="M8 19H40" />
      <path d="M14 27H18M22 27H26M30 27H34" />
      <path d="M14 34H18M22 34H26M30 34H34" />
    </IconBase>
  );
}
