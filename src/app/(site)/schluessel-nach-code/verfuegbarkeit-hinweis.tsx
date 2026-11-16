import Link from 'next/link';

import { VERFUEGBARKEIT_LABEL } from '@/lib/data/shop';
import { ANFRAGE_KASTEN } from '@/lib/codelinie-texte';
import type { Verfuegbarkeit } from '@/lib/types';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';

export interface VerfuegbarkeitHinweisProps {
  /** Nur `auf-anfrage` oder `nicht-lieferbar`; lieferbare Artikel zeigen den Kaufbereich. */
  verfuegbarkeit: Exclude<Verfuegbarkeit, 'lieferbar'>;
  /** Was nicht bestellbar ist, als Satzanfang: „Diesen Schlüssel“ auf Codeseiten, „Diesen Artikel“ bei Artikeln. */
  was: 'Diesen Schlüssel' | 'Diesen Artikel';
  /** Anfrage für „auf Anfrage“, etwa „Code anfragen“ mit vorbelegtem Schloss. */
  anfrage: { href: string; label: string };
  /** Übersicht für „nicht lieferbar“. */
  uebersicht: { href: string; label: string };
}

/** Satz im Kasten je Verfügbarkeit (FA-INHALT-03I, L-01, L-05): was nicht geht und was der Kunde stattdessen tut. */
export function verfuegbarkeitSatz(verfuegbarkeit: VerfuegbarkeitHinweisProps['verfuegbarkeit'], was: VerfuegbarkeitHinweisProps['was']): string {
  const schluessel = was === 'Diesen Schlüssel';
  if (verfuegbarkeit === 'auf-anfrage') {
    return schluessel
      ? ANFRAGE_KASTEN
      : `${was} können Sie nicht in den Warenkorb legen. Bitte fragen Sie ihn bei uns an. Wir prüfen Ihre Angaben und melden uns.`;
  }
  return schluessel
    ? `${was} können Sie zurzeit nicht bestellen. Vielleicht passt ein anderer Schlüssel aus der Übersicht. Oder Sie fragen Ihren Code bei uns an.`
    : `${was} können Sie zurzeit nicht bestellen.`;
}

/**
 * Ruhiger Ersatz für den Kaufbereich (FA-22-10): kein Warenkorb, kein Preis zum
 * Bestellen. „Auf Anfrage“ führt in die Anfrage. „Nicht lieferbar“ sagt es
 * schlicht und zeigt die Übersicht; bei Schlüsseln nach Code steht die
 * Code-Anfrage als zweiter Weg darunter. Bestellungen sperrt der Server ohnehin.
 */
export function VerfuegbarkeitHinweis({ verfuegbarkeit, was, anfrage, uebersicht }: VerfuegbarkeitHinweisProps) {
  const aufAnfrage = verfuegbarkeit === 'auf-anfrage';
  return (
    <Card>
      <CardHeader>
        <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">Verfügbarkeit</p>
        <h2 className="mt-1 text-title-sm font-semibold text-foreground">{VERFUEGBARKEIT_LABEL[verfuegbarkeit]}</h2>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <p className="text-small leading-relaxed text-foreground-muted">{verfuegbarkeitSatz(verfuegbarkeit, was)}</p>
        {aufAnfrage ? (
          <ButtonLink href={anfrage.href} size="lg" fullWidth prefetch={false}>
            {anfrage.label}
          </ButtonLink>
        ) : (
          <>
            <ButtonLink href={uebersicht.href} variant="outline" fullWidth>
              {uebersicht.label}
            </ButtonLink>
            {was === 'Diesen Schlüssel' && (
              <Link
                href={anfrage.href}
                prefetch={false}
                className="inline-flex min-h-touch items-center justify-center text-small font-semibold text-primary hover:underline"
              >
                {anfrage.label}
              </Link>
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
}
