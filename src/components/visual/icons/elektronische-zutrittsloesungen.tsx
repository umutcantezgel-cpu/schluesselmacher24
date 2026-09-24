import { IconBase, type IconProps } from './icon-base';

/** Transponder vor einem Lesegerät, dazwischen Funkbögen. */
export function IconElektronischeZutrittsloesungen(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect className="fill-area-muted" stroke="none" x={6} y={15} width={12} height={22} rx={6} />
      <rect x={6} y={15} width={12} height={22} rx={6} />
      <circle cx={12} cy={21} r={2} />
      <path d="M21.5 22a5 5 0 0 1 0 8M25 19a9.5 9.5 0 0 1 0 14" />
      <rect x={29} y={6} width={13} height={36} rx={3} />
      <circle cx={35.5} cy={19} r={3.5} />
      <circle className="fill-area" stroke="none" cx={35.5} cy={33} r={2} />
    </IconBase>
  );
}
