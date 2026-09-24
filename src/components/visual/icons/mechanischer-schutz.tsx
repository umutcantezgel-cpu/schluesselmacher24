import { IconBase, type IconProps } from './icon-base';

/** Mechanischer Schutz: Querriegelschloss über die ganze Türbreite. */
export function IconMechanischerSchutz(props: IconProps) {
  return (
    <IconBase {...props}>
      <path className="fill-area-muted" stroke="none" d="M12 43V6a1 1 0 0 1 1-1h22a1 1 0 0 1 1 1v37z" />
      <path d="M12 21V6a1 1 0 0 1 1-1h22a1 1 0 0 1 1 1v15M12 27v16M36 27v16M7 43h34" />
      <path d="M19 21H7.5a3 3 0 0 0 0 6H19M29 21h11.5a3 3 0 0 1 0 6H29" />
      <rect x={19} y={16} width={10} height={16} rx={2} />
      <path d="M22.5 23.6a2.5 2.5 0 1 1 3 0V27h-3z" />
    </IconBase>
  );
}
