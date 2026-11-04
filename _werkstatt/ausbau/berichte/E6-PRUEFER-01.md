# E6-PRUEFER-01 · Prüfstufe B Etappe E6 und Prüfliste G-10 bis G-45

HEAD 2702847, frischer Build (232 Seiten), Prüfserver läuft. Vergleich E5-PRUEFER-01. Belege relativ zu `protokolle/E6-PRUEFER-01/`. Gesamturteil: **gelb**, kein Rot.

## GEÄNDERTE DATEIEN
- Neu: `berichte/E6-PRUEFER-01.md`, `protokolle/E6-PRUEFER-01/`.
- Überschrieben: `protokolle/E6-PRUEFER-01/build-pg.log`. Angehängt: `protokolle/datenweiche.log`.
- Keine Projektdatei geändert.

## WAS UND WARUM
- Lighthouse nicht ausführbar. Das Modul fehlt, `werkzeuge/node_modules` zeigt auf `/root/sm24-werkzeuge`, den es hier nicht gibt. Ersatz: `messung.mjs` (Playwright, gedrosselt, drei Läufe). Nicht mit Lighthouse vergleichbar.
- `a11y.mjs` fand `axe-core` aus demselben Grund nicht. Eigener Lauf mit `axe-core` 4.12.0 aus dem Projekt (Werkzeug verlangt 4.10.2).
- Autoschlüssel-Assistent läuft bis zur Preisanzeige, der Foto-Schritt hängt nicht mehr.

## PRÜFUNG UND ERGEBNIS

| Prüfung | E5 | E6 | Urteil | Beleg |
|---|---|---|---|---|
| Build JSON / pg | 226 Seiten | 232 Seiten, exit 0 | grün | build-json.log, build-pg.log |
| Typprüfung / Lint | 0 / 0 | 0 / 0, 0 Warnungen | grün | typecheck.log, lint.log |
| Unit | 2050 (E5-Bericht) | 2226 von 2226 | grün | test-unit.log |
| DB | 97 von 97 | 97 von 97 | grün | test-db.log |
| Konsole, 14 Hauptansichten | 0 Fehler, 0 Warnungen | 0 Fehler, 0 Warnungen, 21 Vorabruf-Abbrüche (ERR_ABORTED, `_rsc`) | grün | konsole.json |
| Funktionsliste F-01 bis F-19 | 19 von 19 | 19 von 19 | grün | funktionsliste.md |
| axe WCAG 2.2 AA, 27 Routen, mobil und Desktop | 0 | 0, außer /service-und-termin/kontakt: definition-list und dlitem, schwer, 9 Stellen | gelb | axe-seiten.json |
| axe offene Menüs (Drawer, Megamenü), 3 Seiten | 0 | 0 | grün | axe-menues.json, axe-menues-desktop.json |
| axe in 6 Anfrage-Abläufen, 34 Schritte | n. v. | 0 | grün | axe-wizard-1 bis 6/ablauf.json |
| Hub 390 × 844, Kacheln im ersten Bildschirm | n. v. | 12 von 12 | grün | bilder/hub-mobil-erster-schirm.png |
| Lighthouse mobil, Median aus 3 | Start 93, Anfrage 92, H02 92, H09 88; LCP 2943 bis 3829 ms | nicht ausführbar | gelb | keiner |
| LCP, Playwright gedrosselt, Median aus 3 | n. v. | 616 bis 880 ms, 6 Ansichten | nicht vergleichbar | messung-mobil.md |
| Bildsatz Überlauf, 13 Ansichten, 5 Geräte | 0 | 0 (65 Zeilen) | grün | bildsatz.md |
| Bildsatz H01 Befunde am Rand | 32, 32, 3, 2, 0 | 32, 32, 3, 2, 0 | grün | bildsatz.md |
| Bildsatz H02 Befunde am Rand | 85, 85, 3, 0, 0 | 85, 85, 3, 0, 0 | grün | bildsatz.md |
| Bewegung reduziert, 14 Ansichten | 0 | 0 | grün | bewegung-reduziert.md |
| Werte außerhalb Designsystem | 45 (Basis 822a0d9) | 45 ohne Ausnahmen (gleiche Basis) | grün | werte-suche.md |
| Slop S1 bis S8 | 0, 2, 150, 0, 26, 10, 0, 24 | 0, 2, 154, 0, 26, 10, 0, 24 | gelb | slopscan.md |
| Gedankenstriche | n. v. | Bestand 2650 (181 Seiten), neu 4 Stellen im Code | gelb | stil.md, gedankenstriche-neu.txt |
| Inventar indexierbar | 182 von 218 | 188 von 196 | gelb | inventar.md, inventar.tsv |
| Strukturdaten | n. v. | 0 Parsefehler, 0 Canonical-Fehler | grün | inventar.md |
| Schließplan in Sitemap (E5-Offene-Frage 5) | nein | ja | grün | inventar.tsv |

## PRÜFLISTE

| G | Urteil | Beleg |
|---|---|---|
| G-10 | erfüllt | Alle 12 Rubrikseiten zeigen „So läuft Ihr Auftrag ab“ mit 3 bis 5 nummerierten Schritten und Icon. pruefliste/bilder/g10-motorrad-mobil.png, texte-rubriken/ |
| G-11 | teilweise | Hub, Kacheln, Abläufe, Abschlüsse aus content/rubriken.json. Formulare sind je Weg fest codiert. Ausbau ohne Umbau nicht geprüft. |
| G-18 | zurückgestellt | /transponder-kopie antwortet 404, nicht im Hub. |
| G-19 | erfüllt | Motorrad-Anfrage: Hersteller, Modell, Baujahr, Chip-Frage Ja, Nein, Weiß ich nicht mit Wegfahrsperre-Erklärung, Schlüsselfoto, Fahrzeugschein. ablauf-motorrad/s00.txt, s01.png |
| G-20 | erfüllt | Gehäuse-Anfrage: Baujahr akzeptiert 1990 bis 2026, auch 1998 und 2022; 1970 und 1980 abgelehnt. baujahr-gehaeuse.log. Zahlungslink liegt auf Inhaber-Seite, nicht geprüft. |
| G-23 | erfüllt | „Nicht jedes Foto ist ablesbar“, Einschicken als Folge, „keine Fertigungszusage“. Zeichnung je Foto-Schritt; Schritt 1 gesehen, 2 und 3 nicht bildlich. ablauf-vorlage/s00.txt, bilder2/vorlage-schritt1-beispiele.png |
| G-24 | teilweise | Begleitschein, versichert oder unversichert, „Empfohlen“, Aufpreise vorhanden. Aber: „das Porto zahlen Sie bei der Post“, während G-24 die Kosten bei SCHLÜSSELMACHER24 sieht. Keine Versandmarke oder Label. ablauf-einschicken/s02.txt |
| G-25 | teilweise | Rückversand genannt, Status nur über Link zur Terminstatus-Seite. Der Kreislauf ist im Code belegt (src/lib/kundenstatus.ts), im Browser nicht. |
| G-26 | teilweise | „Schlüsseldienst online, ohne Anfahrt“ vorhanden. Ländliche und abgelegene Gegenden nicht ausdrücklich genannt. texte/schluessel-einschicken.txt |
| G-33 | teilweise | RFID vorhanden, NFC fehlt. BKS, ABUS, Burg-Wächter nicht genannt. Produktnamen Xialo, SE, One fehlen richtig. texte/elektronische-zutrittsloesungen.txt |
| G-34 | teilweise | Sicherheitstechnik: Einbruchschutz, Alarm, Videoüberwachung. Fehlen: Schlüsselaufbewahrung, Türsicherheit. |
| G-36 | erfüllt | Kontakt mit „Fotos (freiwillig)“, bis zu drei Dateien. pruefliste/bilder/g36-kontakt-mobil.png |
| G-37 | teilweise | Vorgangsblatt-PDF als Betriebsmail-Anhang (src/lib/server/benachrichtigungen.ts, Z. 81 bis 95). Browser ohne Absenden nicht ausgelöst, Admin-Abruf nicht geprüft. |
| G-38 | teilweise | Abschlüsse nach Daten: Kasse 2, Zahlungslink oder Anzahlung 4, Anfrage 4, Beratung mit Rückruf 4. Ob der Rückruf eine „vollständige Anfrage“ ist, bleibt offen. |
| G-40 | teilweise | Code: Modell A aktiv, B aus (src/lib/partner/abrechnung.ts). Öffentlich nur der Partnervertrag-Hinweis auf Provision. |
| G-41 | erfüllt | Keine Stadtseiten Hamburg, Berlin, Rostock. Einzige Ortsseite Wetzlar. Auffindbarkeit nicht messbar. |
| G-45 | erfüllt | Gezeichnete Anleitung, keine vorgetäuschten Fotos. bilder2/vorlage-schritt1-beispiele.png |

Summe: erfüllt 7, teilweise 9, nicht 0, zurückgestellt 1 (G-18).

## ABWEICHUNGEN MIT BELEG
- **Kontakt-Foto, Hinweis fehlt (gelb).** Die Seite sagt vor der Auswahl nicht, dass das Foto sofort übertragen wird. Der Upload startet mit der Auswahl (src/components/forms/photo-upload.tsx, ca. Z. 267). Danach steht nur „testbild.png ist hochgeladen“. Belege: bilder2/info.json, bilder2/kontakt-foto-vor-auswahl.png. Vermuteter Commit: dad07d3.
- **/service-und-termin/kontakt, axe (gelb).** Die Liste nutzt dl > div > div > dt. Der Aufbau steht schon im Stand 0957390 (E5), E5 hat die Seite nicht geprüft.

## BELEGE
`protokolle/E6-PRUEFER-01/`: Logs, JSON, `pruefliste/`, `ablauf-*/`, `texte*/`, `bilder2/`, `axe-*.json`. Skripte in der Scratchpad.

## OFFENE FRAGEN
1. Porto (G-24): trägt es der Kunde oder SCHLÜSSELMACHER24? Inhaber.
2. Lighthouse und LCP-Budget (A-032) bleiben offen, bis die Abhängigkeiten im Werkzeug verfügbar sind.
3. Inventar: Gesamtzahl fiel von 218 auf 196. Ursache nicht geklärt.
4. Herstellernamen G-33 (Inhaber).
5. Rückruf als Abschluss (G-38): zählt er als vollständige Anfrage?
6. Foto-Hinweis auf /service-und-termin/kontakt (R10, rechtlich prüfen).

=== ENDE E6-PRUEFER-01 · BEREIT ZUR RÜCKGABE ===

## ABNAHME DURCH DEN ORCHESTRATOR (886a8f6e)
- Lighthouse: Die Werkzeug-Abhängigkeiten fehlten in der neuen Umgebung (Symlink auf /root/sm24-werkzeuge). Sie sind nach werkzeuge/package.json neu eingerichtet (axe-core 4.10.2, lighthouse 12.6.1, svgo 3.3.2). Nachmessung mobil, Median aus drei Läufen (lighthouse-mobil.json): Start 89 / 3098 ms (E5 93 / 3084), /autoschluessel 86 / 3004 (E5 92 / 3157), /schluessel-einschicken 95 / 2570, Vor Ort 89 / 2975, /schluessel-nach-code 87 / 2536. Barrierefreiheit und SEO 100 überall. Streuung je Ansicht bis 9 Punkte (Start 82 bis 91). LCP nicht schlechter, Leistungswert innerhalb der Streuung: gelb. LCP-Budget weiter verfehlt (A-032).
- axe /service-und-termin/kontakt (definition-list, dlitem): behoben. dt und dd stehen jetzt direkt im Gruppen-div, das Symbol steht im dt. Nachprüfung a11y: 0 Verstöße mobil und desktop (protokolle/a11y-2026-11-04_19-12-41.json).
- Kontakt-Foto: Das Feld sagt jetzt „Jedes Foto wird schon beim Auswählen übertragen.“
- Gedankenstriche: Zwei neue Geviertstriche („nicht nötig — wir fertigen …“ in foto-ergebnis.tsx und freigabe.ts) sind durch Kommas ersetzt. Die übrigen Treffer in gedankenstriche-neu.txt sind Fehlalarme durch deutsche Anführungszeichen. Der Halbgeviertstrich im Mail-Betreff ist Bestand (status.ts) und bleibt.
- Inventar 218 auf 196: Das liegt an der Methode. Das Prerender-Manifest fehlt in diesem Build, deshalb nur Sitemap und Links. Indexierbar sind 188 Seiten (E5: 182). Kein Verlust.
- G-24 (Porto beim Kunden) berührt Preise und Zahlverhalten (G9): vorgemerkt für den Inhaber, keine Änderung.
- Teilweise erfüllte G-Punkte bleiben als offene Teile im Plan. Urteil: abgenommen, gelb ohne Rot. Unit 2226/2226, Typprüfung und Lint grün nach den Änderungen.
