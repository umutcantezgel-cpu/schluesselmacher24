import 'server-only';

import { headers } from 'next/headers';

/**
 * Einfache Ratenbegrenzung pro IP-Adresse und Vorgang.
 *
 * Bewusst ohne externen Dienst: Die Zählung liegt im Arbeitsspeicher der
 * jeweiligen Server-Instanz. Das bremst automatisierte Massenanfragen
 * zuverlässig aus, ist auf mehreren Instanzen aber nur näherungsweise.
 * Eine instanzübergreifende Zählung folgt über die Datenbank.
 */
const buckets = new Map<string, number[]>();

export interface RateLimitRule {
  /** Name des Vorgangs, z. B. "anfrage". */
  name: string;
  /** Erlaubte Aufrufe im Zeitfenster. */
  limit: number;
  /** Zeitfenster in Millisekunden. */
  windowMs: number;
}

export const LIMITS = {
  vorgang: { name: 'vorgang', limit: 10, windowMs: 10 * 60 * 1000 },
  bestellung: { name: 'bestellung', limit: 10, windowMs: 10 * 60 * 1000 },
  status: { name: 'status', limit: 20, windowMs: 10 * 60 * 1000 },
} satisfies Record<string, RateLimitRule>;

async function clientKey(): Promise<string> {
  const h = await headers();
  const forwarded = h.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || h.get('x-real-ip') || 'unbekannt';
}

/** Gibt `true` zurück, wenn der Aufruf erlaubt ist, und zählt ihn mit. */
export async function allowRequest(rule: RateLimitRule, now = Date.now()): Promise<boolean> {
  const key = `${rule.name}:${await clientKey()}`;
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < rule.windowMs);
  if (recent.length >= rule.limit) {
    buckets.set(key, recent);
    return false;
  }
  recent.push(now);
  buckets.set(key, recent);

  // Speicher klein halten.
  if (buckets.size > 5000) {
    for (const [k, times] of buckets) {
      if (times.every((t) => now - t >= rule.windowMs)) buckets.delete(k);
    }
  }
  return true;
}

export const RATE_LIMIT_MESSAGE =
  'Zu viele Anfragen in kurzer Zeit. Bitte warten Sie einige Minuten und versuchen Sie es erneut.';

/** Nur für Tests. */
export function resetRateLimits() {
  buckets.clear();
}
