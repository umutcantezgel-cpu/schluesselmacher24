import { IconBase, type IconProps } from './icon-base';

/** Obentürschließer: Schließerkörper am Türblatt, Gestänge zum Rahmen. */
export function IconTuerschliesser(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 20h28.5M37 20h6M8 43V23M40 43V23" />
      <rect className="fill-area-muted" stroke="none" x={11} y={25} width={19} height={8} rx={2} />
      <rect x={11} y={25} width={19} height={8} rx={2} />
      <circle cx={26} cy={29} r={1.5} />
      <path d="M27.5 28.7L36 27 31 13" />
      <rect x={26} y={8} width={10} height={5} rx={1.5} />
    </IconBase>
  );
}
