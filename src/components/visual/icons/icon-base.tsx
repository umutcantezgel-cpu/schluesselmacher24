import type { ReactNode, SVGProps } from 'react';

import { cn } from '@/lib/cn';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  /** Kantenlänge in Pixel, Standard 48. */
  size?: number;
  /** Mit Titel wird das Icon als Bild angesagt, sonst ist es dekorativ. */
  title?: string;
}

/** Gemeinsamer Rahmen aller Fach-Icons (48er-Raster, Kontur in `currentColor`). */
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
      className={cn('shrink-0', className)}
      {...rest}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}
