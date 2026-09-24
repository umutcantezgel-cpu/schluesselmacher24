import { IconBase, type IconProps } from './icon-base';

/** Werkstatt: Werkbank mit Schraubstock (Amboss, feste und bewegliche Backe, Spindel mit Knebel). */
export function IconWerkstatt(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        className="fill-area-muted"
        stroke="none"
        d="M8 25v-8h5v-6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v10h3v-10a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v14z"
      />
      <path d="M8 25v-8h5v-6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v10h3v-10a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v14" />
      <path d="M31 17h7M38 12v10" />
      <circle cx={38} cy={10.5} r={1.5} />
      <circle cx={38} cy={23.5} r={1.5} />
      <rect x={5} y={25} width={38} height={5} rx={1} />
      <path d="M9 30v13M39 30v13M9 38h30" />
    </IconBase>
  );
}
