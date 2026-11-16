/**
 * Vorlagen der freien Nachricht an den Kunden (FA-KERN-05), als Daten: Betreff und Text als Vorschlag, im
 * Backend vor dem Senden änderbar. Kurz, freundlich, ohne Gedankenstriche. `{nummer}` wird durch die
 * Vorgangsnummer ersetzt. Ohne Importe, damit auch der Knopf im Backend (Browser) sie laden kann.
 */

export interface NachrichtVorlage {
  id: string;
  /** Name der Vorlage im Backend. */
  name: string;
  betreff: string;
  text: string;
}

export const NACHRICHT_VORLAGEN: readonly NachrichtVorlage[] = [
  {
    id: 'rueckfrage',
    name: 'Rückfrage',
    betreff: 'Rückfrage zu Ihrem Auftrag {nummer}',
    text: 'zu Ihrem Auftrag haben wir eine kurze Frage:\n\n\nBitte antworten Sie einfach auf diese E-Mail. Vielen Dank.',
  },
  {
    id: 'unterlagen-fehlen',
    name: 'Unterlagen fehlen',
    betreff: 'Bitte Unterlagen nachreichen ({nummer})',
    text:
      'damit wir Ihren Auftrag bearbeiten können, fehlt uns noch etwas:\n\n\n'
      + 'Bitte schicken Sie es uns als Antwort auf diese E-Mail. Danach arbeiten wir an Ihrem Auftrag weiter.',
  },
  {
    id: 'termin-verschieben',
    name: 'Termin verschieben',
    betreff: 'Ihr Termin ({nummer})',
    text:
      'leider müssen wir Ihren Termin verschieben. Das tut uns leid.\n\n'
      + 'Bitte antworten Sie auf diese E-Mail oder rufen Sie uns an. Dann finden wir gemeinsam einen neuen Termin.',
  },
  {
    id: 'abholung-bereit',
    name: 'Abholung bereit',
    betreff: 'Ihr Auftrag ist fertig ({nummer})',
    text:
      'Ihr Auftrag ist fertig und liegt zur Abholung bereit.\n\n'
      + 'Bitte bringen Sie Ihre Vorgangsnummer und einen Ausweis mit. Wir freuen uns auf Sie.',
  },
  {
    // FA-07-03 (FA-PLATTFORM-01B, Zusatz 8): Der Kunde erfährt vor dem Einsatz, welcher Betrieb ausführt.
    // `{firma}` und `{ort}` setzt der Server beim Senden aus dem Partnerbetrieb des Vorgangs ein.
    // ENTWURF ZUR PRÜFUNG (R10): „Vertragspartner für die Ausführung“ gilt nur bei Abrechnung A (Zusage der
    // Partnerseiten, src/lib/partner/gewinnung.ts). Der Server lehnt die Vorlage bei Abrechnung B und im
    // Partnerweg mit zentraler Zahlung ab (src/payload/hooks/kunden-nachricht.ts), bis der Anwalt entschieden hat.
    id: 'ausfuehrender-betrieb',
    name: 'Ihr ausführender Betrieb',
    betreff: 'Ihr ausführender Betrieb ({nummer})',
    text:
      'Ihren Auftrag führt ein Partnerbetrieb aus unserem Netz aus. Ihr ausführender Betrieb und Vertragspartner '
      + 'für die Ausführung ist:\n\n{firma}, {ort}\n\n'
      + 'Bei Fragen zum Termin helfen Ihnen der Betrieb oder wir. Antworten Sie dazu einfach auf diese E-Mail.',
  },
];

/** Anfang des Betreffs der Vorlage „Ihr ausführender Betrieb“; daran erkennt der Vorgang den Versand. */
export const BETRIEB_BETREFF_ANFANG = 'Ihr ausführender Betrieb';

/** Platzhalter der Vorlage „Ihr ausführender Betrieb“, die der Server beim Senden füllt. */
export const BETRIEB_PLATZHALTER = /\{(firma|ort)\}/;

/** Setzt Firma und Ort des Partnerbetriebs in Betreff oder Text ein. */
export function betriebEinsetzen(text: string, betrieb: { firma: string; ort: string }): string {
  return text.replaceAll('{firma}', () => betrieb.firma.trim()).replaceAll('{ort}', () => betrieb.ort.trim());
}

/** Wurde die Nachricht „Ihr ausführender Betrieb“ schon erfolgreich gesendet? */
export function betriebMitgeteilt(mails: ReadonlyArray<{ art?: string | null; ergebnis?: string | null; betreff?: string | null }> | null | undefined): boolean {
  return (mails ?? []).some((m) => m.art === 'nachricht' && m.ergebnis === 'gesendet' && (m.betreff ?? '').startsWith(BETRIEB_BETREFF_ANFANG));
}

/** Vorlage mit eingesetzter Vorgangsnummer; `undefined` für eine unbekannte Kennung. */
export function vorlageFuer(id: string, nummer: string): { betreff: string; text: string } | undefined {
  const vorlage = NACHRICHT_VORLAGEN.find((v) => v.id === id);
  if (!vorlage) return undefined;
  const einsetzen = (wert: string) => wert.replaceAll('{nummer}', nummer);
  return { betreff: einsetzen(vorlage.betreff), text: einsetzen(vorlage.text) };
}

export const NACHRICHT_GRENZEN = { betreff: 150, text: 5000 } as const;

export const NACHRICHT_MELDUNG = {
  betreff: 'Bitte einen Betreff eintragen.',
  text: 'Bitte einen Text eintragen.',
  betreffLang: `Der Betreff ist zu lang (höchstens ${NACHRICHT_GRENZEN.betreff} Zeichen).`,
  textLang: `Der Text ist zu lang (höchstens ${NACHRICHT_GRENZEN.text} Zeichen).`,
  zeilenumbruch: 'Der Betreff darf keinen Zeilenumbruch enthalten.',
} as const;

/** Prüft Betreff und Text der freien Nachricht. Liefert eine Meldung oder `null`. */
export function nachrichtPruefen(betreff: unknown, text: unknown): string | null {
  const b = typeof betreff === 'string' ? betreff.trim() : '';
  const t = typeof text === 'string' ? text.trim() : '';
  if (!b) return NACHRICHT_MELDUNG.betreff;
  if (/[\r\n]/.test(b)) return NACHRICHT_MELDUNG.zeilenumbruch;
  if (b.length > NACHRICHT_GRENZEN.betreff) return NACHRICHT_MELDUNG.betreffLang;
  if (!t) return NACHRICHT_MELDUNG.text;
  if (t.length > NACHRICHT_GRENZEN.text) return NACHRICHT_MELDUNG.textLang;
  return null;
}
