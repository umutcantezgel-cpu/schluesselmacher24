import { IconBase, type IconProps } from './icon-base';

/** Einsteckschloss: Kasten mit Stulp, Falle, Riegel, Drückernuss und Zylinderloch. */
export function IconEinsteckschloss(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect className="fill-area-muted" stroke="none" x={7} y={7} width={26} height={34} rx={2} />
      <rect x={7} y={7} width={26} height={34} rx={2} />
      <rect x={33} y={4} width={4} height={40} rx={1} />
      <path d="M37 13h3l3 3.5V18h-6M37 27h6v6h-6" />
      <rect x={17} y={12} width={6} height={6} />
      <path d="M18.5 31.6a3 3 0 1 1 3 0V35h-3z" />
    </IconBase>
  );
}
