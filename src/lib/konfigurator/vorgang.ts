/*
 * Vorgang aus dem Schließplan-Planer (E5-OPUS-03, G-27, G-37, E-103): Der Server prüft den Plan aus
 * dem Browser selbst und legt einen vollständigen Schnappschuss in den Vorgang, mit den Namen aus dem
 * Katalog zum Zeitpunkt der Anfrage. Vorgangsblatt, Betriebsmail und spätere Nachbestellungen lesen
 * diesen Schnappschuss; ändert sich der Katalog, bleibt der Vorgang lesbar. Reine Funktionen.
 */

import { z } from 'zod';

import { formatCents } from '../format';
import type { CylinderCatalog } from '../types';
import { preisFuerPlan, SCHUTZ_OPTION_ID } from './preis';
import { EBENE_TEXT, ebene, pruefePlan, type Schliessplan } from './schliessplan';
import { planAusDaten } from './zwischenstand';

/** Kennung im payload, an der der Server eine Anfrage aus dem Planer erkennt. */
export const PLANER_QUELLE = 'schliessplan-planer';
export const NOTIZ_HOECHSTENS = 2000;

const text = z.string().max(200);
const schnappschussSchema = z.object({
  version: z.literal(1),
  erstellt: z.string().max(40),
  system: z.string().max(40).optional(),
  tueren: z
    .array(
      z.object({
        nr: z.number().int().min(1).max(100),
        id: z.string().max(12),
        bezeichnung: text,
        bauform: text,
        masse: text,
        funktion: text.optional(),
        schutz: text.optional(),
      }),
    )
    .max(100),
  schluessel: z
    .array(
      z.object({
        nr: z.number().int().min(1).max(100),
        id: z.string().max(12),
        bezeichnung: text,
        anzahl: z.number().int().min(0).max(500),
        reserve: z.number().int().min(0).max(500),
        kennzeichnung: text.optional(),
        ebene: text,
        tueren: z.array(z.number().int().min(1).max(100)).max(100),
      }),
    )
    .max(100),
  masseGeprueft: z.boolean(),
  preis: z.object({ art: z.enum(['preis', 'angebot', 'offen']), text: z.string().max(400) }),
  wuensche: z.array(text).max(20),
});

export type SchliessplanSchnappschuss = z.infer<typeof schnappschussSchema>;

/** Preis so, wie ihn der Planer zeigt: Gesamt laut Katalog, Angebot mit Grund oder offen. */
function preisText(plan: Schliessplan, katalog: CylinderCatalog, extraIds: string[]): SchliessplanSchnappschuss['preis'] {
  const preis = preisFuerPlan(plan, katalog, extraIds);
  if (preis.art === 'preis') return { art: 'preis', text: `Gesamt ${formatCents(preis.aufstellung.totalCents)} laut Katalog` };
  if (preis.art === 'angebot') return { art: 'angebot', text: `Angebot: ${preis.grund}` };
  return { art: 'offen', text: `Noch offen: ${preis.grund}` };
}

/** Vollständiger Schnappschuss: Türen und Schlüssel nummeriert, Namen aus dem Katalog, Matrix als Türnummern je Schlüssel. */
export function schnappschuss(
  plan: Schliessplan,
  katalog: CylinderCatalog,
  { extraIds = [], jetzt = new Date() }: { extraIds?: string[]; jetzt?: Date } = {},
): SchliessplanSchnappschuss {
  const formName = (id: string) => katalog.forms.find((f) => f.id === id)?.label ?? id;
  const schutzName = katalog.extras.find((e) => e.id === SCHUTZ_OPTION_ID)?.label ?? 'Ziehschutz';
  const nummer = new Map(plan.tueren.map((t, i) => [t.id, i + 1]));
  return {
    version: 1,
    erstellt: jetzt.toISOString(),
    ...(plan.system ? { system: plan.system } : {}),
    tueren: plan.tueren.map((t, i) => {
      const funktion = t.funktionId ? katalog.functions.find((f) => f.id === t.funktionId)?.label : undefined;
      return {
        nr: i + 1,
        id: t.id,
        bezeichnung: t.bezeichnung.trim(),
        bauform: formName(t.form),
        masse: t.b !== undefined ? `A ${t.a} mm, B ${t.b} mm` : `A ${t.a} mm`,
        ...(funktion ? { funktion } : {}),
        ...(t.optionen?.includes(SCHUTZ_OPTION_ID) ? { schutz: schutzName } : {}),
      };
    }),
    schluessel: plan.schluessel.map((s, i) => ({
      nr: i + 1,
      id: s.id,
      bezeichnung: s.bezeichnung.trim(),
      anzahl: s.anzahl,
      reserve: s.reserve ?? 0,
      ...(s.kennzeichnung ? { kennzeichnung: s.kennzeichnung } : {}),
      ebene: EBENE_TEXT[ebene(plan, s.id)],
      tueren: (plan.berechtigungen[s.id] ?? []).map((id) => nummer.get(id)).filter((nr): nr is number => nr !== undefined).sort((a, b) => a - b),
    })),
    masseGeprueft: plan.masseGeprueft === true,
    preis: preisText(plan, katalog, extraIds),
    wuensche: extraIds.map((id) => katalog.extras.find((e) => e.id === id)?.label ?? id),
  };
}

export type PlanerVorgang = { ok: true; payload: Record<string, unknown> } | { ok: false };

/**
 * Prüft das payload einer Anfrage aus dem Planer und baut es neu: Plan nach Schema und ohne Fehler,
 * nur bekannte Zusatzwünsche, Notiz gekürzt, Schnappschuss vom Server. Felder aus dem Browser, die
 * der Planer nicht schickt, fallen weg; ein mitgeschickter Schnappschuss wird nie übernommen.
 */
export function planerVorgang(payload: Record<string, unknown>, katalog: CylinderCatalog, jetzt = new Date()): PlanerVorgang {
  const plan = planAusDaten(payload.schliessplan, { masseGeprueft: true });
  if (!plan || pruefePlan(plan).some((b) => b.art === 'fehler')) return { ok: false };
  const bekannt = new Set(katalog.extras.map((e) => e.id));
  const roh = Array.isArray(payload.extraIds) ? payload.extraIds : [];
  const extraIds = [...new Set(roh.filter((id): id is string => typeof id === 'string' && bekannt.has(id)))];
  const notiz = typeof payload.notiz === 'string' ? payload.notiz.trim().slice(0, NOTIZ_HOECHSTENS) : '';
  return {
    ok: true,
    payload: {
      quelle: PLANER_QUELLE,
      schliessplan: plan,
      extraIds,
      notiz,
      consent: payload.consent === true,
      schnappschuss: schnappschuss(plan, katalog, { extraIds, jetzt }),
    },
  };
}

/** Liest den Schnappschuss aus einem gespeicherten Vorgang; ältere Vorgänge und fremde Daten ergeben null. */
export function schnappschussAusPayload(payload: unknown): SchliessplanSchnappschuss | null {
  if (!payload || typeof payload !== 'object') return null;
  const ergebnis = schnappschussSchema.safeParse((payload as Record<string, unknown>).schnappschuss);
  return ergebnis.success ? ergebnis.data : null;
}
