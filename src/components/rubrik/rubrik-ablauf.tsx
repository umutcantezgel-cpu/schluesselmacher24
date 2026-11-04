import { createElement, type ComponentType, type ReactNode } from 'react';

import { Section, SectionHeading } from '@/components/layout/section';
import { fachIconKomponente } from '@/components/visual/fach-icon';
import { GlyphDokument } from '@/components/visual/glyphen/dokument';
import type { IconProps } from '@/components/visual/icons/icon-base';
import type { Rubrik } from '@/lib/types';

/** Glyphen, die ein Ablaufschritt statt eines Fach-Icons tragen darf (RUBRIK_ICONS, Abschnitt „Glyphen“). */
const ABLAUF_GLYPHEN: Record<string, ComponentType<IconProps>> = { dokument: GlyphDokument };

/** Bild eines Ablaufschritts: das Fach-Icon des Namens, sonst die Glyphe gleichen Namens. */
export function ablaufIconKomponente(name: string | null | undefined): ComponentType<IconProps> | undefined {
  if (!name) return undefined;
  return fachIconKomponente(name) ?? ABLAUF_GLYPHEN[name];
}

/** Das Nachschlagen geschieht hier, damit beim Rendern keine Komponente entsteht (react-hooks/static-components). */
function AblaufIcon({ name, ...props }: IconProps & { name: string }) {
  const komponente = ablaufIconKomponente(name);
  return komponente ? createElement(komponente, props) : null;
}

/** Platzhalter in Schritt-Texten, die aus den Einstellungen gefüllt werden (G9: Werte nie im Text). */
export const ABLAUF_PLATZHALTER = ['anzahlung', 'vorlauf'] as const;
export type AblaufWerte = Partial<Record<(typeof ABLAUF_PLATZHALTER)[number], string>>;

/** Setzt `{anzahlung}` und `{vorlauf}` ein; ein Satz mit fehlendem Wert entfällt, statt eine Lücke zu zeigen. */
export function ablaufText(text: string, werte: AblaufWerte = {}): string {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((satz) =>
      satz.replace(/\{([a-z]+)\}/g, (roh, name: string) => (name in werte && werte[name as keyof AblaufWerte] ? werte[name as keyof AblaufWerte]! : roh)),
    )
    .filter((satz) => !/\{[a-z]+\}/.test(satz))
    .join(' ');
}

/**
 * „So läuft Ihr Auftrag ab“ (G-10) aus den Rubrikdaten (`rubrik.ablauf`): nummerierte Schritte mit
 * Fach-Icon. Eine neue Rubrik bekommt ihren Ablauf ohne Umbau (G-11).
 *
 * - `schiene` (Standard): Schritte auf einer Schiene, deren Fortschritt mit dem Scrollen läuft (B-03,
 *   `sm24-scrub-*`, nur wo unterstützt; sonst steht die Schiene ruhig).
 * - `liste`: Stückliste mit Haarlinien, Nummer, großem Icon und Zwischenüberschrift je Schritt, für
 *   Seiten, deren Ablauf neben einer Erklärung steht.
 */
export function RubrikAblauf({
  rubrik,
  werte,
  className,
  variante = 'schiene',
}: {
  rubrik: Pick<Rubrik, 'ablauf' | 'id'>;
  werte?: AblaufWerte;
  className?: string;
  variante?: 'schiene' | 'liste';
}) {
  if (!rubrik.ablauf.length) return null;
  if (variante === 'liste') {
    return (
      <ol className={className ? `border-t border-border ${className}` : 'border-t border-border'} data-ablauf={rubrik.id}>
        {rubrik.ablauf.map((schritt, index) => (
          <li key={`${index}-${schritt.titel}`} className="flex gap-5 border-b border-border py-6">
            <span aria-hidden className="w-6 shrink-0 pt-1 font-mono text-caption tabular-nums text-foreground-muted">
              {String(index + 1).padStart(2, '0')}
            </span>
            <AblaufIcon name={schritt.icon} size={40} aria-hidden className="shrink-0 text-area-strong" />
            <div className="min-w-0">
              <h3 className="text-title-sm font-semibold text-foreground">
                <span className="sr-only">Schritt {index + 1}: </span>
                {schritt.titel}
              </h3>
              <p className="mt-1 max-w-measure text-small text-foreground-muted">{ablaufText(schritt.text, werte)}</p>
            </div>
          </li>
        ))}
      </ol>
    );
  }
  return (
    <ol className={className ? `relative ${className}` : 'relative'} data-ablauf={rubrik.id}>
      {/* Schiene und Fortschritt: der Strich füllt sich, während die Schritte vorbeiziehen */}
      <span aria-hidden className="absolute bottom-6 left-5 top-6 w-px bg-border-strong" />
      <span aria-hidden className="sm24-scrub-y absolute bottom-6 left-5 top-6 w-px bg-area" />
      {rubrik.ablauf.map((schritt, index) => (
        <li key={`${index}-${schritt.titel}`} className="relative flex gap-6 pb-10 last:pb-0">
          <span
            aria-hidden
            className="sm24-scrub-marke relative z-raised flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-area bg-surface font-mono text-small font-semibold tabular-nums text-area-strong"
          >
            {index + 1}
          </span>
          <div className="pt-1.5">
            <p className="flex items-center gap-2.5 text-title-sm font-semibold text-foreground">
              <AblaufIcon name={schritt.icon} size={28} aria-hidden className="shrink-0 text-area-strong" />
              <span>
                <span className="sr-only">Schritt {index + 1}: </span>
                {schritt.titel}
              </span>
            </p>
            <p className="mt-1.5 max-w-measure text-body text-foreground-muted">{ablaufText(schritt.text, werte)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/**
 * Ganzer Abschnitt „So läuft Ihr Auftrag ab“ für Rubrikseiten ohne eigenen Platz für den Ablauf
 * (G-10): Überschrift links, Schritte auf der Schiene rechts, wie auf /autoschluessel.
 */
export function RubrikAblaufAbschnitt({
  rubrik,
  titel,
  nummer,
  lead,
  werte,
  tone,
  aktion,
}: {
  rubrik: Pick<Rubrik, 'ablauf' | 'id'> | null | undefined;
  titel: string;
  nummer?: string;
  lead?: string;
  werte?: AblaufWerte;
  tone?: 'default' | 'muted';
  aktion?: ReactNode;
}) {
  if (!rubrik?.ablauf.length) return null;
  const id = `ablauf-${rubrik.id}-titel`;
  return (
    <Section tone={tone} tight labelledBy={id}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-gutter">
        <div className="lg:col-span-5">
          <SectionHeading id={id} nummer={nummer} eyebrow="So läuft Ihr Auftrag ab" title={titel} lead={lead} />
          {aktion && <div className="mt-7">{aktion}</div>}
        </div>
        <RubrikAblauf rubrik={rubrik} werte={werte} className="lg:col-span-7" />
      </div>
    </Section>
  );
}
