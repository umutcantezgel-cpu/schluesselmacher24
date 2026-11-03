import { IconBase, type IconProps } from './icon-base';

/** Schlüsselfinder: Pkw in Seitenansicht, darüber eine Lupe mit Schlüsselkopf. */
export function IconSchluesselfinder(props: IconProps) {
  return (
    <IconBase {...props}>
      <path className="fill-area-muted" stroke="none" d="M14 21L19.5 16H28.5L34 21Z" />
      <path d="M6 29V24L13 21L19 15H29L35 21L42 24V29Z" />
      <circle cx={14} cy={33} r={4} />
      <circle cx={34} cy={33} r={4} />
      <path d="M6 37H42" />
      <circle cx={36} cy={11} r={5} />
      <path d="M39.5 14.5L43 18" />
      <circle cx={35} cy={11} r={1.5} />
      <path d="M36.5 11H38.5" />
    </IconBase>
  );
}
