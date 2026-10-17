'use client';

import { useId, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';

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
import { GlyphFilter } from '@/components/visual/glyphen/filter';
import { GlyphHaken } from '@/components/visual/glyphen/haken';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { GlyphZuruecksetzen } from '@/components/visual/glyphen/zuruecksetzen';

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
  /** Beispielhinweis als Zeile mit Glyphe; steht nach dem Suchformular über der Liste. */
  hinweis?: ReactNode;
  className?: string;
}

/**
 * Liste aller Artikel mit Suche und Schlagwortfilter.
 *
 * Filter erscheinen erst, wenn es etwas zu filtern gibt. Am Smartphone sind
 * die Schlagworte eingeklappt, damit die Liste gleich unter der Suche beginnt.
 * Der Hinweis steht zwischen Zählerzeile und Liste, auch ohne Filterformular.
 */
export function ArtikelListe({ articles, hinweis, className }: ArtikelListeProps) {
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
                  <GlyphFilter size={17} />
                  {filterOffen ? 'Schlagworte ausblenden' : 'Schlagworte anzeigen'}
                  {gewaehlt.length > 0 && <Badge tone="primary">{gewaehlt.length} aktiv</Badge>}
                </Button>
              </div>

              <fieldset id={panelId} className={cn('mt-4 md:block', filterOffen ? 'block' : 'hidden')}>
                <legend className="text-small font-semibold text-foreground">Schlagworte</legend>
                <p className="mt-1 text-small leading-snug text-foreground-muted">
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
                              'inline-flex min-h-touch items-center gap-1.5 rounded-lg border px-3.5 text-small font-semibold transition-colors',
                              'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background',
                              an
                                ? 'border-primary bg-primary-soft text-primary'
                                : 'border-border-strong bg-surface text-foreground-muted hover:border-primary hover:text-foreground',
                            )}
                          >
                            {an && <GlyphHaken size={14} />}
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

          <div className="mt-4 flex min-h-touch flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-small tabular-nums text-foreground-muted" aria-live="polite">
              <strong key={treffer.length} className="inline-block sm24-pop [--sm24-duration:var(--dauer-quick)] font-bold text-foreground">{formatNumber(treffer.length)}</strong>
              {'\u00a0'}Artikel von {formatNumber(articles.length)}
            </p>

            {/* „Filter zurücksetzen“ erscheint nur, wenn ein Filter aktiv ist */}
            {aktiv > 0 && (
              <Button type="button" variant="ghost" onClick={zuruecksetzen}>
                <GlyphZuruecksetzen size={15} />
                Filter zurücksetzen
              </Button>
            )}
          </div>
        </form>
      )}

      {hinweis}

      {treffer.length > 0 ? (
        <ul className="border-t border-border">
          {treffer.map((article) => (
            <li key={article.id} className="border-b border-border">
              <ArtikelKarte article={article} />
            </li>
          ))}
        </ul>
      ) : (
        <Card variant="muted">
          <CardBody className="flex flex-col items-start gap-4 py-8 text-left sm:items-center sm:text-center">
            <div>
              <p className="text-body font-bold text-foreground">
                Zu dieser Auswahl gibt es keinen Artikel.
              </p>
              <p className="mt-2 max-w-md text-small leading-relaxed text-foreground-muted">
                Setzen Sie die Filter zurück oder suchen Sie mit einem anderen Begriff.
              </p>
            </div>
            <Button type="button" variant="outline" onClick={zuruecksetzen}>
              <GlyphZuruecksetzen size={16} />
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

  // Eine Zeile der Liste (Stückliste): Fach-Icon ohne Kachel, Name und Kurzangabe, Preis rechts mit „je Stück“, Pfeil als Hinweis.
  return (
    <Link
      href={artikelPfad(article.slug)}
      className="group flex items-center gap-4 py-4 transition-colors duration-quick ease-standard sm:gap-6 sm:py-5"
    >
      <ImagePlaceholder slot={article.image} compact frei className="w-10 shrink-0" sizes="40px" />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h3 className="text-body font-semibold leading-snug text-foreground transition-colors duration-quick ease-standard group-hover:text-primary">
            {article.name}
          </h3>
          {article.example && <Badge tone="neutral">Beispiel</Badge>}
        </div>

        <p className="mt-1 line-clamp-2 max-w-measure text-small leading-relaxed text-foreground-muted md:line-clamp-3">
          {article.description}
        </p>
        {/* Staffel nur bei Mengenpreisen; „je Stück“ steht bereits unter dem Preis. */}
        {preis.ab && (
          <p className="mt-1 text-caption text-foreground-muted">
            ab {formatNumber(preis.abMenge)}{'\u00a0'}Stück · einzeln {formatCents(preis.einzelCents)}
          </p>
        )}
      </div>

      {/* Preis rechts in Mono, darunter die Einheit (Muster Code-Shop) */}
      <p className="shrink-0 text-right">
        <span className="block whitespace-nowrap font-mono text-body font-semibold tabular-nums text-foreground">
          {preisAbText(article)}
        </span>
        <span className="block text-caption text-foreground-muted">je Stück</span>
      </p>

      <GlyphPfeilRechts
        size={16}
        className="shrink-0 text-foreground-muted transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1 group-hover:text-primary group-focus-visible:text-primary"
      />
    </Link>
  );
}
