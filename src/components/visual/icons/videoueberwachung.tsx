import { IconBase, type IconProps } from './icon-base';

/** Videoüberwachung: Kamera mit Wandhalter. */
export function IconVideoueberwachung(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect className="fill-area-muted" stroke="none" x={11} y={11} width={26} height={13} rx={3} />
      <rect x={11} y={11} width={26} height={13} rx={3} />
      <path d="M11 14.5H7.5a1.5 1.5 0 0 0-1.5 1.5v3a1.5 1.5 0 0 0 1.5 1.5H11M9 7h29" />
      <circle className="fill-area" stroke="none" cx={16} cy={17.5} r={1.5} />
      <path d="M29 24v8h10" />
      <rect x={39} y={26} width={4} height={12} rx={1} />
    </IconBase>
  );
}
