import type { Endpoint, PayloadRequest } from 'payload';

import { vorgangZuSeite } from '../../lib/data/payload-mapping';
import { formatDateTime } from '../../lib/format';
import { antwortAdresse, idempotenzSchluessel, sendeVorlage, vorlagenKontext } from '../../lib/mail/versand';
import { kundeEingang } from '../../lib/mail/vorlagen/kunde-eingang';
import { mailKonfiguration } from '../../lib/umgebung';
import type { Vorgaenge } from '../../payload-types';
import { hatRolle } from '../access/rollen';
import { benutzerName, einstellungenLaden, vorgangVermerken } from './vorgang-benachrichtigen';

/*
 * POST /api/vorgaenge/:id/bestaetigung-senden — Eingangsbestätigung erneut
 * senden (Knopf im Backend). Erzeugt einen neuen persönlichen Link; der alte
 * gilt danach nicht mehr. Payload prüft bei eigenen Endpunkten keine Rechte —
 * deshalb hier ausdrücklich.
 */

function json(status: number, body: Record<string, unknown>): Response {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function bestaetigungSendenHandler(req: PayloadRequest): Promise<Response> {
  if (!req.user) return json(401, { error: 'Bitte melden Sie sich an.' });
  if (!hatRolle(req.user, 'inhaber', 'mitarbeiter')) return json(403, { error: 'Keine Berechtigung.' });

  const id = Number(req.routeParams?.id);
  if (!Number.isSafeInteger(id) || id < 1) return json(404, { error: 'Vorgang nicht gefunden.' });
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

  // Die Rückkehr von der Zahlungsseite trägt den bisherigen Link-Schlüssel.
  const zahlung = doc.zahlung;
  if (zahlung?.status === 'offen' && zahlung.checkoutSitzung && zahlung.ablaufAm && Date.parse(zahlung.ablaufAm) > Date.now()) {
    return json(409, {
      error:
        `Für diesen Vorgang ist eine Online-Zahlung offen (bis ${formatDateTime(zahlung.ablaufAm)} Uhr). `
        + 'Ein neuer Link würde die Rückkehr von der Zahlungsseite ungültig machen. Bitte danach erneut senden.',
    });
  }

  // Erst hier laden: Der Link-Schlüssel gehört zum Server der Seite.
  const { createAccessToken } = await import('../../lib/server/access-token');
  const { token, hash } = createAccessToken();

  const vorgang = vorgangZuSeite(doc);
  const einstellungen = await einstellungenLaden(req);
  const eintrag = await sendeVorlage({
    art: 'eingang-kunde',
    an: vorgang.contact.email,
    inhalt: kundeEingang({
      vorgang,
      token,
      onlineZahlung: Boolean(zahlung?.checkoutSitzung && zahlung.status === 'offen'),
      kontext: vorlagenKontext(einstellungen),
    }),
    antwortAn: antwortAdresse(einstellungen?.company),
    // Neuer Schlüssel je Klick — sonst verwirft Resend die zweite Mail.
    idempotenzSchluessel: idempotenzSchluessel(vorgang.reference, 'eingang-kunde', String(Date.now())),
  });
  const gesendet = eintrag.result === 'gesendet';
  const at = new Date().toISOString();

  // Den neuen Schlüssel nur übernehmen, wenn die Mail mit ihm rausging —
  // sonst bliebe der Kunde ohne gültigen Link.
  await vorgangVermerken(req, id, {
    mailLog: [...(vorgang.mailLog ?? []), eintrag],
    internalNotes: [
      ...vorgang.internalNotes,
      {
        at,
        actor: 'team',
        message: gesendet
          ? `Eingangsbestätigung erneut gesendet (${benutzerName(req.user)}). Neuer persönlicher Link; der bisherige gilt nicht mehr.`
          : `Eingangsbestätigung erneut senden fehlgeschlagen (${benutzerName(req.user)}): ${eintrag.error ?? 'unbekannter Fehler'}.`,
      },
    ],
    ...(gesendet ? { accessTokenHash: hash } : {}),
  });

  return gesendet
    ? json(200, { ok: true, meldung: `Bestätigung an ${vorgang.contact.email} gesendet. Neu laden, um das Protokoll zu sehen.` })
    : json(502, { ok: false, error: `Die Mail konnte nicht gesendet werden (${eintrag.error ?? 'unbekannter Fehler'}).` });
}

export const bestaetigungSenden: Endpoint = {
  path: '/:id/bestaetigung-senden',
  method: 'post',
  handler: bestaetigungSendenHandler,
};
