import { VERFUEGBARKEIT_LABEL } from '@/lib/data/shop';
import type { Verfuegbarkeit } from '@/lib/types';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';

export interface VerfuegbarkeitHinweisProps {
  /** Nur `auf-anfrage` oder `nicht-lieferbar`; lieferbare Artikel zeigen den Kaufbereich. */
  verfuegbarkeit: Exclude<Verfuegbarkeit, 'lieferbar'>;
  /** Anfrage für „auf Anfrage“, etwa „Code anfragen“ mit vorbelegtem Schloss. */
  anfrage: { href: string; label: string };
  /** Übersicht für „nicht lieferbar“. */
  uebersicht: { href: string; label: string };
}

/**
 * Ruhiger Ersatz für den Kaufbereich (FA-22-10): kein Warenkorb, kein Preis zum
 * Bestellen. „Auf Anfrage“ führt in die Anfrage, „nicht lieferbar“ sagt es
 * schlicht und zeigt die Übersicht. Bestellungen sperrt der Server ohnehin.
 */
export function VerfuegbarkeitHinweis({ verfuegbarkeit, anfrage, uebersicht }: VerfuegbarkeitHinweisProps) {
  const aufAnfrage = verfuegbarkeit === 'auf-anfrage';
  return (
    <Card>
      <CardHeader>
        <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">Verfügbarkeit</p>
        <h2 className="mt-1 text-title-sm font-semibold text-foreground">{VERFUEGBARKEIT_LABEL[verfuegbarkeit]}</h2>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <p className="text-small leading-relaxed text-foreground-muted">
          {aufAnfrage
            ? 'Diesen Artikel bestellen Sie nicht direkt. Fragen Sie ihn bei uns an. Wir prüfen Ihre Angaben und melden uns.'
            : 'Diesen Artikel können Sie zurzeit nicht bestellen.'}
        </p>
        {aufAnfrage ? (
          <ButtonLink href={anfrage.href} size="lg" fullWidth prefetch={false}>
            {anfrage.label}
          </ButtonLink>
        ) : (
          <ButtonLink href={uebersicht.href} variant="outline" fullWidth>
            {uebersicht.label}
          </ButtonLink>
        )}
      </CardBody>
    </Card>
  );
}
