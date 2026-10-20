import { IconBase, type IconProps } from '../icons/icon-base';

/** Information: Hinweis zum Lesen. */
export function GlyphInfo({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <circle cx="24" cy="24" r="17" />
      <path d="M24 22V33" />
      <path d="M24 15.5V15.6" />
    </IconBase>
  );
}
