import { IconBase, type IconProps } from '../icons/icon-base';

/** Kamera: Gehäuse mit Sucheraufbau und mittigem Objektiv. Einsatz: Foto aufnehmen. */
export function GlyphKamera({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M8 39V17H16L19 12H29L32 17H40V39Z" />
      <circle cx="24" cy="28" r="6" />
    </IconBase>
  );
}
