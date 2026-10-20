import { IconBase, type IconProps } from '../icons/icon-base';

/** Filter: drei Schienen mit versetzten Reglern. Einsatz: Ergebnisse eingrenzen, Optionen wählen. */
export function GlyphFilter({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M6 14H26M34 14H42" />
      <circle cx="30" cy="14" r="4" />
      <path d="M6 24H12M20 24H42" />
      <circle cx="16" cy="24" r="4" />
      <path d="M6 34H28M36 34H42" />
      <circle cx="32" cy="34" r="4" />
    </IconBase>
  );
}
