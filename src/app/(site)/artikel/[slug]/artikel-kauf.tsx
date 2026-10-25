'use client';

import { useId, useMemo, useState } from 'react';

import { aktiveStufe, preisstufen, staffelText } from '@/lib/artikel';
import { useHydrated } from '@/lib/client-state';
import { formatCents, formatNumber } from '@/lib/format';
import { PreisHinweis } from '@/components/recht/preis-hinweis';
import { cn } from '@/lib/cn';
import { unitPriceForCodeLine } from '@/lib/pricing';
import { useCartStore } from '@/lib/store/cart';
import type { StandardArticle } from '@/lib/types';
import { Alert } from '@/components/ui/alert';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Field } from '@/components/forms/field';
import { QuantityInput } from '@/components/forms/controls';
import { GlyphWarenkorb } from '@/components/visual/glyphen/warenkorb';

/** Was der Kaufbereich vom Artikel braucht. */
export type KaufArtikel = Pick<
  StandardArticle,
  'id' | 'name' | 'priceCents' | 'bulkPrices' | 'maxQty' | 'shippingClass' | 'example'
>;

export interface ArtikelKaufProps {
  article: KaufArtikel;
}

/**
 * Stückzahl wählen und in den Warenkorb legen.
 *
 * Die Höchstmenge gilt für den ganzen Warenkorb: Liegt der Artikel schon
 * darin, lässt sich nur noch der Rest hinzufügen. Beispielartikel zeigen
 * Preise und Staffeln, lassen sich aber nicht in den Warenkorb legen — der
 * Server lehnt sie beim Absenden ohnehin ab.
 */
export function ArtikelKauf({ article }: ArtikelKaufProps) {
  const [wunsch, setWunsch] = useState(1);
  const [hinzugefuegt, setHinzugefuegt] = useState<number | null>(null);
  const hinweisId = useId();

  const addStandard = useCartStore((state) => state.addStandard);
  const imWarenkorb = useCartStore((state) =>
    state.items.reduce(
      (summe, item) => (item.kind === 'standard' && item.productId === article.id ? summe + item.qty : summe),
      0,
    ),
  );

  // Der Warenkorb liegt im Browser; vor dem Hydrieren zählt er als leer,
  // damit Server- und Browserausgabe übereinstimmen.
  const geladen = useHydrated();
  const vorhanden = geladen ? imWarenkorb : 0;
  const frei = Math.max(0, article.maxQty - vorhanden);
  const menge = Math.min(Math.max(1, wunsch), Math.max(1, frei));

  const stufen = useMemo(() => preisstufen(article), [article]);
  const aktiv = aktiveStufe(stufen, menge);
  const stueckpreis = unitPriceForCodeLine(article, menge);
  const summe = stueckpreis * menge;
  const beispiel = article.example;
  const bestellbar = !beispiel && frei > 0;
  const preisLabel = beispiel ? 'Beispielpreis je Stück' : 'Preis je Stück';
  const staffel = staffelText(article, beispiel);

  function hinzufuegen() {
    if (!bestellbar) return;
    addStandard({
      productId: article.id,
      label: article.name,
      shippingClass: article.shippingClass,
      qty: menge,
      // Staffel nach der Gesamtmenge im Warenkorb; maßgeblich bleibt die
      // Berechnung beim Absenden.
      unitPriceCents: unitPriceForCodeLine(article, vorhanden + menge),
    });
    setHinzugefuegt(menge);
  }

  const sperrgrund = beispiel
    ? 'Beispielartikel können nicht bestellt werden. Preis und Angaben sind Beispielwerte.'
    : frei === 0
      ? `Die Höchstmenge von ${formatNumber(article.maxQty)} Stück liegt bereits im Warenkorb.`
      : null;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-title-sm font-semibold text-foreground">
          {beispiel ? 'Beispielartikel — nicht bestellbar' : 'Stückzahl wählen'}
        </h2>
        <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
          <span className="font-mono text-title font-semibold tabular-nums text-foreground">
            {formatCents(stufen[0]?.priceCents ?? article.priceCents)}
          </span>
          <span className="text-small text-foreground-muted">{preisLabel}</span>
        </p>
      </CardHeader>

      <CardBody className="flex flex-col gap-6">
        <div>
          <Field
            label="Stückzahl"
            hint={`Höchstens ${formatNumber(article.maxQty)} Stück je Bestellung.`}
            info={
              staffel
                ? {
                    title: 'Staffelpreise',
                    body:
                      `Ab bestimmten Stückzahlen sinkt der Preis je Stück. ${staffel} `
                      + 'Der Gesamtpreis wird sofort neu berechnet.',
                  }
                : undefined
            }
          >
            {({ id }) => (
              <div>
                <QuantityInput
                  id={id}
                  label="Stückzahl"
                  value={menge}
                  min={1}
                  max={Math.max(1, frei)}
                  onChange={(next) => {
                    setWunsch(next);
                    setHinzugefuegt(null);
                  }}
                />
              </div>
            )}
          </Field>

          {vorhanden > 0 && (
            <p className="mt-2 text-small text-foreground-muted">
              Bereits im Warenkorb: {formatNumber(vorhanden)} Stück. Der Staffelpreis richtet sich
              nach der Gesamtmenge.
            </p>
          )}

          {stufen.length > 1 && (
            <div className="table-scroll mt-4">
              <table className="w-full border-collapse text-small">
                <caption className="sr-only">
                  Staffelpreise für {article.name}: {preisLabel} nach Stückzahl.
                </caption>
                <thead>
                  <tr className="border-b border-border text-left">
                    <th scope="col" className="py-2 pr-4 font-semibold text-foreground-muted">
                      Ab Stückzahl
                    </th>
                    <th scope="col" className="py-2 font-semibold text-foreground-muted">
                      {preisLabel}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stufen.map((stufe, index) => (
                    <tr
                      key={stufe.minQty}
                      className={cn(
                        'border-b border-border last:border-0',
                        index === aktiv && 'bg-primary-soft',
                      )}
                    >
                      <th
                        scope="row"
                        className={cn(
                          'py-2 pr-4 text-left font-mono font-medium tabular-nums text-foreground-muted',
                          index === aktiv && 'font-bold text-primary',
                        )}
                      >
                        {formatNumber(stufe.minQty)} Stück
                        {index === aktiv && <span className="sr-only"> — gilt für Ihre Auswahl</span>}
                      </th>
                      <td
                        className={cn(
                          'py-2 font-mono tabular-nums text-foreground',
                          index === aktiv && 'font-bold text-primary',
                        )}
                      >
                        {formatCents(stufe.priceCents)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Preis */}
        <div className="rounded-lg border border-border bg-surface-muted p-4">
          <dl className="space-y-2 text-small">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-foreground-muted">{preisLabel}</dt>
              <dd className="font-mono font-semibold tabular-nums text-foreground">{formatCents(stueckpreis)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-foreground-muted">Stückzahl</dt>
              <dd className="font-mono font-semibold tabular-nums text-foreground">{formatNumber(menge)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t border-border pt-2">
              <dt className="font-bold text-foreground">
                {beispiel ? 'Zwischensumme (Beispiel)' : 'Zwischensumme'}
              </dt>
              {/* Summe blendet bei jeder Änderung neu ein (B-20) */}
              <dd
                key={summe}
                className="animate-schleier-ein font-mono text-title-sm font-semibold tabular-nums text-foreground"
              >
                {formatCents(summe)}
              </dd>
            </div>
          </dl>
          {/* Kurze Ansage bei jeder Mengenänderung statt der ganzen Aufstellung. */}
          <p className="sr-only" aria-live="polite">
            {`${formatNumber(menge)} Stück zu je ${formatCents(stueckpreis)}, zusammen ${formatCents(summe)}.`}
          </p>
          <PreisHinweis className="mt-2" />
          <p className="mt-1 text-caption leading-snug text-foreground-muted">
            Die Versandart wählen Sie im Warenkorb.
          </p>
        </div>

        <div>
          <Button
            type="button"
            size="lg"
            fullWidth
            onClick={hinzufuegen}
            disabled={!bestellbar}
            aria-describedby={sperrgrund ? hinweisId : undefined}
          >
            <GlyphWarenkorb size={18} />
            In den Warenkorb
          </Button>

          {sperrgrund && (
            <p id={hinweisId} className="mt-2 text-center text-small text-foreground-muted">
              {sperrgrund}
            </p>
          )}
        </div>

        {/* Bestätigung */}
        <div aria-live="polite">
          {hinzugefuegt !== null && (
            <Alert tone="success" title="Im Warenkorb" role="status">
              <p>
                {formatNumber(hinzugefuegt)} × {article.name} wurde in den Warenkorb gelegt.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <ButtonLink href="/warenkorb">Zum Warenkorb</ButtonLink>
                <ButtonLink href="/artikel" variant="outline">
                  Weitere Artikel
                </ButtonLink>
              </div>
            </Alert>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
