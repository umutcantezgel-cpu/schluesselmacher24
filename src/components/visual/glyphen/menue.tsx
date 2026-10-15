import { IconBase, type IconProps } from '../icons/icon-base';

/** Menü: drei Linien, die mittlere kürzer wie ein Schlüsselbart. */
export function GlyphMenue({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M10 15H38" />
      <path d="M10 24H30" />
      <path d="M10 33H38" />
    </IconBase>
  );
}
