'use client';

import { useId, useMemo, useState } from 'react';
import Link from 'next/link';

import type { CodeLine, ShopHersteller } from '@/lib/types';
import { cn } from '@/lib/cn';
import {
  bestellWeg,
  codelinienFamilie,
  codelinienPfad,
  codelinienTitel,
  gepflegt,
  herstellerDerLinie,
  herstellerPfad,
  linienZumCode,
  nachHerstellerUndSystem,
  verfuegbarkeitVon,
} from '@/lib/codelinie';
import { codeAnfragePfad } from '@/lib/wege/code-anfrage';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Field } from '@/components/forms/field';
import { Select, TextInput } from '@/components/forms/controls';
import { GlyphFilter } from '@/components/visual/glyphen/filter';
import { GlyphWinkelUnten } from '@/components/visual/glyphen/winkel-unten';
import { GlyphZuruecksetzen } from '@/components/visual/glyphen/zuruecksetzen';
import { motionStyle } from '@/components/visual/motion/motion-style';
import { useAbsichtVorladen } from '@/lib/absicht-vorladen';
import { nachCodeHref } from './[slug]/code-uebernahme';
import { LINIEN_ZEILE_KLASSE, LinienZeileInhalt } from './linien-zeile';

/** Sammelwert „keine Einschränkung“ in den Auswahlfeldern. */
const ALL = 'alle';

/** Mobil zeigt jede Gruppe zunächst so viele Zeilen; der Rest liegt hinter „Alle n anzeigen“. */
const VORSCHAU = 4;

/** Anwendungsfamilie: letzter Eintrag in `tags`, sonst die Anwendung (`codelinienFamilie`). */
const familyOf = codelinienFamilie;

/** Alle durchsuchbaren Felder einer Codelinie in einem Text. */
function haystackOf(line: CodeLine, hersteller?: string): string {
  return [line.name, line.application, line.keyType, line.manufacturer, hersteller, line.system, line.codeRange, ...line.tags]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function sortedUnique(values: Array<string | undefined>): string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value)))].sort((a, b) => a.localeCompare(b, 'de'));
}

export interface ShopListeProps {
  lines: CodeLine[];
  /** Hersteller-Stammliste: Reihenfolge und Adressen der Herstellerseiten. */
  hersteller?: ShopHersteller[];
  /** Anfangswert der Suche, etwa ein Code; ohne Angabe leer. */
  startSuche?: string;
  className?: string;
}

/**
 * Suche und Filter über alle Codelinien.
 *
 * Dimensionen: Freitext, Hersteller, System, Schlüsseltyp und Anwendungsfamilie;
 * Auswahlfelder erscheinen nur, wenn es gepflegte Werte gibt. Sieht die Eingabe
 * wie ein Schlüsselcode aus (ein Wort mit Ziffer), erscheinen zusätzlich alle
 * Linien, zu deren Codeformat sie passt (`codePasst`).
 * Die Treffer stehen nach Hersteller gruppiert, darunter nach System (FA-11-04);
 * unter einem Hersteller nur seine Linien (FA-11-06). Jeder Hersteller mit
 * Namen hat eine eigene Seite, damit keine Linie nur über Suche oder Filter
 * erreichbar ist (Erg. Leitfaden §3). Am Smartphone sind die Auswahlfelder
 * eingeklappt und je System nur die ersten Zeilen sichtbar.
 */
export function ShopListe({ lines, hersteller = [], startSuche = '', className }: ShopListeProps) {
  const [query, setQuery] = useState(startSuche);
  const [manufacturer, setManufacturer] = useState(ALL);
  const [system, setSystem] = useState(ALL);
  const [keyType, setKeyType] = useState(ALL);
  const [family, setFamily] = useState(ALL);
  const [filterOpen, setFilterOpen] = useState(false);
  // Zeilen laden erst bei erkennbarer Absicht vor, nicht alle beim Erscheinen (D-044)
  const vorladen = useAbsichtVorladen();
  const [aufgeklappt, setAufgeklappt] = useState<ReadonlySet<string>>(() => new Set());

  const id = useId();
  const panelId = `${id}-filter`;

  // Hersteller je Linie (Stammliste vor Freitext); Platzhalter zählen nicht.
  const herstellerVon = useMemo(
    () => new Map(lines.map((line) => [line.id, herstellerDerLinie(line, hersteller).name])),
    [lines, hersteller],
  );

  // Auswahlfelder nur mit gepflegten Werten; Anwendungsfamilien erst ab zwei.
  const options = useMemo(
    () => ({
      manufacturers: sortedUnique(lines.map((l) => herstellerVon.get(l.id))),
      systems: sortedUnique(lines.map((l) => gepflegt(l.system))),
      keyTypes: sortedUnique(lines.map((l) => gepflegt(l.keyType))),
      families: sortedUnique(lines.map(familyOf)),
    }),
    [lines, herstellerVon],
  );
  const herstellerOptionen = options.manufacturers;
  const familienZeigen = options.families.length > 1;
  const felderZahl =
    (herstellerOptionen.length > 0 ? 1 : 0)
    + (options.systems.length > 0 ? 1 : 0)
    + (options.keyTypes.length > 0 ? 1 : 0)
    + (familienZeigen ? 1 : 0);

  // Linien, zu deren Codeformat die Eingabe passt — nur, wenn sie wie ein Code aussieht.
  const codeTreffer = useMemo(
    () => new Set(linienZumCode(lines, query).map((line) => line.id)),
    [lines, query],
  );

  const results = useMemo(() => {
    // Mehrere Suchwörter müssen alle passen — das grenzt zuverlässiger ein.
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

    return lines.filter((line) => {
      if (manufacturer !== ALL && herstellerVon.get(line.id) !== manufacturer) return false;
      if (system !== ALL && gepflegt(line.system) !== system) return false;
      if (keyType !== ALL && line.keyType !== keyType) return false;
      if (family !== ALL && familyOf(line) !== family) return false;
      if (terms.length === 0 || codeTreffer.has(line.id)) return true;
      const haystack = haystackOf(line, herstellerVon.get(line.id));
      return terms.every((term) => haystack.includes(term));
    });
  }, [lines, query, manufacturer, system, keyType, family, codeTreffer, herstellerVon]);

  const codeTrefferSichtbar = results.filter((line) => codeTreffer.has(line.id)).length;

  const gruppen = useMemo(() => nachHerstellerUndSystem(results, hersteller), [results, hersteller]);
  // Überschriften nur, wenn es mehr als eine Gruppe oder einen Herstellernamen gibt.
  const mitKoepfen = gruppen.length > 1 || Boolean(gruppen[0]?.name);

  const activeCount =
    (query.trim() ? 1 : 0)
    + (manufacturer !== ALL ? 1 : 0)
    + (system !== ALL ? 1 : 0)
    + (keyType !== ALL ? 1 : 0)
    + (family !== ALL ? 1 : 0);

  function resetAll() {
    setQuery('');
    setManufacturer(ALL);
    setSystem(ALL);
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
        aria-label="Schlüssel nach Code durchsuchen und filtern"
        onSubmit={(event) => event.preventDefault()}
        className="border-b border-border pb-6"
      >
        <Field
          label="Suche"
          hint="Zum Beispiel ein Hersteller, ein System, Briefkasten oder der Code von Ihrem Schloss. Bei einem Code sehen Sie alle Produkte, zu deren Codeformat er passt."
        >
          {({ id: fieldId, describedBy }) => (
            <TextInput
              id={fieldId}
              aria-describedby={describedBy}
              type="search"
              inputMode="search"
              autoComplete="off"
              value={query}
              placeholder="Hersteller, System, Anwendung oder Schlüsselcode"
              onChange={(event) => setQuery(event.target.value)}
            />
          )}
        </Field>

        {/* Zähler und Filter-Knopf in einer Zeile; der Knopf nur am Smartphone (unter 360 px darf er umbrechen) */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="whitespace-nowrap font-mono text-small tabular-nums text-foreground-muted" aria-live="polite">
            <strong className="font-bold text-foreground">{results.length}</strong> von {lines.length} {lines.length === 1 ? 'Produkt' : 'Produkten'}
            {codeTrefferSichtbar > 0 && (
              <span className="sr-only">
                , davon {codeTrefferSichtbar} passend zum Codeformat
              </span>
            )}
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
            felderZahl >= 4 ? 'md:grid-cols-4' : felderZahl === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2',
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

          {options.systems.length > 0 && (
            <Field label="System" hint="So, wie der Hersteller das Schließsystem nennt.">
              {({ id: fieldId, describedBy }) => (
                <Select id={fieldId} aria-describedby={describedBy} value={system} onChange={(e) => setSystem(e.target.value)}>
                  <option value={ALL}>Alle Systeme</option>
                  {options.systems.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          )}

          {options.keyTypes.length > 0 && (
          <Field
            label="Schlüsseltyp"
            info={{
              title: 'Was ist der Schlüsseltyp?',
              body:
                'Der Schlüsseltyp ist die Bauform des Schlüssels, zum Beispiel Möbelschlüssel '
                + 'oder Profilschlüssel. Er steht meist in den Unterlagen des Schlosses. Sind Sie '
                + 'unsicher, lassen Sie das Feld auf „Alle“ und suchen nach der Anwendung.',
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
          )}

          {familienZeigen && (
          <Field
            label="Anwendungsfamilie"
            info={{
              title: 'Was ist eine Anwendungsfamilie?',
              body:
                'Die Anwendungsfamilie fasst Schlösser für denselben Zweck zusammen, zum Beispiel '
                + 'Briefkastenanlagen oder Technikschränke. Damit finden Sie am schnellsten zum Ziel, '
                + 'wenn Sie den Schlüsseltyp nicht kennen.',
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
          )}
        </div>

        {/* Codesuche: Hinweis, dass das Format passt; welches Produkt zum Schloss gehört, zeigen Hersteller und System */}
        {codeTrefferSichtbar > 0 && (
          <p className="mt-4 max-w-measure text-small text-foreground-muted">
            Ihr Code <span className="font-mono font-semibold text-foreground">{query.trim()}</span> passt zum
            Codeformat von {codeTrefferSichtbar} {codeTrefferSichtbar === 1 ? 'Produkt' : 'Produkten'}. Welches
            davon zu Ihrem Schloss gehört, erkennen Sie an Hersteller und System. Passt keines sicher,{' '}
            <Link href={codeAnfragePfad({ code: query })} prefetch={false} className="font-semibold text-primary hover:underline">
              fragen Sie den Code an
            </Link>
            .
          </p>
        )}

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

      {/* Trefferliste: Sprungleiste der Hersteller, darunter je Hersteller die Systeme mit dichten Zeilen */}
      {results.length > 0 ? (
        // min-w-0: Rasterzelle darf schmaler werden als die Sprungleiste; die Leiste scrollt in sich.
        <div className="min-w-0">
          {gruppen.length > 1 && (
            <nav
              aria-label="Hersteller"
              className="sticky top-header z-sticky -mx-5 mb-8 border-b border-border bg-background sm:-mx-6 md:mx-0"
            >
              <ul className="relative flex snap-x gap-1 overflow-x-auto px-5 py-1 scroll-px-5 sm:px-6 sm:scroll-px-6 md:flex-wrap md:overflow-visible md:px-0 md:scroll-px-0">
                {gruppen.map((gruppe) => (
                  <li key={gruppe.adresse ?? 'ohne'} className="shrink-0 snap-start">
                    <a
                      href={`#hersteller-${gruppe.adresse ?? 'ohne'}`}
                      className="inline-flex min-h-touch min-w-touch items-center justify-center whitespace-nowrap px-2 text-small font-semibold text-foreground-muted transition-colors duration-quick ease-standard hover:text-primary"
                    >
                      {gruppe.name ?? 'Ohne Hersteller'}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="grid gap-12">
            {gruppen.map((gruppe, gruppenIndex) => {
              const titelId = `${id}-hersteller-${gruppenIndex}`;
              return (
                <section
                  key={gruppe.adresse ?? 'ohne'}
                  id={`hersteller-${gruppe.adresse ?? 'ohne'}`}
                  className="scroll-mt-14"
                  aria-labelledby={mitKoepfen ? titelId : undefined}
                  aria-label={mitKoepfen ? undefined : 'Produkte'}
                >
                  {mitKoepfen && (
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 id={titelId} className="text-title-sm font-semibold text-foreground">
                        {gruppe.name && gruppe.adresse ? (
                          <Link href={herstellerPfad(gruppe.adresse)} prefetch={false} className="hover:text-primary hover:underline">
                            {gruppe.name}
                          </Link>
                        ) : (
                          'Ohne Herstellerangabe'
                        )}
                      </h3>
                      <p className="font-mono text-caption tabular-nums text-foreground-muted">
                        {gruppe.lines.length} {gruppe.lines.length === 1 ? 'Produkt' : 'Produkte'}
                        {/* „Preis je Stück“ nur, wenn mindestens ein Produkt der Gruppe einen Preis zeigt (R9) */}
                        {gruppe.lines.some((line) => verfuegbarkeitVon(line) === 'lieferbar') && ' · Preis je Stück'}
                      </p>
                    </div>
                  )}

                  {gruppe.systeme.map((systemGruppe, systemIndex) => {
                    const schluessel = `${gruppenIndex}-${systemIndex}`;
                    const offen = aufgeklappt.has(schluessel);
                    const listenId = `${id}-gruppe-${schluessel}`;
                    return (
                      <div key={systemGruppe.name ?? 'ohne-system'} className={cn(mitKoepfen && 'mt-6')}>
                        {systemGruppe.name && <h4 className="eyebrow">System {systemGruppe.name}</h4>}
                        <ul id={listenId} className={cn('border-t border-border', systemGruppe.name && 'mt-3')}>
                          {systemGruppe.lines.map((line, zeile) => {
                            const aufgeklappteZeile = zeile >= VORSCHAU && offen;
                            const ziel = codelinienPfad(line);
                            const weg = bestellWeg(line);
                            // Nur Treffer der Codesuche bekommen einen Knopf; die Adresse trägt den Code.
                            const treffer = codeTreffer.has(line.id);
                            return (
                              <li
                                key={line.id}
                                className={cn(
                                  'border-b border-border',
                                  zeile >= VORSCHAU && !offen && 'hidden md:block',
                                  aufgeklappteZeile && 'sm24-fade',
                                )}
                                style={aufgeklappteZeile ? motionStyle(0, 0.18) : undefined}
                              >
                                <Link
                                  href={ziel}
                                  prefetch={false}
                                  onPointerEnter={() => vorladen(ziel)}
                                  onFocus={() => vorladen(ziel)}
                                  onTouchStart={() => vorladen(ziel)}
                                  className={LINIEN_ZEILE_KLASSE}
                                >
                                  <LinienZeileInhalt
                                    line={line}
                                    zusatz={
                                      treffer && (
                                        <Badge tone="primary" className="ml-2 align-middle font-sans">
                                          passt zum Codeformat
                                        </Badge>
                                      )
                                    }
                                  />
                                </Link>
                                {/* „Nicht lieferbar“: kein Knopf; „auf Anfrage“: Code anfragen statt Warenkorb (FA-22-10). */}
                                {treffer && weg !== 'keiner' && (
                                  <div className="flex justify-end pb-4">
                                    <ButtonLink
                                      href={
                                        weg === 'warenkorb'
                                          ? (nachCodeHref(line.slug, query) ?? ziel)
                                          : codeAnfragePfad({ code: query, schloss: line.name })
                                      }
                                      size="sm"
                                      variant={weg === 'warenkorb' ? 'primary' : 'outline'}
                                      prefetch={false}
                                    >
                                      {weg === 'warenkorb' ? 'Nach Code bestellen' : 'Code anfragen'}
                                      {/* Je Treffer ein eigener Name für Screenreader (WCAG 2.4.4); sichtbar bleibt der Knopftext. */}
                                      <span className="sr-only">: {codelinienTitel(line)}</span>
                                    </ButtonLink>
                                  </div>
                                )}
                              </li>
                            );
                          })}
                        </ul>

                        {systemGruppe.lines.length > VORSCHAU && (
                          <button
                            type="button"
                            aria-expanded={offen}
                            aria-controls={listenId}
                            onClick={() => alleZeigen(schluessel)}
                            className="flex min-h-touch w-full items-center justify-between gap-3 border-b border-border text-small font-semibold text-primary md:hidden"
                          >
                            <span className="min-w-0">
                              {offen ? (
                                'Weniger anzeigen'
                              ) : (
                                <>
                                  Alle <span className="font-mono tabular-nums">{systemGruppe.lines.length}</span> anzeigen
                                </>
                              )}
                            </span>
                            <GlyphWinkelUnten
                              size={16}
                              className={cn('shrink-0 transition-transform duration-base ease-standard', offen && 'rotate-180')}
                            />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </section>
              );
            })}
          </div>
        </div>
      ) : (
        <Card variant="muted">
          <CardBody className="flex flex-col items-start gap-4 py-8 text-left sm:items-center sm:text-center">
            <div>
              <p className="text-body font-bold text-foreground">
                Zu Ihrer Auswahl passt kein Produkt.
              </p>
              <p className="mt-2 max-w-md text-small leading-relaxed text-foreground-muted">
                Setzen Sie die Filter zurück oder suchen Sie mit einem anderen Begriff. Trägt Ihr
                Schloss keinen Code, hilft Schlüssel nach Vorlage. Dort schicken Sie uns zuerst
                Fotos Ihres Schlüssels.
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
