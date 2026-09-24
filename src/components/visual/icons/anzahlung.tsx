import { IconBase, type IconProps } from './icon-base';

/** Anzahlung: Münze, zur Hälfte gefüllt. */
export function IconAnzahlung(props: IconProps) {
  return (
    <IconBase {...props}>
      <path className="fill-area-muted" stroke="none" d="M24 7a17 17 0 0 0 0 34z" />
      <circle cx={24} cy={24} r={17} />
      <path d="M30.82 18.25a7.5 7.5 0 1 0 0 11.5M16 22h9M16 26h9" />
    </IconBase>
  );
}
