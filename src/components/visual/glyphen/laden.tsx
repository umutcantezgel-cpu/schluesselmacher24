import { IconBase, type IconProps } from '../icons/icon-base';

/** Ladeanzeige: Dreiviertelkreis, dreht sich über `animate-spin` (B-19). */
export function GlyphLaden({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M24 8A16 16 0 1 1 8 24" />
    </IconBase>
  );
}
