import { IconBase, type IconProps } from './icon-base';

/** Zahlung: Karte mit bestätigtem Haken. */
export function IconZahlung(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        className="fill-area-muted"
        stroke="none"
        d="M25.05 33H8a3 3 0 0 1-3-3V12a3 3 0 0 1 3-3h26a3 3 0 0 1 3 3v12.2A10 10 0 0 0 25.05 33z"
      />
      <path d="M25.05 33H8a3 3 0 0 1-3-3V12a3 3 0 0 1 3-3h26a3 3 0 0 1 3 3v12.2" />
      <path d="M5 16h32M10 26h8" />
      <circle className="fill-area-muted" stroke="none" cx={35} cy={34} r={8} />
      <circle cx={35} cy={34} r={8} />
      <path d="M31.5 34l2.5 2.5 4.5-4.5" />
    </IconBase>
  );
}
