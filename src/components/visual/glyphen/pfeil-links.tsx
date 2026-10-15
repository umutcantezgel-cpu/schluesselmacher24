import { IconBase, type IconProps } from '../icons/icon-base';

/** Pfeil nach links: zurück. */
export function GlyphPfeilLinks({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M38 24H11" />
      <path d="M21 13.5L10.5 24L21 34.5" />
    </IconBase>
  );
}
