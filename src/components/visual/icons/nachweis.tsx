import { IconBase, type IconProps } from './icon-base';

/** Nachweis: Dokument mit Siegel. */
export function IconNachweis(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        className="fill-area-muted"
        stroke="none"
        d="M32 26V13l-8-8H10a2 2 0 0 0-2 2v31a2 2 0 0 0 2 2h16.7A8 8 0 0 1 32 26z"
      />
      <path d="M32 26V13l-8-8H10a2 2 0 0 0-2 2v31a2 2 0 0 0 2 2h16.7" />
      <path d="M24 5v6a2 2 0 0 0 2 2h6M13 15h6M13 21h14M13 27h8" />
      <circle cx={32} cy={34} r={6} />
      <circle className="fill-area" stroke="none" cx={32} cy={34} r={2.5} />
      <path d="M29 39.2V44l3-2 3 2v-4.8" />
    </IconBase>
  );
}
