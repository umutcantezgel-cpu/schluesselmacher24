import { IconBase, type IconProps } from '../icons/icon-base';

/** Haken im Kreis: Bestätigung, erfüllt. */
export function GlyphHakenKreis({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <circle cx="24" cy="24" r="17" />
      <path d="M16.5 24.5L22 30L32 18.5" />
    </IconBase>
  );
}
