'use client';

import { useId, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, RotateCcw, SlidersHorizontal } from 'lucide-react';

import type { CodeLine } from '@/lib/types';
import { formatCents } from '@/lib/format';
import { cn } from '@/lib/cn';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { Field } from '@/components/forms/field';
import { Select, TextInput } from '@/components/forms/controls';

/** Sammelwert „keine Einschränkung“ in den Auswahlfeldern. */
const ALL = 'alle';

/**
 * Konvention der Datenschicht: Die Anwendungsfamilie steht als letzter Eintrag
 * in `tags`. Fehlt sie, wird auf die Anwendung zurückgefallen.
 */
function familyOf(line: CodeLine): string {
  const last = line.tags[line.tags.length - 1];
  return last ?? line.application;
}

/** Alle durchsuchbaren Felder einer Codelinie in einem Text. */
function haystackOf(line: CodeLine): string {
  return [line.name, line.application, line.keyType, line.manufacturer, ...line.tags]
    .join(' ')
    .toLowerCase();
}

function sortedUnique(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, 'de'));
}

export interface ShopListeProps {
  lines: CodeLine[];
  className?: string;
}

/**
 * Suche und Filter über alle Codelinien.
 *
 * Vier Dimensionen: Freitext, Hersteller, Schlüsseltyp und Anwendungsfamilie.
 * Am Smartphone sind die Auswahlfelder eingeklappt, damit die Trefferliste
 * ohne Scrollen sichtbar bleibt.
 */
export function ShopListe({ lines, className }: ShopListeProps) {
  const [query, setQuery] = useState('');
  const [manufacturer, setManufacturer] = useState(ALL);
  const [keyType, setKeyType] = useState(ALL);
  const [family, setFamily] = useState(ALL);
  const [filterOpen, setFilterOpen] = useState(false);

  const panelId = useId();

  const options = useMemo(
    () => ({
      manufacturers: sortedUnique(lines.map((l) => l.manufacturer)),
      keyTypes: sortedUnique(lines.map((l) => l.keyType)),
      families: sortedUnique(lines.map(familyOf)),
    }),
    [lines],
  );

  const results = useMemo(() => {
    // Mehrere Suchwörter müssen alle passen — das grenzt zuverlässiger ein.
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

    return lines.filter((line) => {
      if (manufacturer !== ALL && line.manufacturer !== manufacturer) return false;
      if (keyType !== ALL && line.keyType !== keyType) return false;
      if (family !== ALL && familyOf(line) !== family) return false;
      if (terms.length === 0) return true;
      const haystack = haystackOf(line);
      return terms.every((term) => haystack.includes(term));
    });
  }, [lines, query, manufacturer, keyType, family]);

  const activeCount =
    (query.trim() ? 1 : 0)
    + (manufacturer !== ALL ? 1 : 0)
    + (keyType !== ALL ? 1 : 0)
    + (family !== ALL ? 1 : 0);

  function resetAll() {
    setQuery('');
    setManufacturer(ALL);
    setKeyType(ALL);
    setFamily(ALL);
  }

  return (
    <div className={cn('grid gap-6', className)}>
      {/* Suche und Filter */}
      <form
        role="search"
        aria-label="Codelinien durchsuchen und filtern"
        onSubmit={(event) => event.preventDefault()}
        className="rounded-lg border border-border bg-surface p-4 md:p-5"
      >
        <Field
          label="Suche"
          hint="Zum Beispiel Briefkasten, Spind, Profilzylinder oder eine Serienkennung."
        >
          {({ id, describedBy }) => (
            <TextInput
              id={id}
              aria-describedby={describedBy}
              type="search"
              inputMode="search"
              autoComplete="off"
              value={query}
              placeholder="Anwendung, Schlüsseltyp oder Hersteller"
              onChange={(event) => setQuery(event.target.value)}
            />
          )}
        </Field>

        {/* Am Smartphone einklappbar, ab Tablet immer sichtbar */}
        <div className="mt-4 md:hidden">
          <Button
            type="button"
            variant="outline"
            fullWidth
            aria-expanded={filterOpen}
            aria-controls={panelId}
            onClick={() => setFilterOpen((open) => !open)}
          >
            <SlidersHorizontal size={17} aria-hidden />
            {filterOpen ? 'Filter ausblenden' : 'Filter anzeigen'}
            {activeCount > 0 && <Badge tone="primary">{activeCount} aktiv</Badge>}
          </Button>
        </div>

        <div id={panelId} className={cn('mt-4 gap-4 md:grid md:grid-cols-3', filterOpen ? 'grid' : 'hidden md:grid')}>
          <Field label="Hersteller">
            {({ id }) => (
              <Select id={id} value={manufacturer} onChange={(e) => setManufacturer(e.target.value)}>
                <option value={ALL}>Alle Hersteller</option>
                {options.manufacturers.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field
            label="Schlüsseltyp"
            info={{
              title: 'Was ist der Schlüsseltyp?',
              body:
                'Der Schlüsseltyp beschreibt die Bauform des Schlüssels, zum Beispiel '
                + 'Möbelschlüssel oder Profilschlüssel. Er steht meist in den Unterlagen des '
                + 'Schlosses. Wenn Sie unsicher sind, lassen Sie das Feld auf „Alle“ und suchen '
                + 'stattdessen nach der Anwendung.',
            }}
          >
            {({ id }) => (
              <Select id={id} value={keyType} onChange={(e) => setKeyType(e.target.value)}>
                <option value={ALL}>Alle Schlüsseltypen</option>
                {options.keyTypes.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field
            label="Anwendungsfamilie"
            info={{
              title: 'Was ist eine Anwendungsfamilie?',
              body:
                'Die Anwendungsfamilie fasst Schlösser mit ähnlichem Einsatzzweck zusammen, '
                + 'zum Beispiel Briefkastenanlagen oder Technikschränke. Sie ist der schnellste '
                + 'Weg, wenn Sie den Schlüsseltyp nicht kennen.',
            }}
          >
            {({ id }) => (
              <Select id={id} value={family} onChange={(e) => setFamily(e.target.value)}>
                <option value={ALL}>Alle Anwendungen</option>
                {options.families.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <p className="text-[14px] text-foreground-muted" aria-live="polite">
            <strong className="font-bold text-foreground">{results.length}</strong>
            {results.length === 1 ? ' Codelinie' : ' Codelinien'} von {lines.length}
          </p>

          <Button
            type="button"
            variant="ghost"
            onClick={resetAll}
            disabled={activeCount === 0}
          >
            <RotateCcw size={15} aria-hidden />
            Filter zurücksetzen
          </Button>
        </div>
      </form>

      {/* Trefferliste */}
      {results.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((line) => {
            const firstTier = line.bulkPrices?.[0];
            return (
              <li key={line.id}>
                <Link
                  href={`/schluessel-nach-code/${line.slug}`}
                  className="group flex h-full flex-col rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary"
                >
                  <ImagePlaceholder slot={line.productImage} compact className="mb-4" />

                  <h3 className="text-[15px] font-bold leading-snug text-foreground group-hover:text-primary">
                    {line.name}
                  </h3>

                  <p className="mt-1.5 text-[13px] leading-relaxed text-foreground-muted">
                    {line.application}
                  </p>

                  <dl className="mt-3 space-y-1 text-[13px]">
                    <div className="flex gap-2">
                      <dt className="shrink-0 font-semibold text-foreground-subtle">Codeformat:</dt>
                      <dd className="min-w-0 text-foreground-muted">{line.codeFormatLabel}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="shrink-0 font-semibold text-foreground-subtle">Schlüsseltyp:</dt>
                      <dd className="min-w-0 text-foreground-muted">{line.keyType}</dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex flex-1 items-end justify-between gap-3 border-t border-border pt-3">
                    <div>
                      <p className="font-display text-lg font-bold text-foreground">
                        {formatCents(line.priceCents)}
                      </p>
                      <p className="text-[12px] text-foreground-subtle">
                        je Stück
                        {firstTier ? ` · Staffelpreis ab ${firstTier.minQty} Stück` : ''}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary">
                      Ansehen
                      <ArrowRight
                        size={14}
                        aria-hidden
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <Card variant="muted">
          <CardBody className="flex flex-col items-start gap-4 py-8 text-left sm:items-center sm:text-center">
            <div>
              <p className="text-[15px] font-bold text-foreground">
                Zu dieser Auswahl gibt es keine Codelinie.
              </p>
              <p className="mt-2 max-w-md text-[14px] leading-relaxed text-foreground-muted">
                Setzen Sie die Filter zurück oder suchen Sie mit einem anderen Begriff. Wenn Ihr
                Schloss keinen Code trägt, ist der Weg über Schlüssel nach Vorlage der richtige:
                Dort genügen Fotos Ihres Schlüssels.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 sm:justify-center">
              <Button type="button" variant="outline" onClick={resetAll}>
                <RotateCcw size={16} aria-hidden />
                Filter zurücksetzen
              </Button>
              <ButtonLink href="/schluessel-nach-vorlage">
                Zu Schlüssel nach Vorlage
                <ArrowRight size={16} aria-hidden />
              </ButtonLink>
            </div>

            <p className="text-[13px] text-foreground-subtle">
              Unsicher, wo der Code steht?{' '}
              <Link
                href="/ratgeber/schluesselcode-finden"
                className="font-semibold text-primary hover:underline"
              >
                Ratgeber: Wo finde ich den Schlüsselcode?
              </Link>
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
