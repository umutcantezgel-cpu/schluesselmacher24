import { IconBase, type IconProps } from './icon-base';

/** Smarte Funktionen: Smartphone, auf dem ein Schloss gesteuert wird. */
export function IconSmarteFunktionen(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect className="fill-area-muted" stroke="none" x={13} y={5} width={22} height={38} rx={4} />
      <rect x={13} y={5} width={22} height={38} rx={4} />
      <path d="M22 9.5h4M22 38.5h4" />
      <path d="M20.5 23v-3a3.5 3.5 0 0 1 7 0v3" />
      <rect x={18} y={23} width={12} height={9} rx={2} />
      <path d="M24 26.5v2" />
    </IconBase>
  );
}
