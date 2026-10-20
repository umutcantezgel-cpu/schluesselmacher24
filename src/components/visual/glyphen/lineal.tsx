import { IconBase, type IconProps } from '../icons/icon-base';

/** Lineal: schräg gelegt, Teilstriche abwechselnd lang und kurz. */
export function GlyphLineal({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M8.5 32.5L32.5 8.5L39.5 15.5L15.5 39.5Z" />
      <path d="M19 36L15.5 32.5M23.3 31.7L21.2 29.6M27.5 27.5L24 24M31.8 23.2L29.6 21.1M36 19L32.5 15.5" />
    </IconBase>
  );
}
