import { enthaeltPlatzhalter, istPlatzhalter } from '@/lib/platzhalter';

/**
 * Telefonnummer im internationalen Format E.164, z. B. „06441 8056279“ →
 * „+4964418056279“. Deutsche Nummern ohne Ländervorwahl bekommen +49.
 * `null` für Platzhalter und alles, was sich nicht sicher umwandeln lässt —
 * dann erscheint die Nummer ohne Link.
 */
export function telefonE164(nummer: string | null | undefined): string | null {
  if (istPlatzhalter(nummer) || enthaeltPlatzhalter(nummer)) return null;
  // „+49 (0) 6441 …“: Die eingeklammerte Null entfällt in der internationalen Form.
  const roh = nummer!.trim().replace(/\(0\)/g, '');
  if (/[^\d\s()+/.\-–]/.test(roh)) return null;

  let ziffern = roh.replace(/[^\d+]/g, '');
  if (ziffern.lastIndexOf('+') > 0) return null;
  if (ziffern.startsWith('00')) ziffern = `+${ziffern.slice(2)}`;
  else if (ziffern.startsWith('0')) ziffern = `+49${ziffern.slice(1)}`;
  else if (!ziffern.startsWith('+')) return null;

  // E.164: Ländervorwahl ohne führende Null, insgesamt höchstens 15 Ziffern.
  return /^\+[1-9]\d{6,14}$/.test(ziffern) ? ziffern : null;
}

/** `tel:`-Link zur Nummer oder `null`, wenn sie sich nicht sicher wählen lässt. */
export function telefonLink(nummer: string | null | undefined): string | null {
  const e164 = telefonE164(nummer);
  return e164 ? `tel:${e164}` : null;
}
