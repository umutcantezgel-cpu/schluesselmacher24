import { createElement, type ComponentType } from 'react';

import { FachIconFlaeche, FotoFlaeche, ratios } from '@/components/ui/bild-flaeche';
import { CodeFundstelleGrafik } from '@/components/visual/generators/code-fundstelle';
import { FotoBeispielGrafik } from '@/components/visual/generators/foto-beispiel';
import { ProfilschnittGrafik } from '@/components/visual/generators/profilschnitt';
import { SchluesselGrafik } from '@/components/visual/generators/schluessel';
import { TuerSchutzGrafik } from '@/components/visual/generators/tuer-schutz';
import type { VisualComponent } from '@/components/visual/registry';
import type { ImageSlot } from '@/lib/types';
import { cn } from '@/lib/cn';
import { visualFuerMotiv } from '@/lib/visual/motiv';

/*
 * Beispielfläche am Upload-Feld ohne das Register aller Generatoren (FA-SEO-03D, Regel A-076).
 *
 * `ImagePlaceholder` bindet über `visual/registry.tsx` alle Generatoren ein, weil eine Bildstelle aus
 * Inhalten jede Zeichnung brauchen kann. Am Upload-Feld kommen nur diese fünf vor: Die Beispiele der
 * Formulare und die Zeichnungen der Steckplätze (`visualFuerSteckplatz`) ergeben nur sie
 * (`upload-beispiel.test.tsx` prüft jedes Beispiel). So lädt ein Formular mit Upload nicht die übrigen
 * Generatoren mit.
 *
 * Die Fläche ist dieselbe wie bei `ImagePlaceholder` mit Standardwerten (Foto, Zeichnung, Fach-Icon in
 * derselben Rangfolge und mit denselben Klassen); der Test vergleicht das Markup beider Wege. Keiner der
 * fünf Generatoren hat eine schmale Fassung (`schmaleFassung`), deshalb entfällt sie hier.
 *
 * Ein Formular, dessen Beispiel aus gepflegten Inhalten kommt (Schlüsseltyp der Codelinie), nutzt
 * `photo-upload-voll.tsx` mit `ImagePlaceholder`, damit dort jede Zeichnung möglich bleibt.
 */

/** Generatoren, die an Upload-Feldern vorkommen (Name wie im Register). */
export const UPLOAD_ZEICHNUNGEN: Readonly<Record<string, VisualComponent>> = {
  'code-fundstelle': CodeFundstelleGrafik,
  'foto-beispiel': FotoBeispielGrafik,
  profilschnitt: ProfilschnittGrafik,
  schluessel: SchluesselGrafik,
  'tuer-schutz': TuerSchutzGrafik,
};

/** Wie die Beispielfläche am Upload-Feld gezeichnet wird. */
export type BeispielFlaeche = ComponentType<{ slot: ImageSlot }>;

/** Wie `ImagePlaceholder` mit Standardwerten, aber nur mit den Generatoren aus `UPLOAD_ZEICHNUNGEN`. */
export function UploadBeispiel({ slot }: { slot: ImageSlot }) {
  if (slot.bild?.url) return <FotoFlaeche slot={slot} sizes="(min-width: 1024px) 50vw, 100vw" />;

  const ref = slot.visual ?? visualFuerMotiv(slot.motif);
  const zeichnung = ref && typeof ref.generator === 'string' && Object.prototype.hasOwnProperty.call(UPLOAD_ZEICHNUNGEN, ref.generator)
    ? UPLOAD_ZEICHNUNGEN[ref.generator]
    : null;
  if (process.env.NODE_ENV !== 'production' && ref && !zeichnung) {
    // ImagePlaceholder zeichnete diesen Generator; hier steht das Fach-Icon. Solche Beispiele gehören zu photo-upload-voll.
    console.warn(
      `UploadBeispiel: Generator "${String(ref.generator)}" für „${slot.motif}“ fehlt in UPLOAD_ZEICHNUNGEN; es erscheint das Fach-Icon statt der Zeichnung. photo-upload-voll nutzen oder die Auswahl ergänzen.`,
    );
  }
  if (ref && zeichnung) {
    return (
      <div className={cn('relative w-full overflow-hidden', 'rounded-lg border border-border bg-surface', ratios[slot.ratio])}>
        {createElement(zeichnung, { params: ref.params ?? {}, title: '', className: cn('absolute inset-0 h-full w-full') })}
      </div>
    );
  }

  return <FachIconFlaeche slot={slot} />;
}
