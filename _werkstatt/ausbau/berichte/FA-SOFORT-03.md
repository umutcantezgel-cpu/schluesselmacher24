# Bericht FA-SOFORT-03 · „Schlüssel nach Foto“ entfernt, Rubrik heißt „Schlüssel nach Vorlage“

## GEÄNDERTE DATEIEN
- content/rubriken.json und src/lib/data/defaults/rubriken.ts (gleicher Stand, nur `schluessel-nach-vorlage` und `schluessel-einschicken`)
- content/seo.json (Eintrag `schluessel-nach-vorlage`, Verweis-Label im Eintrag `schluessel-einschicken`)
- src/lib/navigation.ts (nur Bereich `schluessel-nach-vorlage`)
- src/app/(site)/schluessel-nach-vorlage/page.tsx, src/app/(site)/schluessel-nach-vorlage/opengraph-image.tsx
- src/app/(site)/schluessel-einschicken/page.tsx, src/app/(site)/schluessel-einschicken/layout.tsx
- src/app/(site)/bestellung/[id]/foto-ergebnis.tsx, src/lib/mail/vorlagen/freigabe.ts
- src/lib/rubriken.test.ts
- _werkstatt/ausbau/berichte/FA-SOFORT-03.md

## WAS UND WARUM
- Rubrik `schluessel-nach-vorlage`: name und laienname „Schlüssel nach Vorlage“, Zusatz „per Foto anfragen oder einschicken“ (Feld wie bei `sperrschliessung`). Erklärung: „Sie laden drei Fotos hoch, wir prüfen Schlüsselart und Machbarkeit und nennen Ihnen Preis und Weg.“ Ablaufschritt 2 verspricht keine Nachfertigung nach Bildern mehr: Bestimmung von Schlüsselart, Profil, Beschriftung, Prüfung der Machbarkeit, „Schließwerte lesen wir nicht aus Fotos ab“, Freigabe mit Preis und Weg (Fertigung nach den Angaben auf dem Schlüssel oder Einsendung des Originals). Icons und Reihenfolge unverändert (A-034).
- Rubrik `schluessel-einschicken`: `imHub: false` (ein Hauptzugang); Erklärung ohne „nur nach Freigabe der Fotoanfrage“, passend zur Seite (Einsendung anmelden, Begleitschein, Angebot mit Zahlungslink). Die Seite /schluessel-einschicken/anmelden verlangt keine vorherige Fotoanfrage.
- Navigation: label „Schlüssel nach Vorlage“, navLabel „Nach Vorlage“, summary „Per Foto anfragen oder einschicken. Wir prüfen Machbarkeit und Preis.“, highlight und Spaltenlink „Schlüssel prüfen lassen“ (A-031), Einschicken-Beschreibung „Original einsenden, mit Begleitschein“.
- Seite /schluessel-nach-vorlage: Titel, Brotkrumen, Metadaten-Rückfall, JSON-LD-Name, Kopf, beide Knöpfe „Schlüssel prüfen lassen“. Im Kopf direkt unter dem Intro steht hervorgehoben der Satz des Inhabers: „Ihre Fotos dienen nur der Identifikation und Prüfung. Schließwerte lesen wir nicht aus Fotos ab. Braucht die Fertigung das Original, senden Sie es ein.“ Kopffelder „Original: Bleibt zunächst bei Ihnen“ und „Einsendung: Wenn die Fertigung das Original braucht“. FAQ angepasst (Einsendung gleich möglich; Schließwerte nicht aus Fotos; Autoschlüssel und reine Bärte je nach Fall einsendbar). Die Platzhalter-Antwort zur Bearbeitungsdauer bleibt ausgeblendet. Abschnitt Aufnahmen: „Beschriftungen und Prägungen müssen lesbar sein.“ Abschnitt 04 „Wenn die Fertigung das Original braucht“ mit dem Hinweis auf die direkte Einsendung. „Ein nach Foto gefräster Bart“ wurde „Ein nachgefertigter Bart“. Alle Gedankenstriche der Seite entfernt.
- Seite /schluessel-einschicken: Brotkrume und Eyebrow „Schlüssel nach Vorlage“, Knopf „Schlüssel prüfen lassen“, Hinweiskasten „Zwei Wege zum Schlüssel nach Vorlage“ und erste FAQ-Antwort stellen Einsenden und Anfrage mit Fotos gleichberechtigt dar.
- Ergebnisanzeige und Freigabe-Mail: „nicht nötig, wir fertigen nach Ihren Fotos“ wurde „nicht nötig“.
- content/seo.json: headline „Schlüssel nach Vorlage“, subline ohne Gedankenstrich, Titel „Schlüssel nach Vorlage nachmachen lassen“ (40 Zeichen), Beschreibung 149 Zeichen, Motivtext, Verweis-Labels „Original einschicken“ und „Schlüssel nach Vorlage“.
- Tests: Hub-Reihenfolge G03 ohne `schluessel-einschicken` (elf statt zwölf Kacheln, verlangte Änderung). Neu: kein „nach Foto“ / „Foto prüfen lassen“ in Rubriken (TS und JSON), Navigation und content/seo.json; genau eine Hub-Kachel im Bereich `schluessel-nach-vorlage`.

## PRÜFUNG UND ERGEBNIS
- `sicher.sh --json -- npx vitest run`: 174 Testdateien, 2271 Tests, alle grün.
- `sicher.sh --json -- npm run typecheck`: ohne Fehler.
- `sicher.sh --json -- npm run lint`: ohne Fehler.
- Kein Build, kein Server, kein git.

## BELEGE
- Suche aus Schritt 1 nach den Änderungen: verbleibende Treffer nur außerhalb der Schreibrechte (siehe offene Fragen), in seed.ts (Umbenennung, bleibt) und im neuen Test selbst.

## OFFENE FRAGEN
1. src/app/(site)/schluessel-einschicken/anmelden/page.tsx Zeile 53: Link „Foto prüfen lassen, ohne den Schlüssel aus der Hand zu geben“ sollte nach A-031 „Schlüssel prüfen lassen“ heißen; Datei liegt außerhalb der Schreibrechte.
2. src/lib/kundenstatus.ts Zeile 89: „nicht nach Ihren Fotos anfertigen“ suggeriert eine Fertigung nach Fotos; außerhalb der Schreibrechte.
3. src/lib/wege/nachweis.ts Zeile 8 (Kommentar) und src/app/(site)/schluessel-nach-vorlage/anfrage/beispiele.test.ts Zeile 36 (describe-Name) tragen noch „Schlüssel nach Foto“; nicht sichtbar, außerhalb der Schreibrechte.
4. Video und Bildtutorial zum richtigen Fotografieren (Abschnitt 12) sind nicht Teil dieses Pakets.
5. Der Hub zeigt jetzt elf statt zwölf Kacheln; das Raster wählt die Spalten über `hubRaster`, die Optik der letzten Zeile sollte im Browser gesichtet werden.
6. Das Intro in content/seo.json für `schluessel-nach-vorlage` blieb unverändert (nicht in den freigegebenen Feldern); es enthält kein „nach Foto“.

## Nachbesserung
Alle 13 Befunde am Code geprüft. Behoben, soweit die Datei in den Schreibrechten liegt:
- Befund 5: Ablaufschritt 4 endet jetzt in content/rubriken.json und src/lib/data/defaults/rubriken.ts gleich mit „... in der Freigabe. Während der Fotoanfrage senden Sie bitte nichts unaufgefordert ein.“
- Befund 6: Ablaufschritt 2 ist in beiden Dateien gleich in drei kurze Sätze geteilt: „Sie erhalten per E-Mail die Freigabe mit Preis und Weg. Gefertigt wird nach den Angaben auf dem Schlüssel oder am eingesendeten Original. Geht es nicht, erhalten Sie eine Rückfrage oder eine Absage.“
- Befund 7: In src/lib/mail/vorlagen/freigabe.ts sind die Gedankenstriche im Fließtext ersetzt: „... erteilt haben. Den Preis nennen wir Ihnen vorher.“, „... gelten nicht mehr. Bitte nutzen Sie diesen.“, „... etwas von Ihnen, etwa ein weiteres Foto oder eine Angabe.“ Der Halbgeviertstrich im Betreff vor der Vorgangsnummer blieb. Er ist der Trenner aller Kundenmails, auch in status.ts, vertragsbestaetigung.ts und dem Versandhinweis außerhalb dieses Pakets. Hier allein geändert, wären die Betreffzeilen uneinheitlich (siehe offene Frage N5). Die Spiegelstriche der Einsendeanweisung sind Aufzählungszeichen und blieben.
- Befund 8: src/app/(site)/bestellung/[id]/foto-ergebnis.tsx: „... in unserer E-Mail. Antworten Sie einfach darauf.“ und „... nach Ihrer Vorlage. Dafür besteht kein Widerrufsrecht (§ 312g Abs. 2 Nr. 1 BGB).“ Der Rechtshinweis ist nur geteilt, sein Inhalt bleibt unverändert (G9).
- Befund 9: Die Karte „Was der Sendung beiliegen soll“ auf /schluessel-nach-vorlage nennt jetzt „Der Begleitschein von Ihrer Vorgangsseite, alternativ ein Zettel mit Ihrer Vorgangsnummer, Ihrem Namen und Ihrer Telefonnummer.“ Das passt zum Absatz darüber und zur Freigabe-Mail, die den Zettel weiter nennt.
- Befund 11: Die erste FAQ-Antwort auf /schluessel-einschicken beginnt jetzt mit „Nicht unbedingt. Sie können ihn zuerst anhand von drei Fotos prüfen lassen, dann bleibt er vorerst bei Ihnen. Oder Sie schicken ihn gleich ein: ...“

Nicht in diesem Paket behoben, weil die Datei oder das Feld außerhalb der Schreibrechte liegt (Befunde treffen zu, als OFFENE FRAGE an den Orchestrator):
- N1 (Befunde 1 und 13): src/lib/kundenstatus.ts Zeile 89 „nicht nach Ihren Fotos anfertigen“. Vorschlag: „Nach unserer Prüfung können wir diesen Schlüssel leider nicht nach Ihrer Vorlage anfertigen. Einzelheiten stehen in unserer E-Mail.“ Folgepaket nötig.
- N2 (Befunde 2 und 13): src/app/(site)/schluessel-einschicken/anmelden/page.tsx Zeile 53, Linktext auf „Schlüssel prüfen lassen“ (A-031), bei Bedarf mit dem Satz „Ihr Schlüssel bleibt dabei zunächst bei Ihnen.“ Folgepaket nötig.
- N3 (Befunde 3 und 12): content/seo.json Zeile 288, Intro der Route `schluessel-einschicken`: „Oft genügen auch Fotos ...“ verspricht eine Fertigung nach Fotos. Vorschlag: „Sie können ihn auch zuerst anhand von drei Fotos prüfen lassen. Dann bleibt er vorerst bei Ihnen.“ Die Schreibrechte für seo.json decken nur den Eintrag `schluessel-nach-vorlage` und Verweis-Labels ab. Freigabe zur Erweiterung nötig. Das Feld wird vom Seed abgeglichen (`intro`), eine Änderung erreicht also auch die Datenbank.
- N4 (Befund 4): src/app/(site)/schluessel-nach-code/shop-liste.tsx Zeile 510 „Dort genügen Fotos Ihres Schlüssels.“ Vorschlag: „Dort lassen Sie ihn anhand von Fotos prüfen oder schicken ihn ein.“ Folgepaket nötig.
- N5 (zu Befund 7): Einheitlicher Betreff-Trenner aller Kundenmails (Halbgeviertstrich vor der Vorgangsnummer) gegen Doppelpunkt tauschen? Betrifft freigabe.ts, status.ts, vertragsbestaetigung.ts und die Erwartungen in freigabe.test.ts, vorgang-benachrichtigen.test.ts und einsenden.test.ts. Nur gemeinsam sinnvoll.
- N6 (Befund 10): `imHub: false` für `schluessel-einschicken` steht nur in den Rückfalldaten. Der Seed-Abgleich der Rubriken (src/payload/seed.ts Zeile 515 bis 520) gleicht `imHub` nicht ab, und die Datenmigration 20261115_120000_rubrik_nach_vorlage ändert nur die Kennung. In einer bereits gesäten Payload-Datenbank bleibt `imHub` deshalb true, und getHubRubriken zeigt dort weiter zwei Kacheln. Die Aussage „ein Hauptzugang, elf Kacheln“ gilt also nur für die Rückfalldaten und frisch gesäte Datenbanken. Vorschlag: additive, idempotente Datenmigration (`UPDATE "rubriken" SET "im_hub" = false WHERE "kennung" = 'schluessel-einschicken'`, Spaltennamen vorher im Schema prüfen) oder `{ pfad: 'imHub' }` in den Seed-Abgleich aufnehmen. Beides außerhalb dieses Pakets.
- N7: src/lib/wege/naechste-schritte.ts Zeile 60 trägt noch die alte Satzform „eine Rückfrage oder, wenn es nicht geht, eine Absage“. Inhaltlich korrekt, aber außerhalb der Schreibrechte.

Prüfung nach der Nachbesserung (über die Datenweiche):
- `sicher.sh --json -- npx vitest run`: 174 Testdateien, 2271 Tests, alle grün. Keine Testerwartung musste geändert werden.
- `sicher.sh --json -- npm run typecheck`: ohne Fehler.
- `sicher.sh --json -- npm run lint`: ohne Fehler.
- Kein Build, kein Server, kein git.
