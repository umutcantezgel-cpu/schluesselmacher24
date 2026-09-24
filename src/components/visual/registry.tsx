import { createElement, type ComponentType, type ReactElement } from 'react';

import type { VisualParamValue, VisualRef } from '@/lib/types';

import { CodeFundstelleGrafik } from './generators/code-fundstelle';
import { SchliessplanGrafik } from './generators/schliessplan';
import { SchluesselGrafik } from './generators/schluessel';
import { ZutrittSignalGrafik } from './generators/zutritt-signal';
import { ZylinderMassGrafik } from './generators/zylinder-mass';

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
 * sind stabil, weil sie in Inhalten gespeichert werden (Name = Dateiname).
 */
const REGISTRY: Record<string, VisualComponent> = {
  'code-fundstelle': CodeFundstelleGrafik,
  schliessplan: SchliessplanGrafik,
  schluessel: SchluesselGrafik,
  'zutritt-signal': ZutrittSignalGrafik,
  'zylinder-mass': ZylinderMassGrafik,
};

export function getVisual(name: string): VisualComponent | undefined {
  return Object.prototype.hasOwnProperty.call(REGISTRY, name) ? REGISTRY[name] : undefined;
}

/** Zeichnet die Grafik zu `ref` oder liefert `null`, wenn der Generator unbekannt ist. */
export function renderVisual(
  ref: VisualRef,
  title: string,
  className?: string,
): ReactElement<VisualProps> | null {
  /* `ref` stammt aus Inhalten — auch ein unvollständiger Eintrag darf die Seite nicht stören. */
  if (!ref || typeof ref.generator !== 'string') return null;
  const component = getVisual(ref.generator);
  if (!component) return null;
  return createElement(component, { params: ref.params ?? {}, title, className });
}

export function visualNames(): string[] {
  return Object.keys(REGISTRY).sort();
}
