import { IconBase, type IconProps } from './icon-base';

/** Kombinierte Konzepte: Schutzschild, Kamera und Schlüssel als ein System. */
export function IconKombinierteKonzepte(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        className="fill-area-muted"
        stroke="none"
        d="M16 7l11 3.5V20c0 9-4.5 15-11 19-6.5-4-11-10-11-19v-9.5z"
      />
      <path d="M16 7l11 3.5V20c0 9-4.5 15-11 19-6.5-4-11-10-11-19v-9.5z" />
      <path d="M11.5 22.5l3 3 6-6" />
      <rect x={32} y={7} width={11} height={7} rx={2} />
      <path d="M32 9h-2v3h2M39 14v3h3" />
      <circle cx={34} cy={31} r={4} />
      <path d="M38 31h5M40 31v3M43 31v3" />
    </IconBase>
  );
}
