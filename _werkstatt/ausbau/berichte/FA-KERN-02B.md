# FA-KERN-02B · Eine Fahrzeugschlüssel-Anfrage für alle Klassen

Baumeister, 15.11.2026. Kein git, kein Server, keine Migration (keine Werteliste brauchte einen neuen Wert).

## GEÄNDERTE DATEIEN

Neu
- src/components/fahrzeug-anfrage/kern.ts (reine Funktionen: Daten, Schritte, Prüfung je Schritt, Nutzlast, Dateien je Steckplatz, Zusammenfassung, Vorbelegung)
- src/components/fahrzeug-anfrage/pflicht.ts (Pflichtliste aus der Regel, nur Server)
- src/components/fahrzeug-anfrage/zustand.ts (Hook: useFlow plus Dateien je Steckplatz)
- src/components/fahrzeug-anfrage/formular.tsx (gemeinsames Formular, sechs Schritte)
- src/components/fahrzeug-anfrage/kraftrad-suche.tsx (bisher motorradschluessel/anfrage/motorrad-suche.tsx, jetzt mit Block)
- src/components/fahrzeug-anfrage/nicht-gefunden.tsx (Block „Fahrzeug nicht gefunden?“)
- src/components/fahrzeug-anfrage/seiten.tsx (Metadaten mit noindex-Schalter, Anfrageseite, Einstiegsseite, Unterlagen aus der Regel)
- src/app/(site)/roller-und-kleinstfahrzeuge/{layout,page,anfrage/page}.tsx
- src/app/(site)/e-scooter/{layout,page,anfrage/page}.tsx
- src/app/(site)/seniorenmobile/{layout,page,anfrage/page}.tsx
- src/app/(site)/fahrradschluessel/{layout,page,anfrage/page}.tsx
- src/app/(site)/autoschluessel/fahrzeug-nicht-gefunden/page.tsx
- Tests: src/components/fahrzeug-anfrage/{kern.test.ts, zustand.test.ts, nicht-gefunden.test.tsx, seiten.test.tsx}, src/app/(site)/service-und-termin/anfrage/anfrage-formular.test.tsx, src/lib/server/fahrzeug-anfrage.db.test.ts

Geändert
- src/lib/fahrzeuge/anfrage-klassen.ts (ANFRAGE_FORMULAR, FORMULAR_KLASSEN, NICHT_GEFUNDEN_ADRESSE, KLASSEN_SEITEN, klassenSeite, fahrzeugklasseText)
- src/app/(site)/motorradschluessel/anfrage/page.tsx (gemeinsames Formular), src/app/(site)/motorradschluessel/page.tsx (Abschnitt 03 „Das brauchen wir von Ihnen“ aus der Regel, „Weiß ich nicht“ wie im Formular)
- gelöscht: src/app/(site)/motorradschluessel/anfrage/{anfrage-formular.tsx, kern.ts, kern.test.ts, motorrad-suche.tsx} (aufgegangen im gemeinsamen Ablauf; die Tests leben in fahrzeug-anfrage/kern.test.ts weiter)
- src/app/(site)/service-und-termin/anfrage/anfrage-formular.tsx (Verweis in die geführten Wege, Text zu Unterlagen, Bestätigung)
- src/components/autoschluessel/fahrzeug-ziel.ts (anfrageHref → /autoschluessel/fahrzeug-nicht-gefunden), fahrzeug-suche.tsx (Block, Telefon, Treffer mit Marke und Reihe getrennt)
- src/app/(site)/autoschluessel/anfrage/assistent.tsx (nur Block im Fahrzeugschritt)
- src/app/(site)/autoschluessel/marken/page.tsx und marken/[make]/page.tsx (nur Block, Telefon aus den Einstellungen)
- src/app/sitemap.ts (neue Seiten nur bei eingeschaltetem Schalter)
- content/seo.json und src/lib/data/defaults/content.ts (nur die neun neuen Routen; der Rückfall wird aus KLASSEN_SEITEN gebaut)
- src/payload/collections/Vorgaenge.ts (virtuelles Feld „Fahrzeugklasse“), src/payload-types.ts (dazu passend), src/lib/druckansichten.ts und src/lib/pdf/vorgangsblatt.ts (Zeile „Fahrzeugklasse“)
- Tests: src/lib/actions/security.test.ts, src/app/sitemap.test.ts, src/components/autoschluessel/fahrzeug-ziel.test.ts, src/lib/pdf/vorgangsblatt.test.ts

Nicht angefasst: records.ts (keine neue Quelle nötig, `fahrzeug-anfrage` steht schon in ANFRAGE_QUELLEN), unterlagen-pflicht.ts, Upload-Route und -Schema, rubriken, navigation, Hub, Startseite, vehicles.json, fahrzeugkatalog.json, Preise, Rechtstexte, Migrationen.

## WAS UND WARUM

1. Gemeinsamer Ablauf. Ein Formular (`FahrzeugAnfrageFormular`) trägt Motorrad, Roller, E-Scooter, Seniorenmobil, Fahrrad und „Fahrzeug nicht gefunden“. Was es je Klasse fragt, steht in `ANFRAGE_FORMULAR`: Adressen, Felder (Hersteller, Modell oder Typ, Baujahr Pflicht/freiwillig/keins; beim Fahrrad Hersteller und Schlüsselnummer des Schlosses), Katalogsuche (nur Krafträder), Chip-Frage (Motorrad, Roller, nicht gefunden), Hilfetexte, Bestätigung, Schalter `indexierbar`. Schritte: Fahrzeug → Schlüssel (vorhanden oder keiner, Chip) → Unterlagen → Beschreibung → Kontakt → Prüfen und absenden, mit Fortschrittsanzeige des Bestands (FlowShell).
2. Pflicht nur aus der Regel. Die Seite ruft auf dem Server `fehlendeFahrzeugUnterlagen` mit leerem Fall auf (pflicht.ts) und gibt dem Formular die Tabelle je Nachweisweg (Roller: Fahrzeugschein oder Versicherungskennzeichen) und Schlüsselstand mit. Das Formular zeigt genau diese Steckplätze (Fahrzeugschein; Ersatznachweis mit Art; Typenschild-Foto oder FIN oder „kein Typenschild“; drei Schlüsselfotos), je mit Beispielbild und Satz, sperrt „Weiter“ und sagt in einem Satz, was fehlt. Der Server prüft beim Absenden mit derselben Regel (Quelle `fahrzeug-anfrage`, Bereich `autoschluessel`, Feld `klasse`). Die Einstiegsseiten und die Motorradseite nennen die Unterlagen aus derselben Regel (`UnterlagenAusRegel`). Formulare laden zur Laufzeit nichts aus lib/server (nur `import type`).
3. Zurück ohne Datenverlust. Angaben liegen im Zwischenstand (useFlow), die ausgewählten und hochgeladenen Dateien im Zustand der Komponente; alle Schritte stehen in derselben Komponente, darum bleiben beide beim Zurückgehen erhalten (Test mit dem echten useFlow). Grenze des Bestands: Nach einem Neuladen der Seite sind die Dateien weg (sie liegen nie im Browserspeicher); das Formular sagt das im Unterlagenschritt, und im letzten Schritt führt ein Knopf zum unvollständigen Schritt.
4. Telefon und Erreichbarkeit im Unterlagenschritt (Hilfe-Box mit Baustein `Erreichbarkeit` und `erreichbarkeit(settings)`), Rückruf und „später weitermachen“.
5. „Fahrzeug nicht gefunden?“ als fester Block (`FahrzeugNichtGefunden`, Telefon aus `kontakt(settings.company)`) unter der Fahrzeugsuche, am Ende des Fahrzeugschritts im Termin-Assistenten (dort ersetzt er den alten Satz), auf der Markenübersicht (ersetzt die Box „Marke nicht dabei?“ mit Link in die allgemeine Anfrage), auf jeder Markenseite, in der Kraftradsuche (Motorrad und Roller). `anfrageHref` und damit `ANFRAGE_OHNE_MARKE`, „Fahrzeug trotzdem anfragen“, „Fahrzeug anfragen“ und die Marken ohne eigene Seite führen nach `/autoschluessel/fahrzeug-nicht-gefunden`; Treffer des Katalogs gehen mit Marke und Reihe getrennt mit (mehrteilige Marken), freier Suchtext als `fahrzeug`. Die Seite belegt Marke und Modell vor (bereinigt, gekürzt).
6. Allgemeine Anfrage. Bei den Themen „Autoschlüssel“ und „Schlüssel nach Vorlage“ fragt der erste Schritt „Was möchten Sie?“: „Ich möchte einen Schlüssel anfertigen lassen“ zeigt die geführten Wege (Termin-Assistent, nicht gefunden, Motorrad, Roller, E-Scooter, Seniorenmobil, Fahrrad; Vorlage-Anfrage, Einschicken) und lässt nicht weiter; „Ich habe eine Frage“ geht weiter (Nutzlast `anliegenArt: 'frage'`). Der Satz „freiwillig … von beiden Seiten“ ist ersetzt. Die Bestätigung einer Frage zu „Schlüssel nach Vorlage“ zeigt die Schritte einer allgemeinen Anfrage (Bereich wie der Server: Service und Termin), nicht die der Foto-Anfrage.
7. Einstiegsseiten `/roller-und-kleinstfahrzeuge`, `/e-scooter`, `/seniorenmobile`, `/fahrradschluessel` nach dem Muster der Motorradseite: was wir tun, was bei dieser Fahrzeugart anders ist (Versicherungskennzeichen; kein Fahrzeugschein und Typenschild, welches Schloss; Eigentümer bei überlassenen Fahrzeugen; beim Fahrrad zählt das Schloss, Schlüsselnummer, Codekarte), Unterlagen aus der Regel, Knopf, Telefon und Erreichbarkeit. Keine Preise, keine Zeiten, keine Marken- oder Modellversprechen. Alle neuen Seiten (vier Einstiege, vier Anfragen, nicht gefunden) stehen auf `noindex, follow` und fehlen in der Sitemap, solange `indexierbar` der Klasse aus ist; jede page.tsx setzt ihre eigene canonical. Kopftexte in content/seo.json und gleichlautend im Rückfall (Titel samt Marke 45 bis 55 Zeichen, Beschreibungen 134 bis 148 Zeichen, ohne Gedankenstriche).
8. Admin und Vorgangsblatt. Die Klasse steht als `daten.klasse` im Vorgang; das Backend zeigt das virtuelle Feld „Fahrzeugklasse“ (beim Roller mit Nachweisweg), HTML- und PDF-Vorgangsblatt eine Kopfzeile „Fahrzeugklasse“, die Zusammenfassung (Vorgangsblatt, Mail an das Team) beginnt mit „Fahrzeugklasse“. Finden nach Klasse: Vorgänge-Liste mit `?where[daten.klasse][equals]=roller` (im Datenbanktest gegen Postgres belegt). Die Steckplätze zeigt der Bestand. Keine neue Mailart; der Kunde bekommt die Eingangsbestätigung des Bestands.

## GEMEINSAME DATEIEN (für FA-SOFORT-05)

Einträge für content/rubriken.json und src/lib/data/defaults/rubriken.ts (Felder wie das Rubriken-Modell). Hub und Navigation: je Rubrik `navigation: "autoschluessel"`, `bereich: "autoschluessel"`, Status nach Freigabe (heute sind die Seiten noindex, Vorschlag `status: "spaeter"` bis zur Freigabe).

1. Kennung `roller-und-kleinstfahrzeuge` · Name „Roller und Kleinstfahrzeuge“ (Laienname „Roller, Mofa, Moped“) · Adresse `/roller-und-kleinstfahrzeuge` (Anfrage `/roller-und-kleinstfahrzeuge/anfrage`) · Ablauf: 1 „Fahrzeug angeben“ (Hersteller, Typ, mit Fahrzeugschein oder Versicherungskennzeichen) · 2 „Schlüssel und Chip“ · 3 „Unterlagen hochladen“ (Nachweis und drei Fotos) · 4 „Preis erhalten“ (Wir prüfen und melden uns mit Preis und Termin) · Abschluss `anfrage` · Pflichtuploads mit Fahrzeugschein: `fahrzeugschein`, `schluesselfoto`; mit Versicherungskennzeichen: `dokument` (Ersatznachweis, Typenschild), `schluesselfoto` · Nachweis: Fahrzeugschein oder Ersatznachweis nach Wahl (siehe OFFENE FRAGEN).
2. Kennung `e-scooter` · Name „E-Scooter und ähnliche Elektrofahrzeuge“ (Laienname „E-Scooter“) · Adresse `/e-scooter` (Anfrage `/e-scooter/anfrage`) · Ablauf: 1 „Fahrzeug angeben“ · 2 „Schlüssel angeben“ · 3 „Nachweis, Typenschild und drei Fotos hochladen“ · 4 „Preis erhalten“ · Abschluss `anfrage` · Pflichtuploads `dokument` (Ersatznachweis; Typenschild oder FIN), `schluesselfoto` · Nachweis: Ersatznachweis.
3. Kennung `seniorenmobile` · Name „Seniorenmobile und vergleichbare Fahrzeuge“ (Laienname „Seniorenmobil“) · Adresse `/seniorenmobile` (Anfrage `/seniorenmobile/anfrage`) · Ablauf wie E-Scooter · Abschluss `anfrage` · Pflichtuploads `dokument`, `schluesselfoto` · Nachweis: Ersatznachweis.
4. Kennung `fahrradschluessel` · Name „Fahrradschlüssel“ (Laienname „Fahrradschloss“) · Adresse `/fahrradschluessel` (Anfrage `/fahrradschluessel/anfrage`) · Ablauf: 1 „Schloss angeben“ (Hersteller, Schlüsselnummer) · 2 „Schlüssel angeben“ · 3 „Kaufbeleg oder Codekarte und drei Fotos hochladen“ · 4 „Preis erhalten“ · Abschluss `anfrage` · Pflichtuploads `dokument` (Kaufbeleg oder Codekarte), `schluesselfoto` · Nachweis: Ersatznachweis mit Schlossangaben.
5. Bestehende Rubrik `motorradschluessel`: `erklaerung` sagt noch „mit Fahrzeugschein und Foto“; Vorschlag „Anfrage mit Fahrzeugschein und drei Fotos Ihres Schlüssels, wir melden uns mit Preis und Termin.“; Ablauf passt zu den neuen Schritten (Motorrad, Schlüssel und Chip, Unterlagen, Preis).
6. „Fahrzeug nicht gefunden“ ist keine Rubrik, sondern Ausweg an jeder Suche (`/autoschluessel/fahrzeug-nicht-gefunden`); Vorschlag für die Navigation „Autoschlüssel“: Unterpunkt „Fahrzeug nicht gefunden?“.

## PRÜFUNG UND ERGEBNIS

- `sicher.sh --json -- npx vitest run`: 192 Dateien, 2757 Tests bestanden (vorher 188 und 2664; die Tests aus motorradschluessel/anfrage/kern.test.ts sind in fahrzeug-anfrage/kern.test.ts aufgegangen).
- `sicher.sh --json -- npm run typecheck`: ohne Fehler.
- `sicher.sh --json -- npm run lint`: ohne Befund.
- `sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`: 17 Dateien, 103 Tests bestanden (neu: fahrzeug-anfrage.db.test.ts, Suche nach `daten.klasse` und Feld „Fahrzeugklasse“).
- `sicher.sh --json -- npm run build`: erfolgreich, 177 von 177 Seiten (vorher 168; neu acht statische Seiten und `/autoschluessel/fahrzeug-nicht-gefunden` dynamisch wegen der Vorbelegung aus der Adresse).
- Verlangte Tests:
  - je Klasse „vollständig angenommen“ und „ohne Pflichtunterlage abgelehnt“ (je Datei-Steckplatz einzeln), gebaut mit den Funktionen des Formulars: security.test.ts, describe „gemeinsame Fahrzeugschlüssel-Anfrage aus dem Formular“, sieben Fälle (Motorrad, Roller mit Fahrzeugschein, Roller mit Versicherungskennzeichen, E-Scooter, Seniorenmobil, Fahrrad, nicht gefunden).
  - „Roller mit Versicherungskennzeichen nimmt Ersatznachweis, zugelassener Roller nicht“: ebenda.
  - „nicht gefunden verlangt Fahrzeugschein und drei Fotos“: ebenda (auch: Ersatznachweis ersetzt den Fahrzeugschein nicht).
  - „Zurück behält Eingaben“: zustand.test.ts (echter useFlow, Angaben und Dateien über alle Schritte hin und zurück; Neuladen behält Angaben, nicht Dateien, und sperrt das Absenden).
  - „Einstiegsseite auf noindex, solange der Schalter aus ist, und nicht in der Sitemap“: seiten.test.tsx und sitemap.test.ts (mit eingeschaltetem Schalter erscheinen die Seiten).
  - „Block ‚Fahrzeug nicht gefunden?‘ steht an jeder der genannten Stellen“: nicht-gefunden.test.tsx (gerendert: Fahrzeugsuche, Kraftradsuche; im Quelltext: Termin-Assistent, Markenübersicht, Markenseite; kein Verweis mehr in die allgemeine Anfrage).
  - FA-27 Pflichttest Motorrad und Kleinstfahrzeuge: Datenbank (fahrzeug-anfrage.db.test.ts), alternative Dokumente (Ersatznachweis-Fälle), Fotos (Steckplätze), Anfrage (security.test.ts), Admin (Filter `daten.klasse`, Feld „Fahrzeugklasse“, Vorgangsblatt-Test).

## BELEGE

- Pflichtliste aus der Regel: src/components/fahrzeug-anfrage/pflicht.ts `pflichtListe` ruft `fehlendeFahrzeugUnterlagen`; Test „ist für jede Klasse genau das, was die Regel bei leerem Fall verlangt“.
- FIN im Browser gleich dem Server: Test „prüft die FIN wie der Server“ (gleiche Annahme für sechs Werte).
- Server unverändert streng: Ersatznachweis nur dort, wo die Regel ihn kennt; Motorrad und „nicht gefunden“ immer Fahrzeugschein (R13). Die Motorradanfrage sendet jetzt Quelle `fahrzeug-anfrage` mit Klasse `motorrad`; ältere Vorgänge mit Quelle `motorrad` bleiben gültig und werden weiter geprüft.
- G12: gelesen node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md (robots, Überschreiben verschachtelter Felder) und 03-file-conventions/page.md (searchParams als Promise). Seiten exportieren nur default und generateMetadata; sitemap.ts exportiert nur default.
- Kein Server gestartet, kein git, keine echten Dateien, Mails oder Zahlungen; Tests nutzen erfundene Dateinamen.

## OFFENE FRAGEN

- Rubriken-Modell: `RubrikNachweis` kennt nur `keiner`, `fahrzeugschein`, `sicherungskarte`. Für E-Scooter, Seniorenmobil, Fahrrad und Roller mit Versicherungskennzeichen passt keiner; `keiner` wäre falsch (der Server verlangt sehr wohl einen Nachweis). Vorschlag für FA-SOFORT-05: Wert `ersatznachweis` ergänzen oder den Nachweis dieser Rubriken als `fahrzeugschein` führen und die Anzeige „oder Ersatznachweis“ ergänzen. Die Rubrikprüfung auf dem Server (QUELLE_RUBRIK) greift für die Quelle `fahrzeug-anfrage` nicht; der Nachweis steht allein in der Pflichtregel.
- Chip-Frage nur bei Motorrad, Roller und „nicht gefunden“. Soll sie auch bei E-Scooter und Seniorenmobil kommen?
- Baujahr: Pflicht bei Motorrad und „nicht gefunden“, freiwillig bei Roller, E-Scooter, Seniorenmobil. Passt das?
- „Fahrzeug nicht gefunden“ kennt keine Fahrzeugart (Auto, Transporter, Quad); die Art steht nur in Marke, Modell und Beschreibung. Reicht das dem Team?
- Zwischenstand der alten Motorradanfrage (Schlüssel `motorradschluessel-anfrage` im Browser) wird nicht übernommen; Kunden mit halb ausgefülltem Formular beginnen neu.
- Die Erreichbarkeit steht im Unterlagenschritt, im Block an der Suche nur, wo die Seite sie übergibt (Formular ja; Markenseiten und Termin-Assistent zeigen Telefon ohne Erreichbarkeit, weil dort keine übergeben wird).

## FÜR MENSCHEN

- Inhaber: Wortlaut der vier Einstiegsseiten freigeben (Abschnitte in den page.tsx unter roller-und-kleinstfahrzeuge, e-scooter, seniorenmobile, fahrradschluessel) und die Aussagen prüfen: Kleinkrafträder fahren mit Versicherungskennzeichen ohne Fahrzeugschein; E-Scooter haben keinen Fahrzeugschein; Seniorenmobile meist nicht.
- Inhaber: Wortlaut des Blocks „Fahrzeug nicht gefunden?“ und der Frage „Was möchten Sie?“ in der allgemeinen Anfrage freigeben.
- Orchestrator: Seiten freigeben, indem `indexierbar` der Klasse in `ANFRAGE_FORMULAR` (src/lib/fahrzeuge/anfrage-klassen.ts) auf `true` gesetzt wird; dann entfällt noindex und Sitemap führt Einstieg und Anfrage.
- FA-SOFORT-05: Rubriken, Hub und Navigation nach der Liste oben eintragen.
- Sichtprobe im Browser bei 390 × 844 steht aus (kein Server in diesem Paket): je Klasse bis zum Unterlagenschritt, Zurück mit ausgewählten Dateien, Block an der Fahrzeugsuche und auf Markenseiten.
- Echte Beispielfotos für Ersatznachweis und Typenschild (bisher beschriebene Platzhalter, wie MA-05).
- Anwalt (R10): Datenschutzerklärung zu Ersatznachweisen und Typenschild, wie unter FA-KERN-02 vorgeschlagen; nichts eingebaut.

## Nachbesserung (15.11.2026, nach zwei Gegenprüfungen)

Je Befund: behoben oder nicht zutreffend. Keine Migration, kein git, kein Server.

1. [rot] Sackgasse im Fahrzeugschritt (Fahrrad, E-Scooter, Seniorenmobil, nicht gefunden): behoben. formular.tsx zeigt im Fahrzeugschritt jeder Klasse ohne Katalogsuche den Block „Unsicher bei einer Angabe?“ (`data-block="hilfe-fahrzeug"`) mit Telefon, Erreichbarkeit und Rückruf; Telefon und Erreichbarkeit teilt er sich mit der Hilfe im Unterlagenschritt (gemeinsamer Baustein `TelefonMitErreichbarkeit`). Beim Fahrrad steht unter „Schlüsselnummer“: „Sie finden die Nummer nicht? Rufen Sie uns an, wir helfen beim Suchen.“ Pflichtregel unverändert. Tests: seiten.test.tsx („Formular je Klasse“, „Hilfe im Fahrzeugschritt“).
2. [rot] Admin nach Klasse finden: behoben ohne Migration. Gespeichert und filterbar ist `daten.klasse` (JSON-Feld des Vorgangs); neu sind fertige Filter über der Vorgangsliste: Werkzeug „Anfragen nach Fahrzeugklasse“ (src/payload/components/VorgaengeWerkzeuge.tsx) mit je einem Knopf je Klasse und „Alle Vorgänge“; die Adresse baut `klassenFilter` (anfrage-klassen.ts), der Datenbanktest filtert mit genau diesem `where`. Die Beschreibung der Sammlung nennt den Weg. Ein gespeichertes Zusatzfeld mit Migration war nicht nötig, weil der Wert schon gespeichert ist. Teamhilfe: Admin → Vorgänge → oben „Anfragen nach Fahrzeugklasse“ aufklappen → Klasse wählen. Ältere Motorradanfragen (Quelle `motorrad`, vor diesem Paket) tragen keine Klasse und erscheinen dort nicht; sie findet man wie bisher über Bereich und Suche.
3. [gelb] Rückfalltexte Motorrad: behoben. Anfrage: Titel „Motorradschlüssel: Anfrage mit Fahrzeugschein und drei Fotos“ (60 Zeichen), Beschreibung mit Fahrzeugschein, drei Fotos des Schlüssels und kurzer Beschreibung (141 Zeichen). Einstieg: Beschreibung „Motorradschlüssel anfragen mit Fahrzeugschein, drei Fotos des Schlüssels und einer kurzen Beschreibung. Wir melden uns mit Preis und Termin.“ (140 Zeichen). Ohne Gedankenstriche; Test „Motorradseiten“. content/seo.json bleibt ohne Motorrad-Eintrag (Schreibrecht nur neue Routen).
4. [gelb] Kraftradsuche schickt Roller nach „nicht gefunden“: behoben. `KraftradSuche` nimmt `nichtGefundenHref`; die Rolleranfrage übergibt `null`, der Block zeigt dann keinen Verweis, nur den Satz und Telefon mit Erreichbarkeit (`FahrzeugNichtGefunden` kennt `href={null}`). Satz schlichter: „Ihr Fahrzeug ist nicht in der Liste? Tragen Sie Hersteller und Typ unten selbst ein. Oder rufen Sie uns an.“ Beim Motorrad bleibt der Verweis (Vorgabe 4 der Paketdatei). Tests: nicht-gefunden.test.tsx, seiten.test.tsx.
5. [gelb] „Preis sehen“ in der allgemeinen Anfrage: behoben, jetzt „Fahrzeug wählen, Termin anfragen. Für viele Modelle sehen Sie den Preis sofort.“
6. [gelb] Partnerweg „Kooperation anfragen“ landet im Tor „Was möchten Sie?“: teilweise behoben, Rest als OFFENE FRAGE. gewinnung.ts liegt außerhalb der Schreibrechte. Innerhalb der Rechte heißt die zweite Antwort des Tors jetzt „Ich habe eine Frage oder ein anderes Anliegen“ mit „Zum Beispiel eine Frage zu Ihrem Schlüssel oder eine Zusammenarbeit als Betrieb.“; ein Betrieb findet damit eine passende Antwort. Der Vorgang trägt dann weiter `anliegenArt: 'frage'` und Bereich Autoschlüssel. Übersehene Stelle: src/lib/partner/gewinnung.ts Zeile 606 (`/service-und-termin/anfrage?thema=autoschluessel`).
7. [gelb] Erreichbarkeit im Block: behoben. Termin-Assistent übergibt `erreichbarkeit={erreichbarkeit}`, Markenübersicht und Markenseiten `erreichbarkeit(settings)`, die Kraftradsuche die des Formulars. Die frühere OFFENE FRAGE dazu ist erledigt.
8. [gelb] Doppelter Hinweis auf Markenseiten: behoben. Die Box „Modell nicht dabei?“ (mit Gedankenstrich) ist im Block aufgegangen: eigener Satz „Die Liste zeigt nicht jede Baureihe und Ausstattung. Ist Ihr {Marke} nicht dabei, senden Sie uns trotzdem Ihre Anfrage: …“, Verweis mit der Marke vorbelegt (`anfrageHref({ marke })`). Bitte als Orchestrator bestätigen (Schreibrecht „nur der Block“; die Box stand direkt darüber).
9. [gelb] Einrückung `: schluesselThema`: behoben (18 Leerzeichen, ohne Prettier).
10. [gelb] Hinweis am Feld Marke: behoben, „So, wie sie im Fahrzeugschein steht.“
11. [gelb] Vorbelegung vom Zwischenstand verdeckt: behoben. `vorbelegungAbweichung` (kern.ts) erkennt die Abweichung; das Formular zeigt dann „Anderes Fahrzeug aus der Suche“ mit „Fahrzeug aus der Suche übernehmen“ und „Bisherige Angaben behalten“ (kein stilles Überschreiben, kein Effekt). Test in zustand.test.ts.
12. [gelb] Rubrikprüfung entfällt für den Motorradweg: zutreffend, siehe OFFENE FRAGEN (Nachbesserung). Kein Code geändert.
13. [gelb] Partnerweg: wie 6, OFFENE FRAGE.
14. [gelb] `pflichtPunkte` beim Typenschild strenger als die Regel: behoben, „… oder die Fahrzeug-Identifizierungsnummer. Hat Ihr Fahrzeug keines, sagen Sie es uns in der Anfrage.“ Test in kern.test.ts. Ebenso die Handtexte der Einstiegsseiten Roller und Seniorenmobil („wenn es eines gibt“, „wenn Ihr Fahrzeug ein Typenschild hat“).
15. [gelb] Wie 3: behoben.
16. [gelb] Schalter `indexierbar` wirkt beim Motorrad nicht: behoben. Beide Motorrad-page.tsx nehmen `...robotsFuer('motorrad')` auf; sitemap.ts lässt feste Seiten einer Klasse mit ausgeschaltetem Schalter weg (`gesperrteKlassenSeiten`). Tests: seiten.test.tsx „Motorradseiten“, sitemap.test.ts (Schalter aus, beide Motorradseiten fehlen).
17. [gelb] Brotkrume „Autoschlüssel“ beim Fahrrad: behoben für die Brotkrumen. `bereichsKrume`: Motorrad, Roller und nicht gefunden unter „Autoschlüssel“, E-Scooter, Seniorenmobil und Fahrrad direkt unter der Startseite. Die Akzentfarbe des Bereichs (Layout, AreaScope `autoschluessel`) bleibt; siehe OFFENE FRAGEN.
18. [gelb] Doppeltes „Fahrzeug nicht gefunden?“ auf der Markenübersicht: behoben, die Textzeile im Abschnitt A bis Z ist entfernt; der Block bleibt der eine Ausweg. Test: genau ein Block je Seite, keine alte Box.
19. [gelb] Wie 9: behoben.

Prüfung nach der Nachbesserung (alles über sicher.sh):
- `--json -- npx vitest run`: 192 Dateien, 2760 Tests bestanden (vorher 2757).
- `--json -- npm run typecheck`: ohne Fehler. `--json -- npm run lint`: ohne Befund.
- `--pg -- npx vitest run -c vitest.db.config.ts`: 17 Dateien, 103 Tests bestanden.
- `--json -- npm run build`: erfolgreich, 177 von 177 Seiten.

Geänderte Dateien der Nachbesserung: src/components/fahrzeug-anfrage/{formular.tsx, kraftrad-suche.tsx, nicht-gefunden.tsx, zustand.ts, kern.ts, pflicht.ts, seiten.tsx, kern.test.ts, zustand.test.ts, nicht-gefunden.test.tsx, seiten.test.tsx}, src/lib/fahrzeuge/anfrage-klassen.ts, src/payload/components/VorgaengeWerkzeuge.tsx, src/payload/collections/Vorgaenge.ts (Kommentar, Beschreibung), src/lib/server/fahrzeug-anfrage.db.test.ts, src/app/(site)/motorradschluessel/{page.tsx, anfrage/page.tsx}, src/app/(site)/service-und-termin/anfrage/anfrage-formular.tsx, src/app/(site)/autoschluessel/anfrage/assistent.tsx, src/app/(site)/autoschluessel/marken/{page.tsx, [make]/page.tsx}, src/app/(site)/roller-und-kleinstfahrzeuge/page.tsx, src/app/(site)/seniorenmobile/page.tsx, src/app/sitemap.ts, src/app/sitemap.test.ts, dieser Bericht.

### OFFENE FRAGEN (Nachbesserung)
- Rubrikprüfung beim Motorradweg: Die Motorradanfrage sendet seit diesem Paket die Quelle `fahrzeug-anfrage` mit Klasse `motorrad`. Damit greift für sie QUELLE_RUBRIK in records.ts (Prüfung auf Rubrik `motorradschluessel`, Nachweis und Pflicht-Uploads aus dem Rubriken-Modell) nicht mehr. Heute verlangt die Pflichtregel dasselbe oder mehr (Fahrzeugschein und drei Fotos), der Nachweis ist nicht schwächer (R13). Später im Rubriken-Modell gepflegte strengere Pflicht-Uploads oder eine abgeschaltete Rubrik wirken auf diesen Weg aber nicht. Nach A-048 so gewollt (allein die Pflichtregel entscheidet). Orchestrator: Soll QUELLE_RUBRIK für `fahrzeug-anfrage` mit Klasse `motorrad` zusätzlich gelten?
- Partnerweg: „Kooperation anfragen“ (src/lib/partner/gewinnung.ts Zeile 606) auf ein eigenes Thema oder `thema=service-und-termin` umstellen (eigenes Paket), oder das Tor bei Kooperationsanfragen ausblenden? Bis dahin führt „Ich habe eine Frage oder ein anderes Anliegen“ weiter.
- Akzentfarbe: Fahrrad, E-Scooter und Seniorenmobil stehen im Bereich `autoschluessel` (Farbe, Vorgangsbereich). Eigene Einordnung durch FA-SOFORT-05?
- Markenseiten: Die alte Box „Modell nicht dabei?“ ist im Block aufgegangen (Befund 8); bitte bestätigen.

=== ENDE FA-KERN-02B · BEREIT ZUR RÜCKGABE ===

## ABNAHME (Orchestrator, 15.11.2026)

- **Prüfkette grün** (`werkzeuge/abnahme.sh FA-KERN-02B`): Typprüfung, Lint, Unit 2.760 Tests in 192 Dateien, Datenbanktests 103 in 17 Dateien, Build ohne Datenbank 177 von 177 Seiten (neun neue Seiten).
- **Sichtprobe im Browser** bei 390 × 844 (Attrappen, keine Uploads, kein Absenden): Fahrradanfrage und E-Scooter-Anfrage je bis Schritt 3 „Unterlagen und Fotos“. Schritt 1 zeigt den Hilfeblock mit Rückruf; Schritt 2 die Karte „keinen Schlüssel mehr“; Schritt 3 die Wahl des Nachweises (Kaufbeleg oder Codekarte beim Fahrrad), die drei Foto-Plätze, „Später weitermachen“ und Rückruf; „Weiter“ bleibt gesperrt und die Leiste nennt, was fehlt. Einstiegsseite Roller und „Fahrzeug nicht gefunden“ laden ohne Fehler in der Konsole.
- **Nachgezogen (Partnerweg):** „Kooperation anfragen“ auf den Partnerseiten führt weiter in die allgemeine Anfrage, jetzt mit `?anliegen=frage`: Die Frage „Was möchten Sie?“ ist dort vorbelegt mit „Frage oder anderes Anliegen“, damit ein Betrieb nicht vor der Schlüssel-Frage steht (`gewinnung.ts`, `anfrage/page.tsx`, `anfrage-formular.tsx`; Test der Partnerseite an die HTML-Schreibweise der Adresse angepasst).
- **Entschieden:** Die alte Box „Modell nicht dabei?“ auf den Markenseiten durfte im neuen Block aufgehen. Fahrrad, E-Scooter und Seniorenmobil bleiben im Vorgangsbereich Autoschlüssel (ein Orange für alle Bereiche, A-044); eigene Rubriken bekommen sie in FA-SOFORT-05. Die Zuordnung Klasse zu Rubrik (abgeschaltete Rubrik sperrt den Weg) und der Nachweis-Wert `ersatznachweis` stehen in der Paketdatei FA-SOFORT-05.
- **Bekannt und offen:** Für Ersatznachweis und Typenschild gibt es noch kein echtes Beispielbild; der Rahmen „So sollte das Foto aussehen“ zeigt dort ein Symbol (MA-05, eigene Fotos). Ältere Motorradanfragen mit der Quelle `motorrad` tragen keine Klasse und erscheinen nicht im Klassenfilter des Admins.
- **Fragen an den Inhaber** (MA-38, MA-41): Chip-Frage bei E-Scooter und Seniorenmobil, Baujahr als Pflicht, Fahrzeugart bei „nicht gefunden“, Wortlaut der vier Einstiegsseiten und der neuen Hilfetexte.
