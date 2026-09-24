import { IconBase, type IconProps } from './icon-base';

/** Schlüsselbart fräsen: Fingerfräser über der Zahnung eines Schlüssels. */
export function IconSchluesselbartFraesen(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect className="fill-area-muted" stroke="none" x={25} y={11} width={6} height={14} />
      <path d="M26 5h4v6M26 5v6" />
      <path d="M25 11h6v14l-3 3-3-3z" />
      <path d="M25 15l6 3M25 20l6 3" />
      <path d="M15.87 32H20l2 2.5 2-2.5h2l2 3 2-3h8l3 3v1l-3 3H15.87a6 6 0 1 1 0-7Z" />
      <circle cx={9.5} cy={35.5} r={1.5} />
    </IconBase>
  );
}
