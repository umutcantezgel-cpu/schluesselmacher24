# E0-DATENPFLEGER-01 · Anforderungs-Spur, Projektleitfaden v2.1, Zeilen 1 bis 420

## GEÄNDERTE DATEIEN
- Neu: `/home/user/schluesselmacher24/_werkstatt/ausbau/erhebung/anforderungen-L1.json` (138 Einträge, L-001 bis L-138)
- Neu: `/home/user/schluesselmacher24/_werkstatt/ausbau/berichte/E0-DATENPFLEGER-01.md` (dieser Bericht)
- Keine Projektdatei geändert, nichts committet oder gepusht. Das Erzeugungsskript liegt im Scratchpad und gehört nicht zum Projekt.

## WAS UND WARUM
- Erfasst sind 138 Anforderungen: eine aus dem Titelblatt und 137 aus den Kapiteln 01 bis 09. Kapitel 10 beginnt erst in Zeile 418.
- Gezählt wird jede Soll-Aussage (muss, soll, darf nicht, Pflicht, Ziel) und jedes Element einer Soll-Liste (Navigationspunkt, Schritt, Formularfeld, Seite, Regel, Erfolgskriterium).
- Nicht erfasst sind reine Beschreibungen: Dokumentzweck (Zeilen 19 bis 22), Deckblatt (Zeilen 12 bis 14) und Kundenszenarien.
- Das Feld `inhalt` ist zeichengenau aus dem Leitfaden übernommen. Ein Skript hat jeden Eintrag gegen den Leitfaden-Text geprüft. Zeilen und Fundstellen im Code sind über Textmarken gesucht, nicht von Hand eingetragen.

## GEMEINSAME DATEIEN
Keine gewünschten Änderungen. Hinweise zu Daten stehen unter OFFENE FRAGEN.

## PRÜFUNG UND ERGEBNIS
- Gültiges JSON (`python3 -m json.tool` ohne Fehler). Kennungen fortlaufend L-001 bis L-138. `status` überall „offen“, `pakete` leer, `beleg` null.
- Bestand: vorhanden 119, teilweise 14, fehlt 0, nicht pruefbar 5. Summe 138.
- Alle 138 Leitfaden-Zeilen und alle 133 Code-Fundstellen liegen in existierenden Dateien.
- Zehn Stichproben mit `sed -n` geprüft (L-001, L-012, L-024, L-039, L-058, L-075, L-093, L-107, L-124, L-138). Jede Zeile passt.
- Nicht pruefbar sind fünf Wirkungsaussagen: L-001, L-002, L-008, L-009 und L-042.
- Keine Anforderung hat den Bestand „fehlt“. Die Lücken sind Teilumsetzungen.

## DIE ZEHN WICHTIGSTEN LÜCKEN (teilweise)
1. L-032 Rechtstexte: Der Build prüft vor dem Livegang nur auf Platzhalter in den Rechtsseiten (`src/lib/livegang-pruefung.ts`). Die juristische Prüfung selbst belegt der Code nicht; der Hinweis dazu steht in `src/app/(site)/rechtliches/layout.tsx:38`.
2. L-093 Beleg am Auftrag: Stripe erstellt eine Rechnung (`src/lib/integrations/stripe.ts:172`), im Vorgang gibt es kein Feld dafür (`src/payload/collections/Vorgaenge.ts`).
3. L-016 Hauptnavigation: Zwischen 1024 und 1279 px stehen nur drei Bereiche in der Leiste, sechs liegen unter „Mehr“ (`src/components/layout/site-header.tsx:41`).
4. L-118 Hersteller: alle 52 Codelinien tragen „[Hersteller eintragen]“ (`content/code-lines.json:6`).
5. L-120 Herstellerfilter: ausgeblendet, solange nur Platzhalter gepflegt sind (`src/app/(site)/schluessel-nach-code/shop-liste.tsx:150`).
6. L-115 Beispielbilder je Codelinie: nur eine allgemeine Zeichnung (`src/app/(site)/schluessel-nach-code/[slug]/page.tsx:235`).
7. L-127 Bauformen je Hersteller: der Katalog hat keinen Hersteller (`content/cylinder-catalog.json:19`).
8. L-134 Zusatzkomponenten je Hersteller: Logik im Code (`src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx:222`), aber ohne Daten.
9. L-130 Menge: Der Konfigurator begrenzt auf 30 Zylinder je Bestellung, der Leitfaden verlangt „beliebig viele“ (`konfigurator.tsx:622`).
10. L-015 Stadtseiten: Im aktiven `content/cities.json` steht nur Wetzlar.

Weitere: L-094 Fallback-Werte im Code (`src/lib/data/defaults/settings.ts:49`) und L-043 echte Fotos (Platzhalter, keine Bilddatei in `src`, `content` oder `public`).

## BELEGE
Jeder Eintrag nennt in `fundstelle` und `bestand_fundstelle` Datei und Zeile. Stichproben stehen unter PRÜFUNG.

## OFFENE FRAGEN
1. Abweichungen zu `docs/wert/EVALUIERUNG.md` Abschnitt 4 (nur Code geprüft, Evaluierung nicht neu bewertet):
   - Bart fräsen mit Fahrzeugpflicht (P05-c) und Anzahlung über Festpreis (P06-c): im Code behoben, hier vorhanden (`src/lib/pricing.ts:41` und `:120`).
   - Machbarkeit und Einsendung (P07-b): hier vorhanden, die Freigabe-Mail läuft beim Statuswechsel (`src/payload/hooks/vorgang-benachrichtigen.ts:164`).
   - Produktionsansicht (P08-f): hier vorhanden über die Produktionsliste (`src/payload/components/VorgaengeWerkzeuge.tsx:134`).
   - Bauformen je Hersteller (P09-b) und Stadtseiten (P16-b): hier teilweise statt fehlt.
2. Der Startwerte-Snapshot `content/startwerte/2026-10-25/cities.json` nennt sechs Großstädte. Ob sie live sind, prüfe ich nicht; der aktive Stand hat nur Wetzlar.
3. Die Höchstzahl von 30 Zylindern (L-130) ist eine Geschäftsregel. Ob sie gewollt ist, muss der Inhaber entscheiden.
4. Erfolgsziele (L-010 bis L-015) sind über ihre Umsetzung bewertet. Ob ein Kunde etwas „in wenigen Sekunden“ versteht, prüft der Code nicht.
5. Die Anteile 70 und 30 Prozent (L-004, L-005) sind im Code nicht messbar und deshalb teilweise.
6. Im Leitfaden Zeilen 1 bis 420 steht keine Anweisung an KI-Agenten.
