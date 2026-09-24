import { IconBase, type IconProps } from './icon-base';

/** Standort: Kartenstift. */
export function IconStandort(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        className="fill-area-muted"
        stroke="none"
        d="M24 43C24 43 37 30.5 37 18.5a13 13 0 0 0-26 0C11 30.5 24 43 24 43z"
      />
      <path d="M24 43C24 43 37 30.5 37 18.5a13 13 0 0 0-26 0C11 30.5 24 43 24 43z" />
      <circle cx={24} cy={18.5} r={5} />
    </IconBase>
  );
}
