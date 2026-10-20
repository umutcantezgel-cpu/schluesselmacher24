import { IconBase, type IconProps } from '../icons/icon-base';

/** Winkel nach unten: aufklappen. */
export function GlyphWinkelUnten({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M13.5 19L24 29.5L34.5 19" />
    </IconBase>
  );
}
