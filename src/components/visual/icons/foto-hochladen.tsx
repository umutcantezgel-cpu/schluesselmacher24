import { IconBase, type IconProps } from './icon-base';

/** Foto hochladen: Kamera mit Pfeil nach oben. */
export function IconFotoHochladen(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        className="fill-area-muted"
        stroke="none"
        d="M5 20a3 3 0 0 1 3-3h4l2.5-4h9l2.5 4h4a3 3 0 0 1 3 3v17a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z"
      />
      <path d="M5 20a3 3 0 0 1 3-3h4l2.5-4h9l2.5 4h4a3 3 0 0 1 3 3v17a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z" />
      <circle cx={19} cy={28} r={6} />
      <path d="M40 24V6M36 10l4-4 4 4" />
    </IconBase>
  );
}
