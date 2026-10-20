import { IconBase, type IconProps } from '../icons/icon-base';

/** Speichern: Diskette mit Schieber und Etikett. Einsatz: Eingaben sichern, Entwurf ablegen. */
export function GlyphSpeichern({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M8 10L11 8H32L40 16V38L38 40H10L8 38Z" />
      <path d="M16 8V17H31V8" />
      <path d="M14 40V29H34V40" />
    </IconBase>
  );
}
