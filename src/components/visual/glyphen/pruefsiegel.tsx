import { IconBase, type IconProps } from '../icons/icon-base';

/** Prüfsiegel: Schild mit spitzem Ende und Haken. Einsatz: geprüfte Qualität, Sicherheitsnachweis. */
export function GlyphPruefsiegel({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M24 7L38 12V24L24 41L10 24V12Z" />
      <path d="M17 24L22 29L31 19" />
    </IconBase>
  );
}
