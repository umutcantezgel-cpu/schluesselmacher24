import { IconBase, type IconProps } from './icon-base';

/** Schließanlage: ein Hauptschlüssel, darunter drei Gruppenschlüssel. */
export function IconSchliessanlagen(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle className="fill-area-muted" stroke="none" cx={13} cy={10.5} r={5.5} />
      <path d="M17.9 8H37l3 2.5-3 2.5h-2l-1.5-1.5L32 13H17.9a5.5 5.5 0 1 1 0-5Z" />
      <path d="M24 13v8M11 25v-2a2 2 0 0 1 2-2h22a2 2 0 0 1 2 2v2M24 21v4" />
      <circle cx={11} cy={29} r={4} />
      <circle cx={24} cy={29} r={4} />
      <circle cx={37} cy={29} r={4} />
      <path d="M11 33v10h2.5M11 39h2M24 33v10h2.5M24 39h2M37 33v10h2.5M37 39h2" />
    </IconBase>
  );
}
