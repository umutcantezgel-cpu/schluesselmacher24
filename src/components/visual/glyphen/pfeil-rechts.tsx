import { IconBase, type IconProps } from '../icons/icon-base';

/** Pfeil nach rechts: weiter, öffnen, zum Ziel. */
export function GlyphPfeilRechts({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M10 24H37" />
      <path d="M27 13.5L37.5 24L27 34.5" />
    </IconBase>
  );
}
