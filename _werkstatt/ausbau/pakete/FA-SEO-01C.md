# FA-SEO-01C · Strukturdaten, Überschriften, Indexierbarkeit je Umgebung, interne Verweise (Teil 3 von FA-SEO-01, ohne Datenschema)

Kopf: Etappe FA Priorität 6 · Rolle Baumeister · Modell Opus · Stufe 3 (Indexierung, Strukturdaten) · Kostenklasse L · kein Datenschema, kein `--pg` · Anforderungen FA-25-00, FA-25-04 bis FA-25-18, FA-23 (Strukturdaten), FA-27-17 · Befunde: `berichte/FA-ABGLEICH.md` Block 11, `berichte/FA-KUNDSCHAFTER-11.md`, `berichte/FA-BLINDPRUEFUNG-11.md` · Recherche: `erhebung/FA-RECHERCHE-05.md` · Messung: `berichte/FA-SEO-02-onpage.md`, Werkzeug `werkzeuge/onpage.mjs`.

## Aufgabe in einem Satz
Bringe Strukturdaten, Überschriften, Indexierbarkeit und interne Verweise auf den Stand, den der Inhaber verlangt, ohne Inhalte für Suchmaschinen zu erfinden. Titel und Beschreibungen sind nicht dein Auftrag (Teile A und B), das Canonical-Feld im Admin auch nicht (braucht ein Datenschema, eigener Teil).

## Vorgabe des Inhabers (wörtlich, Arbeitsanweisung vom 11.11.2026, Abschnitt 25)
„SEO muss von Anfang an technisch mitgedacht werden. Saubere URLs, Seitentitel, Meta Beschreibungen, Überschriftenstruktur, Canonicals, XML Sitemap und robots.txt. Strukturierte Daten für Betrieb, Produkte, Leistungen, Breadcrumbs und passende Inhalte. Sehr gute mobile Performance, optimierte Bilder und kurze Ladezeiten. Interne Verlinkung zwischen Marke, Modell, Leistung, Stadt, Partner, Shop und Ratgeber. Staging nicht versehentlich indexieren. Seobility für technische und Onpage Kontrolle verwenden.“ Abschnitt 23: Erreichbarkeit überall konsistent, auch in strukturierten Daten.

## So bauen
1. Überschriften: genau eine h1 je Seite, keine übersprungenen Ebenen; behebe, was `berichte/FA-SEO-02-onpage.md` meldet, und prüfe die Seiten, die seit dem letzten Lauf neu sind (Fahrzeugklassen, „Fahrzeug nicht gefunden“, `/auftrag-bestaetigen`).
2. Strukturdaten (nur für Sichtbares, R8): der Betrieb (Locksmith mit Anschrift, Telefon und Kontaktpunkt rund um die Uhr, wie in `localBusinessSchema`) als eine feste Kennung, auf die jede Seite verweist, statt nur auf der Startseite; Leistungsseiten mit `Service` (Anbieter, Gebiet, Bezeichnung, Beschreibung aus dem sichtbaren Kurztext); Brotkrumen auf jeder Seite unterhalb der Startseite; Ratgeber als `Article`. `Product` und `Offer` fasst du nicht an (FA-SHOP-01B). `FAQPage` nur dort, wo Fragen und Antworten sichtbar auf der Seite stehen; prüfe den Bestand gegen R8 und entferne die Auszeichnung, wo sie nicht durch Sichtbares gedeckt ist. Keine doppelten Kennungen. Keine Öffnungszeiten in den Strukturdaten außer dem Kontaktpunkt aus `erreichbarkeit(settings)` (FA-23).
3. Staging und Schaufenster: Eine Stelle entscheidet, ob eine Umgebung indexierbar ist (lies `src/lib/umgebung.ts`, `src/app/robots.ts`, `src/lib/rechtliches/indexierung.ts`, `scripts/schaufenster.json`); jede Adresse außer der echten Produktionsdomain liefert `noindex` als Kopfzeile und Meta-Angabe, ohne die Seite in `robots.txt` zu sperren (sonst sieht die Suchmaschine das `noindex` nicht; Quelle in der Recherche). Schließe die Lücke „Produktionsbetrieb außerhalb von Vercel“. Tests für jede Kombination der Umgebung. Du änderst nichts an Vercel, Domain oder Suchmaschinen (G3); der heutige Zustand der Produktion (Schaufenster auf noindex, A-042) bleibt, bis ein Mensch ihn ändert: Dein Code darf ihn nicht versehentlich aufheben. Nenne im Bericht genau, welcher Schalter die Produktion indexierbar macht.
4. Interne Verweise: Marke ↔ Modell ↔ Leistung, Leistung ↔ Ratgeber, Leistung ↔ Ortsseite (nur veröffentlichte), Fahrzeugklassen ↔ Autoschlüssel, Partnerseiten ↔ Autoschlüssel. Baue eine kleine, datengetriebene Verweisliste („Passt dazu“) statt handgesetzter Linkblöcke, wo der Bestand noch keine hat (`seo.internalLinks` gibt es schon: nutze und ergänze es, erfinde kein zweites System); keine Suchbegriffe als Anker im Fuß (R6). Jede indexierbare Seite hat mindestens einen eingehenden internen Verweis; ein Test meldet Waisen.
5. Leistung der Seite: Miss nichts mit einem Server (keiner läuft). Prüfe am Code, was ohne Umbau geht (Bildgrößen, Vorabladen, unnötiger Code im ersten Laden der Startseite), behebe Eindeutiges und nenne den Rest als Vorschlag im Bericht.

## Schreibrechte
src/components/seo/**, src/lib/rechtliches/indexierung.ts, src/lib/umgebung.ts (nur Indexierbarkeit), src/app/robots.ts, src/app/(site)/layout.tsx (nur Strukturdaten und Kopfangaben), Seitenvorlagen unter src/app/(site) nur für Überschriftenebenen, Brotkrumen, Strukturdaten und die Verweisliste; `seo.internalLinks` in content/seo.json, content/service-pages.json, content/guides.json und den Rückfällen (nur Verweislisten); zugehörige Tests; `_werkstatt/ausbau/berichte/FA-SEO-01C.md`.
Nicht anfassen: Titel und Beschreibungen (`metadata`, `generateMetadata`, `seo.title`, `seo.description`: dort arbeitet gleichzeitig FA-SEO-01B), sichtbare Fließtexte, `src/app/sitemap.ts` (dort arbeitet FA-KERN-05; nenne gewünschte Änderungen im Bericht), `Product`/`Offer`, Navigation, Preise, Rechtstexte, alles unter `src/payload`, `src/lib/mail`, `src/lib/zahlung`. Geteilte Dateien nur mit dem Bearbeitungswerkzeug an einzelnen Stellen ändern.

## Prüfen
- `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`
- Kein Build, kein Server, kein `--pg`, kein git. Ein roter Test in Dateien der gleichzeitig laufenden Pakete ist nicht dein Fehler; wiederhole den Lauf und nenne es im Bericht.
- Lies vor Änderungen an Next-Schnittstellen die Anleitungen in `node_modules/next/dist/docs` (Metadaten, robots).

## Grenzen
G3, R1 (eine Fassung für Mensch und Bot), R2, R3, R6, R7, R8, G8, G9. Prettier nicht auf Bestand anwenden.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · PRÜFUNG UND ERGEBNIS · BELEGE · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-SEO-01C · BEREIT ZUR RÜCKGABE ===
