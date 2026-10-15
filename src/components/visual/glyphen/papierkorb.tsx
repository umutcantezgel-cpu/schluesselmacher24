import { IconBase, type IconProps } from '../icons/icon-base';

/** Papierkorb: Deckel mit Griff, konischer Behälter, zwei Rillen. Einsatz: Eintrag oder Position entfernen. */
export function GlyphPapierkorb({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M8 12H40" />
      <path d="M19 12V9L21 7H27L29 9V12" />
      <path d="M11.5 12L13.5 41H34.5L36.5 12" />
      <path d="M20 18V35M28 18V35" />
    </IconBase>
  );
}
