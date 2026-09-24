import { IconBase, type IconProps } from './icon-base';

/** Profil-Doppelzylinder, Seitenansicht: Schließbart in der Mitte, darunter das Stulpschraubenloch. */
export function IconProfilzylinder(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        className="fill-area-muted"
        stroke="none"
        d="M7 11h34a2 2 0 0 1 2 2v11h-3v9a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-9H5V13a2 2 0 0 1 2-2z"
      />
      <path d="M7 11h34a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-1v9a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-9H7a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2z" />
      <path d="M8 24h12M28 24h12M20 11v13M28 11v13" />
      <rect className="fill-area" stroke="none" x={21.5} y={13.5} width={5} height={8} rx={2.5} />
      <circle cx={24} cy={29.5} r={2.5} />
    </IconBase>
  );
}
