import { IconBase, type IconProps } from './icon-base';

/** Sicherheitscheck: Klemmbrett mit Schutzschild und Haken. */
export function IconSicherheitscheck(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        className="fill-area-muted"
        stroke="none"
        d="M24 16l8 3v6c0 5.5-3.5 9.5-8 12-4.5-2.5-8-6.5-8-12v-6z"
      />
      <path d="M17 7h-5a3 3 0 0 0-3 3v30a3 3 0 0 0 3 3h24a3 3 0 0 0 3-3V10a3 3 0 0 0-3-3h-5" />
      <rect x={17} y={4} width={14} height={6} rx={2} />
      <path d="M24 16l8 3v6c0 5.5-3.5 9.5-8 12-4.5-2.5-8-6.5-8-12v-6z" />
      <path d="M20.5 26l2.5 2.5 4.5-4.5" />
    </IconBase>
  );
}
