import { IconBase, type IconProps } from './icon-base';

/** Klappschlüssel: Tastengehäuse mit ausklappender Klinge. */
export function IconKlappschluessel(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect className="fill-area-muted" stroke="none" x={5} y={28} width={26} height={13} rx={6.5} />
      <rect x={5} y={28} width={26} height={13} rx={6.5} />
      <circle cx={11.5} cy={34.5} r={2} />
      <circle cx={17.5} cy={34.5} r={2} />
      <circle cx={25} cy={34.5} r={2.5} />
      <g transform="rotate(-45 25 34.5)">
        <path d="M27.5 31.5H44a3 3 0 0 1 0 6H27.5M31 34.5h10" />
      </g>
      <path d="M9 23a15 15 0 0 1 12-10" />
      <path d="M17.5 11.5l3.5 1.5-2 3.5" />
    </IconBase>
  );
}
