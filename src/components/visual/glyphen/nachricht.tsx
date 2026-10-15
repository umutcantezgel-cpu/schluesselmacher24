import { IconBase, type IconProps } from '../icons/icon-base';

/** Nachricht: Sprechblase als abgerundetes Rechteck mit Ecke unten links. */
export function GlyphNachricht({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M12 8H36A4 4 0 0 1 40 12V30A4 4 0 0 1 36 34H16L8 42V12A4 4 0 0 1 12 8Z" />
    </IconBase>
  );
}
