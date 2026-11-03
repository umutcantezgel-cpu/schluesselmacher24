import { IconBase, type IconProps } from '../icons/icon-base';

/** Abspielen: Dreieck mit runden Ecken, Gegenstück zu GlyphPause (B-36). */
export function GlyphAbspielen({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M17 12L35 24L17 36Z" />
    </IconBase>
  );
}
