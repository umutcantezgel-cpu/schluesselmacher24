import { IconBase, type IconProps } from './icon-base';

/** Funkschlüssel: Fernbedienung mit drei Tasten und Funkwellen. */
export function IconFunkschluessel(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect className="fill-area-muted" stroke="none" x={9} y={14} width={19} height={29} rx={7} />
      <rect x={9} y={14} width={19} height={29} rx={7} />
      <circle cx={18.5} cy={22} r={2.5} />
      <circle cx={18.5} cy={29.5} r={2.5} />
      <path d="M16.5 37h4" />
      <path d="M31 10.5a6 6 0 0 1 4.5 4.5M32.5 5a11.5 11.5 0 0 1 8.5 8.5" />
    </IconBase>
  );
}
