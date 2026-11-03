import { IconBase, type IconProps } from '../icons/icon-base';

/** Pause: zwei senkrechte Balken mit runden Enden. */
export function GlyphPause({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M18 12V36M30 12V36" />
    </IconBase>
  );
}
