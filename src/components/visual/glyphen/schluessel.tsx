import { IconBase, type IconProps } from '../icons/icon-base';

/**
 * Schlüssel in Seitenansicht wie im Generator `schluessel`: runde Reide, langer
 * Halm, Bart mit zwei Einschnitten nach unten. Einsatz: Autoschlüssel, Schließung, Zugang.
 */
export function GlyphSchluessel({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <circle cx="13" cy="21" r="8.5" />
      <path d="M21.5 21H43" />
      <path d="M43 21V27H39.5L37 30.5L34.5 27H31.5L29 30.5L26.5 27H21.5" />
    </IconBase>
  );
}
