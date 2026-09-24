import { z } from 'zod';

import { getSettings } from '@/lib/data';
import { storageStatus } from '@/lib/integrations';
import { createAccessToken } from '@/lib/server/access-token';
import {
  MAX_PDF_BYTES,
  MELDUNG_ZU_GROSS,
  UPLOAD_KATEGORIEN,
  pruefeDatei,
  saeubereDateiname,
} from '@/lib/server/datei-pruefung';
import { aufbewahrenBis, speichereKundendatei } from '@/lib/server/kundendateien';
import { LIMITS, RATE_LIMIT_MESSAGE, allowRequest } from '@/lib/server/rate-limit';

/*
 * POST /api/kunden-upload — eine Datei je Aufruf (Feld „datei“) plus „kategorie“.
 *
 * Liegt neben der Payload-Schnittstelle /api/[...slug]; der feste Pfad hat
 * Vorrang vor dem Sammelpfad. Bewusst nur POST: Es gibt keine Liste und keinen
 * Abruf — hochgeladene Dateien sieht nur das Team im Backend.
 */

/** Größte Datei plus Platz für die Felder und Trenner des Formulars. */
const MAX_ANFRAGE_BYTES = MAX_PDF_BYTES + 256 * 1024;

const kategorieSchema = z.enum(UPLOAD_KATEGORIEN);

function antwort(status: number, body: Record<string, unknown>): Response {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

function fehler(status: number, meldung: string): Response {
  return antwort(status, { error: meldung });
}

/**
 * Fremde Seiten dürfen keine Dateien in unserem Namen hochladen. Browser
 * senden bei POST immer „Origin“; fehlt er, ist es kein Browser-Formular.
 */
function gleicheHerkunft(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  const host = (request.headers.get('x-forwarded-host') ?? request.headers.get('host'))?.split(',')[0]?.trim();
  try {
    return Boolean(host) && new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** Liest den Anfragekörper, bricht aber ab, sobald er zu groß wird. */
async function leseBegrenzt(request: Request, max: number): Promise<Uint8Array<ArrayBuffer> | 'zu-gross'> {
  const angegeben = Number(request.headers.get('content-length'));
  if (Number.isFinite(angegeben) && angegeben > max) return 'zu-gross';
  if (!request.body) return new Uint8Array(0);

  const reader = request.body.getReader();
  const teile: Uint8Array[] = [];
  let gesamt = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    gesamt += value.byteLength;
    if (gesamt > max) {
      await reader.cancel().catch(() => {});
      return 'zu-gross';
    }
    teile.push(value);
  }

  const koerper = new Uint8Array(gesamt);
  let position = 0;
  for (const teil of teile) {
    koerper.set(teil, position);
    position += teil.byteLength;
  }
  return koerper;
}

/** Fehler, die Payload bei unlesbaren oder beschädigten Dateien wirft. */
function istDateifehler(error: unknown): boolean {
  return error instanceof Error && ['ValidationError', 'FileUploadError'].includes(error.name);
}

export async function POST(request: Request): Promise<Response> {
  if (!gleicheHerkunft(request)) {
    return fehler(403, 'Die Anfrage wurde abgelehnt. Bitte laden Sie die Datei direkt über unser Formular hoch.');
  }

  if (!storageStatus().configured) {
    return fehler(
      503,
      'Dateien können gerade nicht gespeichert werden. Sie können das Formular trotzdem absenden; '
        + 'wir fordern die Unterlagen bei Bedarf nach.',
    );
  }

  if (!(await allowRequest(LIMITS.upload))) {
    return fehler(429, RATE_LIMIT_MESSAGE);
  }

  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().startsWith('multipart/form-data')) {
    return fehler(415, 'Die Datei kam in einem unerwarteten Format an. Bitte laden Sie die Seite neu und versuchen Sie es erneut.');
  }

  const koerper = await leseBegrenzt(request, MAX_ANFRAGE_BYTES);
  if (koerper === 'zu-gross') return fehler(413, MELDUNG_ZU_GROSS);

  let formular: FormData;
  try {
    formular = await new Response(koerper, { headers: { 'content-type': contentType } }).formData();
  } catch {
    return fehler(400, 'Die Datei konnte nicht gelesen werden. Bitte versuchen Sie es erneut.');
  }

  const dateien = [...formular.values()].filter((wert): wert is File => typeof wert !== 'string');
  const datei = formular.get('datei');
  if (dateien.length === 0 || typeof datei === 'string' || datei === null) {
    return fehler(400, 'Es wurde keine Datei übermittelt. Bitte wählen Sie eine Datei aus.');
  }
  if (dateien.length > 1) {
    return fehler(400, 'Bitte laden Sie jede Datei einzeln hoch.');
  }

  const kategorie = kategorieSchema.safeParse(formular.get('kategorie'));
  if (!kategorie.success) {
    return fehler(400, 'Es fehlt die Angabe, um welche Unterlage es sich handelt. Bitte laden Sie die Seite neu.');
  }

  // Maßgeblich ist der Inhalt: Endung und Typangabe des Browsers zählen nicht.
  const daten = new Uint8Array(await datei.arrayBuffer());
  const pruefung = pruefeDatei(daten, kategorie.data);
  if (!pruefung.ok) return fehler(pruefung.status, pruefung.fehler);

  try {
    const settings = await getSettings();
    const { token, hash } = createAccessToken();
    const gespeichert = await speichereKundendatei({
      daten,
      typ: pruefung.typ,
      dateiname: saeubereDateiname(datei.name, pruefung.typ.endung),
      kategorie: kategorie.data,
      aufbewahrenBis: aufbewahrenBis(kategorie.data, settings.retentionDays),
      uploadSchluesselHash: hash,
    });

    return antwort(201, { ...gespeichert, uploadToken: token });
  } catch (error) {
    if (istDateifehler(error)) {
      return fehler(
        422,
        'Die Datei scheint beschädigt oder unvollständig zu sein. Bitte nehmen Sie das Foto erneut auf '
          + 'oder speichern Sie das Dokument neu.',
      );
    }
    console.error('[kunden-upload] Speichern fehlgeschlagen', error);
    return fehler(
      500,
      'Die Datei konnte gerade nicht gespeichert werden. Bitte versuchen Sie es in einigen Minuten erneut.',
    );
  }
}
