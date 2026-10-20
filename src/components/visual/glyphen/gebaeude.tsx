import { IconBase, type IconProps } from '../icons/icon-base';

/** Gebäude: Hochhaus mit Fenstern und Eingang auf einer Grundlinie. */
export function GlyphGebaeude({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M12 7H36V42H12Z" />
      <path d="M6 42H42" />
      <path d="M15.5 14H18.5M22.5 14H25.5M29.5 14H32.5M15.5 22H18.5M22.5 22H25.5M29.5 22H32.5" />
      <path d="M21 42V33H27V42" />
    </IconBase>
  );
}
