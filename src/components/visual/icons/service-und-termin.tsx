import { IconBase, type IconProps } from './icon-base';

/** Kalenderblatt mit bestätigtem Termin (Haken). */
export function IconServiceUndTermin(props: IconProps) {
  return (
    <IconBase {...props}>
      <path className="fill-area-muted" stroke="none" d="M7 18v-6a3 3 0 0 1 3-3h28a3 3 0 0 1 3 3v6z" />
      <rect x={7} y={9} width={34} height={33} rx={3} />
      <path d="M7 18h34M16 5v7M32 5v7" />
      <path d="M17 30l5 5 9-9" />
    </IconBase>
  );
}
