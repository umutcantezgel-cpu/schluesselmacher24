import { IconBase, type IconProps } from './icon-base';

/** Schlüsseldienst vor Ort: Haustür mit Klinke und darüber rechts ein Standortpunkt. */
export function IconVorOrt(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect className="fill-area-muted" stroke="none" x={14} y={18} width={20} height={25} rx={2} />
      <rect x={14} y={18} width={20} height={25} rx={2} />
      <path d="M29 28V34" />
      <path d="M38 21C38 21 43 16.5 43 11A5 5 0 0 0 33 11C33 16.5 38 21 38 21Z" />
      <circle cx={38} cy={11} r={2} />
    </IconBase>
  );
}
