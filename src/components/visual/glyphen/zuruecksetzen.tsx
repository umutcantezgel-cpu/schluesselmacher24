import { IconBase, type IconProps } from '../icons/icon-base';

/** Zurücksetzen: Kreisbogen gegen den Uhrzeigersinn, Pfeilspitze oben links. Einsatz: Eingaben leeren, Änderung rückgängig machen. */
export function GlyphZuruecksetzen({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M24 38A14 14 0 1 0 14.1 14.1" />
      <path d="M21.1 14.1H14.1V7.1" />
    </IconBase>
  );
}
