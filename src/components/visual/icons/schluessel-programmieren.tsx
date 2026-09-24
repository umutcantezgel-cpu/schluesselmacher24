import { IconBase, type IconProps } from './icon-base';

/** Schlüssel programmieren: Diagnose-Laptop mit Schlüssel auf dem Bildschirm. */
export function IconSchluesselProgrammieren(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect className="fill-area-muted" stroke="none" x={8} y={8} width={32} height={24} rx={2} />
      <rect x={8} y={8} width={32} height={24} rx={2} />
      <path d="M4 36h40v1a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" />
      <circle cx={17.5} cy={20} r={4} />
      <path d="M21.5 20H32M29 20v3M32 20v3" />
    </IconBase>
  );
}
