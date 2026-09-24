import { IconBase, type IconProps } from './icon-base';

/** Alarmtechnik: Signalgeber (Sirene) mit Schallbögen. */
export function IconAlarmtechnik(props: IconProps) {
  return (
    <IconBase {...props}>
      <path className="fill-area-muted" stroke="none" d="M15 32V22a9 9 0 0 1 18 0v10z" />
      <path d="M15 32V22a9 9 0 0 1 18 0v10" />
      <rect x={11} y={32} width={26} height={6} rx={2} />
      <path d="M21 21a3 3 0 0 1 3-3" />
      <path d="M11.3 15a14 14 0 0 0 0 13M36.7 15a14 14 0 0 1 0 13M6.8 12.5a19 19 0 0 0 0 18M41.2 12.5a19 19 0 0 1 0 18" />
    </IconBase>
  );
}
