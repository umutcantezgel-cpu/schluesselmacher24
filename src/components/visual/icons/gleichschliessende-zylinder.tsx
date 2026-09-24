import { IconBase, type IconProps } from './icon-base';

/** Zwei Profilzylinder (Stirnansicht), die derselbe Schlüssel schließt. */
export function IconGleichschliessendeZylinder(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        className="fill-area-muted"
        stroke="none"
        d="M11 17.62a6.5 6.5 0 1 1 8 0V26a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2zM29 17.62a6.5 6.5 0 1 1 8 0V26a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"
      />
      <path d="M11 17.62a6.5 6.5 0 1 1 8 0V26a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z" />
      <path d="M29 17.62a6.5 6.5 0 1 1 8 0V26a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z" />
      <path d="M15 10.5v10M33 10.5v10" />
      <path d="M15.9 35H37l3 2.5-3 2.5h-2l-1.5-1.5L32 40h-2l-1.5-1.5L27 40H15.9a5.5 5.5 0 1 1 0-5Z" />
      <circle cx={9} cy={37.5} r={1.5} />
    </IconBase>
  );
}
