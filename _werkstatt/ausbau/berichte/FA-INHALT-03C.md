# Bericht FA-INHALT-03C · Texte menschlicher: Rubrikseiten Zylinder, Schließanlagen, Zutritt, Service und Termin, Vor Ort, Beratung, Kontakt

Fortsetzung eines unterbrochenen Laufs. Der Zwischenstand aus den Commits 53658db und 8c26b50 (Seitendateien) wurde gegen die Paketdatei geprüft, an vier Stellen berichtigt und um die Kopftexte in den Daten und einen Test ergänzt.

## GEÄNDERTE DATEIEN
- `src/app/(site)/gleichschliessende-zylinder/page.tsx` (FAQ-Rückfall, Fließtexte, Abschnittsköpfe, Rückfall-Unterzeile)
- `src/app/(site)/schliessanlagen/page.tsx` (Glossar, Zielgruppen, FAQ-Rückfall, Fließtexte, Rückfall-Unterzeile und -Einleitung)
- `src/components/schliessanlagen/system-erklaerung.tsx` (Erklärungen, Vergleichsspalten, Info-Texte, Merkpunkte der fünf Systeme)
- `src/app/(site)/elektronische-zutrittsloesungen/page.tsx` (elf Bausteine, Hinweise, Entscheidungstabelle, FAQ-Rückfall, Fließtexte)
- `src/app/(site)/service-und-termin/page.tsx` (Wege, fünf Phasen, Abschnitt „So arbeiten wir“, FAQ)
- `src/app/(site)/service-und-termin/vor-ort/page.tsx` (Leistungsliste, Kopf, Terminvorlauf, zwei Knopftexte)
- `src/app/(site)/service-und-termin/kontakt/page.tsx` (Kopf, Abschnittstitel, Hinweiskasten, Nachrichtenkopf)
- `src/app/(site)/beratung/page.tsx` (Kopf, ein Wegweisertext)
- `content/seo.json` (nur `subline` und `intro` der Routen `gleichschliessende-zylinder`, `schliessanlagen`, `elektronische-zutrittsloesungen`, `service-und-termin`)
- `src/lib/data/defaults/content.ts` (dieselben Felder wortgleich; dazu `headline` der Zylinderseite an die Daten angeglichen: „Gleichschließende Zylinder (Sperrschließung)“)
- `src/lib/data/defaults/rubrikseiten-texte.test.ts` (neu)
- dieser Bericht

Nicht berührt: `seo.title`, `seo.description` (geprüft: alle SEO-Felder in `seo.json` gleich wie vorher), Rückfall-Metadaten in `generateMetadata`, Konfiguratoren, Rechner, Formulare und ihre Logik (`kern.ts` der Routen enthält nur Formularlogik), `src/components/konfigurator`, `src/components/schliessung`, Navigation, Rubrikdaten, Preise und Preisformeln (`catalog.*`, `formatCents`), Rechtskästen (Verfügungsberechtigung auf Vor Ort wörtlich), Erreichbarkeit (nur der Baustein `Erreichbarkeit` mit `erreichbarkeit(settings)`), Bildvermerke, Code-Kommentare. Routen `vor-ort`, `kontakt`, `beratung` haben keinen Eintrag in `seo.json`; ihre Kopftexte stehen in den Seitendateien.

## WAS UND WARUM
**Gleichschließende Zylinder**
- FAQ (Rückfall, `seo.json` hat keine FAQ): gleiche sechs Fragen, gleiche Aussagen, kürzere Sätze. „Je Position“ heißt „für jede Tür“.
- Maße A und B je mit einem Halbsatz erklärt („Maß A ist die Länge nach außen“, „Maß B ist die Länge nach innen“, Messpunkt Mitte der Stulpschraube); Halbzylinder ohne Maß B bleibt.
- Not- und Gefahrenfunktion erklärt: „Mit der Not- und Gefahrenfunktion lässt sich die Tür dann trotzdem von außen öffnen.“ Bauform erklärt („mit Schlüssel auf beiden Seiten oder mit Knauf“).
- Preise und Grenzen unverändert aus den Katalogdaten (enthaltene Schlüssel, Preis je weiterem Schlüssel, Höchstzahlen), nur der Satz drumherum gekürzt; Gedankenstrich entfernt.
- „Ein Berechtigungsgrad für alle“ heißt „Alle Schlüssel haben dieselben Rechte“; Schließanlage: „Verschiedene Rechte, zum Beispiel ein Hauptschlüssel für alle Türen“.
- Kopfdaten: Unterzeile „Mehrere Türen, ein Schlüssel. Als Sperrschließung direkt konfigurierbar.“ wird „Ein Schlüssel für mehrere Türen. Sie stellen die Zylinder selbst zusammen und bestellen direkt.“ Einleitung „… werden mit derselben Anzahl gemeinsamer Schlüssel geliefert“ (missverständlich) wird „Sie wählen für jede Tür den passenden Zylinder und seine Maße. Alle Zylinder bekommen dieselbe Schließung. Jeder gemeinsame Schlüssel sperrt dann jede dieser Türen.“

**Schließanlagen und Systemerklärung (FA-16, FA-17)**
- Die drei Anlagenarten folgen der Tabelle des Inhabers, Sinn erhalten, Alltagsbeispiele aus dem Bestand:
  - Z: „Bei einer Zentralschließung öffnen mehrere verschiedene Einzelschlüssel dieselben gemeinsamen Türen. Im Mehrfamilienhaus hat jede Partei einen eigenen Schlüssel für die eigene Wohnung. …“
  - HS: „Bei einer Hauptschlüsselanlage hat jede Person feste Rechte. Ihr Schlüssel öffnet genau die Türen, die ihr zugeordnet sind. Ein Hauptschlüssel öffnet alle Türen der Anlage. …“
  - GHS: „Eine Generalhauptschlüsselanlage hat mehrere Bereiche und mehrere Stufen. Jeder Bereich, etwa ein Gebäude oder eine Abteilung, hat einen eigenen Hauptschlüssel. Ganz oben steht der Generalhauptschlüssel, der alles öffnet. …“
- Vergleichsspalten als ganze Sätze statt Doppelpunkt-Ketten; alle Gedankenstriche aus sichtbaren Texten entfernt (19 → 0; der eine verbleibende steht in der SEO-Beschreibung im Rückfall von `generateMetadata` und blieb).
- Zielgruppen heißen wie im Konfigurator (Privat, Gewerbe, Hausverwaltung, Öffentliche Einrichtung, Mehrere Liegenschaften). Link der Privatkarte „Kleine Vorhaben direkt konfigurieren“ heißt „Zu den gleichschließenden Zylindern“ (Ziel ist die Zylinderseite, nicht ein Konfigurator).
- Schlüsselprofil und Sicherungskarte mit Halbsatz erklärt; Nachweisregel (nur mit Karte Nachbestellung) unverändert.
- FAQ Fluchtwege: Die Normen DIN EN 179 (Notausgänge) und DIN EN 1125 (Paniktüren) standen im Zwischenstand nicht mehr. **Berichtigt:** sie stehen wieder, gleichlautend mit der Tür-Seite aus FA-INHALT-03B („Für Notausgänge gilt DIN EN 179, für Paniktüren DIN EN 1125.“), belegt durch den Nachweis in `seed.ts` und den Startwerten.
- Gewerbe-Karte: „… für die jemand zuständig ist“ (unklar) **berichtigt** zu „… für die sein Nutzer zuständig ist“.
- Überschriften ohne rhetorische Frage („Wenige Türen, ein Schlüssel für alles“, „Welche Anlage zu wem passt“).
- Kopfdaten: Unterzeile „Von der Hauptschlüsselanlage bis zur Generalhauptschlüsselanlage.“ wird „Wir planen Ihre Schließanlage mit Ihnen, von der Zentralschließung bis zur Generalhauptschlüsselanlage.“ (Aussage oben: was wir tun). Einleitung in drei kurzen Sätzen.

**Elektronische Zutrittslösungen (Abschnitt 17)**
- Jeder Baustein in kurzen Sätzen erklärt, nur mit Aussagen des Bestands: RFID (Chip per Funk, Karte oder Transponder vor den Leser), Smartphone/App, PIN, digitaler Zylinder (statt des mechanischen Zylinders, Knauf schließt erst nach Erkennung), Beschläge, zeitlich begrenzte Berechtigungen (Start- und Enddatum), Benutzerverwaltung (Gruppen), Zeitprofile, Sperren, Protokoll, Kombination mechanisch und elektronisch.
- Fachwörter erklärt: Transponder („kleiner Anhänger mit Chip“), Mastermedium („Karte mit Verwaltungsrechten“), Dornmaß („Abstand von der Türkante zur Mitte des Zylinders“).
- Datenschutz-Hinweis zur Protokollierung: gleiche Pflichten (Zweck, Umfang, Aufbewahrungsdauer, Beteiligung), Verantwortung beim Betreiber, nur in zwei Sätze geteilt.
- Keine Herstellernamen (es standen keine). Gedankenstriche 12 → 0.
- FAQ-Überschrift „Was Kundinnen und Kunden vorab wissen wollen“ heißt „Häufige Fragen zu elektronischen Zutrittslösungen“.
- Kopfdaten: Unterzeile wird ein ganzer Satz plus nächster Schritt („… Wir planen die Lösung für Ihr Objekt und richten sie ein.“, belegt durch Vor Ort „Elektronische Zutrittslösungen einrichten“). Einleitung ohne Gedankenstrich.

**Service und Termin**
- Größter Eingriff: Der Abschnitt „Präzision in jedem Schritt: Unsere Service-Architektur“ (ein Absatz mit 103 Wörtern, Floskel „maßgeschneidert“, „Out-of-the-box“) heißt „So arbeiten wir“ und hat vier kurze Sätze mit derselben Aussage (Bestandsaufnahme, Schwachstellen, Schutzziel, passende Lösung, keine Lösung von der Stange).
- Fünf Phasen: Namen als einfache Tätigkeiten („Bedarf klären“, „Planen“, „Fertigen und vorbereiten“, „Montieren“, „Unterlagen übergeben“), Inhalte gleich; Normen DIN 18252 und DIN EN 1303 bleiben. Die Zeichnung nutzt weiter die Kurzformen (`kurz`), unverändert.
- „Produkte und Technik“: Inhalt gleich, Fachbegriffe in Alltagssprache. Gestrichen: „MIFARE DESFire EV2/EV3“, „Bluetooth Low Energy mit AES-128“ (Produkt- und Verfahrensnamen ohne Erklärung, nicht in `FACHWISSEN.md` belegt; Aussage „verschlüsselt“ bleibt). Steht in der Schlussredaktion.
- Gewerbe-Abschnitt: DIN EN 179 und DIN EN 1125 standen im Zwischenstand nicht mehr; **berichtigt**, sie stehen wieder („Häufig geht es auch um Fluchtwege nach DIN EN 179 und DIN EN 1125 …“). Doppeltes „Dort … Dort“ beseitigt.
- FAQ (zugleich Strukturdaten, R8): gleiche fünf Fragen, gleiche Kernaussagen, Fragen in Kundensprache. Der Satz zum Orientierungsrechner („höchstens eine unverbindliche Spanne und ersetzt kein Angebot“) steht wörtlich.
- Keine Sätze zu Zeiten, Reaktionszeiten oder Notdienst; Erreichbarkeit nur über den Baustein.
- Kopfdaten: Unterzeile „Anfrage stellen, Terminstatus prüfen, Kontakt aufnehmen.“ wird „Hier stellen Sie eine Anfrage, sehen den Stand Ihres Vorgangs oder nehmen Kontakt mit uns auf.“ Einleitung ohne Doppelpunkt-Aufzählung: „Wählen Sie den Weg, der zu Ihrem Anliegen passt. Gehört es in keinen der Fachbereiche, stellen Sie eine allgemeine Anfrage.“

**Vor Ort**
- Leistungen als „Wir …“-Sätze; keine neue Zusage. Fahrzeug: „Ob wir auch zu Ihnen kommen können, prüfen wir im Einzelfall“ (alt: „nur nach individueller Prüfung möglich“).
- Terminvorlauf aus `settings.booking.leadTimeDays` unverändert, Satz verständlicher („frühestens nach etwa … Tagen“).
- Knöpfe: „Termin starten“ heißt „Termin anfragen“ (A-031: jeder Knopf zu `/autoschluessel/anfrage` heißt so); „Beratungstermin anfragen“ heißt „Anfrage stellen“ wie der Kopfknopf der Kontaktseite mit demselben Ziel (das Ziel ist eine Anfrage, kein fester Termin).
- Kasten zur Verfügungsberechtigung (R13) wörtlich.

**Kontakt**
- Kopf sagt, was auf der Seite steht (Anschrift, Telefon, E-Mail) und was der nächste Schritt für einen Auftrag ist.
- Hinweiskasten: Der Satz „Arbeiten an Fahrzeugen und Schließanlagen finden ausschließlich nach Terminvereinbarung statt“ ist gestrichen. Er war ein eigener Satz zur Arbeitsweise neben dem Baustein `Erreichbarkeit`, der direkt darüber den Wortlaut des Inhabers zeigt („Werkstatt und persönliche Beratung nach Terminvereinbarung“). Die Paketvorgabe lässt nur den Baustein zu (FA-23). Der Kasten nennt jetzt nur die Wege (Autoschlüssel-Ablauf, allgemeine Anfrage).

**Beratung**
- Kopf als Bedingungssatz, ein Wegweisertext ohne Doppelpunkt-Effekt. Formular unverändert.

**Neuer Test** `src/lib/data/defaults/rubrikseiten-texte.test.ts`: Kopftexte (`headline`, `subline`, `intro`) der vier Routen in `seo.json` und im Rückfall gleich; ohne Gedankenstrich, kein Satz über 25 Wörter, Unterzeile höchstens zwei Sätze; Z, HS und GHS tragen die Kernaussagen der Inhabertabelle; alle Systemerklärungen ohne Gedankenstrich und ohne Satz über 25 Wörter.

Seed: Die geänderten Kopftexte kommen über den bestehenden Startwert-Abgleich in die Datenbank, wo der Betrieb sie nicht selbst geändert hat. Kein Datenschema, keine Migration.

## ZAHLEN VORHER UND NACHHER
`stil.mjs` misst nur gerenderte Seiten und braucht den Server (Aufruf ohne Server endet mit `ERR_CONNECTION_REFUSED`); das Paket verbietet ihn. Gemessen wie in FA-INHALT-03B mit einer Heuristik über den Quelltext: alle sichtbaren Zeichenketten der Seitendateien (ohne SEO-Felder, Bildvermerke, Klassen, Kommentare) plus `headline`, `subline`, `intro`, `faq` aus `content/seo.json`. Sätze unter vier Wörtern zählen nicht. Vorher ist der Startcommit 4342f87 des Pakets.

| Seite | Wörter vorher → nachher | Satzlänge Mittel | längster Satz | > 25 Wörter | Gedankenstriche | offene Stellen |
|---|---|---|---|---|---|---|
| Gleichschließende Zylinder | 745 → 800 | 8,8 → 8,3 | 23 → 18 | 0 → 0 | 1 → 0 | Not- und Gefahrenfunktion je Bauform |
| Schließanlagen (mit Systemerklärung) | 1590 → 1677 | 10,3 → 8,7 | 27 → 21 | 2 → 0 | 19 → 0 (1 in SEO-Rückfall) | Normen nur ohne „zertifiziert“ |
| Elektronische Zutrittslösungen | 1137 → 1261 | 10,5 → 9,4 | 21 → 23 | 0 → 0 | 12 → 0 | RFID-Erklärung neu |
| Service und Termin | 962 → 836 | 14,1 → 10,4 | 33 → 23 | 4 → 0 | 3 → 0 | Verschlüsselung ohne Standardnamen |
| Vor Ort | 230 → 251 | 9,1 → 8,9 | 19 → 18 | 0 → 0 | 0 → 0 | Einsatz beim Kunden für Fahrzeuge |
| Kontakt | 91 → 101 | 11,4 → 11,2 | 18 → 18 | 0 → 0 | 0 → 0 | Terminvereinbarung nur im Baustein |
| Beratung | 122 → 121 | 9,3 → 9,2 | 13 → 13 | 0 → 0 | 0 → 0 | „Angebot, das alle Kosten nennt“ |

Zylinder, Schließanlagen und Zutritt werden etwas länger, weil Fachwörter (Maß A und B, Not- und Gefahrenfunktion, Bauform, Schlüsselprofil, RFID, Transponder, Mastermedium, Dornmaß) jetzt je einen Halbsatz Erklärung haben und Nominalketten in ganze Sätze aufgelöst sind. Service und Termin verliert 13 Prozent und alle Sätze über 25 Wörter.

Gegenlesen: Diese Teilaufgabe hat kein Werkzeug, um unabhängige Agenten zu starten. Die zwei Lesungen habe ich selbst in getrennten Durchgängen gemacht: (1) als älterer Kunde ohne Fachwissen: eingearbeitet wurden die unklare Gewerbe-Karte („für die jemand zuständig ist“), das doppelte „Dort“ im Gewerbe-Abschnitt und die Einleitung der Zylinderseite („derselben Anzahl gemeinsamer Schlüssel“, las sich wie eine feste Stückzahl); (2) Tatsachen gegen die alte Fassung (`git diff 4342f87`) und die Belege: eingearbeitet wurden die zwei verlorenen Normangaben DIN EN 179 und DIN EN 1125 (Schließanlagen-FAQ und Service-Seite), damit Tür-, Schließanlagen- und Service-Seite sie wieder einheitlich nennen. Preise, Grenzen und Terminvorlauf kommen weiter aus den Daten.

## SCHLUSSREDAKTION (Liste für den Menschen)
**Gleichschließende Zylinder**
1. „Mit der Not- und Gefahrenfunktion lässt sich die Tür dann trotzdem von außen öffnen.“ Fachlich so gemeint (auch wenn innen ein Schlüssel steckt)?
2. „Ohne Hinterlegung können wir später nicht in jedem Fall passende Zylinder nachfertigen.“ (alt: „passgenaue Erweiterung … nicht in jedem Fall möglich“): gleiche Aussage?
3. Überschrift „Gleichschließende Zylinder (Sperrschließung)“: Soll der Fachbegriff „Sperrschließung“ in der Hauptüberschrift bleiben oder nur im Menü stehen (A-031)?

**Schließanlagen und Systemerklärung**
1. Z-Anlage: „Bei einer Zentralschließung öffnen mehrere verschiedene Einzelschlüssel dieselben gemeinsamen Türen.“ Trifft das den Sinn Ihrer Tabelle (Abschnitt 16)?
2. GHS: „Jeder Bereich, etwa ein Gebäude oder eine Abteilung, hat einen eigenen Hauptschlüssel.“ Gilt das für jede GHS-Anlage oder nur typisch?
3. FAQ Hauptschlüsselverlust: „Gehen an einer Tür oft Schlüssel verloren, kann dort eine elektronische Lösung sinnvoll sein.“ (alt: „Türen mit hohem Verlustrisiko“): gleiche Aussage?

**Elektronische Zutrittslösungen**
1. „RFID heißt, dass ein Chip per Funk gelesen wird.“ Als Laienerklärung richtig genug?
2. Digitaler Zylinder: „Erst wenn er eine berechtigte Karte oder einen berechtigten Transponder erkennt, können Sie mit dem Knauf schließen.“ Gilt das auch für App und PIN-Varianten?
3. „Ausgeben und Entziehen erledigen Sie in der Verwaltung“: Macht das immer der Kunde, oder auch der Betrieb als Dienstleistung?

**Service und Termin**
1. Gestrichen: „MIFARE DESFire EV2/EV3“, „Bluetooth Low Energy mit AES-128“, „AES-128 oder höher“. Sollen Standardnamen wieder genannt werden (dann mit Quelle in `FACHWISSEN.md`)?
2. Phase „Bedarf klären“: „Wir sehen uns Türen, Zylindermaße, vorhandene Technik und das Gebäude an.“ Immer vor Ort, oder auch anhand von Fotos und Plänen?
3. „Wir bieten auch regelmäßige Wartung an.“ (alt: „strukturierte Wartungskonzepte“): Gibt es dieses Angebot wirklich, und für welche Anlagen?

**Vor Ort**
1. „Ob wir auch zu Ihnen kommen können, prüfen wir im Einzelfall“ (Autoschlüssel am Fahrzeug): richtig wiedergegeben?
2. „Termine für Autoschlüssel gibt es in der Regel frühestens nach etwa … Tagen“: Wortlaut zum Terminvorlauf so in Ordnung?
3. „Bestellungen aus dem Shop liefern wir in ganz Deutschland“ (alt: „deutschlandweit“): unverändert belegt?

**Kontakt**
1. Gestrichener Satz „Arbeiten an Fahrzeugen und Schließanlagen finden ausschließlich nach Terminvereinbarung statt.“ Reicht der Wortlaut im Baustein „Erreichbarkeit“?
2. Abschnittstitel „Fachbetrieb“ heißt jetzt „Anschrift und Kontakt“. Einverstanden?
3. „Für Arbeiten an Türen und Schließanlagen stellen Sie bitte eine allgemeine Anfrage.“ Oder soll auf den Schließanlagen-Konfigurator verwiesen werden?

**Beratung**
1. „Technik für Ihr Objekt, mit Beratung und einem Angebot, das alle Kosten nennt“ (Bestand, unverändert): Zusage so haltbar?
2. „Passt Ihr Anliegen zu keinem der anderen Wege, sind Sie hier richtig.“ Ton passend?
3. Rückruf „unter Ihrer Telefonnummer“: ohne Zeitangabe so gewollt?

## OFFENE FRAGEN
- OFFENE FRAGE: Gegenlesen durch zwei unabhängige Agenten (Haiku als Laie, Opus für Tatsachen) gegen `git diff 4342f87` nachholen, ebenso eine Messung mit `stil.mjs` bei laufendem Server.
- OFFENE FRAGE (Inhaber): DIN EN 179 und DIN EN 1125 stehen ohne „zertifiziert“, wie auf der Tür-Seite (MA-42, Nachweis „bereithalten“).
- OFFENE FRAGE: Die Rückfall-Metadaten in `generateMetadata` der Schließanlagen-Seite tragen weiter einen Gedankenstrich („… Generalhauptschlüsselanlage — in einfacher Sprache erklärt …“), ebenso die SEO-Titel in `content.ts` („Schließanlagen planen — Z, HS und GHS“, „Elektronische Zutrittslösungen — RFID, PIN, App“). SEO-Felder gehören zu FA-SEO-01.
- OFFENE FRAGE: Die Not- und Gefahrenfunktion ist „nicht für jede Bauform“ verfügbar; welche Bauformen sie haben, steht im Konfigurator, nicht auf der Seite.
- R13 (Berechtigungsnachweis): Auf Vor Ort steht der Kasten unverändert; die Sicherungskarte als Nachweis für Nachschlüssel steht auf der Schließanlagen-Seite unverändert. Die Formulare selbst sind nicht Teil dieses Pakets.

## PRÜFUNG
Über die Datenweiche (`sicher.sh --json`):
- `npx vitest run`: 187 Testdateien, 2427 Tests, alle bestanden (davon 12 neu in `rubrikseiten-texte.test.ts`; die Zahl enthält Tests gleichzeitig laufender Pakete). Ein erster Lauf zeigte zwei Fehler in `src/components/autoschluessel/fahrzeug-ziel.test.ts` (fremdes Paket, Fahrzeugkatalog in Arbeit); der Wiederholungslauf war grün.
- `npm run typecheck`: ohne Fehler (ein früherer Lauf zeigte 7 Fehler nur in `scripts/fahrzeuge-import-fz2.test.ts`, fremdes Paket in Arbeit; der Schlusslauf war fehlerfrei).
- `npm run lint`: ohne Fehler.
- Kein Build, kein Server, kein git (außer `status`, `diff`, `log` lesend), keine `--pg`-Befehle.

## Nachbesserung
Nach zwei Gegenprüfungen (15 Befunde, alle gelb). Prüfung danach über die Datenweiche (`sicher.sh --json`): `npx vitest run` 187 Testdateien, 2427 Tests, alle bestanden (ein erster Lauf zeigte einen Fehler in `src/lib/rubriken.test.ts`, Datei eines fremden Pakets, nicht berührt; einzeln und im Wiederholungslauf grün); `npm run typecheck` ohne Fehler; `npm run lint` ohne Fehler. Kein git.

1. Zutritt, digitaler Zylinder: **behoben.** Zurück zur Aussage des Bestands: „Erst wenn er ein berechtigtes Medium erkennt, etwa eine Karte oder einen Transponder, können Sie mit dem Knauf schließen.“ Die Frage 2 der Schlussredaktion (Zutritt) ist damit erledigt.
2. Schließanlagen, Gewerbe-Karte: **behoben.** „… öffnet jeder Schlüssel nur die Türen, die sein Besitzer braucht. Der Hauptschlüssel öffnet alle Türen.“
3. Schließanlagen, Karte „Mehrere Liegenschaften“: **behoben.** „Der Generalhauptschlüssel öffnet alle Türen.“
4. Systemerklärung Z und Unterzeile: **behoben.** Die Z-Erklärung beginnt jetzt „Bei einer Zentralschlossanlage, auch Zentralschließung genannt, öffnen mehrere verschiedene Einzelschlüssel dieselben gemeinsamen Türen.“ Die Unterzeile lautet in `content/seo.json`, `content.ts` und im Rückfall der Seite gleich „… von der Gleichschließung bis zur Generalhauptschlüsselanlage.“ (wie Navigation und Startwerte). Test in `rubrikseiten-texte.test.ts` auf den neuen Satzanfang geschärft.
5. Systemerklärung HS: **behoben.** Wortlaut des Inhabers übernommen: „Ein Hauptschlüssel öffnet alle ihm zugeordneten Türen, meist alle Türen der Anlage.“ Der Test prüft jetzt /Hauptschlüssel öffnet alle ihm zugeordneten Türen/ (genauer, nicht lockerer). `opensWhat` („öffnet alle Türen der Anlage“) bleibt als typischer Fall, siehe Schlussredaktion.
6. Zylinderseite, Sicherungskarte: **behoben.** Lead von Abschnitt 06 „Schutz und Optionen“: „Dazu gehört die Sicherungskarte, also ein Nachweis, ohne den niemand Nachschlüssel bestellen kann.“ Beleg im Bestand: `content/cylinder-catalog.json` („Nachschlüssel werden nur gegen Vorlage der Sicherungskarte gefertigt.“).
7. Kontakt, Kopf: **behoben.** „Für einen Auftrag nutzen Sie am besten den passenden Ablauf, dort fragen wir gleich alles Nötige ab.“
8. Vor Ort, Terminvorlauf: **behoben.** „Termine für Autoschlüssel gibt es in der Regel ab etwa {leadTimeDays} Tagen.“ Wert weiter aus `settings.booking.leadTimeDays`, zweiter Satz unverändert.
9. Vor Ort, Überschrift: **behoben.** „Arbeiten vor Ort und in unserer Werkstatt“; die Autoschlüssel-Zeile bleibt.
10. Ratgeber `content/guides.json`: **behoben als OFFENE FRAGE** (Datei außerhalb der Schreibrechte), siehe unten.
11. Kontakt, Kopf: **behoben** wie Befund 7 (doppelt gemeldet).
12. Vor Ort, Terminvorlauf: **behoben** wie Befund 8 (doppelt gemeldet).
13. Systemerklärung HS: **behoben** wie Befund 5 (doppelt gemeldet); der Test wurde nicht gelockert, sondern auf den Wortlaut des Inhabers gesetzt.
14. M-20 in `docs/gestaltung/MENSCHEN.md`: **zutreffend, nicht in diesem Paket behebbar** (außerhalb der Schreibrechte). Hinweis für den Orchestrator: bei M-20 vermerken, dass die Angaben „AES-128 oder höher“, „MIFARE DESFire EV2/EV3“ und „Bluetooth Low Energy mit AES-128“ mit FA-INHALT-03C gestrichen wurden; über die Wiederaufnahme mit Quelle in `FACHWISSEN.md` entscheidet der Inhaber.
15. Schließanlagen-FAQ „Flucht- und Rettungswege“: **behoben.** Verkettung auf unter 100 Zeichen je Zeile umbrochen.

Weitere offene Fragen aus der Nachbesserung:
- OFFENE FRAGE (Ratgeber-Paket): `content/guides.json`, Ratgeber „Welche Schließanlage passt“, erklärt Z, HS und GHS anders als `system-erklaerung.tsx` (etwa HS „Ein Hauptschlüssel öffnet alle oder eine größere Gruppe davon“), und der Auszug trägt einen Gedankenstrich („Gleichschließung, Z, HS oder GHS — in einfacher Sprache erklärt.“). FA-16 verlangt eine einheitliche Laienerklärung: Texte an die Tabelle des Inhabers und an die Systemerklärung angleichen, Gedankenstrich entfernen.
- OFFENE FRAGE (Orchestrator): M-20 in `docs/gestaltung/MENSCHEN.md` nachtragen (Befund 14).
- Schlussredaktion, Ergänzung Schließanlagen: HS-Karte `opensWhat` sagt weiter „Der Hauptschlüssel öffnet alle Türen der Anlage.“ (Bestand, typischer Fall). Soll dort ebenfalls „alle zugeordneten Türen“ stehen?
- Schlussredaktion, Ergänzung Zylinder: „die Sicherungskarte, also ein Nachweis, ohne den niemand Nachschlüssel bestellen kann“: so allgemein richtig, oder nur „bei geschützten Systemen“?

=== ENDE FA-INHALT-03C · BERICHT ===

## ABNAHME (Orchestrator, 15.11.2026)

- **Verweistext „Code vorhanden? Direkt bestellen“** auf drei Routen (`content/seo.json`, Rückfall `content.ts`) heißt jetzt „Code vorhanden? Schlüssel nach Code“. Solange es keine Codeprodukte gibt, darf dort kein Direktkauf stehen (R4); der neue Text stimmt mit und ohne Produkte.
- **M-20** in `docs/gestaltung/MENSCHEN.md` trägt den Vermerk zu den gestrichenen Verschlüsselungsangaben.
- **Ratgeber „Welche Schließanlage passt“** (`content/guides.json`): Die Angleichung von Z, HS und GHS an die neue Systemerklärung geschieht mit der Abnahme von FA-INHALT-03E, das den Ratgeber gerade überarbeitet.
- **Fragen an den Inhaber** (HS-Karte „alle Türen der Anlage“, Sicherungskarte allgemein, Verschlüsselungsangaben, Wartungsangebot, Bestandsaufnahme vor Ort) stehen in MA-41.
- Commit 292c5a6 enthielt einen Zwischenstand dieses Pakets; der Stand nach der Nachbesserung ist mit diesem Commit vollständig.
