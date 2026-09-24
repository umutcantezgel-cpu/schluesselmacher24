import { IconBase, type IconProps } from './icon-base';

/** Datenschutz: Dokument, gesichert mit einem Vorhängeschloss. */
export function IconDatenschutz(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        className="fill-area-muted"
        stroke="none"
        d="M32 17.5V13l-8-8H10a2 2 0 0 0-2 2v31a2 2 0 0 0 2 2h12V27h2.77A7.5 7.5 0 0 1 32 17.5z"
      />
      <path d="M32 17.5V13l-8-8H10a2 2 0 0 0-2 2v31a2 2 0 0 0 2 2h12" />
      <path d="M24 5v6a2 2 0 0 0 2 2h6M13 15h6M13 21h9M13 27h5" />
      <path d="M27.5 29v-4a4.5 4.5 0 0 1 9 0v4" />
      <rect className="fill-area-muted" stroke="none" x={24} y={29} width={16} height={13} rx={2} />
      <rect x={24} y={29} width={16} height={13} rx={2} />
      <path d="M32 34v3" />
    </IconBase>
  );
}
