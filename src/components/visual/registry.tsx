import { createElement, type ComponentType, type ReactElement } from 'react';

import type { VisualParamValue, VisualRef } from '@/lib/types';

/**
 * Einheitliche Schnittstelle aller Grafik-Generatoren.
 *
 * Ein Generator bekommt nur einfache Werte (aus Datenbank oder Code), prüft sie
 * selbst und zeichnet reines SVG. Unbekannte oder fehlerhafte Werte führen zu
 * einer ruhigen Standardgrafik, nie zu einem Fehler auf der Seite.
 */
export interface VisualProps {
  params: Record<string, VisualParamValue>;
  /** Kurzer Alternativtext; wird als `<title>` ins SVG geschrieben. */
  title: string;
  className?: string;
}

export type VisualComponent = ComponentType<VisualProps>;

/**
 * Zulässige Generatoren. Neue Generatoren werden hier eingetragen — Namen
 * sind stabil, weil sie in Inhalten gespeichert werden.
 */
const REGISTRY: Record<string, VisualComponent> = {};

export function getVisual(name: string): VisualComponent | undefined {
  return Object.prototype.hasOwnProperty.call(REGISTRY, name) ? REGISTRY[name] : undefined;
}

/** Zeichnet die Grafik zu `ref` oder liefert `null`, wenn der Generator unbekannt ist. */
export function renderVisual(
  ref: VisualRef,
  title: string,
  className?: string,
): ReactElement<VisualProps> | null {
  const component = getVisual(ref.generator);
  if (!component) return null;
  return createElement(component, { params: ref.params ?? {}, title, className });
}

export function visualNames(): string[] {
  return Object.keys(REGISTRY).sort();
}
