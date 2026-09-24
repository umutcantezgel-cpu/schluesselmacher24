import { IconBase, type IconProps } from './icon-base';

/** Warenkorb. */
export function IconWarenkorb(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        className="fill-area-muted"
        stroke="none"
        d="M10.4 14H41l-3.2 15.2a2 2 0 0 1-2 1.6H15.9a2 2 0 0 1-2-1.6z"
      />
      <path d="M5 8h4l4.9 21.2a2 2 0 0 0 2 1.6h19.9a2 2 0 0 0 2-1.6L41 14H10.4" />
      <path d="M22 14v17M31 14v17" />
      <circle cx={17} cy={38} r={2.5} />
      <circle cx={34} cy={38} r={2.5} />
    </IconBase>
  );
}
