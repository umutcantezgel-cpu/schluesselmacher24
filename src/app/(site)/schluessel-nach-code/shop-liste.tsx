'use client';

import { useId, useMemo, useState } from 'react';
import Link from 'next/link';

import type { CodeLine } from '@/lib/types';
import { formatCents } from '@/lib/format';
import { cn } from '@/lib/cn';
import { istPlatzhalter } from '@/lib/platzhalter';
import { codelinienKennung } from '@/lib/codelinie';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Field } from '@/components/forms/field';
import { Select, TextInput } from '@/components/forms/controls';
import { GlyphFilter } from '@/components/visual/glyphen/filter';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';
import { GlyphZuruecksetzen } from '@/components/visual/glyphen/zuruecksetzen';

/** Sammelwert „keine Einschränkung“ in den Auswahlfeldern. */
const ALL = 'alle';

/** Mobil zeigt jede Anwendungsgruppe zunächst so viele Zeilen; der Rest liegt hinter „Alle n anzeigen“. */
const VORSCHAU = 4;

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

/** Titel ohne die angehängte Serienkennung („— Serie MS-01“). Nur Anzeige. */
function titelOf(line: CodeLine): string {
  return line.name.replace(/\s*[—–-]\s*Serie\s+[A-Za-z0-9-]+\s*$/, '');
}

interface Gruppe {
  /** Schlüssel der Anwendungsfamilie (wie beim Filter). */
  schluessel: string;
  /** Augenbraue, etwa „MS · Möbel- und Büroschloss“. */
  kopf: string;
  /** Schlüsseltyp der Gruppe, nur wenn alle Zeilen denselben haben. */
  schluesseltyp?: string;
  lines: CodeLine[];
}

/** Gruppiert die Treffer nach Anwendungsfamilie; die Reihenfolge bleibt die der Daten. */
function gruppenVon(lines: CodeLine[]): Gruppe[] {
  const gruppen = new Map<string, { kopf: string; typen: Set<string>; lines: CodeLine[] }>();
  for (const line of lines) {
    const schluessel = familyOf(line);
    let gruppe = gruppen.get(schluessel);
    if (!gruppe) {
      const praefix = codelinienKennung(line).split('-')[0];
      const anwendung = line.application.split(':')[0].trim();
      gruppe = { kopf: `${praefix} · ${anwendung}`, typen: new Set<string>(), lines: [] };
      gruppen.set(schluessel, gruppe);
    }
    gruppe.typen.add(line.keyType);
    gruppe.lines.push(line);
  }
  return [...gruppen].map(([schluessel, gruppe]) => ({
    schluessel,
    kopf: gruppe.kopf,
    schluesseltyp: gruppe.typen.size === 1 ? [...gruppe.typen][0] : undefined,
    lines: gruppe.lines,
  }));
}

export interface ShopListeProps {
  lines: CodeLine[];
  className?: string;
}

/**
 * Suche und Filter über alle Codelinien.
 *
 * Vier Dimensionen: Freitext, Hersteller, Schlüsseltyp und Anwendungsfamilie.
 * Die Treffer stehen als dichte Zeilen je Anwendungsfamilie. Am Smartphone sind
 * die Auswahlfelder eingeklappt und je Gruppe nur die ersten Zeilen sichtbar.
 */
export function ShopListe({ lines, className }: ShopListeProps) {
  const [query, setQuery] = useState('');
  const [manufacturer, setManufacturer] = useState(ALL);
  const [keyType, setKeyType] = useState(ALL);
  const [family, setFamily] = useState(ALL);
  const [filterOpen, setFilterOpen] = useState(false);
  const [aufgeklappt, setAufgeklappt] = useState<ReadonlySet<string>>(() => new Set());

  const id = useId();
  const panelId = `${id}-filter`;

  const options = useMemo(
    () => ({
      manufacturers: sortedUnique(lines.map((l) => l.manufacturer)),
      keyTypes: sortedUnique(lines.map((l) => l.keyType)),
      families: sortedUnique(lines.map(familyOf)),
    }),
    [lines],
  );

  // Das Auswahlfeld „Hersteller“ erscheint nur, wenn ein echter Hersteller vorliegt.
  const herstellerOptionen = options.manufacturers.filter((value) => !istPlatzhalter(value));

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

  const gruppen = useMemo(() => gruppenVon(results), [results]);

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

  function alleZeigen(schluessel: string) {
    setAufgeklappt((alt) => {
      const neu = new Set(alt);
      if (neu.has(schluessel)) neu.delete(schluessel);
      else neu.add(schluessel);
      return neu;
    });
  }

  return (
    <div className={cn('grid gap-8', className)}>
      {/* Suche und Filter: eine ruhige Zeile mit Haarlinie */}
      <form
        role="search"
        aria-label="Codelinien durchsuchen und filtern"
        onSubmit={(event) => event.preventDefault()}
        className="border-b border-border pb-6"
      >
        <Field
          label="Suche"
          hint="Zum Beispiel Briefkasten, Spind, Profilzylinder oder eine Serienkennung."
        >
          {({ id: fieldId, describedBy }) => (
            <TextInput
              id={fieldId}
              aria-describedby={describedBy}
              type="search"
              inputMode="search"
              autoComplete="off"
              value={query}
              placeholder="Anwendung, Typ oder Hersteller"
              onChange={(event) => setQuery(event.target.value)}
            />
          )}
        </Field>

        {/* Zähler und Filter-Knopf in einer Zeile; der Knopf nur am Smartphone */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="whitespace-nowrap font-mono text-small tabular-nums text-foreground-muted" aria-live="polite">
            <strong className="font-bold text-foreground">{results.length}</strong>
            {results.length === 1 ? ' Codelinie' : ' Codelinien'} von {lines.length}
          </p>

          <Button
            type="button"
            variant="outline"
            className="whitespace-nowrap md:hidden"
            aria-expanded={filterOpen}
            aria-controls={panelId}
            onClick={() => setFilterOpen((open) => !open)}
          >
            <GlyphFilter size={17} />
            {filterOpen ? 'Filter ausblenden' : 'Filter anzeigen'}
            {activeCount > 0 && (
              <Badge tone="primary">
                {activeCount}
                <span className="sr-only"> aktiv</span>
              </Badge>
            )}
          </Button>
        </div>

        <div
          id={panelId}
          className={cn(
            'mt-4 gap-4 md:grid',
            herstellerOptionen.length > 0 ? 'md:grid-cols-3' : 'md:grid-cols-2',
            filterOpen ? 'grid' : 'hidden md:grid',
          )}
        >
          {herstellerOptionen.length > 0 && (
            <Field label="Hersteller">
              {({ id: fieldId }) => (
                <Select id={fieldId} value={manufacturer} onChange={(e) => setManufacturer(e.target.value)}>
                  <option value={ALL}>Alle Hersteller</option>
                  {herstellerOptionen.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          )}

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
            {({ id: fieldId }) => (
              <Select id={fieldId} value={keyType} onChange={(e) => setKeyType(e.target.value)}>
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
            {({ id: fieldId }) => (
              <Select id={fieldId} value={family} onChange={(e) => setFamily(e.target.value)}>
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

        {/* „Filter zurücksetzen“ erscheint nur, wenn ein Filter aktiv ist */}
        {activeCount > 0 && (
          <div className="mt-4 flex justify-end">
            <Button type="button" variant="ghost" onClick={resetAll}>
              <GlyphZuruecksetzen size={15} />
              Filter zurücksetzen
            </Button>
          </div>
        )}
      </form>

      {/* Trefferliste: dichte Zeilen je Anwendungsfamilie */}
      {results.length > 0 ? (
        <div className="grid gap-12">
          {gruppen.map((gruppe, gruppenIndex) => {
            const offen = aufgeklappt.has(gruppe.schluessel);
            const listenId = `${id}-gruppe-${gruppenIndex}`;
            return (
              <section key={gruppe.schluessel} aria-labelledby={`${listenId}-titel`}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 id={`${listenId}-titel`} className="eyebrow">
                    {gruppe.kopf}
                  </h3>
                  {gruppe.schluesseltyp && (
                    <p className="font-mono text-caption text-foreground-muted">{gruppe.schluesseltyp}</p>
                  )}
                </div>

                <ul id={listenId} className="mt-4 border-t border-border">
                  {gruppe.lines.map((line, zeile) => {
                    const staffel = line.bulkPrices?.[0];
                    return (
                      <li
                        key={line.id}
                        className={cn(
                          'border-b border-border',
                          zeile >= VORSCHAU && !offen && 'hidden md:block',
                        )}
                      >
                        <Link
                          href={`/schluessel-nach-code/${line.slug}`}
                          className="group grid min-h-touch-lg grid-cols-12 items-center gap-x-3 gap-y-1 py-4 transition-colors duration-quick ease-standard md:gap-x-6"
                        >
                          <span className="col-span-2 font-mono text-small font-semibold tabular-nums text-foreground">
                            {codelinienKennung(line)}
                          </span>
                          <span className="col-span-9 text-balance text-body font-semibold leading-snug text-foreground transition-colors duration-quick ease-standard group-hover:text-primary md:col-span-3">
                            {titelOf(line)}
                          </span>
                          <GlyphPfeilRechts
                            size={16}
                            className="col-span-1 row-span-2 justify-self-end text-foreground-subtle transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1 group-hover:text-primary md:order-last md:row-span-1"
                          />
                          <span className="col-span-9 col-start-3 font-mono text-small text-foreground-muted md:col-span-3 md:col-start-auto lg:col-span-4">
                            {line.codeFormatLabel}
                          </span>
                          <span className="col-span-9 col-start-3 flex flex-wrap items-baseline gap-x-3 md:col-span-3 md:col-start-auto md:block md:text-right lg:col-span-2">
                            <span className="block font-mono text-body font-semibold tabular-nums text-foreground">
                              {formatCents(line.priceCents)}
                            </span>
                            <span className="block text-caption text-foreground-muted">je Stück</span>
                            {staffel && (
                              <span className="block whitespace-nowrap text-caption text-foreground-muted">
                                Staffelpreis ab {staffel.minQty} Stück
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                {gruppe.lines.length > VORSCHAU && (
                  <button
                    type="button"
                    aria-expanded={offen}
                    aria-controls={listenId}
                    onClick={() => alleZeigen(gruppe.schluessel)}
                    className="mt-3 inline-flex min-h-touch items-center font-semibold text-small text-primary hover:underline md:hidden"
                  >
                    {offen ? 'Weniger anzeigen' : `Alle ${gruppe.lines.length} anzeigen`}
                  </button>
                )}
              </section>
            );
          })}
        </div>
      ) : (
        <Card variant="muted">
          <CardBody className="flex flex-col items-start gap-4 py-8 text-left sm:items-center sm:text-center">
            <div>
              <p className="text-body font-bold text-foreground">
                Zu dieser Auswahl gibt es keine Codelinie.
              </p>
              <p className="mt-2 max-w-md text-small leading-relaxed text-foreground-muted">
                Setzen Sie die Filter zurück oder suchen Sie mit einem anderen Begriff. Wenn Ihr
                Schloss keinen Code trägt, ist der Weg über Schlüssel nach Vorlage der richtige:
                Dort genügen Fotos Ihres Schlüssels.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 sm:justify-center">
              <Button type="button" variant="outline" onClick={resetAll}>
                <GlyphZuruecksetzen size={16} />
                Filter zurücksetzen
              </Button>
              <ButtonLink href="/schluessel-nach-vorlage" pfeil>
                Zu Schlüssel nach Vorlage
              </ButtonLink>
            </div>

            <p className="text-small text-foreground-muted">
              Unsicher, wo der Code steht?{' '}
              <Link
                href="/ratgeber/schluesselcode-finden"
                className="inline-flex min-h-touch items-center font-semibold text-primary hover:underline"
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
