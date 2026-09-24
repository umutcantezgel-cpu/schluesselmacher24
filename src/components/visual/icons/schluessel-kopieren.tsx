import { IconBase, type IconProps } from './icon-base';

/** Autoschlüssel kopieren: Original und Kopie, versetzt. */
export function IconSchluesselKopieren(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect className="fill-area-muted" stroke="none" x={17} y={6} width={13} height={15} rx={5} />
      <rect x={17} y={6} width={13} height={15} rx={5} />
      <path d="M30 10.5h11a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H30M33 13.5h6" />
      <circle cx={23.5} cy={13.5} r={1.5} />
      <rect x={5} y={27} width={13} height={15} rx={5} />
      <path d="M18 31.5h11a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H18M21 34.5h6" />
      <circle cx={11.5} cy={34.5} r={1.5} />
    </IconBase>
  );
}
