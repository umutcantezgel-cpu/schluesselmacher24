import { IconBase, type IconProps } from './icon-base';

/** Panik- bzw. Notruf-Alarmtaster: Gehäuse mit großem Drucktaster. */
export function IconPanikAlarmtaster(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect className="fill-area-muted" stroke="none" x={8} y={8} width={32} height={32} rx={5} />
      <rect x={8} y={8} width={32} height={32} rx={5} />
      <circle cx={24} cy={24} r={9} />
      <circle className="fill-area" stroke="none" cx={24} cy={24} r={5.5} />
    </IconBase>
  );
}
