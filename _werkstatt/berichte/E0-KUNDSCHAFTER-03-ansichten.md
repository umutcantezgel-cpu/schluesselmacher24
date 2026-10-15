# E0-Kundschafter: Ansichten, Abläufe, Inhalte, Sprachen

Root: `/home/user/schluesselmacher24`. Alle Fundstellen liegen relativ dazu. Die Datei jeder Route ist `src/app/(site)/<route>/page.tsx`, sofern nicht anders angegeben. Nur gelesen, nichts geändert.

## 1. Routenliste (48 page.tsx)

Art: E = Erzählansicht, A = Arbeitsansicht. Datenquelle: `content/…` = JSON, `DB` = Payload (nur DB-Modus), `hart` = im Code.

| Route | Art | Hauptkomponenten | Datenquelle |
|---|---|---|---|
| / | E Start | Hero, Kacheln, Trust, Ratgeber-Teaser | seo.json (''), settings.json, guides.json |
| /artikel | E Angebot | artikel-liste.tsx | seo.json, standardArticles (Default) |
| /artikel/[slug] | E Angebot dyn. | artikel-kauf.tsx | standardArticles (z. B. beispiel-schluesselkasten) |
| /autoschluessel | E Bereich | Accordion, ImagePlaceholder | seo.json, settings, vehicles.json |
| /autoschluessel/nachmachen | E Angebot | ServiceArticle | seo.json, settings |
| /autoschluessel/programmieren | E Angebot | ServiceArticle | seo.json, settings |
| /autoschluessel/kopieren | E Angebot | ServiceArticle | seo.json |
| /autoschluessel/funkschluessel | E Angebot | ServiceArticle | seo.json, settings |
| /autoschluessel/smart-key | E Angebot | ServiceArticle | seo.json, settings |
| /autoschluessel/schluesselbart-fraesen | E Angebot | ServiceArticle | seo.json |
| /autoschluessel/fahrzeugoeffnung | E Angebot | ServiceArticle | seo.json |
| /autoschluessel/marken | E Angebot | InfoTip, KeyKindBadges | seo.json, vehicles.json |
| /autoschluessel/marken/[make] | E Angebot dyn. | Modellliste | vehicles.json (12 Marken, z. B. volkswagen) |
| /autoschluessel/marken/[make]/[model] | E Angebot dyn. | SummaryList, OnSiteBadge | vehicles.json (48 Modelle, z. B. volkswagen/golf) |
| /autoschluessel/anfrage | A Formular | assistent.tsx, FlowShell (13 Schritte) | seo.json, vehicles.json, settings; fetchQuote, fetchSlots, submitRecord |
| /bestellung/[id] | A Status | Badge, SummaryList | DB (getRecord), Token `?t=`, notFound |
| /elektronische-zutrittsloesungen | E Bereich | Accordion, ImagePlaceholder | seo.json |
| /elektronische-zutrittsloesungen/konfigurator | A Konfigurator | zutritt-konfigurator.tsx (9 Schritte) | seo.json; submitRecord |
| /gleichschliessende-zylinder | E Angebot | Accordion, Badge | cylinder-catalog.json, seo.json |
| /gleichschliessende-zylinder/konfigurator | A Konfigurator | konfigurator.tsx (5 Schritte) → Warenkorb | cylinder-catalog.json, seo.json |
| /kasse | A Kasse | kasse-formular.tsx | settings, code-lines, standardArticles, cylinder-catalog; submitOrder |
| /ratgeber | E Ratgeber | Section | guides.json |
| /ratgeber/[slug] | E Ratgeber dyn. | ImagePlaceholder, articleSchema | guides.json (8, z. B. autoschluessel-verloren-was-tun) |
| /rechtliches/agb | A Rechtstext | hart | 15 Platzhalterzeilen |
| /rechtliches/widerruf | A Rechtstext | hart | 6 Platzhalterzeilen |
| /rechtliches/impressum | A Rechtstext | — | settings.json, 6 Platzhalterzeilen |
| /rechtliches/datenschutz | A Rechtstext | — | settings.json, 10 Platzhalterzeilen |
| /rechtliches/versand-und-zahlung | A Rechtstext | integrationStatuses | settings.json, 4 Platzhalterzeilen |
| /rechtliches/cookie-einstellungen | A Einstellung | cookie-einstellungen.tsx | localStorage `sm24-cookie-einwilligung` |
| /schliessanlagen | E Bereich | SystemErklaerung, SystemVergleich | seo.json |
| /schliessanlagen/konfigurator | A Konfigurator | projekt-konfigurator.tsx (11 Schritte) | seo.json, settings; submitRecord (projekt) |
| /schluessel-nach-code | E Angebot | shop-liste.tsx | code-lines.json (52), seo.json |
| /schluessel-nach-code/[slug] | E Angebot dyn. | bestell-formular.tsx | code-lines.json (z. B. ms-01) |
| /schluessel-nach-vorlage | E Bereich | Accordion, ImagePlaceholder | seo.json, settings |
| /schluessel-nach-vorlage/anfrage | A Formular | anfrage-formular.tsx (8 Schritte) | seo.json, settings; submitRecord (anfrage) |
| /service-und-termin | E Bereich | ServiceEinsatzRechner | seo.json, settings, Richtwerte (DB) |
| /service-und-termin/anfrage | A Formular | anfrage-formular.tsx (5 Schritte) | submitRecord (anfrage) |
| /service-und-termin/kontakt | E Info | Alert (Platzhalterfirma) | settings.json |
| /service-und-termin/terminstatus | A Status | status-formular.tsx | fetchRecordStatus (DB) |
| /service-und-termin/vor-ort | E Angebot | Card | cities.json, settings |
| /sicherheitstechnik | E Bereich | Card | seo.json, service-pages.json |
| /sicherheitstechnik/[slug] | E Angebot dyn. | ImagePlaceholder | service-pages.json (7, z. B. videoueberwachung) |
| /sicherheitstechnik/sicherheitscheck | A Formular | sicherheitscheck.tsx (10 Schritte) | seo.json, settings; submitRecord (anfrage) |
| /standorte | E Liste | Alert | cities.json (6) |
| /standorte/[city] | E Angebot dyn. | ImagePlaceholder | cities.json (z. B. berlin) |
| /tuer-und-schliesstechnik | E Bereich | TuerAbsicherungRechner, NachweiseListe | seo.json, service-pages.json, Richtwerte + Nachweise (DB) |
| /tuer-und-schliesstechnik/[slug] | E Angebot dyn. | ImagePlaceholder | service-pages.json (10, z. B. einsteckschloesser) |
| /warenkorb | A Warenkorb | warenkorb-ansicht.tsx | Zustand-Store, localStorage `sm24-warenkorb`; code-lines, settings |

Kein Page-Route, aber in `(site)`: `api/kunden-upload/route.ts` (POST, eine Datei je Aufruf).

## 2. Startseite `src/app/(site)/page.tsx` (362 Zeilen)

1. Einstieg (Hero, `bg-surface`): Eyebrow, H1 und Subline aus seo.json, zwei CTAs (`/autoschluessel/anfrage`, `/schluessel-nach-code`), Kennzahlen (Anzahlung, Vorlauf, Versand). Grafik: ImagePlaceholder 4/3 ohne Bild, Anzeige "Bild folgt". Keine Bewegung außer Hover-Transition.
2. Schnelleinstieg: 8 Kacheln aus `QUICK_ENTRIES` (Navigation ohne Service). Lucide-Icons, `ShieldCheck` doppelt belegt.
3. Autoschlüssel-Ablauf: 5 Schritte, hart im Code (`carKeySteps`). Anzahlung und Vorlauf aus settings.
4. Vertrauen: 4 Karten, hart im Code (`TRUST_POINTS`).
5. Shop-Teaser: 2 Karten (Schlüssel nach Code, Gleichschließende Zylinder).
6. Projekte: 3 Karten aus `NAV_AREAS`.
7. Ratgeber: die ersten 3 Einträge aus guides.json.

Zusätzlich `JsonLd localBusinessSchema` (unsichtbar).

## 3. Layout, Navigation, Fehlerseiten

- `layout.tsx`: `lang="de"`, drei next/font-Schriften, Skip-Link "Zum Inhalt springen" auf `#inhalt` vorhanden.
- `site-header.tsx` (Client): Wortmarke; Desktop ab lg mit 5 Bereichen plus "Mehr" und Aufklappmenü (Spalten, "Nächster Schritt"). Mobil Drawer mit Akkordeon je Bereich. Warenkorb-Icon mit Zähler (erst nach Hydrierung). Button "Termin starten" ab sm.
- `mobile-action-bar.tsx`: vier Schnellzugriffe unter md. Ausgeblendet bei `/anfrage`, `/konfigurator`, `/sicherheitscheck`, `/kasse`, `/admin`.
- `site-footer.tsx` (async): Anschrift und Öffnungszeiten aus settings.company, Service- und Rechtslinks. Öffentlicher Hinweis "Firmendaten sind noch Platzhalter", weil `isPlaceholder: true`.
- `not-found.tsx` vorhanden. `error.tsx`, `loading.tsx`, `global-error.tsx` fehlen. `robots.ts` und `sitemap.ts` vorhanden. Keine `middleware.ts` oder `proxy.ts`.

## 4. Abläufe

Gemeinsame Basis: `useFlow` (`src/lib/flow/use-flow.ts`) speichert Eingaben in localStorage unter `sm24:flow:<id>`, versioniert. Dateien werden nicht gespeichert. Banner "Weitermachen / Neu beginnen". `isStepRelevant` nutzt nur der Schließanlagen-Konfigurator. `onReset` wird nirgends genutzt. `validate` in 6 Abläufen.

- **Autoschlüssel-Termin mit Anzahlung** (`autoschluessel/anfrage/assistent.tsx`, FLOW_ID `autoschluessel-anfrage`, 13 Schritte: marke, modell, baujahr, fahrzeugdaten, schluesselart, vorhandene-schluessel, leistung, schluesselfotos, fahrzeugschein, kontakt, preis, anzahlung, termin). Preis über `fetchQuote`, Zeitfenster über `fetchSlots` (60 min, Vorlauf 7 Tage, Horizont 90 Tage). Absenden über `submitRecord` (`src/lib/actions/records.ts`) mit `kind: 'termin'` und `verify`. Der Server leitet Preis und Anzahlung selbst her (`verifyCarKeyBooking`). Anzahlung Standard 69,90 € (Min. 50, Max. 80), Pflicht-Checkbox. Bestätigung inline, kein eigener Route. `clearFlow` danach. Online-Zahlung nur, wenn `PAYMENT_PROVIDER` und `PAYMENT_API_KEY` gesetzt sind (`src/lib/integrations/index.ts`), sonst Status "offen".
- **Warenkorb → Kasse → Bestellung**: Zugänge über `addCodeKey` (bestell-formular), `addStandard` (artikel-kauf) und `addCylinderOrder` (Zylinder-Konfigurator, danach `router.push('/warenkorb')`). Warenkorb in localStorage `sm24-warenkorb`. `/kasse`: Formular mit React-State, kein useFlow, clientseitige Prüfung `pruefen()`. `submitOrder` (`src/lib/actions/orders.ts`) prüft `expectedTotalCents`. Danach Leeren des Warenkorbs und Weiterleitung zu `redirectUrl` oder `/bestellung/[id]?t=<token>`. `bestellung/[id]/page.tsx` prüft den Token, sonst `notFound`.
- **Schlüssel nach Vorlage** (`schluessel-nach-vorlage/anfrage/anfrage-formular.tsx`, FLOW_ID `schluessel-nach-vorlage-anfrage`, 8 Schritte: foto-vorderseite, foto-rueckseite, foto-spitze, hersteller, nummern, stueckzahl, kontakt, absenden). Fotos über `/api/kunden-upload`. `submitRecord` (`anfrage`). Bestätigung inline mit Vorgangsnummer.
- **Allgemeine Anfrage** (`service-und-termin/anfrage/anfrage-formular.tsx`, FLOW_ID `allgemeine-anfrage`, 5 Schritte). `submitRecord` (`anfrage`). Bestätigung inline.
- **Sicherheitscheck** (`sicherheitstechnik/sicherheitscheck/sicherheitscheck.tsx`, FLOW_ID `sicherheitscheck`, 10 Schritte). `submitRecord` (`anfrage`). Bestätigung inline.
- **Schließanlagen-Projekt** (`schliessanlagen/konfigurator/projekt-konfigurator.tsx`, FLOW_ID `schliessanlagen-projekt`, 11 Schritte). `submitRecord` (`projekt`). Bestätigung inline.
- **Zutrittslösung** (`elektronische-zutrittsloesungen/konfigurator/zutritt-konfigurator.tsx`, FLOW_ID `zutritt-konfigurator`, 9 Schritte). `submitRecord` (`projekt`). Bestätigung inline.
- **Gleichschließende Zylinder** (`gleichschliessende-zylinder/konfigurator/konfigurator.tsx`, FLOW_ID `zylinder-konfigurator`, 5 Schritte). Kein Server-Absenden, nur Warenkorb.
- **Terminstatus**: Nummer und E-Mail über `fetchRecordStatus` (Rate-Limit). Kein useFlow.

## 5. Inhalte

Lesepfad: `src/lib/data/index.ts` → `json-adapter.ts` (`FILE_NAMES`). Fehlt eine Datei, greift `src/lib/data/defaults/*`. Im DB-Modus liest Payload.

- settings.json → settings: Firma, Öffnungszeiten, Buchung (Anzahlung 6990 ct). Footer, Startseite, Autoschlüssel, Kontakt, Rechtstexte.
- vehicles.json → vehicleMakes (12/48): Marken- und Modellseiten, Assistent.
- code-lines.json → codeLines (52): `/schluessel-nach-code*`, Kasse, Sitemap.
- cylinder-catalog.json → cylinderCatalog: Zylinder-Konfigurator, Kasse.
- service-pages.json → servicePages (17: 10 Tür, 7 Sicherheit): `[slug]`-Routen.
- seo.json → pages (24 Routen): Titel, Headlines.
- guides.json → guides (8): Ratgeber.
- cities.json → cities (6): Standorte, Vor-Ort.
- blocked-days.json → blockedDays: Terminsperren.
- pricing-groups.json, service-pricing.json, car-key-services.json: Preislogik.
- Fehlt unter `content/`: `standard-articles.json` (Default: 8 Artikel `beispiel-*`), `records.json` (Default: leer).
- DB-only: Richtwerte-Global, Nachweise (`src/lib/data/richtwerte.ts`, `nachweise.ts`).

Platzhalter (Zeilen mit `[Platzhalter`, `[Hersteller`, `[PLZ]`, `[Ort]`):
- content/: 80 (code-lines.json 52, cities.json 18, settings.json 10).
- src/lib/data/defaults/: 14 (settings.ts 10, content.ts 3, code-lines.ts 1).
- src/app und src/components: 50 (rechtliches/agb 15, datenschutz 10, impressum 6, widerruf 6, versand-und-zahlung 4, Layout und Cookie je 1; weitere Seiten 5; Komponenten 2).

ImagePlaceholder: 37 JSX-Aufrufe in 27 Dateien. Keine `bild:`- oder `visual:`-Verweise in content/ oder src. Im JSON-Modus zeigen daher alle Flächen den Platzhalter "Bild folgt". Bilder kommen nur aus der Payload-Medienbibliothek (`payload-mapping.ts`).

Befund: `code-lines` zeigt den Wert "[Hersteller eintragen]" ungefiltert als Fakt an (`schluessel-nach-code/[slug]/page.tsx:54`). Die Artikelseite filtert dagegen (`artikel/[slug]/page.tsx:40`).

## 6. Sprachen

- Nur Deutsch. Kein i18n-Paket und keine Locale-Routen. `lang="de"`, Intl mit `de-DE`, `localeCompare(…, 'de')`. Keine englischen UI-Texte gefunden.
- Mikrotexte sind verstreut: Knöpfe und Fehler inline in Komponenten (z. B. `kasse-formular.tsx` `pruefen()`). Die Schritt-Knöpfe sind zentral in `flow-shell.tsx`.
- Zentral: `src/lib/navigation.ts` (Bereichs- und Prozesslabels), `src/lib/server/rate-limit.ts` (`RATE_LIMIT_MESSAGE`), `src/lib/format.ts`, `src/lib/integrations/index.ts`, Statuslabels in `bestellung/[id]/page.tsx`.
- Dupliziert: "Einige Angaben sind unvollständig oder ungültig…" steht in `records.ts` und `orders.ts`.

## 7. Zwölf Hauptansichten

Nach Traffic-Wahrscheinlichkeit, Kernaufgabe und Umsatz.

1. `/` (E, Start): Einstieg, höchster Traffic.
2. `/autoschluessel` (E, Bereich): Schwerpunkt, Anzahlungs-Umsatz.
3. `/autoschluessel/anfrage` (A, Assistent): Kernaufgabe Termin.
4. `/autoschluessel/marken` (E, Angebot): Fahrzeugsuche.
5. `/autoschluessel/marken/volkswagen/golf` (E, dyn.): Long-Tail-Traffic.
6. `/schluessel-nach-code` (E, Angebot): Direktkauf.
7. `/schluessel-nach-code/ms-01` (E, dyn.): Produktseite; zeigt Platzhalter-Hersteller.
8. `/warenkorb` (A): Umsatz.
9. `/kasse` (A): Umsatz.
10. `/gleichschliessende-zylinder/konfigurator` (A, Konfigurator): Direktkauf.
11. `/schluessel-nach-vorlage/anfrage` (A, Formular): Anfragen.
12. `/schliessanlagen/konfigurator` (A, Konfigurator): Projekt-Umsatz.

## 8. Hauptaufgaben

1. Autoschlüssel-Termin buchen: `/` → "Fahrzeug auswählen und Termin starten" → `/autoschluessel/anfrage` → 13 Schritte → Anzahlung bestätigen → Termin → Vorgangsnummer.
2. Schlüssel nach Code bestellen: Header "Schlüssel nach Code" → `/schluessel-nach-code` → Codelinie → Bestellformular → Warenkorb → `/kasse` → `/bestellung/[id]?t=…`.
3. Zylinder konfigurieren: `/` → "Zum Konfigurator" → `/gleichschliessende-zylinder/konfigurator` → in den Warenkorb → `/kasse`.
4. Schlüssel nach Vorlage anfragen: Header → "Anfrage starten" → `/schluessel-nach-vorlage/anfrage` (8 Schritte, Fotos) → Vorgangsnummer.
5. Projekt erfassen: Header "Schließanlagen" → "Projekt erfassen" → `/schliessanlagen/konfigurator` (11 Schritte) → Vorgangsnummer.
6. Stand prüfen: Footer "Terminstatus" → `/service-und-termin/terminstatus` → Nummer und E-Mail.

## 9. OFFENE FRAGEN

- Keine Bilder hinterlegt: Ist ein Medien-Upload über Payload vor Livegang geplant?
- Zahlung: Ohne `PAYMENT_PROVIDER` bleiben Vorgänge "offen". Ist Online-Zahlung vorgesehen oder bleibt die Anzahlung manuell?
- Shop: `standard-articles.json` fehlt, es zeigen nur 8 Beispielartikel. Soll der Katalog gepflegt werden?
- Slugs ohne Umlaut: `koda` (Škoda) und `m-gane` (Mégane). Absicht oder Fehler?
- Schließanlagen: Der Navigationstext sagt "zehn Blöcken", der Konfigurator hat 11 Schritte (inkl. `kundentyp`). Welche Zahl gilt?
- Motion-Bausteine (`Reveal`, `InView`, `DrawOn`, `CheckDraw`) und die 55 Fach-Icons werden von keiner Seite genutzt. Die 5 Grafik-Generatoren sind mangels `visual:`-Verweis unerreichbar. Ist das gewollt?
- `error.tsx` und `loading.tsx` fehlen. Gilt der Next-Standard als gewollt?
- Rechtstexte (AGB, Widerruf, Datenschutz, Impressum) enthalten rund 40 Platzhalterzeilen. Ist die juristische Freigabe ein Launch-Blocker?
- Der öffentliche Footer-Hinweis "Firmendaten sind noch Platzhalter" bleibt bis zur Pflege der Einstellungen sichtbar.
- Die Hersteller-Platzhalter auf 52 Codelinien-Seiten: Wer pflegt sie vor Livegang?
- Die 6 Standorte haben nur Platzhalter-Texte in `localIntro`. Sollen sie vorerst offline bleiben?
- Richtwerte und Nachweise liefern im JSON-Modus nur Platzhalter. Im Produktivbetrieb ist die DB-Pflege zu prüfen.

=== ENDE E0-KUNDSCHAFTER-views · BEREIT ZUR RÜCKGABE ===