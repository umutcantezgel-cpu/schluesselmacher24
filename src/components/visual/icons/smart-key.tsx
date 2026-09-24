import { IconBase, type IconProps } from './icon-base';

/** Smart Key: schlanker Keyless-Schlüssel ohne Klinge, rundum sendend. */
export function IconSmartKey(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect className="fill-area-muted" stroke="none" x={16} y={8} width={16} height={32} rx={8} />
      <rect x={16} y={8} width={16} height={32} rx={8} />
      <circle cx={24} cy={18} r={3.5} />
      <path d="M21 30h6" />
      <path d="M11.5 18.5a13 13 0 0 0 0 11M36.5 18.5a13 13 0 0 1 0 11M7 15.5a18 18 0 0 0 0 17M41 15.5a18 18 0 0 1 0 17" />
    </IconBase>
  );
}
