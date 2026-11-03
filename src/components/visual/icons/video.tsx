import { IconBase, type IconProps } from './icon-base';

/** Video: Bildschirmrahmen mit Abspieldreieck in der Mitte. */
export function IconVideo(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect className="fill-area-muted" stroke="none" x={6} y={10} width={36} height={26} rx={4} />
      <rect x={6} y={10} width={36} height={26} rx={4} />
      <path d="M19 17L29 23L19 29Z" />
    </IconBase>
  );
}
