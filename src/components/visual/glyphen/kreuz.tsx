import { IconBase, type IconProps } from '../icons/icon-base';

/** Kreuz: schließen, entfernen. */
export function GlyphKreuz({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M14 14L34 34" />
      <path d="M34 14L14 34" />
    </IconBase>
  );
}
