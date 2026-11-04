import type { NextRequest } from 'next/server';

import { getRecord, getSettings } from '@/lib/data';
import { defaults } from '@/lib/data/defaults';
import { begleitscheinAnzeigen, begleitscheinZumVorgang } from '@/lib/einsenden/schein';
import { verifyAccessToken } from '@/lib/server/access-token';
import { LIMITS, RATE_LIMIT_MESSAGE, allowRequest } from '@/lib/server/rate-limit';

/**
 * Begleitschein zum Vorgang als PDF (G-24, E6-OPUS-02): für Einsendungen und für Foto-Anfragen, deren
 * Freigabe das Original verlangt, solange die Vorgangsseite ihn zeigt (bei Einsendungen bis zum Eingang).
 * Nur mit dem Link-Schlüssel der Vorgangsseite (`?t=`); ein
 * unbekannter Vorgang und ein falscher Schlüssel sehen gleich aus. Gespeichert wird nichts.
 */
const KOPF = { 'cache-control': 'no-store', 'x-robots-tag': 'noindex', 'referrer-policy': 'no-referrer' };

function textAntwort(text: string, status: number) {
  return new Response(text, { status, headers: { ...KOPF, 'content-type': 'text/plain; charset=utf-8' } });
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await allowRequest(LIMITS.begleitschein))) return textAntwort(RATE_LIMIT_MESSAGE, 429);
  const { id } = await params;
  const token = request.nextUrl.searchParams.get('t');
  const vorgang = await getRecord(id);
  if (!vorgang || !token || !verifyAccessToken(token, vorgang.accessTokenHash)) return textAntwort('Nicht gefunden.', 404);
  try {
    const settings = await getSettings();
    const schein = await begleitscheinZumVorgang(vorgang, {
      company: settings.company,
      einstellungen: settings.sendIn ?? defaults.settings().sendIn!,
    });
    if (!schein || !begleitscheinAnzeigen(vorgang)) return textAntwort('Zu diesem Vorgang gibt es keinen Begleitschein.', 404);
    return new Response(new Uint8Array(schein.pdf), {
      headers: { ...KOPF, 'content-type': 'application/pdf', 'content-disposition': `attachment; filename="${schein.dateiname}"` },
    });
  } catch (fehler) {
    console.error('Begleitschein fehlgeschlagen', fehler);
    return textAntwort('Der Begleitschein ließ sich gerade nicht erzeugen. Bitte versuchen Sie es später noch einmal.', 500);
  }
}
