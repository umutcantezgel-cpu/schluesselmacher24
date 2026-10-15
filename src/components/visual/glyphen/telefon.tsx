import { IconBase, type IconProps } from '../icons/icon-base';

/** Telefon: Hörer, schräg, mit Ohr- und Sprechmuschel. */
export function GlyphTelefon({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M7 13A23.5 23.5 0 0 0 35 41L33.4 34.1A16.5 16.5 0 0 1 13.9 14.6Z" />
    </IconBase>
  );
}
