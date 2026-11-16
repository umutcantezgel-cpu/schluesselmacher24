# FA-QA-03A · Bericht: Prüfwerkzeug reste.mjs

## GEÄNDERTE DATEIEN

- Neu: `_werkstatt/ausbau/werkzeuge/reste.mjs` (Werkzeug, Nachbesserung 16.11.2026: Telefon, Uhrzeiten, Klammern, Demo-Wörter, Anschrift mit PLZ, Umgebung, Ausnahmen mit Feld `ort`)
- Neu: `_werkstatt/ausbau/werkzeuge/reste.test.mjs` (Selbsttest, 44 Tests)
- Neu: `_werkstatt/ausbau/werkzeuge/reste-ausnahmen.json` (leere Liste `[]`, unverändert)
- Geändert: `_werkstatt/ausbau/werkzeuge/LIESMICH.md` (Tabellenzeile unter funktionsliste.mjs, Testzahl)
- Neu: `_werkstatt/ausbau/protokolle/reste-2026-11-16T03-32-11-111Z.json` (Protokoll des ersten Laufs, bleibt als Verlauf)
- Neu: `_werkstatt/ausbau/protokolle/reste-2026-11-16T03-45-28-191Z.json` (Protokoll des Laufs nach der Nachbesserung)
- Geändert: `_werkstatt/ausbau/berichte/FA-QA-03A-lauf.md` (Markdown des Laufs nach der Nachbesserung)
- Neu: `_werkstatt/ausbau/berichte/FA-QA-03A.md` (dieser Bericht)
- Von der Datenweiche angehängt: `_werkstatt/ausbau/protokolle/datenweiche.log` (automatisch, je Aufruf eine Zeile)

Nichts unter `src`, `content`, `scripts`, `docs` geändert. `lib.mjs` nicht angefasst. Kein git.

## WAS UND WARUM

Das Werkzeug `reste.mjs` sucht im gebauten Stand und in den Inhalten nach Resten, die laut Vorgabe des Inhabers nicht übrig bleiben dürfen. Es arbeitet ohne Browser, ohne Netz und ohne neue Abhängigkeit.

Drei Quellen, jeder Fund nennt seine Quelle:
- ausgeliefert: `.next/server/app/**/*.html` (sichtbarer Text, Attribute alt, title, aria-label, meta content, Strukturdaten). Skripte und Stile zählen nicht.
- inhalt: `content/**/*.json` ohne `content/startwerte/**`.
- code: Zeichenketten in `src/lib/data/defaults`, `src/lib/mail/vorlagen`, `src/lib/pdf` (ohne Testdateien, ohne Kommentare).

Fünf Prüfungen, einzeln abschaltbar mit `--nur`: demo, platzhalter, alt, kontakt, erreichbarkeit. Ausnahmen nur genau passend (Prüfung, Quelle, Datei, Fundstück, optional Feld `ort`), mit Grund. Eine nicht mehr passende Ausnahme wird als veraltet gemeldet. Exit 0 ohne Fund, 1 bei Funden oder veralteten Ausnahmen, 2 bei Bedienfehlern (fehlender oder unvollständiger Build; die anderen Quellen werden trotzdem geprüft).

Entscheidungen beim Bau (Stand nach der Nachbesserung):
- Telefonnummern: Ein Treffer wird zuerst in die Nationalform umgewandelt (+49, 0049 und „(0)“ nach +49 werden zur 0), danach höchstens 13 Ziffern der Nationalform in ganzen Bündeln behalten. Inland mindestens zehn Ziffern; kürzere Folgen mit 0 sind Gemeindeschlüssel (AGS) oder Fahrzeugcodes. Ausland (+43, 0043 und andere Vorwahlen mit zwei oder drei Ziffern) ab acht Ziffern. Jede Nummer, die nicht die Nummer aus `content/settings.json` ist, ist ein Fund.
- Anschrift: nur wenn Straße mit Hausnummer und fünfstellige Postleitzahl zusammenstehen (Komma, „in“ oder nichts dazwischen). Vergleich über Straße, Hausnummer und Postleitzahl mit der Firmenanschrift und der Handwerkskammer-Anschrift aus `content/settings.json`.
- Platzhalter in eckigen Klammern: Wörter mit Leerzeichen, Komma oder Doppelpunkt, z. B. `[Ort]`, `[PLZ]`, `[ort]`, `[Name, Ort]`, `[Hersteller eintragen]`. Keine Fundstelle sind Muster wie `[A-Z]`, `[0-9]` oder Zugriffe im Code wie `ART_LABEL[art]`. Die Wortform „Platzhalter“ (auch Platzhaltertext, Platzhaltern) zählt.
- Demo: „Demo“ als Wortanfang, aber nicht Demografie, Demokratie, Demonstration, Demontage. Im ausgelieferten Stand zusätzlich „(Beispiel)“, die Kennzeichnung der Beispielartikel.
- Uhrzeiten: die alten Zeiten mit oder ohne Minuten („9 bis 13 Uhr“, „Mo–Fr 9–13 Uhr“, „09:00-13:00“, „9:00 Uhr – 13:00 Uhr“).
- Umgebung: 30 Zeichen links und rechts vom Fundstück. Die Paketangabe „60 Zeichen Umgebung“ ist so gelesen (offene Frage 6).
- Exit-Vorrang: ein Bedienfehler ergibt Exit 2, auch wenn Funde da sind (siehe offene Fragen).

## PRÜFUNG UND ERGEBNIS

Selbsttest: `node --test _werkstatt/ausbau/werkzeuge/reste.test.mjs` über die Datenweiche (`sicher.sh --json --als-root`): **44 von 44 bestanden**, 9 Suiten. Die Tests decken je Prüfung mindestens einen Fund und einen Nicht-Fund ab. Nachbesserung: Telefon mit 0049 und +49 (0) (Fund) und eigene Nummer in dieser Schreibweise (kein Fund), ausländische Nummern, Uhrzeiten ohne Minuten, Klammern wie [PLZ] und [ort], Platzhaltertext, Code-Zugriff ohne Fund, Demontage ohne Fund, „(Beispiel)“, fremde Postleitzahl und „in“ bei Anschriften, Umgebung mit 30 Zeichen, Ausnahme mit und ohne Feld `ort` (Warnung bei mehreren Treffern), leeres Feld `ort` als Bedienfehler.

Endlauf nach der Nachbesserung gegen den heutigen Stand (Build vom 16.11.2026 03:21 UTC, vollständig: `BUILD_ID` und 148 HTML-Seiten): `sicher.sh --json --als-root -- node _werkstatt/ausbau/werkzeuge/reste.mjs --md …/FA-QA-03A-lauf.md`, **Exit 1**, keine Bedienfehler.

| Quelle | Status | Dateien | Textstellen |
|---|---|---|---|
| ausgeliefert | ok | 148 Seiten | 4743 |
| inhalt | ok | 18 Dateien | 30770 |
| code | ok | 37 Dateien | 3497 |

Funde je Prüfung und Quelle (Vorkommen, nicht Stellen):

| Prüfung | ausgeliefert | inhalt | code | Summe |
|---|---|---|---|---|
| demo | 0 | 0 | 0 | 0 |
| platzhalter | 0 | 52 | 33 | 85 |
| alt | 0 | 0 | 0 | 0 |
| kontakt | 1 | 0 | 0 | 1 |
| erreichbarkeit | 0 | 0 | 0 | 0 |

Summe 86 Vorkommen, verteilt auf 6 Fundgruppen (Dateien), Befunde 1 bis 7 unten. Die sechste Gruppe (`vorschaubilder.ts`, Befund 6) kam durch die erweiterte Klammerprüfung dazu. Ausgenommen: 0. Veraltete Ausnahmen: 0. Warnungen zu Ausnahmen: 0. Bedienfehler: keine.

Lint: `npx eslint` über den Werkzeugordner ausgeführt, eslint ignoriert dort beide Dateien (Ignorier-Muster der Konfiguration). Nicht geprüft, nicht gelockert.

Kein Build, kein Server, kein git, kein Browser verwendet.

## BEFUNDE AM PRODUKT

1. **Platzhalter in den Beispieldaten** (52 Vorkommen): `content/code-lines.json`, Feld `manufacturer` bei allen 52 Einträgen mit `example: true`, Wert `[Hersteller eintragen]`. Diese Einträge sind erfundene Musterdaten. `src/lib/beispiele.ts` (oeffentlicheEintraege, ohneBeispiele) hält sie von der öffentlichen Seite fern, deshalb erscheinen sie im ausgelieferten Stand nicht (Prüfung demo ohne Fund). Vorschlag: den Wert neutral setzen, etwa „Beispiel, kein Hersteller“, oder eine Ausnahme mit Grund „Musterdaten, öffentlich gefiltert durch src/lib/beispiele.ts“. Keinen echten Hersteller eintragen, das wäre erfunden (R4, R12). Entscheidung: Orchestrator.
2. **Platzhalter im Code-Standard für Beispieldaten**: `src/lib/data/defaults/code-lines.ts`, Zeile 242, `manufacturer: '[Hersteller eintragen]'`. Vorschlag: wie Befund 1, im Standard denselben Weg wählen.
3. **Platzhalter im Firmen-Standard**: `src/lib/data/defaults/settings.ts`, 21 Vorkommen in 13 Zeilen (Zeilen 18 bis 33, u. a. Zeile 18 `legalName: '[Platzhalter: vollständige Firmierung]'`, Zeilen 23 und 24 `[PLZ]` und `[Ort]`). `content/settings.json` setzt `isPlaceholder: false`, der Standard wird damit überschrieben. Im ausgelieferten Stand ist davon nichts zu sehen. Vorschlag: Standardwerte nur mit Angaben des Inhabers füllen (G9, Firmendaten); bis dahin nicht ausliefern lassen. Entscheidung: Inhaber.
4. **Platzhalter im Vertragstext**: `src/lib/pdf/partnervertrag.ts`, 10 Vorkommen: Zeilen 52 bis 72 (Platzhaltertext „[Platzhalter: Text des Anwalts …]“ und Wortform), Zeile 119 `OFFEN = '[fehlt]'` (Verwendung im PDF nicht geprüft, siehe offene Fragen), Zeile 256 (Wort „Platzhalter“). Rechtstext (R10, G9). Vorschlag: Text durch Rechtsprüfung und Inhaber ersetzen lassen; kein Agent-Entwurf als Endfassung. Entscheidung: Mensch.
5. **Anschrift in der Datenschutzerklärung**: `.next/server/app/rechtliches/datenschutz.html`, sichtbarer Text, „Gustav-Stresemann-Ring 1 65189 Wiesbaden“. Der Umgebungstext nennt die Informationsfreiheit und die Datenschutzbehörde des Landes Hessen. Das ist eine fremde Anschrift, die nicht in `settings.json` steht. Vorschlag: als Ausnahme mit Grund eintragen (siehe unten). Kein Produktfehler, wenn es die Aufsichtsbehörde ist.
6. **Fehlfund im Code (Log-Präfix)**: `src/lib/pdf/vorschaubilder.ts`, Zeile 78, `console.warn('[vorgangsblatt] Vorschau ausgelassen: …')`. Das ist ein Präfix für die Konsole, kein Kundentext. Das Werkzeug meldet es nur, weil die Klammerprüfung ein Wort in eckigen Klammern findet. Vorschlag: Ausnahme mit Grund „Log-Präfix in console.warn, kein Kundentext“ oder das Präfix ohne Klammern schreiben. Entscheidung: Orchestrator.
7. **Hinweistext im Zutritt-Konfigurator (Widerspruch zu FA-23)**: `src/app/(site)/elektronische-zutrittsloesungen/konfigurator/zutritt-konfigurator.tsx`, Zeile 1088: „Freiwillig. Zum Beispiel: Montage außerhalb der Öffnungszeiten, Ansprechperson vor Ort.“ Der Text steht auch im ausgelieferten Client-Bundle `.next/static/chunks/38tp-qjl_v6jl.js` (geprüft mit Textsuche). Das Werkzeug liest nur die vorgerenderten HTML-Seiten und findet ihn deshalb nicht. Das Wort setzt feste Öffnungszeiten voraus, FA-23 nennt „Werkstatt und persönliche Beratung nach Terminvereinbarung“. Vorschlag: „Zum Beispiel: gewünschte Montagezeit, Ansprechperson vor Ort.“ Entscheidung: Orchestrator (Produkttext, Änderung nicht durch dieses Paket).

Ausgeliefert nicht gefunden (ohne Fund in den vorgerenderten HTML-Seiten): Beispielnamen und Kennungen aus `code-lines.json`, Schreibweisen alter Anschriften und Zeiten, „Öffnungszeiten“, „nach Foto“, Erreichbarkeit im Widerspruch zum Wortlaut des Inhabers, fremde Mailadressen, fremde Rufnummern, „(Beispiel)“. Text, der erst im Browser erscheint (Befund 7), wird nicht geprüft.

## VORGESCHLAGENE AUSNAHMEN

Nicht eingetragen. Der Orchestrator entscheidet (G8: keine Prüfung lockern).

```json
{
  "pruefung": "kontakt",
  "quelle": "ausgeliefert",
  "datei": ".next/server/app/rechtliches/datenschutz.html",
  "fundstueck": "Gustav-Stresemann-Ring 1 65189 Wiesbaden",
  "grund": "Anschrift der Datenschutz-Aufsichtsbehörde des Landes Hessen in der Datenschutzerklärung, keine Angabe des Betriebs",
  "datum": "2026-11-16"
}
```

Vorschlag für Befund 6, nur mit Entscheidung des Orchestrators (Feld `ort` setzen, damit nur diese Stelle frei wird):

```json
{
  "pruefung": "platzhalter",
  "quelle": "code",
  "datei": "src/lib/pdf/vorschaubilder.ts",
  "fundstueck": "[vorgangsblatt]",
  "ort": "Zeile 78",
  "grund": "Log-Präfix in console.warn, kein Kundentext",
  "datum": "2026-11-16"
}
```

Die Platzhalter aus den Befunden 1 bis 4 sind keine Ausnahmekandidaten: sie sollen behoben werden.

## OFFENE FRAGEN

1. **Öffnungszeiten in `content/settings.json`**: `openingHours` enthält Mo bis Do 09:00 bis 13:00 und 14:00 bis 17:00, Fr 09:00 bis 13:00. Das sind genau die Zeiten, die das Paket als frühere Angaben nennt. Das Werkzeug findet sie nicht, weil sie als strukturierte Felder (`from`, `to`) stehen und der ausgelieferte Stand keine Uhrzeiten als Text zeigt. Frage: Sind diese Werte aktuell oder veraltet? Wenn veraltet, muss `settings.json` korrigiert werden (Inhaber).
2. **Beispielartikel**: Die Standardartikel in `src/lib/data/defaults/standard-articles.ts` (SEO-Titel mit „(Beispiel)“, `example: true`) sind nach der Nachbesserung über das Muster „(Beispiel)“ im ausgelieferten Stand erfasst. Im heutigen Build taucht es nicht auf. Frage: Soll das Werkzeug Artikel aus dem Code zusätzlich auf Beispielnamen prüfen? Dafür wäre eine Auswertung des TypeScript-Codes nötig.
3. **Exit bei veralteten Ausnahmen**: Das Werkzeug gibt Exit 1, damit eine nicht mehr passende Ausnahme auffällt. Bitte bestätigen oder ändern.
4. **Exit-Vorrang**: Ein fehlender Build ergibt Exit 2, auch wenn andere Quellen Funde liefern. Bitte bestätigen.
5. **Grenzen des Werkzeugs** (nicht ausgeschaltet, sie gelten):
   - Versteckter Text per CSS (display:none) zählt als sichtbar.
   - Der Zeichenketten-Scanner für Code ist einfach gebaut (Regex-Literale, JSX-Apostrophe): er kann Zeichenketten verfehlen oder falsch zusammenziehen.
   - Text, der erst im Browser erscheint (Client-Bundles in `.next/static/chunks`), wird nicht geprüft (Befund 7).
   - Dynamische Routen ohne vorgerendertes HTML (z. B. `/schluessel-nach-code/[slug]` mit `dynamicParams`) werden nicht geprüft. Dass die Beispiele nicht live sind, sichert heute nur `SM24_BEISPIELE` ab (`beispiele-oeffentlich.test.ts`). Für das Paket FA-QA-03B einen Lauf gegen die gerenderten Seiten mit Serverdaten vormerken.
   - Anschriften ohne Straßenendung (z. B. „Am Markt 3, 35576 Wetzlar“) werden nicht erkannt. Ein offenes Muster würde Angaben wie „Position 3, 12345 Euro“ melden.
   - Ortsnummern mit Trennzeichen und weniger als zehn Ziffern (z. B. „06441 123“) werden nicht gemeldet. Die Regel „zehn Ziffern nur ohne Trennzeichen“ ist nicht umgesetzt, weil Maß- und Bestellnummern dann Fehlfunde erzeugen würden.
   - Ausländische Vorwahlen werden nur mit „+“ oder „00“ erkannt, nicht mit nationalen Schreibweisen ohne Vorwahl.
   - Die Klammerprüfung meldet auch Log-Präfixe in Klammern (Befund 6).
6. **Lesart der Umgebung**: „Fundstück mit 60 Zeichen Umgebung“ ist als 30 Zeichen links und 30 rechts gelesen. Bitte bestätigen.
7. **Prüfung der Client-Bundles**: Soll `.next/static/chunks` als vierte Quelle dazukommen? Das würde den Quellenkatalog des Pakets ändern. Vorschlag für FA-QA-03B.

## NACHBESSERUNG

Gegenprüfung mit 17 Befunden (vier rote, 13 gelbe). Jeder Befund am Code geprüft, Ergebnis je Punkt:

| Nr. | Ergebnis | Begründung |
|---|---|---|
| 1 (rot, Telefon 0049 und +49 (0)) | behoben | Treffer wird zuerst in die Nationalform umgewandelt, dann höchstens 13 Ziffern der Nationalform gekürzt. „(0)“ nach +49 entfällt. Tests: „0049 30 12345678“, „0049 641 1234567“, „0049-6441-1234567“, „+49 (0) 30 1234567“ (Fund), „+49 (0) 6441 8056279“ (kein Fund). |
| 2 (rot, Uhrzeiten ohne Minuten) | behoben | Muster für 9 bis 13 und 14 bis 17 mit optionalen Minuten und „Uhr“. Tests: „9 bis 13 Uhr“, „Mo–Fr 9–13 Uhr“, „14 bis 17 Uhr“, „14–17 Uhr“ (Fund); „Ab 9 Uhr bis 18 Uhr“, „Vom 9 bis 13 Mai“ (kein Fund). |
| 3 (rot, Zutritt-Konfigurator) | behoben im Bericht | Nachgeprüft: „Öffnungszeiten“ steht in `zutritt-konfigurator.tsx` Zeile 1088 und im Client-Bundle `.next/static/chunks/38tp-qjl_v6jl.js`. Als Befund 7 aufgenommen, Vorschlag mit dem genannten Text übernommen. Zeile „nicht gefunden“ auf die vorgerenderten HTML-Seiten eingeschränkt, Browser-Text als Grenze genannt. Die Erweiterung des Werkzeugs auf Client-Bundles ist offene Frage 7 (kein Umbau dieses Pakets). |
| 4 (gelb, Vorschlag „Hersteller eintragen“) | behoben im Bericht | Zutreffend: die 52 Einträge sind Musterdaten, die `src/lib/beispiele.ts` filtert. Befund 1 umformuliert (neutraler Wert oder Ausnahme mit Grund, Hinweis auf den Filter), kein erfundener Hersteller (R4, R12). |
| 5 (gelb, Umgebung 20 Zeichen, 90er Kürzung) | behoben | Umgebung jetzt 30 Zeichen links und rechts, die feste Kürzung auf 90 Zeichen ist entfallen. Test „Umgebung“. Lesart in offener Frage 6. |
| 6 (gelb, Klammern nur mit Kleinbuchstabenwort) | behoben | Klammern mit Wörtern, Leerzeichen, Komma und Doppelpunkt (`[PLZ]`, `[ort]`, `[Name, Ort]`), Muster wie `[A-Z]` und `[0-9]` weiter ausgenommen. Zusätzlich Zugriffe im Code wie `ART_LABEL[art]` ausgenommen; die Erweiterung hätte sonst Fehlfunde in den Mailvorlagen erzeugt. Die Wortform „Platzhalter“ ist erweitert (Platzhaltertext, Platzhaltern). Tests zu Fund, Nicht-Fund und Code-Zugriff. |
| 7 (gelb, „Demontage“) und 13 (gelb, „nta“) | behoben | Ausschluss erweitert auf „Demo(?!gra|kra|nst|nt)“, damit auch Demontage und demontieren ausgeschlossen sind. Tests: „Demontage des Zylinders“, „Schloss-Demontage“, „Zylinder demontieren“ (kein Fund). |
| 8 (gelb, Anschrift ohne Straßenendung) | behoben, Rest als Grenze | „Hauptstraße 5 in 35576 Wetzlar“ wird jetzt erkannt (Trennzeichen „in“, Test). „Am Markt 3, 35576 Wetzlar“ bleibt unerkannt; das offene Muster wäre zu unscharf. Als Grenze in offene Frage 5 aufgenommen. |
| 9 (gelb, Beispielartikel nicht geprüft) | behoben | „(Beispiel)“ in DEMO_WOERTER für den ausgelieferten Stand aufgenommen, Test. Im heutigen Build taucht es nicht auf (geprüft). Die Auswertung des TypeScript-Codes bleibt offene Frage 2. |
| 10 (rot, Anschrift nur Straße und Hausnummer) | behoben | Vergleichsschlüssel ist Straße, Hausnummer und Postleitzahl. Vergleichsliste aus Firmenanschrift (street, postalCode, city) und Handwerkskammer-Anschrift. Test „Langgasse 61, 99999 Berlin“ (Fund), „Langgasse 61, 35576 Wetzlar“ (kein Fund). |
| 11 (gelb, Ausnahme ohne Ort) | behoben | Optionales Feld `ort` (Zeile, Zeigerpfad oder Segmentart) wird verglichen und validiert. Ohne `ort` meldet das Werkzeug einen Treffer, der mehrere Stellen freistellt, als Warnung (Abschnitt „Warnungen zu Ausnahmen“ und Protokoll). Tests. `reste-ausnahmen.json` bleibt leer. |
| 12 (gelb, dynamische Routen) | behoben im Bericht | Zutreffend als Grenze: das Werkzeug liest nur vorgerenderte `.html`-Dateien. Eingetragen in offene Frage 5, Vorschlag für FA-QA-03B. |
| 14 (gelb, Auslandsvorwahlen) | behoben, eine Regel als Grenze | `+43`, `00 43` und andere Vorwahlen werden erkannt, ausländische Nummern ab acht Ziffern, jede Nummer außer den Einstellungsnummern meldet das Werkzeug. Test „+43 1 234567890“ und „0043 1 234567890“. Die Trennzeichen-Regel (zehn Ziffern nur ohne Trennzeichen) ist nicht übernommen, Begründung in offener Frage 5. |
| 15 (gelb, Umgebung, Dublette zu 5) | behoben | Wie Punkt 5. |
| 16 (gelb, „6 Fundgruppen“ bei 5 Gruppen) | behoben | Die Zahl war im alten Lauf falsch. Nach dem neuen Lauf gibt es 6 Dateigruppen, ausdrücklich benannt (Befunde 1 bis 6, Datei `vorschaubilder.ts` neu durch die erweiterte Klammerprüfung). |
| 17 (gelb, Klammerbeschreibung) | behoben | Beschreibung unter „Entscheidungen beim Bau“ und in dieser Nachbesserung korrigiert (Wörter mit Leerzeichen, Komma, Doppelpunkt; Code-Zugriffe ausgenommen). |

Die roten Punkte 1, 2, 3 und 10 sind damit alle behandelt. Kein Befund wurde als unzutreffend zurückgewiesen; die Teilpunkte zu 8 und 14 stehen oben mit Begründung. Die Punkte 7 und 13 sind dieselbe Stelle und werden gemeinsam behandelt.

Nach der Nachbesserung gilt: Selbsttest 44 von 44, Lauf Exit 1 mit 86 Vorkommen (52 in `code-lines.json`, 33 im Code, 1 Anschrift im ausgelieferten Stand). Die Funde sind Befunde am Produkt, keine Ausnahmen (G8).

## FÜR MENSCHEN

- Entscheidung Inhaber: Öffnungszeiten in `settings.json` (offene Frage 1) und Firmendaten-Standard (Befund 3).
- Entscheidung Mensch mit Rechtsprüfung: Vertragstext im PDF-Modul (Befund 4), R10. Dazu klären, ob `[fehlt]` (Zeile 119) im PDF erscheint.
- Entscheidung Orchestrator: Ausnahme für die Aufsichtsbehörde (Vorschlag oben), Ausnahme für das Log-Präfix (Befund 6), Hersteller-Platzhalter in den Beispielen (Befunde 1 und 2), Hinweistext im Zutritt-Konfigurator (Befund 7), Antworten zu den offenen Fragen 2 bis 7.
- Das Werkzeug läuft gegen den Build vom 16.11.2026 03:21 UTC. Nach einem neuen Build sollte der Lauf wiederholt werden.
- Paket FA-QA-03B vormerken: Lauf gegen die gerenderten Seiten mit Serverdaten und Client-Bundles (offene Fragen 5 und 7).

## ABNAHME (Orchestrator, 16.11.2026)

- **Werkzeug geprüft:** Selbsttest `reste.test.mjs` 44 von 44 über die Datenweiche. Lauf gegen den Build der Abnahme von FA-SHOP-03 (148 vorgerenderte Seiten, 18 Inhaltsdateien, 37 Codedateien).
- **Ergebnis für den ausgelieferten Stand:** In den vorgerenderten Seiten steht kein Beispiel- oder Demo-Name, kein Platzhalter, keine alte Anschrift oder Zeit, keine fremde Mailadresse oder Rufnummer und keine Aussage „geöffnet“, die der Erreichbarkeit des Inhabers widerspricht. Einziger Treffer dort ist die Anschrift der Datenschutz-Aufsichtsbehörde in der Datenschutzerklärung (Pflichtangabe, als Ausnahme eingetragen).
- **Entschiedene Ausnahmen** (`reste-ausnahmen.json`, 15 Einträge, jeder mit Grund): „[Hersteller eintragen]“ in den 52 Musterlinien und ihrem Rückfall (öffentlich gefiltert, entfallen mit den echten Angeboten; ein eingetragener Hersteller wäre erfunden); der Rückfall der Firmendaten in `defaults/settings.ts` (als Platzhalter gekennzeichnet, von der Seite nicht gezeigt; die echten Firmendaten stehen in `content/settings.json`); ein Protokollpräfix auf dem Server; die Anschrift der Aufsichtsbehörde. Zwei Ausnahmen treffen mehrere gleiche Stellen derselben Datei; das Werkzeug meldet das als Warnung.
- **Bleibt als echter Fund (Lauf endet deshalb mit 1):** zehn Platzhalter im Partnervertrag (`src/lib/pdf/partnervertrag.ts`: „Text des Anwalts“, „[fehlt]“). Der Vertragstext kommt vom Anwalt (R10, MA-29); bis dahin bleibt der Fund stehen, eine Ausnahme trage ich dafür nicht ein.
- **Befund am Produkt behoben:** Im Zutritt-Konfigurator stand im Hinweis zu den Terminwünschen „Montage außerhalb der Öffnungszeiten“. Gemeint sind die Zeiten des Kunden; der Satz lautet jetzt „Montage außerhalb Ihrer Geschäftszeiten“. Das Werkzeug hätte ihn nicht gefunden, weil der Text erst im Browser entsteht.
- **Öffnungszeiten in `content/settings.json`:** Die Felder (Montag bis Donnerstag 9 bis 13 und 14 bis 17 Uhr, Freitag 9 bis 13 Uhr) werden nirgends angezeigt; sie steuern nur, welche Terminfenster die Buchung anbietet (`src/lib/scheduling.ts`). Ob diese Zeiten als Terminzeiten stimmen, fragt MA-51.
- **Grenzen des Werkzeugs** (im Bericht benannt): Text, der erst im Browser entsteht (Client-Bündel), und Seiten ohne vorgerendertes HTML (etwa Produktseiten) prüft es nicht; Anschriften ohne übliche Straßenendung und kurze Ortsnummern erkennt es nicht. Ein Lauf gegen gerenderte Seiten mit Serverdaten und die Client-Bündel als vierte Quelle sind für FA-QA-03 vorgemerkt.
- **Entschieden zu den offenen Fragen:** 30 Zeichen Umgebung je Seite sind in Ordnung. Veraltete Ausnahmen ergeben Rückgabewert 1, ein fehlender Build 2: bleibt so.

