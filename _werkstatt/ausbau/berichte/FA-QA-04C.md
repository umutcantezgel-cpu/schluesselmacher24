# FA-QA-04C · Bericht · Beispielzeichnungen an den Upload-Feldern, Upload-Schritt im Zutritt-Konfigurator

Anforderungen: FA-26-06, FA-27-10 · Stand 16.11.2026 · kein git, kein Server, keine Formularsendung.

## GEÄNDERTE DATEIEN
- `src/components/visual/generators/foto-beispiel.tsx` (neu): Generator `foto-beispiel` mit `motiv` = `fahrzeugschein` | `typenschild` | `schluesselspitze` | `ersatznachweis` | `gewerbeanmeldung`.
- `src/components/visual/generators/foto-beispiel.test.tsx` (neu)
- `src/components/visual/registry.tsx`: ein Import, ein Eintrag `'foto-beispiel'` (siehe GEMEINSAME DATEIEN).
- `src/components/visual/registry.test.tsx`: Name in der Liste `NAMEN`.
- `src/lib/visual/motiv.ts`: `beispielZeichnung` (in `visualFuerMotiv`, nur für Motive, die mit „Beispiel“ beginnen) und neu `visualFuerSteckplatz`.
- `src/lib/visual/motiv.test.ts`: Fälle je Motiv aus dem Bestand und je Steckplatz.
- `src/components/forms/photo-upload.tsx`: nur die Zuordnung des Beispiels (`beispielFuerFeld`, das Feld zeigt danach `beispiel` statt `example`).
- `src/components/forms/photo-upload.test.tsx`: Test je Steckplatz; der bisherige Fall „nur Symbol“ nutzt jetzt ein Motiv ohne Zeichnung (der Fahrzeugschein hat nun eine).
- `src/app/(site)/elektronische-zutrittsloesungen/konfigurator/zutritt-konfigurator.tsx`: Schritt „Unterlagen“.
- `src/app/(site)/elektronische-zutrittsloesungen/konfigurator/page.tsx`: reicht die Aufbewahrungsfristen durch (kein Seitentext geändert).
- `src/app/(site)/elektronische-zutrittsloesungen/konfigurator/unterlagen.test.ts` (neu)
- `src/components/forms/formulare-bedienbarkeit.test.ts`: Zutritt `dateien: true`.

## WAS UND WARUM
1. **Beispielzeichnungen (FA-26-06).** Fünf schlichte Fachgrafiken im Raster 480 × 300 (K-008), nur Strichskala-Namen, Tokenfarben, runde Enden, keine `id`, keine Ziffern, keine Marken, keine lesbaren Kennzeichen oder Namen (R12, alle Angaben nur als Platzhalter-Striche):
   - Fahrzeugschein: Blatt mit Kopf, vier Eckwinkel („alle vier Ecken im Bild“), markiert sind nur die Felder, die der Bestand nennt: **B** (Erstzulassung, `assistent.tsx:1315`, Gehäuse-Anfrage) und **E** (Fahrgestellnummer, `optionen.ts:136`). D.1/D.3 aus dem Befundvorschlag nennt keine Seite, deshalb nicht gezeichnet (R4).
   - Typenschild: Schild mit Nieten an einem angedeuteten Bauteil, markiert „Hersteller“ und „Nummer“ (Wortlaut `kern.ts:325`).
   - Schlüsselspitze: Seitenansicht, Blickpfeil auf die Spitze, daneben das Profil von vorne als allgemeiner Querschnitt mit Längsnuten (kein Herstellerprofil).
   - Ersatznachweis: Dokument mit Kopf, vier Ecken, markiert „Name“ und „Fahrzeug“ (Wortlaut `kern.ts:319-321`).
   - Gewerbeanmeldung: Dokument mit markiertem Kopf und markierten Angaben, vier Ecken („vollständig und gut lesbar“, `partner-formular.tsx:655`).
   Jede Zeichnung trägt als `<title>`/`aria-label` einen Satz, was auf dem Foto zu sehen sein muss (`FOTO_BEISPIEL_TITEL`); `ImagePlaceholder` übergibt am Feld keinen Titel, also gilt dieser Text.
   **Zuordnung zweifach:** (a) `visualFuerMotiv` erkennt die Beispielmotive des Bestands (Fahrzeugschein, Zulassungsbescheinigung, Typenschild, Nachweis, Gewerbeanmeldung, Spitze/Profilquerschnitt), nur wenn das Motiv mit „Beispiel“ beginnt — das Werkstattfoto „… daneben der Fahrzeugschein“ bleibt beim Schlüssel (Test). (b) `visualFuerSteckplatz` ordnet die Steckplätze `fahrzeugschein`, `typenschild`, `ersatznachweis`, `schluessel-spitze` zu; `beispielFuerFeld` in `photo-upload.tsx` setzt sie, solange kein echtes Foto (`bild.url`, MA-05) da ist. (b) war nötig, weil beide Spitzen-Beispiele (`optionen.ts:198`, `schluessel-nach-vorlage/anfrage/anfrage-formular.tsx:203`) ausdrücklich `visual: profilschnitt` setzen — das ist die Seitenansicht mit Fräsung, nicht das Profil von vorne, und `slot.visual` hat Vorrang vor dem Motiv. Diese Seitendateien liegen außerhalb der Schreibrechte; die Steckplatz-Zuordnung löst es ohne sie. Ergebnis: Die Zeile heißt an allen fünf Feldarten „So sollte das Foto aussehen“ statt „Darauf muss zu sehen sein“.
2. **Upload-Schritt im Zutritt-Konfigurator (FA-27-10).** Neuer Schritt `unterlagen` („9. Grundriss und Fotos hochladen“) zwischen Service und Zusammenfassung, nach dem Muster des Sicherheitschecks: zwei `PhotoUpload` (Grundriss/Lageplan als `grundriss` mit PDF, bis 4 Dateien; Fotos von Türen und Bestand als `objektfoto`, bis 6), Hinweis „Hochladen ist freiwillig“, `HilfeBlock stelle="unterlagen" spaeter mitDateien`. `validate` liefert für den Schritt `true` („Weiter“ ohne Datei), der Fortschritt zählt ihn über `STEPS` mit, `FlowShell` hat `ungesichert={grundrisse.length > 0 || fotos.length > 0}` und `mitDateien`. Beim Absenden erst `uploadsAbwarten()`, dann `uploads: zutrittUploads(grundrisse, fotos)` statt `uploads: []`. Kein Steckplatz vom Browser (wie im Sicherheitscheck); Kennung und Einmal-Schlüssel ordnet der Server zu. Die Zusammenfassung (Seite, Bestätigung und Vorgang) führt „9. Unterlagen“ mit Anzahl je Art. Die Aufbewahrungsfristen kommen wie im Sicherheitscheck aus den Einstellungen (`floorPlans`, `projectDocuments`). `FLOW_VERSION` bleibt 1: Der Zwischenstand speichert die Schritt-Kennung, die Daten ändern sich nicht.
   **Server geprüft, keine Zeile nötig:** `/api/kunden-upload` nimmt `grundriss` und `objektfoto` an (`UPLOAD_KATEGORIEN`, `datei-pruefung.ts:14-22`, PDF für `grundriss` erlaubt); `publicRecordSchema` nimmt `uploads` für jede Art und jeden Bereich an (`record-schema.ts`), `submitRecord` prüft sie in `unterlagenAusAblage` und `createRecord` schreibt sie in den Vorgang und ordnet sie in `dateienZuordnen` zu (`create-record.ts:151`, `:482-516`). Fristen: `FRIST_JE_KATEGORIE` in `kundendateien.ts`. `records.ts` und `datei-pruefung.ts` sind daher unverändert.

## GEMEINSAME DATEIEN
- `src/components/visual/registry.tsx` und `registry.test.tsx` stehen nicht ausdrücklich in den Schreibrechten. Ohne Eintrag zeichnet `renderVisual` keinen neuen Generator, und der Registry-Test verlangt jede Generator-Datei unter ihrem Namen. Geändert sind nur ein Import, ein Eintrag und ein Name in der Testliste.
- `src/components/visual/README.md` und `docs/gestaltung/KERN.md` führen den neuen Generator noch nicht (außerhalb der Schreibrechte).

## PRÜFUNG UND ERGEBNIS
- `sicher.sh --json -- npx vitest run` (Stand zum Umsetzungszeitpunkt; aktueller Stand siehe NACHBESSERUNG): 249 Dateien, 3902 Tests; **3897 bestanden, 5 rot**, alle in `src/lib/data/seo-laengen.test.ts` und `src/app/(site)/artikel/kategorie/[slug]/page.test.tsx` — fremde, nicht eingecheckte Arbeit eines parallelen Shop-Pakets (`git status`: `artikel/kategorie/` neu, `seo-laengen.test.ts`, `shop.ts` geändert), keine Berührung mit diesem Paket.
- Bereich dieses Pakets (`src/components/visual`, `src/lib/visual`, `src/components/forms`, Zutritt-Konfigurator): 41 Dateien, 1177 Tests, alle grün.
- `sicher.sh -- npm run typecheck`: ohne Fehler. `sicher.sh -- npm run lint`: ohne Befund. `sicher.sh --json -- npm run build`: erfolgreich (Exit 0).
- Sichtprobe: die fünf Zeichnungen headless gerendert (Chrome, Platzhalterfarben), Anordnung ohne Überlappung; das Profil danach quer etwas verbreitert.

## BELEGE
- Generator: `src/components/visual/generators/foto-beispiel.tsx` (`FOTO_BEISPIEL_TITEL`, `FotoBeispielGrafik`).
- Zuordnung: `src/lib/visual/motiv.ts` (`beispielZeichnung`, `visualFuerSteckplatz`), `src/components/forms/photo-upload.tsx` (`beispielFuerFeld`).
- Tests je Steckplatz: `foto-beispiel.test.tsx`, `motiv.test.ts` („Beispielzeichnung an Upload-Feldern“), `photo-upload.test.tsx` („Steckplatz %s: das Feld zeigt die Beispielzeichnung mit Alternativtext“, „ein echtes Foto … bleibt“).
- Zutritt: `zutritt-konfigurator.tsx` (Schritt `unterlagen`, `zutrittUploads`, `ungesichert`, `mitDateien`), `unterlagen.test.ts` (Zusammenfassung, Uploads, Reihenfolge, Rückfrage), `formulare-bedienbarkeit.test.ts` (`dateien: true`).

## OFFENE FRAGEN
- Registry-Eintrag außerhalb der wörtlichen Schreibrechte (s. o.): nachträglich bestätigen oder anders lösen.
- An der Schlüsselspitze ersetzt die Steckplatz-Zeichnung den bisher am Beispiel gesetzten Profilschnitt (Seitenansicht). Die Kommentare in `optionen.ts:196-197` und der Vorlage nannten den Profilschnitt „das Profil von vorne“; das stimmt fachlich nicht. Ein Folgepaket mit Schreibrecht kann das `visual` dort entfernen oder den Kommentar richtigstellen.
- ~~Gewerbeanmeldung: markierter „Kopf“~~ — erledigt in der NACHBESSERUNG (Befund 3).
- Die Grundriss- und Türbeispiele im Zutritt-Schritt zeigen wie im Sicherheitscheck und bei den Schließanlagen die Tür-Zeichnung (`tuer-schutz`), weil das Motiv „Tür“ enthält; eine eigene Grundriss-Zeichnung gibt es nicht.
- README des visuellen Systems und KERN-Liste der Generatoren nachtragen (außerhalb der Schreibrechte).

## FÜR MENSCHEN
- Echte Beispielfotos für Fahrzeugschein, Typenschild, Nachweis, Gewerbeanmeldung und Schlüsselspitze (MA-05) — sie ersetzen die Zeichnungen über das Bildfeld, ohne Codeänderung.
- Fachliche Durchsicht der Zeichnungen (markierte Felder B/E, Stellen am Typenschild und am Nachweis).
- Browserlauf Zutritt bis zur vollständigen Anfrage mit Unterlagen (Pflichttest Abschnitt 27) mit Attrappen, ohne echte Sendung.

## NACHBESSERUNG (Gegenprüfung, 16.11.2026)
1. **[rot] Fahrzeugschein ohne Halter — behoben.** Der Bestand nennt den Halter (`einsende-formular.tsx:126`, „Halter und Fahrzeugdaten lesbar“). `foto-beispiel.tsx`: dritte Markierung rechts oben, nur beschriftet „Halter“ (keine erfundene Feldkennung, R4); Alternativtext jetzt „… alle vier Ecken im Bild, Halter, Feld B (Erstzulassung) und Feld E (Fahrgestellnummer) lesbar“. Tests: `foto-beispiel.test.tsx` (drei markierte Stellen, Beschriftung „Halter“, Wortlaut des Titels), `photo-upload.test.tsx` („Einsendeweg (R13): am Fahrzeugschein bleibt ‚Halter und Fahrzeugdaten lesbar‘ sichtbar …“).
2. **[gelb] Satz der Seite unter der Zeichnung fehlt — behoben.** Neu `beispielSatzSichtbar` in `photo-upload.tsx`: Unter einer Zeichnung `foto-beispiel` steht der Satz der Seite (`beispielSatz`, Motiv, sonst `note`) wieder sichtbar; bei anderen Zeichnungen und echten Fotos bleibt es wie bisher. Hinweis: `beispielSatz` nimmt das Motiv vor der `note`; die `note` „Die ganze Seite, scharf und ohne Spiegelung.“ war auch vor diesem Paket nicht sichtbar, sichtbar war und ist wieder der Motivsatz. An der Partnerseite steht damit „Gewerbeanmeldung oder Zertifikat, vollständig und gut lesbar.“ wieder am Feld.
3. **[gelb] Alternativtext Gewerbeanmeldung, „Kopf“ — behoben.** Titel jetzt „Beispiel Gewerbeanmeldung oder Zertifikat: das ganze Blatt mit allen vier Ecken im Bild, alles gut lesbar“; markierter Kopf und Beschriftung „Kopf“ entfernt, markiert bleibt nur „Angaben“ (das Blatt behält sein ungetöntes Kopfband als Dokumentform). Die OFFENE FRAGE zur Gewerbeanmeldung entfällt damit.
4. **[gelb] Uneinheitliche Leerangabe — behoben.** Beide Zeilen der Zusammenfassung „9. Unterlagen“ sagen ohne Datei „Nicht hochgeladen“ (`zutritt-konfigurator.tsx`, `unterlagen.test.ts`). Der Sicherheitscheck („Kein Grundriss“) liegt außerhalb der Schreibrechte und bleibt.
5. **[gelb] Seitentext „Acht Abfragen“ und „bleiben im Browser gespeichert“ — trifft zu, nicht behoben (Seitentexte gesperrt), als OFFENE FRAGE festgehalten** (siehe unten).
6. **[rot] Satz der Seite fällt an Fahrzeugschein, Nachweis und Gewerbeanmeldung weg — behoben** mit derselben Änderung wie Befund 2 (Bedingung `!zeigtBild` für `foto-beispiel` aufgehoben); Test im Einsendeweg verlangt „Halter und Fahrzeugdaten lesbar.“ am Feld, die Steckplatz-Tests verlangen den Satz der Seite an allen fünf Feldarten.
7. **[gelb] Testzahl im Bericht überholt — behoben.** Zeile als „Stand zum Umsetzungszeitpunkt“ gekennzeichnet; aktueller Stand unten.

Zusätzliche OFFENE FRAGE (Folgepaket mit Schreibrecht an Seitentexten): `elektronische-zutrittsloesungen/konfigurator/page.tsx` nennt „Acht Abfragen“ ohne den freiwilligen Schritt „9. Unterlagen“; die Lead-Zeile auf `/elektronische-zutrittsloesungen` („Ihre Angaben bleiben im Browser gespeichert“) sollte klarstellen, dass hochgeladene Dateien nicht im Browser gespeichert werden und beim Neuladen neu gewählt werden müssen.

Prüfung nach der Nachbesserung (über `sicher.sh`): `--json -- npx vitest run` 249/249 Dateien, **3905/3905 Tests grün**; `-- npm run typecheck` ohne Fehler; `-- npm run lint` ohne Befund; `--json -- npm run build` Exit 0.

Geänderte Dateien der Nachbesserung: `src/components/visual/generators/foto-beispiel.tsx`, `foto-beispiel.test.tsx`, `src/components/forms/photo-upload.tsx`, `photo-upload.test.tsx`, `src/app/(site)/elektronische-zutrittsloesungen/konfigurator/zutritt-konfigurator.tsx`, `unterlagen.test.ts`, dieser Bericht.

=== ENDE FA-QA-04C · BEREIT ZUR RÜCKGABE ===
