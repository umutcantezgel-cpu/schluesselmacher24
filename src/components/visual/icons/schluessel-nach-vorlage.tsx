import { IconBase, type IconProps } from './icon-base';

/** Schlüssel und seine Kopie, versetzt übereinander. */
export function IconSchluesselNachVorlage(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        className="fill-area-muted"
        stroke="none"
        d="M28.06 11H40l3 3.5-3 3.5h-2l-2-2.5-2 2.5h-2l-2-2.5-1.94 2.5A7 7 0 1 1 28.06 11Z"
      />
      <path d="M28.06 11H40l3 3.5-3 3.5h-2l-2-2.5-2 2.5h-2l-2-2.5-1.94 2.5A7 7 0 1 1 28.06 11Z" />
      <circle cx={19.5} cy={14.5} r={2} />
      <path d="M17.06 30H29l3 3.5-3 3.5h-2l-2-2.5-2 2.5h-2l-2-2.5-1.94 2.5A7 7 0 1 1 17.06 30Z" />
      <circle cx={8.5} cy={33.5} r={2} />
    </IconBase>
  );
}
