import { IconBase, type IconProps } from './icon-base';

/** Reparatur und Austausch: Profilzylinder im Kreislauf zweier Pfeile. */
export function IconReparaturAustausch(props: IconProps) {
  return (
    <IconBase {...props}>
      <path className="fill-area-muted" stroke="none" d="M21 24.35a4.5 4.5 0 1 1 6 0V29a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 21 29z" />
      <path d="M21 24.35a4.5 4.5 0 1 1 6 0V29a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 21 29z" />
      <path d="M24 19.5v5" />
      <path d="M8.96 18.53A16 16 0 0 1 39.04 18.53M39.04 29.47A16 16 0 0 1 8.96 29.47" />
      <path d="M35.2 16.3l3.84 2.23 1.1-4.3M12.8 31.7l-3.84-2.23-1.1 4.3" />
    </IconBase>
  );
}
