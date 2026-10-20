import { IconBase, type IconProps } from '../icons/icon-base';

/** Mail: Briefumschlag mit V-förmiger Klappe. */
export function GlyphMail({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M7 11H41V37H7Z" />
      <path d="M7 11L24 26L41 11" />
    </IconBase>
  );
}
