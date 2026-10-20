import { IconBase, type IconProps } from '../icons/icon-base';

/** Suche: Lupe. */
export function GlyphSuche({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <circle cx="21" cy="21" r="12" />
      <path d="M30 30L39 39" />
    </IconBase>
  );
}
