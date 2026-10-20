import type { ReactNode, SVGProps } from 'react';

import { cn } from '@/lib/cn';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  /** Kantenlänge in Pixel, Standard 48. */
  size?: number;
  /** Mit Titel wird das Icon als Bild angesagt, sonst ist es dekorativ. */
  title?: string;
}

/**
 * Gemeinsamer Rahmen der Icon-Familie (48er-Raster, Kontur in `currentColor`):
 * Fach-Icons (`visual/icons/`) und UI-Glyphen (`visual/glyphen/`). Das Attribut
 * `data-sm24-icon` schaltet in `globals.css` die einheitliche Bildschirm-
 * Strichstärke ein (`vector-effect: non-scaling-stroke`, KERN K-008) — so wirkt
 * der Strich bei 16 px so kräftig wie bei 48 px.
 */
export function IconBase({
  size = 48,
  title,
  className,
  children,
  ...rest
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      data-sm24-icon=""
      className={cn('shrink-0', className)}
      {...rest}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}
