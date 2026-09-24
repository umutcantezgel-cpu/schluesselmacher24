import { IconBase, type IconProps } from './icon-base';

/** Versand: verschlossenes Paket mit Klebeband und Etikett. */
export function IconVersandPaket(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect className="fill-area-muted" stroke="none" x={7} y={11} width={34} height={30} rx={2} />
      <rect x={7} y={11} width={34} height={30} rx={2} />
      <path d="M7 20h34M21 11v14h6V11M30 34h6" />
    </IconBase>
  );
}
