import { IconBase, type IconProps } from './icon-base';

/** Warenkorb: Einkaufstasche wie `GlyphWarenkorb` im Kopf – eine Form für denselben Korb. */
export function IconWarenkorb(props: IconProps) {
  return (
    <IconBase {...props}>
      <path className="fill-area-muted" stroke="none" d="M11 18H37L34.6 39.5H13.4Z" />
      <path d="M9 17H39L36 41H12Z" />
      <path d="M17 17V13A7 7 0 0 1 31 13V17" />
      <path d="M17 23V25M31 23V25" />
    </IconBase>
  );
}
