import { IconBase, type IconProps } from '../icons/icon-base';

/** Raute: Nummernzeichen mit zwei schrägen senkrechten und zwei waagerechten Strichen. */
export function GlyphRaute({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M18 7L15 41M33 7L30 41M7 18H41M5 30H39" />
    </IconBase>
  );
}
