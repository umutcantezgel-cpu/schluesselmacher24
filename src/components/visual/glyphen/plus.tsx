import { IconBase, type IconProps } from '../icons/icon-base';

/** Plus: hinzufügen, mehr. */
export function GlyphPlus({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M24 11V37" />
      <path d="M11 24H37" />
    </IconBase>
  );
}
