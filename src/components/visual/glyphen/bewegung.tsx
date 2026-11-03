import { IconBase, type IconProps } from '../icons/icon-base';

/** Bewegung: Kreis mit drei Bewegungsspuren rechts davon, unterschiedlich lang. */
export function GlyphBewegung({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <circle cx={14} cy={24} r={6} />
      <path d="M26 18H36M26 24H40M26 30H32" />
    </IconBase>
  );
}
