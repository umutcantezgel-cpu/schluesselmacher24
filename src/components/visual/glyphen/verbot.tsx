import { IconBase, type IconProps } from '../icons/icon-base';

/** Verbot: Kreis mit diagonalem Strich von links oben nach rechts unten. */
export function GlyphVerbot({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <circle cx="24" cy="24" r="17" />
      <path d="M12 12L36 36" />
    </IconBase>
  );
}
