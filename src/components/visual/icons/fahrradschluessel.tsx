import { IconBase, type IconProps } from './icon-base';

/** Fahrrad mit Bügelschloss am Rahmen (Strebe bis zum Schloss) und Schlüssel mit Bart rechts darunter. */
export function IconFahrradschluessel(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect className="fill-area-muted" stroke="none" x={30} y={22} width={12} height={10} rx={2} />
      <circle cx={12} cy={31} r={9} />
      <path d="M12 31L21 22H30M21 22L18 16M14 16h8" />
      <rect x={30} y={22} width={12} height={10} rx={2} />
      <path d="M33 22v-4a3 3 0 0 1 6 0v4" />
      <path d="M25 40a3 3 0 1 0 6 0a3 3 0 1 0-6 0M31 40h12M37 40v3M42 40v4" />
    </IconBase>
  );
}
