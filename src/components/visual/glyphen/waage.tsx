import { IconBase, type IconProps } from '../icons/icon-base';

/** Waage: Säule, Balken und zwei Schalen. Einsatz: Gewicht, Vergleich, Abwägen von Optionen. */
export function GlyphWaage({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M24 9V41" />
      <path d="M17 41H31" />
      <path d="M9 15H39" />
      <path d="M9 15L4 27M9 15L14 27" />
      <path d="M4 27A5 3 0 0 0 14 27" />
      <path d="M39 15L34 27M39 15L44 27" />
      <path d="M34 27A5 3 0 0 0 44 27" />
    </IconBase>
  );
}
