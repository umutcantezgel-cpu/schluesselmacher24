import type { Endpoint, PayloadRequest } from 'payload';

import { vorgangZuSeite } from '../../lib/data/payload-mapping';
import { antwortAdresse, idempotenzSchluessel, sendeVorlage, vorlagenKontext } from '../../lib/mail/versand';
import { BETRIEB_PLATZHALTER, betriebEinsetzen, nachrichtPruefen } from '../../lib/mail/nachricht-vorlagen';
import { kundenNachricht } from '../../lib/mail/vorlagen/nachricht';
import { mailKonfiguration } from '../../lib/umgebung';
import type { Partnerbetriebe, Vorgaenge } from '../../payload-types';
import { hatRolle } from '../access/rollen';
import { benutzerName, einstellungenLaden, vorgangVermerken } from './vorgang-benachrichtigen';

/*
 * POST /api/vorgaenge/:id/nachricht — Nachricht des Teams an den Kunden (Knopf „Nachricht an den Kunden“,
 * FA-KERN-05). Betreff und Text kommen aus dem Backend (Vorlage oder frei geschrieben). Versand über den
 * vorhandenen Mailweg; jede Mail steht danach mit Zeit, Art, Empfänger, Betreff, vollständigem Text und
 * Ergebnis im Mailverlauf des Vorgangs, auch wenn der Versand scheitert. Payload prüft bei eigenen
 * Endpunkten keine Rechte, deshalb hier ausdrücklich.
 */

export const MELDUNG_OHNE_BETRIEB =
  'Die Vorlage „Ihr ausführender Betrieb“ braucht einen Partnerbetrieb am Vorgang (Reiter „Vermittlung“). Bitte zuerst wählen.';

/**
 * Vorlage „Ihr ausführender Betrieb“ (FA-07-03): `{firma}` und `{ort}` füllt der Server aus dem
 * Partnerbetrieb des Vorgangs, damit der Kunde genau den Betrieb erfährt, der am Vorgang steht.
 * Ohne Platzhalter bleibt der Text unverändert; ohne Partnerbetrieb eine Meldung.
 */
async function betriebFuellen(
  req: PayloadRequest,
  doc: Vorgaenge,
  betreff: string,
  text: string,
): Promise<{ betreff: string; text: string } | { fehler: string }> {
  if (!BETRIEB_PLATZHALTER.test(betreff) && !BETRIEB_PLATZHALTER.test(text)) return { betreff, text };
  const verweis = doc.vermittlung?.partnerbetrieb;
  const betriebId = typeof verweis === 'object' && verweis ? verweis.id : verweis;
  if (betriebId === null || betriebId === undefined) return { fehler: MELDUNG_OHNE_BETRIEB };
  const betrieb = (await req.payload.findByID({
    collection: 'partnerbetriebe',
    id: betriebId,
    depth: 0,
    overrideAccess: true,
    disableErrors: true,
    req,
  })) as Partnerbetriebe | null;
  if (!betrieb?.firma || !betrieb.ort) return { fehler: MELDUNG_OHNE_BETRIEB };
  const angaben = { firma: betrieb.firma, ort: betrieb.ort };
  return { betreff: betriebEinsetzen(betreff, angaben), text: betriebEinsetzen(text, angaben) };
}

function json(status: number, body: Record<string, unknown>): Response {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

async function eingabe(req: PayloadRequest): Promise<{ betreff?: unknown; text?: unknown }> {
  try {
    const body = typeof req.json === 'function' ? await req.json() : (req.data ?? {});
    return body && typeof body === 'object' ? (body as { betreff?: unknown; text?: unknown }) : {};
  } catch {
    return {};
  }
}

export async function kundenNachrichtHandler(req: PayloadRequest): Promise<Response> {
  if (!req.user) return json(401, { error: 'Bitte melden Sie sich an.' });
  if (!hatRolle(req.user, 'inhaber', 'mitarbeiter')) return json(403, { error: 'Keine Berechtigung.' });

  const id = Number(req.routeParams?.id);
  if (!Number.isSafeInteger(id) || id < 1) return json(404, { error: 'Vorgang nicht gefunden.' });

  const { betreff, text } = await eingabe(req);
  const fehler = nachrichtPruefen(betreff, text);
  if (fehler) return json(400, { error: fehler });
  if (!mailKonfiguration()) {
    return json(409, { error: 'Der Mailversand ist nicht eingerichtet (Einstellungen → Anbindungen).' });
  }

  const doc = (await req.payload.findByID({
    collection: 'vorgaenge',
    id,
    depth: 0,
    overrideAccess: true,
    disableErrors: true,
    req,
  })) as Vorgaenge | null;
  if (!doc) return json(404, { error: 'Vorgang nicht gefunden.' });

  const gefuellt = await betriebFuellen(req, doc, String(betreff), String(text));
  if ('fehler' in gefuellt) return json(400, { error: gefuellt.fehler });
  const fehlerGefuellt = nachrichtPruefen(gefuellt.betreff, gefuellt.text);
  if (fehlerGefuellt) return json(400, { error: fehlerGefuellt });

  const vorgang = vorgangZuSeite(doc);
  const einstellungen = await einstellungenLaden(req);
  const eintrag = await sendeVorlage({
    art: 'nachricht',
    an: vorgang.contact.email,
    inhalt: kundenNachricht({ vorgang, kontext: vorlagenKontext(einstellungen), betreff: gefuellt.betreff, text: gefuellt.text }),
    antwortAn: antwortAdresse(einstellungen?.company),
    // Neuer Schlüssel je Klick: Zwei gleiche Nachrichten dürfen beide hinausgehen.
    idempotenzSchluessel: idempotenzSchluessel(vorgang.reference, 'nachricht', String(Date.now())),
  });
  const gesendet = eintrag.result === 'gesendet';

  await vorgangVermerken(req, id, {
    mailLog: [...(vorgang.mailLog ?? []), eintrag],
    internalNotes: [
      ...vorgang.internalNotes,
      {
        at: eintrag.at,
        actor: 'team',
        message: gesendet
          ? `Nachricht „${gefuellt.betreff.trim().slice(0, 150)}“ an den Kunden gesendet (${benutzerName(req.user)}). Text im Mailverlauf.`
          : `Nachricht an den Kunden nicht gesendet (${benutzerName(req.user)}): ${eintrag.error ?? 'unbekannter Fehler'}.`,
      },
    ],
  });

  return gesendet
    ? json(200, { ok: true, meldung: `Nachricht an ${vorgang.contact.email} gesendet. Neu laden, um den Mailverlauf zu sehen.` })
    : json(502, { ok: false, error: `Die Nachricht konnte nicht gesendet werden (${eintrag.error ?? 'unbekannter Fehler'}). Sie steht im Mailverlauf.` });
}

export const kundenNachrichtSenden: Endpoint = {
  path: '/:id/nachricht',
  method: 'post',
  handler: kundenNachrichtHandler,
};
