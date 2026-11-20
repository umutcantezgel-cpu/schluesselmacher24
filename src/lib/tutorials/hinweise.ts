import { getTutorialsFuer } from '@/lib/data';
import type { TutorialOrt } from '@/lib/types';

import { videosFreigegeben } from './freigabe';
import { tutorialVerweise, type TutorialVerweis } from './tutorials';

/**
 * Verweise für den Tutorial-Hinweis an einem oder mehreren Orten (FA-INHALT-01B), nur für Serverbausteine
 * der Seiten: Diese Datei liest die Datenschicht. Bausteine mit „use client“ importieren sie nie (A-071);
 * Formulare bekommen den fertig gerenderten Hinweis als Eigenschaft von ihrer Seite.
 */
export async function tutorialVerweiseFuer(...orte: TutorialOrt[]): Promise<TutorialVerweis[]> {
  const listen = await Promise.all(orte.map((ort) => getTutorialsFuer(ort)));
  return tutorialVerweise(listen.flat(), videosFreigegeben());
}
