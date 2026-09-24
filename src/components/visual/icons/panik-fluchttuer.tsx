import { IconBase, type IconProps } from './icon-base';

/** Panik-/Fluchttür: Tür mit Panikstange, Pfeil in Fluchtrichtung. */
export function IconPanikFluchttuer(props: IconProps) {
  return (
    <IconBase {...props}>
      <path className="fill-area-muted" stroke="none" d="M7 43V6a1 1 0 0 1 1-1h19a1 1 0 0 1 1 1v37z" />
      <path d="M7 43V6a1 1 0 0 1 1-1h19a1 1 0 0 1 1 1v37M4 43h27" />
      <rect x={9} y={22} width={17} height={5} rx={2.5} />
      <path d="M33 24.5h10M38.5 20l4.5 4.5-4.5 4.5" />
    </IconBase>
  );
}
