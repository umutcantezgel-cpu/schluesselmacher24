import { IconBase, type IconProps } from './icon-base';

/** Lieferung: neutraler Lieferwagen, Seitenansicht. */
export function IconLieferung(props: IconProps) {
  return (
    <IconBase {...props}>
      <path className="fill-area-muted" stroke="none" d="M5 34V14a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v20z" />
      <path d="M5 34V14a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v20" />
      <path d="M29 17h6.2a2 2 0 0 1 1.6.8l5.8 7.7a2 2 0 0 1 .4 1.2V32a2 2 0 0 1-2 2h-1.5" />
      <path d="M5 34h3.5M17.5 34h13" />
      <path d="M31 20h3.5l4 5.5H31z" />
      <circle cx={13} cy={35} r={3.5} />
      <circle cx={35} cy={35} r={3.5} />
    </IconBase>
  );
}
