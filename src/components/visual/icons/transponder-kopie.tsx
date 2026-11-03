import { IconBase, type IconProps } from './icon-base';

/** Transponder kopieren: zwei Chips mit Beinchen und ein Pfeil dazwischen. */
export function IconTransponderKopie(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect className="fill-area-muted" stroke="none" x={31} y={18} width={12} height={12} rx={2} />
      <rect x={5} y={18} width={12} height={12} rx={2} />
      <path d="M9 18V14M13 18V14M9 30V34M13 30V34" />
      <rect x={31} y={18} width={12} height={12} rx={2} />
      <path d="M35 18V14M39 18V14M35 30V34M39 30V34" />
      <path d="M21 24H27M24 21L27 24L24 27" />
    </IconBase>
  );
}
