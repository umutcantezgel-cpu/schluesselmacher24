import type { NextRequest } from 'next/server';

import { getCollection } from '@/lib/data';
import { bekannteWuensche, schnappschuss } from '@/lib/konfigurator/vorgang';
import { dekodiere } from '@/lib/konfigurator/zwischenstand';
import { erzeugePdf } from '@/lib/pdf/erzeuge-pdf';
import { SCHLIESSPLAN_DATEINAME, schliessplanBlatt } from '@/lib/pdf/schliessplan';
import { LIMITS, RATE_LIMIT_MESSAGE, allowRequest } from '@/lib/server/rate-limit';

/**
 * Schließplan als PDF zum Herunterladen (G-27, E5-OPUS-03). Der Plan kommt aus dem Link des Planers
 * (`?plan=`, gleiche Prüfung wie beim Öffnen des Links), dazu die gewählten Zusatzwünsche (`?wuensche=`,
 * nur bekannte); gespeichert wird nichts, Kontaktdaten stehen nie im Link. Namen der Bauformen und
 * Funktionen kommen aus dem Katalog des Servers.
 */
const KOPF = { 'cache-control': 'no-store', 'x-robots-tag': 'noindex' };

function textAntwort(text: string, status: number) {
  return new Response(text, { status, headers: { ...KOPF, 'content-type': 'text/plain; charset=utf-8' } });
}

export async function GET(request: NextRequest) {
  if (!(await allowRequest(LIMITS.schliessplanPdf))) return textAntwort(RATE_LIMIT_MESSAGE, 429);
  const plan = dekodiere(request.nextUrl.searchParams.get('plan'));
  if (!plan || !plan.tueren.length) return textAntwort('Der Link enthält keinen gültigen Schließplan.', 400);
  try {
    const katalog = await getCollection('cylinderCatalog');
    // Zusatzwünsche aus dem Planer, damit der Preis im Blatt dem im Planer entspricht.
    const extraIds = bekannteWuensche((request.nextUrl.searchParams.get('wuensche') ?? '').split(',').slice(0, 20), katalog);
    const daten = await erzeugePdf(schliessplanBlatt(schnappschuss(plan, katalog, { extraIds })));
    return new Response(new Uint8Array(daten), {
      headers: { ...KOPF, 'content-type': 'application/pdf', 'content-disposition': `inline; filename="${SCHLIESSPLAN_DATEINAME}"` },
    });
  } catch (fehler) {
    console.error('Schließplan-PDF fehlgeschlagen', fehler);
    return textAntwort('Das PDF ließ sich gerade nicht erzeugen. Bitte versuchen Sie es später noch einmal.', 500);
  }
}
