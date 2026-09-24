import { IconBase, type IconProps } from './icon-base';

/** Fahrzeugöffnung: Auto von oben, Fahrertür leicht geöffnet. */
export function IconFahrzeugoeffnung(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        className="fill-area-muted"
        stroke="none"
        d="M20 18.5c2.5-2 9.5-2 12 0V31c-2.5 1.5-9.5 1.5-12 0z"
      />
      <path d="M17 18v-5a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8v22a8 8 0 0 1-8 8h-2a8 8 0 0 1-8-8v-5" />
      <path d="M20 18.5c2.5-2 9.5-2 12 0V31c-2.5 1.5-9.5 1.5-12 0z" />
      <path d="M35 11h2v4h-2M35 33h2v4h-2M17 33h-2v4h2M17 11h-2v4h2" />
      <path d="M17 18l-8 9" />
    </IconBase>
  );
}
