import { IconBase, type IconProps } from '../icons/icon-base';

/** Minus: weniger. */
export function GlyphMinus({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M11 24H37" />
    </IconBase>
  );
}
