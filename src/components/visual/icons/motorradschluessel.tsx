import { IconBase, type IconProps } from './icon-base';

/** Motorradschlüssel: Schlüsselkopf als Rad mit Nabe und Speichen, rechts der kurze Bart. */
export function IconMotorradschluessel(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle className="fill-area-muted" stroke="none" cx={14} cy={24} r={9} />
      <circle cx={14} cy={24} r={9} />
      <circle cx={14} cy={24} r={2} />
      <path d="M14 22V15M15.5 25L22 28.5M12.5 25L6 28.5" />
      <path d="M22 21H38L42 23V25H36L35 23L34 25L33 23L32 25H22Z" />
    </IconBase>
  );
}
