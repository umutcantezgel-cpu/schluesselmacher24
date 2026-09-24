import { IconBase, type IconProps } from './icon-base';

/** Technische Beratung: Sprechblase mit Schlüssel. */
export function IconTechnischeBeratung(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        className="fill-area-muted"
        stroke="none"
        d="M10 7h28a5 5 0 0 1 5 5v18a5 5 0 0 1-5 5H21l-8 7v-7h-3a5 5 0 0 1-5-5V12a5 5 0 0 1 5-5z"
      />
      <path d="M10 7h28a5 5 0 0 1 5 5v18a5 5 0 0 1-5 5H21l-8 7v-7h-3a5 5 0 0 1-5-5V12a5 5 0 0 1 5-5z" />
      <path d="M19.83 18.5H33l2.5 2.5-2.5 2.5h-2l-1.5-1.5-1.5 1.5h-2l-1.5-1.5-1.5 1.5h-3.67a5 5 0 1 1 0-5z" />
      <circle cx={13.5} cy={21} r={1.5} />
    </IconBase>
  );
}
