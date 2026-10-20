import { IconBase, type IconProps } from '../icons/icon-base';

/** Hilfe: Rettungsring mit vier Verbindungen zwischen den Kreisen. */
export function GlyphHilfe({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <circle cx="24" cy="24" r="17" />
      <circle cx="24" cy="24" r="7" />
      <path d="M12 12L19 19M29 19L36 12M29 29L36 36M19 29L12 36" />
    </IconBase>
  );
}
