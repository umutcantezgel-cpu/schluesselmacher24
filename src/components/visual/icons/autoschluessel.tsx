import { IconBase, type IconProps } from './icon-base';

/** Fahrzeugschlüssel mit Funkgehäuse und Laserschliff-Klinge. */
export function IconAutoschluessel(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect className="fill-area-muted" stroke="none" x={5} y={12} width={18} height={24} rx={7} />
      <rect x={5} y={12} width={18} height={24} rx={7} />
      <circle cx={14} cy={19} r={2.5} />
      <circle cx={14} cy={29} r={2.5} />
      <path d="M23 19h17a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H23" />
      <path d="M27 24c1.5-2.5 3-2.5 4.5 0s3 2.5 4.5 0 2.5-2.5 3.5-1" />
    </IconBase>
  );
}
