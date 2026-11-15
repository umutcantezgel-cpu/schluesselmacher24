import { IconBase, type IconProps } from './icon-base';

/** Tretroller mit Elektroantrieb von der Seite: hohe Lenkstange bis zur Vorderradnabe, flaches Trittbrett, Blitz für den Akku. */
export function IconEScooter(props: IconProps) {
  return (
    <IconBase {...props}>
      <path className="fill-area-muted" stroke="none" d="M7 34h31v2H7z" />
      <circle cx={10} cy={38} r={4} />
      <circle cx={38} cy={38} r={4} />
      <path d="M7 34h31M34 10L38 38M30 10h9" />
      <path d="M22 17l-3 5h4l-3 5" />
    </IconBase>
  );
}
