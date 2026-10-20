import { IconBase, type IconProps } from '../icons/icon-base';

/** Haken: erledigt, gewählt, enthalten. */
export function GlyphHaken({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M11 25.5L19.5 34L37 15" />
    </IconBase>
  );
}
