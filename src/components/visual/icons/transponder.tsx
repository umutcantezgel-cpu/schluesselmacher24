import { IconBase, type IconProps } from './icon-base';

/** Transponder-Chip mit Anschlüssen. */
export function IconTransponder(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect className="fill-area-muted" stroke="none" x={13} y={13} width={22} height={22} rx={3} />
      <rect x={13} y={13} width={22} height={22} rx={3} />
      <rect x={19} y={19} width={10} height={10} rx={1.5} />
      <path d="M19 13V8M24 13V8M29 13V8M19 40v-5M24 40v-5M29 40v-5M13 19H8M13 24H8M13 29H8M40 19h-5M40 24h-5M40 29h-5" />
    </IconBase>
  );
}
