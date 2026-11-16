import { formatCents } from '@/lib/format';
import type { EinsendeOption } from '@/lib/versand/angebot';

/*
 * Eine Versandvariante in Worten (A-050): Einsatz, Haftung als Zahl, Warnung bei geringer Haftung,
 * Abgabeort und die Kosten vor dem Absenden (Porto laut Post, Aufpreis des Betriebs, Summe). Dieselbe
 * Darstellung im Formular, auf der Seite zum Einschicken und auf der Vorgangsseite.
 */

/** „7,69 € Porto laut Post · kein Aufpreis · zusammen 7,69 €“. */
export function kostenSatz(o: EinsendeOption): string {
  const teile = [o.portoText];
  if (!o.label) teile.push(o.aufpreisCents > 0 ? `Aufpreis ${formatCents(o.aufpreisCents)}` : 'kein Aufpreis');
  if (o.summeCents !== undefined && !o.label) teile.push(`zusammen ${formatCents(o.summeCents)}`);
  return teile.join(' · ');
}

/**
 * Satz zu den Versandkosten je wählbarer Variante: empfohlene zuerst genannt, jede mit Kosten
 * (Porto, Aufpreis, Summe) und Haftung. Leer, wenn keine Variante wählbar ist.
 */
export function kostenAntwort(optionen: readonly EinsendeOption[]): string {
  const saetze = optionen.map((o) =>
    o.empfohlen
      ? `Für wertvolle Originalschlüssel empfehlen wir ${o.titel}: ${kostenSatz(o)}, ${o.haftung}.`
      : `${o.titel}: ${kostenSatz(o)}, ${o.haftung}.`,
  );
  return saetze.length ? `${saetze.join(' ')} ` : '';
}

export function VarianteBeschreibung({ option, mitStand = false }: { option: EinsendeOption; mitStand?: boolean }) {
  return (
    <span className="block space-y-1">
      <span className="block">{option.einsatz}</span>
      <span className="block">
        {option.haftung}
        {option.sendungsverfolgung ? ', mit Sendungsverfolgung' : ''}
        {option.einlieferung ? `. ${option.einlieferung}.` : '.'}
      </span>
      {option.warnung && <span className="block font-semibold text-warning">{option.warnung}</span>}
      <span className="block font-semibold text-foreground">{kostenSatz(option)}</span>
      {mitStand && option.stand && <span className="block text-caption text-foreground-subtle">Stand: {option.stand}</span>}
    </span>
  );
}
