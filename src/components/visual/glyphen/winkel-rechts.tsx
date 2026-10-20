import { IconBase, type IconProps } from '../icons/icon-base';

/** Winkel nach rechts: Unterpunkt, weiter. */
export function GlyphWinkelRechts({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M19 13.5L29.5 24L19 34.5" />
    </IconBase>
  );
}
