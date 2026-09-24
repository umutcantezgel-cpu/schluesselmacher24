import { IconBase, type IconProps } from './icon-base';

/** Tür mit Drückergarnitur (Langschild) und Profilzylinder. */
export function IconTuerUndSchliesstechnik(props: IconProps) {
  return (
    <IconBase {...props}>
      <path className="fill-area-muted" stroke="none" d="M12 43V6a1 1 0 0 1 1-1h22a1 1 0 0 1 1 1v37z" />
      <path d="M12 43V6a1 1 0 0 1 1-1h22a1 1 0 0 1 1 1v37M7 43h34" />
      <rect x={27} y={17} width={6} height={19} rx={3} />
      <path d="M30 21H20" />
      <path d="M30 28.5v3" />
    </IconBase>
  );
}
