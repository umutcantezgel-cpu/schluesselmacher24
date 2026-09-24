import { IconBase, type IconProps } from './icon-base';

/** Schutzschild mit Schlüsselloch. */
export function IconSicherheitstechnik(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        className="fill-area-muted"
        stroke="none"
        d="M24 5l15 5v11c0 10-6.5 17.5-15 22-8.5-4.5-15-12-15-22V10z"
      />
      <path d="M24 5l15 5v11c0 10-6.5 17.5-15 22-8.5-4.5-15-12-15-22V10z" />
      <path d="M22 24.5a4.5 4.5 0 1 1 4 0l1.5 7.5h-7z" />
    </IconBase>
  );
}
