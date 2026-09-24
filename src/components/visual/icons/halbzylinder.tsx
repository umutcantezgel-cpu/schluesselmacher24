import { IconBase, type IconProps } from './icon-base';

/** Halbzylinder, Seitenansicht: Schließbart am Ende, dort das Stulpschraubenloch. */
export function IconHalbzylinder(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        className="fill-area-muted"
        stroke="none"
        d="M11 11h26a2 2 0 0 1 2 2v11h-2v9a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2v-9H9V13a2 2 0 0 1 2-2z"
      />
      <path d="M11 11h26a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2v9a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2v-9h-1a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2z" />
      <path d="M12 24h13M25 11v13M33 11v13" />
      <rect className="fill-area" stroke="none" x={26.5} y={13.5} width={5} height={8} rx={2.5} />
      <circle cx={29} cy={29.5} r={2.5} />
    </IconBase>
  );
}
