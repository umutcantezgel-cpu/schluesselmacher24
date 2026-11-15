import { IconBase, type IconProps } from './icon-base';

/** Seniorenmobil (Elektromobil) von der Seite: flaches Chassis mit zwei gleich kleinen Rädern, Sitz mit Lehne, Lenksäule mit Griff vorn. */
export function IconSeniorenmobil(props: IconProps) {
  return (
    <IconBase {...props}>
      <path className="fill-area-muted" stroke="none" d="M15 23h13v7H15z" />
      <path d="M15 30V16h3v7h10v7" />
      <path d="M9 30h29l2 4H9z" />
      <path d="M33 30L36 17M32 17h8" />
      <circle cx={12} cy={38} r={4} />
      <circle cx={38} cy={38} r={4} />
    </IconBase>
  );
}
