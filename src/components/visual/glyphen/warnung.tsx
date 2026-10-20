import { IconBase, type IconProps } from '../icons/icon-base';

/** Warnung: Dreieck mit Ausrufezeichen. */
export function GlyphWarnung({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M24 9L40.5 37.5H7.5Z" />
      <path d="M24 19V27.5" />
      <path d="M24 32.5V32.6" />
    </IconBase>
  );
}
