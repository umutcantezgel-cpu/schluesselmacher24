'use client';

import { useCallback, useMemo, useState } from 'react';

import type { PickedFile } from '@/components/forms/photo-upload';
import { ANFRAGE_FORMULAR, type FormularKlasse } from '@/lib/fahrzeuge/anfrage-klassen';
import { useFlow, type FlowState, type FlowStep } from '@/lib/flow/use-flow';

import {
  INITIAL,
  ersterOffenerSchritt,
  fehltImUnterlagenschritt,
  flowKennung,
  leereUnterlagen,
  pflichtFuer,
  schrittGueltig,
  vorbelegungAbweichung,
  type AnfrageSchritt,
  type FahrzeugAnfrageDaten,
  type FehlendeUnterlage,
  type FotoPlatz,
  type PflichtTabelle,
  type UnterlagenDateien,
} from './kern';

/** Die sechs Schritte; Frage und Kurzform des ersten Schritts aus den Klassendaten. */
export function schritteFuer(klasse: FormularKlasse): FlowStep[] {
  const formular = ANFRAGE_FORMULAR[klasse];
  return [
    { id: 'fahrzeug', title: formular.fahrzeugFrage, hint: formular.fahrzeugHinweis, short: formular.fahrzeugKurz },
    {
      id: 'schluessel',
      title: 'Ihr Schlüssel',
      hint: formular.chip ? 'Ist noch ein Schlüssel da, und hat er einen Chip?' : 'Ist noch ein Schlüssel da?',
      short: 'Schlüssel',
    },
    {
      id: 'unterlagen',
      title: 'Unterlagen und Fotos',
      hint: 'Je Feld sehen Sie ein Beispiel und was darauf zu sehen sein muss. Unterlagen können Sie auch als PDF hochladen.',
      short: 'Unterlagen',
    },
    { id: 'beschreibung', title: 'Ihr Anliegen in einem Satz', hint: 'Was ist passiert, und was brauchen Sie?', short: 'Beschreibung' },
    { id: 'kontakt', title: 'Kontakt', hint: 'Hierhin schicken wir Ihre Rückmeldung.', short: 'Kontakt' },
    { id: 'absenden', title: 'Angaben prüfen und Anfrage absenden', hint: 'Nach dem Absenden erhalten Sie eine Bestätigung mit Ihrer Nummer.', short: 'Absenden' },
  ];
}

export interface FahrzeugAnfrageZustand {
  flow: FlowState<FahrzeugAnfrageDaten>;
  /** Ablauf für den Rahmen: „Weiter“ gesperrt, solange Unterlagen fehlen. */
  shellFlow: FlowState<FahrzeugAnfrageDaten>;
  dateien: UnterlagenDateien<PickedFile>;
  setDateien: (feld: 'fahrzeugschein' | 'ersatznachweis' | 'typenschild', liste: PickedFile[]) => void;
  setFoto: (platz: FotoPlatz, liste: PickedFile[]) => void;
  /** Pflichtliste der Regel für den aktuellen Fall. */
  pflicht: FehlendeUnterlage[];
  /** Was im Schritt Unterlagen noch fehlt. */
  fehlt: FehlendeUnterlage[];
  /** Erster unvollständiger Schritt (für das Absenden), sonst `null`. */
  offen: AnfrageSchritt | null;
  /**
   * Fahrzeug aus der Suche, wenn ein gespeicherter Zwischenstand davon abweicht (das Formular fragt dann,
   * welches gelten soll); sonst `null`.
   */
  vorbelegungAnbieten: Pick<FahrzeugAnfrageDaten, 'hersteller' | 'modell'> | null;
  /** Fahrzeug aus der Suche übernehmen oder die bisherigen Angaben behalten; danach kein Hinweis mehr. */
  vorbelegungEntscheiden: (uebernehmen: boolean) => void;
}

/**
 * Zustand der gemeinsamen Anfrage. Die Angaben liegen im Zwischenstand des Ablaufs (useFlow), die Dateien
 * im Zustand dieser Komponente: Beide bleiben beim Zurückgehen erhalten, weil alle Schritte in derselben
 * Komponente stehen. Nach einem Neuladen der Seite fehlen nur die Dateien; das Formular sagt es dann.
 */
export function useFahrzeugAnfrage({
  klasse,
  pflichtTabelle,
  vorbelegung,
  jahr,
}: {
  klasse: FormularKlasse;
  pflichtTabelle: PflichtTabelle;
  vorbelegung?: Partial<Pick<FahrzeugAnfrageDaten, 'hersteller' | 'modell'>>;
  jahr: number;
}): FahrzeugAnfrageZustand {
  const [dateien, setDateienZustand] = useState<UnterlagenDateien<PickedFile>>(leereUnterlagen<PickedFile>);
  const [vorbelegungErledigt, setVorbelegungErledigt] = useState(false);
  const steps = useMemo(() => schritteFuer(klasse), [klasse]);
  const hersteller = vorbelegung?.hersteller ?? '';
  const modell = vorbelegung?.modell ?? '';
  const initial = useMemo<FahrzeugAnfrageDaten>(() => ({ ...INITIAL, hersteller, modell }), [hersteller, modell]);
  const validate = useCallback((daten: FahrzeugAnfrageDaten, schritt: string) => schrittGueltig(klasse, daten, schritt as AnfrageSchritt, jahr), [klasse, jahr]);
  const onReset = useCallback(() => setDateienZustand(leereUnterlagen<PickedFile>()), []);

  const flow = useFlow<FahrzeugAnfrageDaten>({ id: flowKennung(klasse), steps, initial, version: 1, validate, onReset });

  // Ein gespeicherter Zwischenstand liegt über der Vorbelegung (useFlow): Abweichung anbieten, nicht still verwerfen.
  const vorbelegungAnbieten = vorbelegungErledigt ? null : vorbelegungAbweichung({ hersteller, modell }, flow.data);
  const { update } = flow;
  const vorbelegungEntscheiden = useCallback(
    (uebernehmen: boolean) => {
      if (uebernehmen) update({ hersteller, modell });
      setVorbelegungErledigt(true);
    },
    [update, hersteller, modell],
  );

  const pflicht = pflichtFuer(pflichtTabelle, flow.data);
  const fehlt = fehltImUnterlagenschritt(klasse, pflicht, flow.data, dateien);
  const offen = ersterOffenerSchritt(klasse, pflicht, flow.data, dateien, jahr);
  const schritt = flow.step?.id;
  const gesperrt = (schritt === 'unterlagen' && fehlt.length > 0) || (schritt === 'absenden' && offen !== null);

  // Uploads melden sich zeitversetzt: immer auf den vorigen Stand setzen.
  const setDateien = useCallback(
    (feld: 'fahrzeugschein' | 'ersatznachweis' | 'typenschild', liste: PickedFile[]) => setDateienZustand((alt) => ({ ...alt, [feld]: liste })),
    [],
  );
  const setFoto = useCallback(
    (platz: FotoPlatz, liste: PickedFile[]) => setDateienZustand((alt) => ({ ...alt, fotos: { ...alt.fotos, [platz]: liste } })),
    [],
  );

  return {
    flow,
    shellFlow: { ...flow, canContinue: flow.canContinue && !gesperrt },
    dateien,
    setDateien,
    setFoto,
    pflicht,
    fehlt,
    offen,
    vorbelegungAnbieten,
    vorbelegungEntscheiden,
  };
}
