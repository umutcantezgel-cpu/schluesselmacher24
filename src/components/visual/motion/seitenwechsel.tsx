import * as React from 'react';
import type { ReactNode } from 'react';

/**
 * `ViewTransition` aus dem React-Canary, das Next 16 zur Laufzeit einbindet
 * (KERN K-004a). Das Projekt-React 19.2 der Tests kennt es nicht; dort bleibt
 * nur das Kind stehen.
 */
const ViewTransition = (React as { ViewTransition?: typeof React.ViewTransition }).ViewTransition;

/** Name des gemeinsamen Elements für das Fach-Icon eines Bereichs. */
export function bereichsName(bereich: string): string {
  return `bereich-${bereich}`;
}

/**
 * Seitenwechsel mit gemeinsamem Element (Register B-13): Elemente mit gleichem
 * `name` auf alter und neuer Seite gehen ineinander über, etwa das Fach-Icon
 * aus dem Schnelleinstieg in den Bereichskopf. Ein Name darf je Seite nur
 * einmal vorkommen. Ohne Browser-Unterstützung oder bei reduzierter Bewegung
 * wechselt die Seite sofort (globals.css).
 */
export function Seitenwechsel({ name, children }: { name: string; children: ReactNode }) {
  if (!ViewTransition) return <>{children}</>;
  return (
    <ViewTransition name={name} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}
