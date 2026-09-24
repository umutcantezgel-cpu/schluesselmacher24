import { IconBase, type IconProps } from './icon-base';

/** Schlüssel mit Anhänger, auf dem der Schließcode als Striche steht. */
export function IconSchluesselNachCode(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect className="fill-area-muted" stroke="none" x={17} y={26} width={25} height={15} rx={3} />
      <path d="M18.06 11H38l3 3.5-3 3.5h-3l-2-2.5-2 2.5h-2l-2-2.5-2 2.5h-6.94A7 7 0 1 1 18.06 11Z" />
      <path d="M10 16.5V25a8.5 8.5 0 0 0 8.5 8.5h1" />
      <circle cx={10} cy={14.5} r={2} />
      <rect x={17} y={26} width={25} height={15} rx={3} />
      <circle cx={22} cy={33.5} r={2} />
      <path d="M28 30v7M31 30v7M34 30v7M37 30v7" />
    </IconBase>
  );
}
