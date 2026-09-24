import { IconBase, type IconProps } from './icon-base';

/** Knaufzylinder, Seitenansicht: Drehknauf innen, Schlüsselseite außen. */
export function IconKnaufzylinder(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect className="fill-area-muted" stroke="none" x={5} y={9} width={9} height={30} rx={3} />
      <rect x={5} y={9} width={9} height={30} rx={3} />
      <path d="M8 17v14M11 17v14" />
      <path d="M14 13h27a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-1v8a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2v-8h-2" />
      <path d="M16 24h9M33 24h7M25 13v11M33 13v11" />
      <rect className="fill-area" stroke="none" x={26.5} y={15.5} width={5} height={6} rx={2.5} />
      <circle cx={29} cy={29} r={2.5} />
    </IconBase>
  );
}
