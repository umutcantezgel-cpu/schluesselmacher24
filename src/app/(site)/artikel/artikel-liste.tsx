'use client';

import { useId, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, RotateCcw, SlidersHorizontal } from 'lucide-react';

import { artikelPfad, filterArtikel, preisAb, preisAbText, schlagworte } from '@/lib/artikel';
import { formatCents, formatNumber } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { StandardArticle } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { Field } from '@/components/forms/field';
import { TextInput } from '@/components/forms/controls';

/** Was die Übersicht von einem Artikel braucht — der Rest bleibt auf dem Server. */
export type ListenArtikel = Pick<
  StandardArticle,
  | 'id'
  | 'slug'
  | 'name'
  | 'description'
  | 'manufacturer'
  | 'priceCents'
  | 'bulkPrices'
  | 'maxQty'
  | 'image'
  | 'tags'
  | 'example'
>;

export interface ArtikelListeProps {
  articles: ListenArtikel[];
  className?: string;
}

/**
 * Kartenraster aller Artikel mit Suche und Schlagwortfilter.
 *
 * Filter erscheinen erst, wenn es etwas zu filtern gibt. Am Smartphone sind
 * die Schlagworte eingeklappt, damit die Karten ohne Scrollen sichtbar sind.
 */
export function ArtikelListe({ articles, className }: ArtikelListeProps) {
  const [suche, setSuche] = useState('');
  const [gewaehlt, setGewaehlt] = useState<string[]>([]);
  const [filterOffen, setFilterOffen] = useState(false);
  const panelId = useId();

  const alleSchlagworte = useMemo(() => schlagworte(articles), [articles]);
  const treffer = useMemo(
    () => filterArtikel(articles, { suche, schlagworte: gewaehlt }),
    [articles, suche, gewaehlt],
  );

  const zeigeFilter = articles.length > 1;
  const aktiv = (suche.trim() ? 1 : 0) + gewaehlt.length;

  function umschalten(tag: string) {
    setGewaehlt((jetzt) => (jetzt.includes(tag) ? jetzt.filter((t) => t !== tag) : [...jetzt, tag]));
  }

  function zuruecksetzen() {
    setSuche('');
    setGewaehlt([]);
  }

  return (
    <div className={cn('grid gap-6', className)}>
      {zeigeFilter && (
        <form
          role="search"
          aria-label="Artikel durchsuchen und filtern"
          onSubmit={(event) => event.preventDefault()}
          className="rounded-lg border border-border bg-surface p-4 md:p-5"
        >
          <Field label="Suche" hint="Zum Beispiel Schlüsselkasten, Briefkasten oder Pflege.">
            {({ id, describedBy }) => (
              <TextInput
                id={id}
                aria-describedby={describedBy}
                type="search"
                inputMode="search"
                autoComplete="off"
                value={suche}
                placeholder="Name, Einsatz oder Schlagwort"
                onChange={(event) => setSuche(event.target.value)}
              />
            )}
          </Field>

          {alleSchlagworte.length > 0 && (
            <>
              {/* Am Smartphone einklappbar, ab Tablet immer sichtbar */}
              <div className="mt-4 md:hidden">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  aria-expanded={filterOffen}
                  aria-controls={panelId}
                  onClick={() => setFilterOffen((offen) => !offen)}
                >
                  <SlidersHorizontal size={17} aria-hidden />
                  {filterOffen ? 'Schlagworte ausblenden' : 'Schlagworte anzeigen'}
                  {gewaehlt.length > 0 && <Badge tone="primary">{gewaehlt.length} aktiv</Badge>}
                </Button>
              </div>

              <fieldset id={panelId} className={cn('mt-4 md:block', filterOffen ? 'block' : 'hidden')}>
                <legend className="text-sm font-semibold text-foreground">Schlagworte</legend>
                <p className="mt-1 text-[13px] leading-snug text-foreground-subtle">
                  Mehrere Schlagworte erweitern die Auswahl.
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {alleSchlagworte.map((tag) => {
                    const an = gewaehlt.includes(tag);
                    return (
                      <li key={tag}>
                        <label className="relative inline-flex cursor-pointer">
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={an}
                            onChange={() => umschalten(tag)}
                          />
                          <span
                            className={cn(
                              'inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border px-3.5 text-[14px] font-semibold transition-colors',
                              'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background',
                              an
                                ? 'border-primary bg-primary-soft text-primary'
                                : 'border-border-strong bg-surface text-foreground-muted hover:border-primary hover:text-foreground',
                            )}
                          >
                            {an && <Check size={14} aria-hidden />}
                            {tag}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </fieldset>
            </>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <p className="text-[14px] text-foreground-muted" aria-live="polite">
              <strong className="font-bold text-foreground">{formatNumber(treffer.length)}</strong>
              {' '}Artikel von {formatNumber(articles.length)}
            </p>

            <Button type="button" variant="ghost" onClick={zuruecksetzen} disabled={aktiv === 0}>
              <RotateCcw size={15} aria-hidden />
              Filter zurücksetzen
            </Button>
          </div>
        </form>
      )}

      {treffer.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {treffer.map((article) => (
            <li key={article.id}>
              <ArtikelKarte article={article} />
            </li>
          ))}
        </ul>
      ) : (
        <Card variant="muted">
          <CardBody className="flex flex-col items-start gap-4 py-8 text-left sm:items-center sm:text-center">
            <div>
              <p className="text-[15px] font-bold text-foreground">
                Zu dieser Auswahl gibt es keinen Artikel.
              </p>
              <p className="mt-2 max-w-md text-[14px] leading-relaxed text-foreground-muted">
                Setzen Sie die Filter zurück oder suchen Sie mit einem anderen Begriff.
              </p>
            </div>
            <Button type="button" variant="outline" onClick={zuruecksetzen}>
              <RotateCcw size={16} aria-hidden />
              Filter zurücksetzen
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

function ArtikelKarte({ article }: { article: ListenArtikel }) {
  // Beim Preis „ab“ steht dabei, ab welcher Menge er gilt und was ein Stück kostet.
  const preis = preisAb(article);
  const einheit = article.example ? 'Beispielpreis je Stück' : 'je Stück';

  return (
    <Link
      href={artikelPfad(article.slug)}
      className="group flex h-full flex-col rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary"
    >
      <ImagePlaceholder
        slot={article.image}
        compact
        className="mb-4"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      />

      {article.example && (
        <p className="mb-2">
          <Badge tone="neutral">Beispiel</Badge>
        </p>
      )}

      <h3 className="text-[15px] font-bold leading-snug text-foreground group-hover:text-primary">
        {article.name}
      </h3>

      <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-foreground-muted">
        {article.description}
      </p>

      <div className="mt-4 flex flex-1 items-end justify-between gap-3 border-t border-border pt-3">
        <div>
          <p className="font-display text-lg font-bold text-foreground">{preisAbText(article)}</p>
          <p className="text-[12px] text-foreground-subtle">
            {preis.ab
              ? `${einheit} ab ${formatNumber(preis.abMenge)} Stück · einzeln ${formatCents(preis.einzelCents)}`
              : einheit}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary">
          Ansehen
          <ArrowRight size={14} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
