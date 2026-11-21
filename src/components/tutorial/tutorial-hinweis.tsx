import type { ReactNode } from 'react';

import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { cn } from '@/lib/cn';
import type { TutorialVerweis } from '@/lib/tutorials/tutorials';

/* ==========================================================================
   Tutorial-Hinweis an Leistungsseiten und in Formularen (FA-INHALT-01B,
   FA-INHALT-01C)

   Serverbaustein ohne eigenes Skript. Er liest keine Daten: Die Seite holt die
   Verweise (`tutorialVerweiseFuer` in src/lib/tutorials/hinweise.ts) und gibt
   sie hinein; ein Formular bekommt den fertig gerenderten Hinweis als
   Eigenschaft (A-071). Ohne Verweis erscheint nichts, auch keine Überschrift.

   Diese Datei ist die Fassung für Formulare und importiert die Einbettung nie:
   Formularseiten laden kein Skript der Einbettung, auch nicht mit Schalter.
   Auf Leistungsseiten steht `TutorialHinweisSeite`
   (`tutorial-hinweis-seite.tsx`); sie zeigt mit Schalter das Video direkt im
   Hinweis (FA-21-02) und nutzt dafür `videoBlock`.
   ========================================================================== */

/** Kennung im Markup, für Tests und Browserproben. */
export const TUTORIAL_HINWEIS = 'data-tutorial-hinweis';

/** Sichtbarer Zusatz an Verweisen, die ein neues Fenster öffnen. */
export const NEUES_FENSTER_ZUSATZ = '(öffnet in neuem Fenster)';

/** Kennzeichen, wenn das Tutorial ein Video zeigt. */
export const MIT_VIDEO_TEXT = 'mit Video';

export interface TutorialHinweisProps {
  verweise: readonly TutorialVerweis[];
  /**
   * `kompakt`: Kasten mit Titel als Frage und einem kurzen Satz je Tutorial.
   * `verweis`: nur der Verweis, für Stellen, die denselben Stoff schon als eigene Anleitung tragen
   * (Fotoanleitung, Messhilfe); dort wäre ein zweiter Text ein Doppel.
   */
  variante?: 'kompakt' | 'verweis';
  /**
   * In Formularen: gewöhnlicher Verweis in neuem Fenster mit sichtbarem Zusatz. So bleibt das Formular
   * mit seinem Zwischenstand und gewählten Dateien stehen.
   */
  neuesFenster?: boolean;
  /** Ort aus `TUTORIAL_ORTE`, für Tests und die Sichtprobe. */
  ort?: string;
  className?: string;
  /**
   * Nur für `TutorialHinweisSeite`: Inhalt über dem Verweis eines Tutorials (das eingebettete Video). Gibt er
   * `null` zurück, ist das Markup genau wie ohne diese Eigenschaft.
   */
  videoBlock?: (verweis: TutorialVerweis) => ReactNode;
}

function Verweis({ verweis, neuesFenster }: { verweis: TutorialVerweis; neuesFenster: boolean }) {
  const inhalt = (
    <>
      <span className="min-w-0 [overflow-wrap:anywhere]">
        {verweis.titel}
        {verweis.mitVideo && (
          <span className="ml-2 inline-block rounded-sm border border-border px-1.5 align-middle text-caption font-semibold text-foreground-muted">
            {MIT_VIDEO_TEXT}
          </span>
        )}
        {neuesFenster && <span className="ml-1 font-normal text-foreground-muted"> {NEUES_FENSTER_ZUSATZ}</span>}
      </span>
      <GlyphPfeilRechts size={16} className="shrink-0 transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1" />
    </>
  );
  // Gewöhnlicher Verweis ohne Vorladen: Der Hinweis lädt kein Skript der Tutorial-Seite nach (A-076).
  return (
    <a
      href={verweis.href}
      {...(neuesFenster ? { target: '_blank', rel: 'noopener' } : {})}
      className="group flex min-h-touch items-center justify-between gap-3 py-2 text-small font-semibold text-primary hover:underline"
    >
      {inhalt}
    </a>
  );
}

/** Zeigt die Tutorials eines Ortes kompakt an; ohne Verweis nichts. */
export function TutorialHinweis({ verweise, variante = 'kompakt', neuesFenster = false, ort, className, videoBlock }: TutorialHinweisProps) {
  if (verweise.length === 0) return null;
  const titel = verweise.length > 1 ? 'Passende Anleitungen' : 'Passende Anleitung';

  if (variante === 'verweis') {
    return (
      <div {...{ [TUTORIAL_HINWEIS]: '' }} data-ort={ort} data-variante="verweis" className={className}>
        <p className="text-small text-foreground-muted">{titel} Schritt für Schritt:</p>
        <ul>
          {verweise.map((verweis) => (
            <li key={verweis.slug}>
              {videoBlock?.(verweis)}
              <Verweis verweis={verweis} neuesFenster={neuesFenster} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      {...{ [TUTORIAL_HINWEIS]: '' }}
      data-ort={ort}
      data-variante="kompakt"
      className={cn('rounded-lg border border-border bg-surface p-4 sm:p-5', className)}
    >
      <p className="text-small font-semibold text-foreground">{titel} Schritt für Schritt</p>
      <ul className="mt-1 divide-y divide-border">
        {verweise.map((verweis) => (
          <li key={verweis.slug} className="py-2 first:pt-0 last:pb-0">
            {videoBlock?.(verweis)}
            <Verweis verweis={verweis} neuesFenster={neuesFenster} />
            <p className="max-w-measure text-small text-foreground-muted">{verweis.satz}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
