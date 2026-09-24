import { IconBase, type IconProps } from './icon-base';

/** Mehrfachverriegelung: Stulp mit Hauptschloss und drei Verriegelungspunkten. */
export function IconMehrfachverriegelung(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect className="fill-area-muted" stroke="none" x={9} y={17} width={13} height={14} rx={2} />
      <rect x={22} y={4} width={5} height={40} rx={1} />
      <path d="M22 17H11a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11" />
      <path d="M13.5 24.6a2.5 2.5 0 1 1 3 0V28h-3z" />
      <path d="M27 7h9a2 2 0 0 1 0 4h-9M27 22h12a2 2 0 0 1 0 4H27M27 37h9a2 2 0 0 1 0 4h-9" />
    </IconBase>
  );
}
