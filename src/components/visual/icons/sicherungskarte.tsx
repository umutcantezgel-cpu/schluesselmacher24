import { IconBase, type IconProps } from './icon-base';

/** Sicherungskarte mit Chip und Datenzeilen (ohne Schrift). */
export function IconSicherungskarte(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect className="fill-area-muted" stroke="none" x={5} y={10} width={38} height={28} rx={3} />
      <rect x={5} y={10} width={38} height={28} rx={3} />
      <rect x={10} y={16} width={9} height={7} rx={1.5} />
      <path d="M14.5 16v7M24 17h14M24 22h9M10 31h28" />
    </IconBase>
  );
}
