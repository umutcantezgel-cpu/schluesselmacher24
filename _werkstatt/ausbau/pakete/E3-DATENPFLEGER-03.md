# E3-DATENPFLEGER-03 · Erhebungsbögen PREISE, KLONBAR, SORTIMENT, PRODUKTE, PARTNER

## 1. Kopfzeile
Kennung E3-DATENPFLEGER-03 · Rolle Datenpfleger · Modell Haiku 5.5 · Stufe 2 · Kern 2.1 · Kostenklasse M · Anforderungen: G-18, G-22, G-33, G-40, Auftrag Abschnitt 11 (Erhebungsbögen), MA-04, MA-06, MA-15 · Kriterium Z-19 · Schreibrechte: _werkstatt/ausbau/erhebung/boegen/ (nur neue Dateien darin), _werkstatt/ausbau/berichte/E3-DATENPFLEGER-03.md · Umfang: fünf Bögen, je CSV und Druckseite, dazu LIESMICH.md

## 2. Rollenbriefing
Datenpfleger: überträgt Daten zeichengenau in Strukturen und Bögen, mit Quelle je Eintrag. Fehler: runden oder ergänzen; Einträge auslassen; Quelle vergessen; Vorschläge als Tatsache ausgeben.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und halte dich daran. Du änderst keine Projektdatei.

## 3. Aufgabe in einem Satz
Lege fünf Erhebungsbögen an, die der Inhaber ausdrucken oder als Tabelle ausfüllen kann, mit dem heutigen Wert aus dem Bestand und einem Vorschlag aus der Recherche je Zeile, jede Zeile sichtbar als „Vorschlag, bitte prüfen“.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer echten Schlüsselwerkstatt in Wetzlar mit Fertigung, Beratung und Außendienst, mit Schwerpunkt Wetzlar und Hessen und bestellbar in ganz Deutschland. Kundinnen und Kunden bestellen Autoschlüssel mit Anzahlung, Schlüssel nach Code, nach Foto oder per Einsendung, gleichschließende Zylinder und Schließanlagen über Konfiguratoren, oder sie schicken eine vollständige Anfrage. Technisch ist es Next.js 16 mit React 19, TypeScript strikt, Tailwind 3.4 und Payload 3.90 auf Postgres mit Stripe, Resend und S3-Ablage; ohne Datenbank liest die Seite content/*.json. Dieser Lauf baut den Bestand aus: ein Hub „Wobei können wir Ihnen helfen?“ im ersten Bildschirm, Rubriken aus Daten, ein Abschluss für alle Wege und neue Wege für Fahrzeuge, Einsenden, Konfiguratoren, Partner und Karte. Maßstab sind Laien ohne Geduld, offene Preise, Ehrlichkeit über Prüfungen, Berechtigungsnachweise, die nie geschwächt werden, und ein Bestand, von dem nichts verloren geht.

## 5. Kern-Auszug (unveränderlich)
- Auftrag 11: Erhebungsbögen in erhebung, je als druckbare Seite und CSV mit Vorschlag aus der Recherche, jede Zeile sichtbar als „Vorschlag, bitte prüfen“: PREISE (Konfigurator, Sets, Aufpreise, Einsenden versichert, Gehäuse ab, Transponder-Kopie) · KLONBAR (Fahrzeuge und Transponder) · SORTIMENT (Schlüssel nach Code) · PRODUKTE (elektronische Systeme) · PARTNER (Provision je Auftragsart). Ein späteres Importskript übernimmt ausgefüllte Bögen und bricht bei unbekannten Werten ab; deshalb braucht jede Zeile eine feste Kennung.
- G9: Preise und Preisregeln des Bestands sind unantastbar; du überträgst sie nur zeichengenau als „Bestand“. G13 (öffentliches Repository): keine Einkaufspreise, keine Kalkulation, keine Provisionswerte, keine Vertragsinhalte, keine Kundendaten. Die Spalte für Provisionen im Bogen PARTNER bleibt leer; der Bogen sagt, dass Provisionen nur als Nachricht kommen.
- R4 nichts erfinden: Ein Vorschlag steht nur mit Quelle (Datei und Abschnitt der Erhebung oder URL mit Abrufdatum aus der Erhebung). Ohne Quelle bleibt das Vorschlagsfeld leer.
- R12: Herstellermarken nur sachlich, als Hersteller oder Produktfamilie.
- Ton: Sie-Anrede, keine Gedankenstriche, keine Ausrufezeichen, Bereiche mit „bis“.

## 6. Maßstab
- Je Bogen eine CSV-Datei (UTF-8 mit BOM, Trennzeichen Semikolon, Dezimalkomma, erste Zeile Spaltennamen) und eine druckbare Seite als eigenständige HTML-Datei (A4 hoch, Schrift mindestens 11 pt, Kopf mit Bogenname, Datum, Feld „Ausgefüllt von“, Fuß „Vorschlag, bitte prüfen“ auf jeder Seite, keine externen Dateien, keine Skripte).
- Spalten in allen CSVs: Kennung (P-001, K-001, S-001, PR-001, PA-001) · Bereich · Gegenstand · Einheit · Bestand (Wert aus dem Repository, leer, wenn keiner) · Quelle Bestand (Pfad und Feld) · Vorschlag · Quelle Vorschlag · Hinweis (immer beginnend mit „Vorschlag, bitte prüfen“) · Antwort (leer).
- PREISE: alle Preispositionen des Bestands aus content/pricing-groups.json, content/service-pricing.json, content/cylinder-catalog.json und content/settings.json (Anzahlung, Versand, Aufpreise), zeichengenau; dazu neue Positionen ohne Bestand für Einsenden versichert und unversichert, Gehäuse ab, Transponder-Kopie, Sets ab 11 Zylindern; Vorschläge nur aus _werkstatt/ausbau/erhebung/E1-versand.md (Porto der Post, mit Stand) und, falls vorhanden und fertig, _werkstatt/ausbau/erhebung/E1-wettbewerb.md (Marktpreise mit Quelle; fertig ist sie, wenn _werkstatt/ausbau/berichte/E1-RECHERCHEUR-03.md existiert).
- KLONBAR: Kandidaten aus _werkstatt/ausbau/erhebung/E1-transponder.md (Transpondertyp, Fahrzeuge, Quelle), Antwortform „ja, nein, weiß nicht“; nichts gilt als klonbar ohne Antwort.
- SORTIMENT: alle Codelinien aus content/code-lines.json (Kennung, Hersteller, Bezeichnung, Preis des Bestands), Antwortform „im Sortiment ja/nein, Lieferzeit in Tagen, Foto vorhanden ja/nein“.
- PRODUKTE: elektronische Systeme aus dem Bestand (content/service-pages.json und content/service-pricing.json, Bereich elektronische Zutrittslösungen) und aus _werkstatt/ausbau/erhebung/E1-schliesstechnik-systeme.md (Hersteller und Technik, keine Produktnamen ohne Beleg, MA-15).
- PARTNER: Auftragsarten (Autoschlüssel vor Ort, Türöffnung durch Partner nicht vorgesehen außer laut Bestand, Montage Zylinder, Montage Schließanlage, Beratung vor Ort, Einbau elektronische Systeme, weitere nur mit Beleg aus _werkstatt/ausbau/FACHWISSEN.md oder AUFTRAG.md G-39 und G-40), Spalten Provision und Abrechnungsart leer.
- LIESMICH.md im Ordner boegen: wie der Inhaber die Bögen bekommt (Druck oder Tabelle), wie er zurückgibt (Upload nach _werkstatt/ausbau/eingang ohne interne Werte, Preise und Provisionen nur als Nachricht `PREISE …` oder `ANTWORTEN …`), was ohne Antwort gilt (Standardannahme aus MENSCHEN.md MA-04), höchstens 250 Wörter.

## 7. Grenzen
G4 (keine echten Kundendaten), G9, G11, G13, R4, R12. Keine Websuche. Nur lesend im Repository; schreiben nur unter _werkstatt/ausbau/erhebung/boegen/ und den Bericht.

## 8. Schritte
1. Lies die genannten Quellen (Abschnitt 6) und _werkstatt/ausbau/MENSCHEN.md (MA-04, MA-06, MA-13, MA-15).
2. Schreibe die fünf CSVs. Prüfe jede Bestandszahl gegen ihre Quelle (zeichengenau, keine Rundung).
3. Erzeuge je Bogen die Druckseite aus derselben Tabelle (ein kleines Skript in _werkstatt/ausbau/erhebung/boegen/erzeugen.mjs ist erlaubt; es liest nur die CSVs und schreibt nur HTML in denselben Ordner).
4. Prüfe die Druckseiten im Browser (Chromium, Druckvorschau oder page.pdf in den Scratchpad) und notiere Seitenzahl und Lesbarkeit.
5. Schreibe LIESMICH.md und den Bericht.

## 9. Selbstprüfung
Zahl der Zeilen je Bogen; jede Zeile mit Kennung, Quelle Bestand oder leerem Bestand, Hinweis „Vorschlag, bitte prüfen“; keine Provisionswerte; keine Gedankenstriche und keine Ausrufezeichen in HTML und LIESMICH; jede Bestandszahl stichprobenweise (mindestens zehn) gegen die Quelle verglichen und im Bericht genannt.

## 10. Ausgabe
Dateien unter _werkstatt/ausbau/erhebung/boegen/ (preise.csv, preise.html, klonbar.csv, klonbar.html, sortiment.csv, sortiment.html, produkte.csv, produkte.html, partner.csv, partner.html, LIESMICH.md, optional erzeugen.mjs). Bericht nach _werkstatt/ausbau/berichte/E3-DATENPFLEGER-03.md (höchstens 500 Wörter: Zeilen je Bogen, Stichproben, Lücken, offene Fragen, Abschnitt GEMEINSAME DATEIEN mit dem gewünschten Eintrag in MENSCHEN.md als exakter Zeile).

## 11. Letzte Zeile
=== ENDE E3-DATENPFLEGER-03 · BEREIT ZUR RÜCKGABE ===
