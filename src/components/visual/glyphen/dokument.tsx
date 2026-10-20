import { IconBase, type IconProps } from '../icons/icon-base';

/** Dokument: Blatt mit Eselsohr oben rechts und drei Textzeilen. */
export function GlyphDokument({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <path d="M12 6H30L36 12V42H12Z" />
      <path d="M30 6V12H36" />
      <path d="M18 22H30M18 28H30M18 34H26" />
    </IconBase>
  );
}
