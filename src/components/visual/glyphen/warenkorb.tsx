import { IconBase, type IconProps } from '../icons/icon-base';

/** Warenkorb: Einkaufstasche mit Henkel, Körper leicht trapezförmig. */
export function GlyphWarenkorb({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M9 17H39L36 41H12Z" />
      <path d="M17 17V13A7 7 0 0 1 31 13V17" />
    </IconBase>
  );
}
