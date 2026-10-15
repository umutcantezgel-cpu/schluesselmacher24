import { IconBase, type IconProps } from '../icons/icon-base';

/** Rechner: Gehäuse mit Anzeige oben und sechs Tasten in drei Spalten und zwei Reihen. */
export function GlyphRechner({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M12 7H36V41H12Z" />
      <path d="M16 13H32V19H16Z" />
      <path d="M15.5 27H18.5M22.5 27H25.5M29.5 27H32.5M15.5 35H18.5M22.5 35H25.5M29.5 35H32.5" />
    </IconBase>
  );
}
