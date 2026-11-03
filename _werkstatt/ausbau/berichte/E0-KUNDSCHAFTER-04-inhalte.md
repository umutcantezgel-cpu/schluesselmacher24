# E0-KUNDSCHAFTER-04 · Inhalte, Seiten, Metadaten und Index-Steuerung

Stand 2026-11-02, Branch claude/affectionate-knuth-n7mjur, nur gelesen. Routen: `_werkstatt/ausbau/erhebung/E0-routen.tsv` (Kopfzeile plus 55 Zeilen). Die Zahlen gelten für den Notbetrieb mit `content/*.json` (siehe Offene Frage 1).

## GEÄNDERTE DATEIEN
- `_werkstatt/ausbau/berichte/E0-KUNDSCHAFTER-04-inhalte.md` (neu)
- `_werkstatt/ausbau/erhebung/E0-routen.tsv` (neu)

Keine Projektdatei geändert, nichts committet, keine Projektbefehle gestartet.

## WAS UND WARUM

**Überblick.** 55 `page.tsx` erfasst. Heute indexierbar sind 181 Adressen, noindex sind 19, ohne eigene Regel sind 2 (404 und Backend). Die Sitemap enthält genau die 181 indexierbaren Adressen.

**1. Index-Steuerung.**
- Grundregel: `(site)/layout.tsx` Z.67 setzt index nur, wenn `indexierungErlaubt()` gilt (`src/lib/umgebung.ts` Z.51-64, also nur in Produktion).
- Fest noindex: kasse Z.19, warenkorb Z.16, bestellung/[id] Z.98, terminstatus Z.11 und sechs Rechtsseiten (agb Z.13, cookie-einstellungen Z.11, datenschutz Z.15, impressum Z.12, widerruf Z.20, widerruf/erklaeren Z.13).
- Substanzregeln im Code: Artikel nur mit echtem Artikel (`artikel/page.tsx` Z.69, `src/lib/artikel.ts` Z.170-172); Codelinie nur ohne Beispiel (`src/lib/codelinie.ts` Z.65-67); Kategorie und Hersteller nur mit einer indexierbaren Linie (`kategorie/[familie]/page.tsx` Z.46, `hersteller/[hersteller]/page.tsx` Z.50); Stadt ohne Platzhalter (`src/lib/rechtliches/indexierung.ts` Z.18-20); Einsatzgebiete-Übersicht nur mit einer Stadt (`standorte/page.tsx` Z.27).
- Der Schalter `seo.noindex` wird gelesen bei Leistungen (`tuer-und-schliesstechnik/[slug]/page.tsx` Z.39, `sicherheitstechnik/[slug]/page.tsx` Z.49), Artikeln, Einsatzgebiet, Codelinien und Marken/Modellen (`src/lib/fahrzeug-texte.ts` Z.296, Z.301, Z.306). Nicht gelesen wird er bei Ratgebern und bei allen Seiten aus `content/seo.json` außer `/artikel` (Befund 1).

**2. Seitentypen** (Dateien; Adressen mit aktuellen Daten)

| Seitentyp | Dateien | indexierbar | noindex |
|---|---|---|---|
| Startseite | 1 | 1 | 0 |
| Bereichs- und Übersichtsseiten | 14 | 13 | 1 |
| Leistungs- und Einzelseiten | 10 | 10 | 0 |
| Anfrage-, Kontakt- und Konfiguratorseiten | 7 | 7 | 0 |
| Vorgangs- und Shopseiten | 4 | 0 | 4 |
| Rechtliche Seiten | 7 | 1 | 6 |
| Detailseiten aus Daten: Marken 12, Modelle 49, Codelinien 52, Kategorien 10, Hersteller 0, Stadt 1 | 6 | 124 | 0 |
| Leistungen 17, Ratgeber 8, Beispielartikel 8 | 4 | 25 | 8 |
| Technisch: 404, Backend (ohne eigene Regel) | 2 | 0 | 0 |

**3. Sitemap und robots.** `src/app/sitemap.ts`: 31 feste Routen (Z.33-65), Marken und Modelle (Z.100-118), Codelinien (Z.121-129), Kategorien (Z.132-139), Hersteller und Artikel (leer), Leistungen (Z.162-168, 17), Ratgeber (Z.170-177, alle 8, ohne noindex-Filter), Einsatzgebiete (Z.180-196, 2). Summe 181. Das lastmod kommt aus `updatedAt` (Z.71-76) und liegt in den Daten nur bei seo.json-Routen, Ratgebern und Städten vor. Keine Bild- oder Videositemap. `src/app/robots.ts`: Produktion erlaubt; gesperrt sind /admin, /api/, /kasse, /warenkorb, /bestellung (Z.19); Sitemap-Verweis Z.22; außerhalb der Produktion Sperre für alles (Z.11). Zusätzlich gibt es `src/app/llms.txt/route.ts`.

**4. Strukturdaten** (21 Dateien mit JSON-LD, `src/components/seo/json-ld.tsx`).
- Organization, WebSite und WebPage mit festen @id `/#organization` und `/#website`. Voll ausgeschrieben nur auf der Startseite (Z.91-112), sonst als Stubs mit @id.
- Locksmith mit OpeningHoursSpecification (Z.76-85) und PostalAddress (Z.37-45), nur auf der Startseite (`page.tsx` Z.116).
- Product mit Offer (Z.156-175) auf 52 Codelinien; Brand entfällt, da alle Hersteller Platzhalter sind. Article (Z.203-212) auf 8 Ratgebern. Service mit City-Area (Z.274-286) auf Wetzlar. Product für Artikel ohne Beispiel: `src/lib/artikel.ts` Z.200-221.
- FAQPage auf 109 Seiten (52 Codelinien, 8 Bereichsseiten, 49 Modelle). BreadcrumbList auf 20 Dateien.
- Keine AggregateRating, Review, VideoObject oder ImageObject.
- R8: Alle FAQ-Quellen erscheinen als Accordion (`service-und-termin/page.tsx` Z.396, `tuer-und-schliesstechnik/page.tsx` Z.364, `schluessel-nach-code/[slug]/page.tsx` Z.306-309). Staffelpreise sind sichtbar (Z.131). Nicht sichtbar ist `dateModified` (json-ld.tsx Z.209) auf Ratgebern, denn die Seite zeigt kein Datum (geprüft in `ratgeber/[slug]/page.tsx` und `page-header.tsx`).

**5. Metadaten-Muster.** Titelvorlage `%s | SCHLÜSSELMACHER24` (`layout.tsx` Z.48), die Startseite ist absolut (`page.tsx` Z.29). openGraph mit website, de_DE und Seitenname (`layout.tsx` Z.60-64), ohne og:url (Z.58-59, bewusst). Teilen-Bilder kommen nur aus 11 Dateien `opengraph-image.tsx` (Startseite und 10 Bereiche), 1200 × 630 px. Kein twitter-Objekt. canonical steht auf jeder indexierbaren Seite (Test `canonical.test.ts`), im Root-Layout nicht (Z.55-57). Meta-Robots nur index und follow; max-image-preview, max-snippet und googlebot sind nicht gesetzt.

**6. Inhalte** (`content/`, Wurzel: 12 Dateien). `seo.json` 26 Einträge (Seitentexte je Route, ohne noindex). `code-lines.json` 52 Codelinien, alle aktiv, alle mit Hersteller "[Hersteller eintragen]". `vehicles.json` 12 Marken, 49 Modelle, ohne seo-Felder. `guides.json` 8 Ratgeber. `cities.json` 1 Einsatzgebiet (Wetzlar). `service-pages.json` 17 Leistungen (10 Tür, 7 Sicherheit). `service-pricing.json` 24 Preisregeln, `pricing-groups.json` 4 Preisgruppen, `car-key-services.json` 6 Autoschlüssel-Leistungen, `blocked-days.json` 5 Sperrtage, `cylinder-catalog.json` Konfiguratorkatalog (Maße, Formen, Funktionen, Extras), `settings.json` Firma, Öffnungszeiten, Buchung und Versand. Es fehlt `content/standard-articles.json`; die 8 Beispielartikel kommen aus `src/lib/data/defaults/standard-articles.ts`. `content/startwerte/2026-10-25/` (14 Dateien) enthält 6 weitere Städte mit Platzhaltern (Berlin, Hamburg, München, Köln, Frankfurt am Main, Stuttgart).

Ratgeber (8, davon 5 mit Gedankenstrich im Titel): "Autoschlüssel verloren — was jetzt zu tun ist"; "Kopie oder Programmierung — wo ist der Unterschied?"; "Zylinder richtig ausmessen"; "Welche Schließanlage passt zu meinem Objekt?"; "Wo finde ich den Schlüsselcode?"; "Einbruchschutz — wo fängt man sinnvoll an?"; "Wohnungsschlüssel verloren — Schloss tauschen oder nicht?"; "Mechanisch oder elektronisch — was ist sinnvoller?"

Hersteller-Seiten: 0, weil keine Linie einen gepflegten Hersteller hat (`codeHersteller`, `src/lib/codelinie.ts`). Codelinien-Titel: alle 52 aus den Daten im Muster "{Anwendung} — Serie {Kennung} nach Code bestellen"; 31 davon sind länger als 60 Zeichen, 42 Beschreibungen länger als 160.

**7. Textgleichheit.** `scripts/textgleichheit.mjs` misst die Jaccard-Ähnlichkeit der Wort-Trigramme des `<main>`-Texts je Seitenpaar (Codelinien, Kategorien, Marken, Modelle). Es gibt nur Kennzahlen aus, ohne Schwelle und ohne Exit-Code. Aufruf: `SM24_DATA=json npx next build`, danach `node scripts/textgleichheit.mjs`; ein Eintrag in `package.json` fehlt. Eine Schwelle steht nur im Test `src/lib/codelinie-texte.test.ts` Z.143-150 (alt über 0,6, neu unter 0,75 × alt).

**8. Markendefinition.** Fuß (`site-footer.tsx` Z.61-62) und Strukturdaten (`json-ld.tsx` Z.119-121) enthalten denselben Satz: "Fachbetrieb für Autoschlüssel, Schlüssel- und Schließtechnik, elektronische Zutrittslösungen und Sicherheitstechnik." Die Startseite zeigt die Vertrauensbasis (`page.tsx` Z.56-58, Z.281) und den Untertitel aus seo.json (Z.178-179). `llms.txt` (`route.ts` Z.27) hat eine Variante. Eine Seite "Über uns" gibt es nicht.

**9. Agenturnennung.** Keine. Fuß, WebSite-Knoten (`json-ld.tsx` Z.98-104) und Metadaten nennen keine Agentur und keinen creator. "Agentur" kommt nur als Formularoption vor (`zutritt-konfigurator.tsx` Z.50).

## BEFUNDE
1. `seo.noindex` ist für Ratgeber und die Seiten aus `content/seo.json` wirkungslos, obwohl die Backend-Felder existieren (`src/payload/fields/gemeinsam.ts` Z.211; Collections Ratgeber und Seiten).
2. `socialImage` wird gemappt (`src/lib/data/payload-mapping.ts` Z.141, Z.166), aber in keiner Metadatenstelle ausgegeben.
3. Gedankenstriche: 218 "—" und 3 "–" in `content/*.json`, darunter 9 seo.json-Titel mit "—" und 5 Ratgeber-Titel. Dazu kommen der Layout-Standardtitel (`layout.tsx` Z.47), der Manifest-Name mit "–" (`src/app/manifest.ts` Z.30) und Texterzeuger in `codelinie-texte.ts` (Z.210-214, Z.222, Z.234, Z.365, Z.376, Z.384, Z.422) und `fahrzeug-texte.ts` (Z.201, Z.217, Z.259). Nach `_GEMEINSAM.md` Z.14 ist das nicht zulässig.
4. Doppelte WebPage-@id: Codelinien-, Ratgeber- und Standortseiten geben dieselbe @id `…/#webpage` in mehreren Script-Blöcken aus (json-ld.tsx Z.150, Z.233, Z.306 bzw. Z.197, Z.306, Z.268). Die Schreibweise ist uneinheitlich: `pageGraphSchema` nutzt `#webpage` ohne Schrägstrich (Z.350).
5. Organization mit Name und Kontakt nur auf der Startseite. Der Markenname steht fest im Text in `publisher` (Z.211) und `provider` (Z.284), nicht aus den Firmendaten.
6. Das Backend hat kein noindex-Metatag. Payload setzt laut `node_modules/@payloadcms/next/dist/views` kein robots; geschützt ist nur die Sperre in robots.txt.
7. robots.txt sperrt /kasse, /warenkorb und /bestellung. Dort gesetzte noindex-Angaben lesen Crawler dadurch nicht.

## GEMEINSAME DATEIEN (Vorschläge, nicht geändert)
1. `src/app/(site)/ratgeber/[slug]/page.tsx` Z.21-33 und `src/app/sitemap.ts` Z.170-177: seo.noindex auswerten.
2. Seiten mit Titel aus seo.json (alle Zeilen der TSV mit "seo.json" in Spalte 5, z. B. `src/app/(site)/autoschluessel/page.tsx` Z.28-37): seo.noindex auswerten oder den Backend-Schalter entfernen.
3. `src/components/seo/json-ld.tsx` Z.150, Z.197, Z.233, Z.268, Z.306, Z.350: je URL eine WebPage-@id, einheitliche Schreibweise.
4. `src/components/seo/json-ld.tsx` Z.209: dateModified nur mit sichtbarem Datum ausgeben.
5. `src/components/seo/json-ld.tsx` Z.211 und Z.284 sowie `src/lib/artikel.ts`: Markenname aus `settings.company.brandName`.
6. Gedankenstriche entfernen: `src/app/(site)/layout.tsx` Z.47, `src/app/manifest.ts` Z.30, `src/lib/codelinie-texte.ts` Z.210-214, Z.222, Z.234, Z.365, Z.376, Z.384, Z.422, `src/lib/fahrzeug-texte.ts` Z.201, Z.217, Z.259, die Fallbacks in TSV-Spalte 5 und 6 sowie `content/*.json`.
7. `src/lib/types.ts` Z.833-834 und `src/lib/data/payload-mapping.ts` Z.141, Z.166: socialImage ausgeben oder streichen.

## PRÜFUNG UND ERGEBNIS
- 55 `page.tsx` und 55 TSV-Zeilen: gleiche Dateien, keine Dubletten, je Zeile 8 Felder.
- 109 Literale aus der TSV im Quellcode oder in den Daten gefunden, 0 Fehler.
- Zählungen per Python über `content/*.json` und die Quelldateien. Sitemap: 31 feste + 1 Einsatzgebiet-Übersicht + 1 Stadt + 12 Marken + 49 Modelle + 52 Codelinien + 10 Kategorien + 17 Leistungen + 8 Ratgeber = 181.
- Keine Build-, Test- oder Datenbankläufe.

## BELEGE
Gelesen: alle 55 `page.tsx`, `src/app/sitemap.ts`, `robots.ts`, `manifest.ts`, `llms.txt/route.ts`, `(site)/layout.tsx`, `src/components/seo/json-ld.tsx`, `src/lib/{umgebung, site-url, artikel, codelinie, codelinie-texte, fahrzeug-texte, rechtliches/firma, rechtliches/indexierung, platzhalter, data/*}.ts`, `scripts/textgleichheit.mjs`, die Tests zu Canonical, Layout, Sitemap, robots und Seitenstruktur, `content/*.json`, `docs/wert/EVALUIERUNG.md` Z.58 und Z.289.

## OFFENE FRAGEN
1. In Produktion läuft die Datenbank (`mitDatenbank()`, `src/lib/umgebung.ts` Z.38-40). Die Zahlen gelten für `content/*.json`; die Datenbankinhalte sind nicht geprüft.
2. Textgleichheit: `docs/wert/EVALUIERUNG.md` Z.58 nennt für Modelle 78 % auf 68 %, Z.289 nennt 0,94 bis 1,00. Ist es dieselbe Messung?
3. Soll robots.txt /kasse, /warenkorb und /bestellung sperren, obwohl deren noindex dann nicht greift?
4. Soll das Backend ein eigenes noindex erhalten?
5. Außerhalb von Vercel gilt jeder Lauf mit NODE_ENV=production als Produktion (`umgebung.ts` Z.51-54), also auch ein lokaler `next start`. Ist das gewollt?
6. Wie Suchmaschinen doppelte @id über mehrere Script-Blöcke werten, ist nicht geprüft.
