import { IconBase, type IconProps } from '../icons/icon-base';

/** Personen: vordere Person größer, hintere versetzt dahinter. */
export function GlyphPersonen({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <circle cx="18" cy="17" r="6.5" />
      <path d="M4 42A14 14 0 0 1 32 42" />
      <circle cx="33" cy="14" r="5" />
      <path d="M31 26A12 12 0 0 1 43 38" />
    </IconBase>
  );
}
