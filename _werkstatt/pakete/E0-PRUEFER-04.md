E0-PRUEFER-04 · Rolle Prüfer · Modell Haiku 5.5 · Stufe 1 · Kern-Version 1.0 · Schreibrechte (exakt): `_werkstatt/werkzeuge/funktionsliste.mjs` (neu), `_werkstatt/protokolle/funktionsliste-*.json|md` · Umfang: Funktionsliste aus LAGEBILD.md als wiederholbares Playwright-Skript und Ausgangsdurchlauf

## Rollenbriefing
Du bist Prüfer. Du richtest Prüfwerkzeuge ein, führst sie aus und berichtest knapp mit Belegpfaden. Häufige Fehler: deuten statt berichten; über die Stufe hinaus prüfen; Einzelmessung statt Median. Du committest und pushst nie und änderst keine Projektdatei.

## Aufgabe in einem Satz
Baue `funktionsliste.mjs`, das die 14 Funktionen F-01 bis F-14 aus `_werkstatt/LAGEBILD.md` im Browser durchläuft, jede schreibende Anfrage mit Attrappen abfängt und je Funktion BESTANDEN oder NICHT BESTANDEN mit Begründung meldet, und führe es einmal als Ausgangswert aus.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Das Designsystem ist hell und sachlich – Stahlblau auf kühlem Off-White, IBM Plex Sans, Inter und Plex Mono, je Leistungsbereich eine eigene Akzentfarbe – und hat ein eigenes Formsystem aus Fach-Icons und deterministischen SVG-Grafikgeneratoren. Der Lauf hebt Gestaltung, Bewegung, Grafik, Bedienung und Technik auf Spitzenniveau, ohne Geschäftslogik, Zahlungsabläufe oder Rechtstexte zu verändern.

## Kern-Auszug
- G5 des Auftrags: keine echten Formularsendungen, Zahlungen oder E-Mails. Nutze **immer** `attrappenSetzen(context)` aus `lib.mjs`. Trage in jedes Formular als E-Mail `PRUEF_EMAIL` aus `lib.mjs` ein: Daran erkennt die Attrappe das Absenden und fängt es ab. Lesende Server Actions (Preis, Zeitfenster, Status) laufen echt.
- Server: `_werkstatt/werkzeuge/server.sh start` (JSON-Modus, Port 3000).
- Das Skript muss nach dem Umbau weiterlaufen. Wähle Elemente deshalb **über sichtbaren Text, Rollen und Beschriftungen** (`getByRole`, `getByLabel`, `getByText`) statt über Klassen oder DOM-Struktur. Klassen und Struktur ändern sich im Lauf, Texte und Rollen bleiben weitgehend.

## Maßstab
Aufbau wie die übrigen Skripte in `_werkstatt/werkzeuge` (lies `lib.mjs`, `bild.mjs`, `konsole.mjs`). Eine Funktion je F-Nummer, jede mit eigenem Kontext (`kontextFuer(browser, GERAETE[0 oder 2])`), Zeitlimit je Funktion 60 s, Fehler einer Funktion beenden das Skript nicht.

## Grenzen
- Nur die Dateien aus den Schreibrechten. Keine Projektdatei ändern; findest du einen echten Fehler der Seite, berichte ihn.
- Keine echten Sendungen: Prüfe im Bericht, dass die Attrappen-Liste das Absenden enthält.

## Schritte
0. **Messfenster beachten:** Solange `/tmp/sm24-messfenster.lock` existiert, misst ein anderer Prüfer die Ausgangswerte. Starte dann **keine** Browserläufe. Lies Quelltexte und schreibe das Skript; prüfe alle 2 Minuten, ob die Sperre weg ist (höchstens 40 Minuten warten, sonst OFFENE FRAGE).
1. Lies `_werkstatt/LAGEBILD.md` (Funktionsliste), `_werkstatt/werkzeuge/lib.mjs` und für jede Funktion die zugehörige Seite im Quelltext. So findest du die echten Beschriftungen von Knöpfen und Feldern und die Pflichtfelder. Für F-04 brauchst du die 13 Schritte in `src/app/(site)/autoschluessel/anfrage/assistent.tsx`, für F-02 die Pflichtfelder in `src/app/(site)/kasse/kasse-formular.tsx`.
2. Implementiere F-01 bis F-14 genau so, wie die Spalte „Prüfschritt“ es verlangt:
   - F-01: auf `/schluessel-nach-code/ms-01` einen gültigen Code eingeben (Format aus `content/code-lines.json`, Feld für das Codemuster, zum Beispiel `codePattern`), Menge 2 wählen und in den Warenkorb legen. Auf `/warenkorb` stimmen Eintrag und Summe. Danach Menge ändern, Versandart wählen, Eintrag entfernen; „leer“ muss erscheinen.
   - F-02: Warenkorb wie in F-01 füllen, `/kasse` öffnen, alle Pflichtfelder ausfüllen (E-Mail = `PRUEF_EMAIL`), beide Bestätigungen setzen, absenden. Bestanden, wenn die Attrappenliste eine `action-schreibend` enthält.
   - F-03: `/bestellung/irgendwas?t=falsch` liefert Status 404.
   - F-04: den Assistenten Schritt für Schritt mit gültigen Werten durchlaufen. Für die Fotos nimm ein kleines PNG, das du zur Laufzeit erzeugst und unter `/tmp` ablegst; der Upload geht an die Attrappe. Bestanden, wenn der Absende-Knopf erreichbar ist und das Absenden als Attrappe erscheint. Liefert die lesende Preis- oder Zeitfenster-Action im JSON-Modus keine Termine, gilt „bis zum letzten erreichbaren Schritt“; nenne den Schritt.
   - F-05: Zylinder konfigurieren und in den Warenkorb legen; der Eintrag erscheint auf `/warenkorb`.
   - F-06 und F-07: erster und letzter Schritt erreichbar, Absenden als Attrappe, wo möglich.
   - F-08: absenden; danach erscheint eine sichtbare Rückmeldung (Fehler oder Status).
   - F-09: speichern setzt `localStorage['sm24-cookie-einwilligung']`, Zurücksetzen entfernt oder ändert ihn.
   - F-10: Schritt 1 ausfüllen, neu laden, „Weitermachen“ wird angeboten.
   - F-11: mobil Menü öffnen und schließen, Desktop Megamenü öffnen. Der Sprunglink ist das erste fokussierte Element nach `Tab` und springt zu `#inhalt`. Mobil (390 px) ist die Aktionsleiste sichtbar.
   - F-12: Status und Zahl der `<loc>` in der Sitemap, Zahl der `Disallow`-Zeilen in robots.txt, `llms.txt` liefert 200, Zahl der `application/ld+json`-Skripte auf `/` und `/schluessel-nach-code/ms-01`.
   - F-13: In beiden Rechnern Auswahlen treffen; ein Ergebnisbereich erscheint oder ändert sich.
   - F-14: Ein Filter auf `/schluessel-nach-code` ändert die Zahl der sichtbaren Einträge.
3. Ausgabe: Markdown-Tabelle „F-Nr. · Funktion · Ergebnis · Begründung oder Messwert · Dauer“ auf stdout und als `_werkstatt/protokolle/funktionsliste-<zeitstempel>.md`. Dazu JSON mit der Attrappenliste je Funktion. Mit `--nur F-01,F-04` laufen nur einzelne Funktionen.
4. Ausgangslauf: `node _werkstatt/werkzeuge/funktionsliste.mjs` einmal komplett. Nicht bestandene Funktionen danach **einmal** einzeln wiederholen, um Wackler zu erkennen; beide Ergebnisse angeben.

## Schnellprüfung und Selbstprüfung
- `node --check` ohne Fehler; 14 Funktionen implementiert und gezählt.
- Ausgangslauf: Zahl der bestandenen Funktionen, Gründe für jede nicht bestandene.
- Keine echte schreibende Anfrage: Prüfe in `/tmp/sm24-next.log`, dass während des Laufs kein Vorgang angelegt wurde. Nach dem Lauf existiert keine `content/records.json` (`git status`).

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN (gewünschte Änderungen an `lib.mjs` als exakte Liste) · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.

Letzte Zeile: === ENDE E0-PRUEFER-04 · BEREIT ZUR RÜCKGABE ===
