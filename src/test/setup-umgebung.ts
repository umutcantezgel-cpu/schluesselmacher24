/**
 * Läuft vor jeder Testdatei (Einheits- und Datenbanktests).
 *
 * Kein Test darf echte Mails versenden, echte Zahlungen anlegen oder in einen
 * echten Bucket schreiben — auch dann nicht, wenn in der Shell Zugangsdaten
 * stehen. Deshalb werden die Anbindungen hier abgeschaltet und Aufrufe an
 * Resend und Stripe über `fetch` gesperrt. Tests, die eine Anbindung brauchen,
 * setzen ihre Werte selbst (`vi.stubEnv`) und ersetzen `fetch` bzw. Stripe.
 */
for (const name of Object.keys(process.env)) {
  if (/^(MAIL|PAYMENT|STORAGE)_/.test(name)) delete process.env[name];
}

const GESPERRT = /^https:\/\/api\.(resend|stripe)\.com(\/|$)/;
const echtesFetch = globalThis.fetch;

function adresse(eingabe: Parameters<typeof fetch>[0]): string {
  if (typeof eingabe === 'string') return eingabe;
  if (eingabe instanceof URL) return eingabe.href;
  return eingabe.url;
}

globalThis.fetch = (async (eingabe: Parameters<typeof fetch>[0], init?: RequestInit) => {
  const url = adresse(eingabe);
  if (GESPERRT.test(url)) {
    throw new Error(`Tests rufen ${new URL(url).host} nicht auf — fetch im Test ersetzen.`);
  }
  return echtesFetch(eingabe, init);
}) as typeof fetch;
