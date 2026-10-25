import Link from 'next/link';

import { formatCents } from '@/lib/format';
import { freigabeZahlbar, gewuenschteStueckzahl } from '@/lib/foto-freigabe';
import type { BusinessRecord } from '@/lib/types';
import { Alert } from '@/components/ui/alert';

/** Nach der Freigabe — das Ergebnis bleibt sichtbar, auch nach der Zahlung. */
const NACH_FREIGABE = new Set(['freigegeben', 'in-fertigung', 'versendet', 'abgeschlossen']);

/**
 * Ergebnis der Foto-Prüfung auf der privaten Vorgangsseite (Schlüssel nach
 * Vorlage): Freigabe mit Preis und Einsendeanweisung, Rückfrage oder Absage.
 * Der Knopf „Jetzt bezahlen“ steht im Abschnitt Zahlung darunter.
 */
export function FotoErgebnis({ record, einsendeAnschrift }: { record: BusinessRecord; einsendeAnschrift: string[] }) {
  const freigabe = record.approval ?? {};
  const hinweis = freigabe.note?.trim();

  if (record.status === 'nicht-moeglich') {
    return (
      <Alert tone="danger" title="Anfertigung leider nicht möglich">
        Nach unserer Prüfung können wir diesen Schlüssel nicht nach Ihrer Vorlage anfertigen. Ein Auftrag ist
        nicht zustande gekommen.
        {hinweis && <span className="mt-2 block whitespace-pre-line">{hinweis}</span>}
      </Alert>
    );
  }
  if (record.status === 'wartet-auf-kunde') {
    return (
      <Alert tone="warning" title="Rückfrage zu Ihrer Anfrage">
        Für die Prüfung brauchen wir noch eine Angabe oder ein weiteres Foto von Ihnen. Einzelheiten stehen in
        unserer E-Mail — antworten Sie einfach darauf.
      </Alert>
    );
  }
  if (!NACH_FREIGABE.has(record.status)) return null;

  const preis = freigabe.priceCents && freigabe.priceCents > 0 ? freigabe.priceCents : undefined;
  const stueck = gewuenschteStueckzahl(record);
  const zahlbar = freigabeZahlbar(record);
  const einsenden = freigabe.sendInRequired === true && (record.status === 'freigegeben' || record.status === 'in-fertigung');

  const zeilen: Array<[string, string]> = [['Ergebnis der Prüfung', 'Anfertigung möglich']];
  if (stueck) zeilen.push(['Stückzahl laut Ihrer Anfrage', String(stueck)]);
  zeilen.push(['Preis', preis ? `${formatCents(preis)} inkl. USt.` : 'nennen wir Ihnen gesondert']);
  zeilen.push(['Originalschlüssel', freigabe.sendInRequired ? 'bitte einsenden' : 'nicht nötig — wir fertigen nach Ihren Fotos']);

  return (
    <section className="border-t border-border pt-8">
      <p className="eyebrow"><span className="sm24-nummer tabular-nums text-foreground-muted" />Freigabe</p>
      <h2 className="mt-1 text-title font-semibold text-foreground">Ergebnis der Prüfung</h2>

      <dl className="mt-6 divide-y divide-border border-y border-border text-small">
        {zeilen.map(([label, wert]) => (
          <div key={label} className="flex flex-wrap items-baseline justify-between gap-4 py-3">
            <dt className="text-foreground-muted">{label}</dt>
            <dd className="font-semibold text-foreground">{wert}</dd>
          </div>
        ))}
      </dl>

      {hinweis && (
        <p className="mt-4 whitespace-pre-line text-small leading-relaxed text-foreground-muted">
          <span className="font-semibold text-foreground">Hinweis zur Freigabe: </span>
          {hinweis}
        </p>
      )}

      {zahlbar && (
        <Alert tone="legal" title="So erteilen Sie den Auftrag" className="mt-6">
          Die Freigabe ist noch keine Fertigungszusage. Den Auftrag erteilen Sie mit der Zahlung unten; erst danach
          fertigen wir. Den Schlüssel fertigen wir eigens nach Ihrer Vorlage — dafür besteht kein Widerrufsrecht
          (§ 312g Abs. 2 Nr. 1 BGB). Es gelten unsere{' '}
          <Link href="/rechtliches/agb" className="font-semibold text-primary hover:underline">
            AGB
          </Link>
          .
        </Alert>
      )}
      {!preis && record.status === 'freigegeben' && (
        <Alert tone="info" title="Preis folgt" className="mt-6">
          Den Preis nennen wir Ihnen gesondert. Gefertigt wird erst, wenn Sie den Auftrag danach erteilt haben.
        </Alert>
      )}

      {einsenden && (
        <div className="mt-6">
          <h3 className="text-title-sm font-semibold text-foreground">Originalschlüssel einsenden</h3>
          <p className="mt-2 text-small leading-relaxed text-foreground-muted">
            {record.status === 'freigegeben'
              ? 'Bitte senden Sie Ihren Originalschlüssel erst, nachdem Sie den Auftrag erteilt haben.'
              : 'Gefertigt wird, sobald Ihr Originalschlüssel bei uns ist.'}
          </p>
          {einsendeAnschrift.length > 0 ? (
            <address className="mt-3 text-small not-italic text-foreground">
              {einsendeAnschrift.map((zeile) => (
                <span key={zeile} className="block">
                  {zeile}
                </span>
              ))}
            </address>
          ) : (
            <p className="mt-3 text-small text-foreground-muted">Die Anschrift für die Einsendung nennen wir Ihnen gesondert.</p>
          )}
          <ul className="mt-3 list-disc space-y-1 pl-4 text-small text-foreground-muted">
            <li>
              Zettel mit Ihrer Vorgangsnummer <span className="font-mono tabular-nums">{record.reference}</span>, Ihrem
              Namen und Ihrer Telefonnummer beilegen.
            </li>
            <li>Nur den betreffenden Schlüssel senden, ohne Schlüsselring und Anhänger.</li>
            <li>Versichert oder mindestens nachverfolgbar versenden.</li>
          </ul>
        </div>
      )}
    </section>
  );
}
