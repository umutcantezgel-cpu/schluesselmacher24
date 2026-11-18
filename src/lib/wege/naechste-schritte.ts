/*
 * „So geht es weiter“ nach dem Absenden (G-38, E6-OPUS-01): eine Quelle für die Bestätigung am Ende
 * jedes Weges und für die Statusseite des Vorgangs (/bestellung/[id]), damit beide dasselbe zusagen (R4).
 * Grundlage sind die Art des Vorgangs und, wo ein Weg eigene Schritte hat, Bereich und Quelle.
 * Die Texte stammen aus den bisherigen Erfolgsansichten und der Statusseite; neu formuliert ist nichts,
 * was über deren Zusagen hinausgeht.
 *
 * Die Listen stehen in `naechste-schritte-listen.ts` (FA-SEO-03D); Formulare, die nur eine Liste zeigen,
 * lesen dort. Diese Datei gibt sie weiter und wählt mit `naechsteSchritte()` die passende.
 */

import { istEinsendung } from '@/lib/einsenden/vorgang';
import { istFotoanfrage } from '@/lib/foto-freigabe';
import type { BusinessRecord } from '@/lib/types';
import {
  SCHRITTE_EINSENDUNG,
  SCHRITTE_FOTOANFRAGE,
  SCHRITTE_NACH_ART,
  SCHRITTE_PLANER,
  SCHRITTE_SCHLIESSANLAGE,
  SCHRITTE_SICHERHEITSTECHNIK,
  SCHRITTE_ZUTRITT,
  type NaechsterSchritt,
} from './naechste-schritte-listen';

export {
  SCHRITTE_EINSENDUNG,
  SCHRITTE_FOTOANFRAGE,
  SCHRITTE_NACH_ART,
  SCHRITTE_PLANER,
  SCHRITTE_SCHLIESSANLAGE,
  SCHRITTE_SICHERHEITSTECHNIK,
  SCHRITTE_ZUTRITT,
};
export type { NaechsterSchritt };

/** Quelle eines Projekts aus dem Schließplan-Planer (gleich `PLANER_QUELLE` in lib/konfigurator/vorgang, Test sichert das). */
const PLANER = 'schliessplan-planer';

type Vorgang = Pick<BusinessRecord, 'kind' | 'area' | 'process'> & { payload?: Record<string, unknown> };

/**
 * Die Schritte nach dem Absenden für einen Vorgang; die Bestätigung im Weg zeigt dieselben.
 * Eine Foto-Anfrage erkennt dieselbe Regel wie die Foto-Freigabe (`istFotoanfrage`), damit
 * Schritte und Freigabe-Block auf der Statusseite zusammenpassen, auch bei einer allgemeinen
 * Anfrage zum Thema „Schlüssel nach Vorlage“.
 */
export function naechsteSchritte(vorgang: Vorgang): NaechsterSchritt[] {
  if (istEinsendung(vorgang)) return SCHRITTE_EINSENDUNG;
  if (istFotoanfrage(vorgang)) return SCHRITTE_FOTOANFRAGE;
  if (vorgang.kind === 'anfrage' && vorgang.area === 'sicherheitstechnik' && vorgang.process === 'gefuehrte-anfrage') return SCHRITTE_SICHERHEITSTECHNIK;
  if (vorgang.kind === 'projekt' && vorgang.process === 'projektkonfigurator') {
    if (vorgang.area === 'elektronische-zutrittsloesungen') return SCHRITTE_ZUTRITT;
    if (vorgang.area === 'schliessanlagen') return vorgang.payload?.quelle === PLANER ? SCHRITTE_PLANER : SCHRITTE_SCHLIESSANLAGE;
  }
  return SCHRITTE_NACH_ART[vorgang.kind];
}
