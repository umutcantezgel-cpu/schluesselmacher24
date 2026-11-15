import { IconBase, type IconProps } from './icon-base';

/** Motorroller von der Seite: Lenker mit Beinschild, Trittbrett, Sitzbank auf dem Rahmen, Radkasten über dem Hinterrad, zwei kleine Räder. */
export function IconRoller(props: IconProps) {
  return (
    <IconBase {...props}>
      <path className="fill-area-muted" stroke="none" d="M20 21h12a3 3 0 0 1 3 3H20z" />
      <path d="M9 15h10M14 15L11 31" />
      <path d="M12.5 23L19 31H31L35 24M20 24V21h12a3 3 0 0 1 3 3H20" />
      <circle cx={11} cy={36} r={5} />
      <circle cx={38} cy={36} r={5} />
      <path d="M31 36a7 7 0 0 1 14 0" />
    </IconBase>
  );
}
