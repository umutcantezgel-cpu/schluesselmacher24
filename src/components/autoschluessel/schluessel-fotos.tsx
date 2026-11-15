'use client';

import { PhotoUpload, alsUpload, type PickedFile } from '@/components/forms/photo-upload';
import { Alert } from '@/components/ui/alert';
import type { UploadRef } from '@/lib/types';
import { SCHLUESSEL_STECKPLAETZE } from '@/lib/wege/nachweis';

import { KEY_PHOTO_SLOTS } from './optionen';

/* ==========================================================================
   Die drei Schlüsselfotos als Steckplätze (FA-KERN-02, A-048)
   Vorderseite, Rückseite, Spitze beziehungsweise Profil von vorne. Jede Datei geht mit ihrem
   Steckplatz an den Server, der die drei Aufnahmen beim Absenden prüft. Die gezeichneten
   Beispielbilder aus KEY_PHOTO_SLOTS bleiben, bis echte Fotos vorliegen (MA-05).
   ========================================================================== */

export type SchluesselSteckplatz = (typeof SCHLUESSEL_STECKPLAETZE)[number];

/** Ausgewählte Dateien je Steckplatz; Fotos liegen nie im Browserspeicher. */
export type SchluesselFotos = Record<SchluesselSteckplatz, PickedFile[]>;

export const LEERE_SCHLUESSELFOTOS: SchluesselFotos = {
  'schluessel-vorderseite': [],
  'schluessel-rueckseite': [],
  'schluessel-spitze': [],
};

/** Fototipps im Wortlaut der Anleitung, gleich in jedem Weg. */
export const FOTO_TIPPS = [
  'Drei Aufnahmen: Vorderseite, Rückseite, Spitze beziehungsweise Profil von vorne.',
  'Beschriftungen und Prägungen müssen lesbar sein.',
  'Heller, einfarbiger Untergrund, ohne Blitz und ohne Schatten.',
] as const;

/** Sind alle drei Steckplätze belegt? */
export function schluesselfotosVollstaendig(fotos: SchluesselFotos): boolean {
  return SCHLUESSEL_STECKPLAETZE.every((platz) => fotos[platz].length > 0);
}

/** Die drei Fotos für das Absenden, je mit ihrem Steckplatz. */
export function schluesselfotosAlsUploads(fotos: SchluesselFotos): Array<Omit<UploadRef, 'id' | 'uploadedAt'>> {
  return SCHLUESSEL_STECKPLAETZE.flatMap((platz) => fotos[platz].map((datei) => alsUpload(datei, 'schluesselfoto', platz)));
}

export interface SchluesselFotoFelderProps {
  fotos: SchluesselFotos;
  /**
   * Neue Dateien eines Steckplatzes. Uploads melden sich zeitversetzt; die Eltern setzen deshalb mit
   * einer Funktion auf den vorigen Stand (`setFotos((alt) => ({ ...alt, [platz]: dateien }))`).
   */
  onChange: (platz: SchluesselSteckplatz, dateien: PickedFile[]) => void;
  /** Bei bestätigtem Totalverlust freiwillig, sonst Pflicht. */
  pflicht?: boolean;
  /** Vorsilbe der Feldkennungen, damit sie auf der Seite eindeutig bleiben. */
  idVorsilbe?: string;
}

/** Drei Upload-Felder mit Fototipps; Beschriftung und Beispiel aus KEY_PHOTO_SLOTS. */
export function SchluesselFotoFelder({ fotos, onChange, pflicht = true, idVorsilbe = 'foto' }: SchluesselFotoFelderProps) {
  return (
    <div className="space-y-7">
      <Alert tone="info" title="So werden die Fotos brauchbar">
        <ul className="space-y-1">
          {FOTO_TIPPS.map((tipp) => (
            <li key={tipp}>{tipp}</li>
          ))}
        </ul>
      </Alert>
      {SCHLUESSEL_STECKPLAETZE.map((platz) => {
        const slot = KEY_PHOTO_SLOTS.find((eintrag) => eintrag.steckplatz === platz)!;
        return (
          <PhotoUpload
            key={platz}
            category="schluesselfoto"
            steckplatz={platz}
            id={`${idVorsilbe}-${platz}`}
            label={pflicht ? slot.label : `${slot.label} (freiwillig)`}
            description={slot.description}
            example={slot.example}
            required={pflicht}
            files={fotos[platz]}
            onChange={(next) => onChange(platz, next)}
          />
        );
      })}
    </div>
  );
}
