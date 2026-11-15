# Bericht FA-INHALT-03A · Texte menschlicher: sieben Leistungsseiten Autoschlüssel

## GEÄNDERTE DATEIEN
- `src/app/(site)/autoschluessel/nachmachen/page.tsx`
- `src/app/(site)/autoschluessel/programmieren/page.tsx`
- `src/app/(site)/autoschluessel/kopieren/page.tsx`
- `src/app/(site)/autoschluessel/funkschluessel/page.tsx`
- `src/app/(site)/autoschluessel/smart-key/page.tsx`
- `src/app/(site)/autoschluessel/schluesselbart-fraesen/page.tsx`
- `src/app/(site)/autoschluessel/fahrzeugoeffnung/page.tsx`
- `content/seo.json` (nur `headline`, `subline`, `intro` der sieben Routen; `faq` bleibt leer, `seo.*` unberührt)
- `src/lib/data/defaults/content.ts` (dieselben Felder, jetzt wortgleich mit `seo.json`; vorher wichen die Intros leicht ab)
- `content/car-key-services.json` und `src/lib/data/defaults/pricing.ts` (nur `description` der sechs Leistungen, wortgleich)
- dieser Bericht

Nicht berührt: SEO-Titel und -Beschreibungen (auch die Rückfallwerte in `generateMetadata`, sie tragen noch Gedankenstriche, Regel 5), Bildstellen (`motif`, `ratio`, `note`), Komponenten, Preise, Kennungen, Links, `ON_SITE_HINT` (liegt in `src/components`), der Hinweiskasten „Ohne Nachweis keine Öffnung“ (Ton `legal`, wörtlich belassen) und der Aufbewahrungshinweis auf „Nachmachen“.

## WAS UND WARUM
- Kopf jeder Seite: eine Aussage, was wir tun („Wir fertigen…“, „Wir fräsen…“, „Wir öffnen…“), dann höchstens drei bis vier kurze Sätze.
- Abschnitt „Was ist das“ heißt überall „So läuft es ab“. Überschriften als Aussagen statt Fragen („Wann Sie das brauchen“, „Was nicht dazugehört“). Keine Gedankenstriche, keine Fragen im Fließtext außerhalb der FAQ.
- Doppelte Punkte gestrichen oder zusammengelegt (z. B. Reichweite in „Tasten reagieren“, Zubehör in „nur aufschließen“, verlorener Schlüssel nur noch einmal je Seite). Jede gestrichene Aussage steht an anderer Stelle derselben Seite oder auf der verlinkten Seite.
- Fachwörter beim ersten Auftreten mit Halbsatz erklärt: Bart, Rohling, Transponder, Wegfahrsperre, Steuergerät, Diagnoseschnittstelle, Smart Key, Keyless, zerstörungsfrei.
- Berechtigungsnachweis (R13) steht auf allen sieben Seiten als eigener Punkt „Ihr Nachweis beim Termin“: Ausweis und Fahrzeugschein, bei fremdem Halter eine Vollmacht des Halters. Auf „Smart Key“ fehlte er bisher als eigener Punkt (nur Foto des Fahrzeugscheins); jetzt ergänzt mit dem Satz aus „Nachmachen“ („Ohne diesen Nachweis …“). Fahrzeugöffnung behält Ausweis, Fahrzeugschein, Halterbestätigung für Leasing und Firma, Hinweiskasten und Prüfungsvermerk.
- Hauptknopf nach A-031: alle Knöpfe zu `/autoschluessel/anfrage` heißen „Termin anfragen“ (vorher „Fahrzeug auswählen“, „Termin mit Fahrzeug starten“). Fahrzeugöffnung behält „Fahrzeugöffnung anfragen“ und den Weg über `/service-und-termin/anfrage?thema=fahrzeugoeffnung`. „Erst Fahrzeug nachschlagen“ heißt wie auf den anderen Seiten „Fahrzeug nachschlagen“.
- Anzahlung, Vorlauf, Termindauer und Aufbewahrungsfristen nur über die vorhandenen Werte aus den Einstellungen (`deposit`, `leadDays`, `slot`, `retentionDays`). Keine Zeit- oder Erreichbarkeitsaussage neu.
- Fahrzeugöffnung: keine Aussage zu Notdienst, Anfahrt oder Einsatzgebiet; Weg und Knöpfe unverändert.
- Linktext „Autoschlüssel verloren — was tun?“ ohne Gedankenstrich: „Autoschlüssel verloren“ mit Beschreibung „Was Sie jetzt in welcher Reihenfolge tun“.
- Kurztexte der Leistungen als ganze Sätze („Alle Schlüssel sind verloren oder beschädigt. Wir prüfen vorab Umfang und Machbarkeit.“). Der Seed übernimmt sie nur, wo der Betrieb den Text nicht geändert hat (Schnappschuss `content/startwerte/2026-10-25/`).
- Kleinigkeiten: Titel „Schlüssel- oder Schlüsselnummer“ (Doppelung) heißt „Schlüsselnummer, falls vorhanden“.

## ZAHLEN VORHER UND NACHHER
`stil.mjs` misst den gerenderten Text im Browser und braucht den Server. Das Paket verbietet den Server, deshalb wurde es nicht gestartet. Gemessen wurde mit einer Heuristik über den Quelltext: alle sichtbaren Zeichenketten der Seite (Kopftexte aus `seo.json`, Abschnitte, Hinweise in den Info-Knöpfen, FAQ, Knöpfe, Brotkrumen, Linktexte, Bildvermerke) ohne SEO-Felder. Sätze unter vier Wörtern sind nicht mitgezählt. Die Zahlen sind deshalb nur untereinander vergleichbar, nicht mit `SLOP-AUDIT.md`.

| Seite | Wörter vorher → nachher | Satzlänge Mittel | längster Satz | Sätze > 25 Wörter | Gedankenstriche | offene Stellen |
|---|---|---|---|---|---|---|
| nachmachen | 848 → 763 | 9,3 → 8,1 | 23 → 18 | 0 → 0 | 8 → 0 | Vollmacht (s. u.) |
| programmieren | 859 → 783 | 9,1 → 7,6 | 24 → 17 | 0 → 0 | 5 → 0 | Vollmacht |
| kopieren | 811 → 726 | 9,2 → 8,0 | 19 → 18 | 0 → 0 | 3 → 0 | Vollmacht, abgenutzter Bart |
| funkschluessel | 754 → 694 | 9,1 → 8,3 | 25 → 14 | 0 → 0 | 6 → 0 | Vollmacht |
| smart-key | 836 → 819 | 9,4 → 8,5 | 26 → 16 | 2 → 0 | 5 → 0 | Nachweis neu als Punkt |
| schluesselbart-fraesen | 716 → 730 | 8,4 → 8,2 | 19 → 15 | 0 → 0 | 5 → 0 | Vollmacht |
| fahrzeugoeffnung | 785 → 759 | 9,1 → 9,0 | 23 → 20 | 0 → 0 | 5 → 0 | Erreichbarkeit (s. u.) |

Die Wortzahl sinkt nur um 2 bis 10 Prozent; auf „Schlüsselbart fräsen“ steigt sie leicht. Neu hinzugekommen sind die Begriffserklärungen und der vollständige Nachweis (R13) auf jeder Seite. Gewonnen ist vor allem bei der Satzlänge: kein Satz über 20 Wörtern, Gedankenstriche von 37 auf 0. Der längste Satz auf „Fahrzeugöffnung“ (20 Wörter) steht im unveränderten Hinweiskasten. Ohne die konstanten Teile (Brotkrumen, Linkliste, Bildvermerke) ist der Rückgang beim eigentlichen Lesetext größer. Diese Teile wurden nicht getrennt gemessen.

Gegenlesen: Diese Teilaufgabe hatte kein Werkzeug, um unabhängige Agenten zu starten. Die zwei Lesungen aus dem Ablauf (älterer Kunde ohne Fachwissen; Tatsachen gegen die alte Fassung) habe ich selbst in zwei getrennten Durchgängen gemacht. Daraus eingearbeitet: „Platine“ im Kopf von „Funkschlüssel“ durch „Elektronik“ ersetzt; doppelte Punkte gestrichen (siehe oben); im Tatsachenabgleich jede gestrichene Aussage gesucht und an anderer Stelle gefunden. Die alte Fassung liegt zum Vergleich im Scratchpad, ohne git. Ein Gegenlesen durch zwei unabhängige Agenten steht noch aus (OFFENE FRAGE).

## SCHLUSSREDAKTION (Liste für den Menschen)
**Nachmachen**
1. „Steht das Fahrzeug nicht auf Ihren Namen, brauchen wir zusätzlich eine Vollmacht des Halters.“ Neu, belegt nur durch FACHWISSEN §8 (Firmenfahrzeuge, gelb) und die Paketvorgabe. Stimmt das für Privatleute mit geliehenem Fahrzeug?
2. „Am günstigsten ist ein neuer Schlüssel, solange noch einer funktioniert.“ So stand es schon im Bestand. Bitte die Aussage zum Preis bestätigen.
3. „Passt er nicht, bleibt der Aufwand für die Prüfung trotzdem.“ Klingt nach einer Gebühr. Ist das so gemeint und durch die Preisregeln gedeckt?

**Programmieren**
1. „Bei einigen älteren Fahrzeugen geht das ohne Gerät.“ Die Aussage stammt aus dem Bestand und hat keine Quelle.
2. „Die Fahrzeugbatterie muss genug Spannung haben.“ (alt: „nutzbare Bordspannung“): fachlich richtig verkürzt?
3. Hinweis „Funk und Wegfahrsperre … Beides wird getrennt angelernt“: gilt das für alle Systeme, die der Betrieb bedient?

**Kopieren**
1. „Bei neueren Fahrzeugen ist eine elektronische Wegfahrsperre die Regel.“ Soll hier eine Jahreszahl stehen? Es gibt keinen Beleg dafür. Deshalb steht keine Zahl da.
2. Unter „Wann eine Kopie reicht“ steht „Der Originalbart ist abgenutzt“, unter „Was eine Kopie nicht kann“ steht „stark abgenutzte Vorlage“. Wo genau liegt die Grenze?
3. Nachweis „beim Termin oder bei der Abholung“: Gibt es bei reinen Kopien wirklich keinen Termin?

**Funkschlüssel**
1. „Bei den meisten Fahrzeugen bleibt die Programmierung beim Batteriewechsel erhalten.“ Die Aussage stammt aus dem Bestand und hat keine Quelle.
2. „Für Arbeiten an Gehäuse und Tasten geht das [Einschicken] in vielen Fällen.“ Bietet der Betrieb Versand für Funkschlüssel an?
3. „Dann haben wir die passende Batterie vorrätig.“ Stimmt der Ablauf für reinen Batteriewechsel so?

**Smart Key**
1. Neuer Punkt „Ihr Nachweis beim Termin“ mit „Ohne diesen Nachweis lernen wir keinen Schlüssel an.“ Bitte bestätigen.
2. „Rechnen Sie mit mindestens {Vorlauf} Tagen“: Ist der allgemeine Vorlauf aus den Einstellungen hier wirklich die Untergrenze?
3. „Viele Fahrzeuge … haben eine Ersatzposition zum Starten.“ Die Aussage stammt aus dem Bestand und hat keine Quelle.

**Schlüsselbart fräsen**
1. „Als Vorlage dient … geeignete Fahrzeugdaten.“ Woher kommen diese Daten, und dürfen wir das so zusagen (vgl. FACHWISSEN §8, Herstellerzugang)?
2. „Auch Dachbox, Anhängerkupplung oder Werkzeugkasten …“: Fräst der Betrieb diese Schlüssel über diesen Weg?
3. „Für reine Fräsarbeiten geht das [Einschicken] in vielen Fällen.“ Bitte den Versandweg bestätigen.

**Fahrzeugöffnung**
1. Der Punkt „Das Fahrzeug steht bei uns … öffnen wir es in unserem Betrieb“ ist in der Nachbesserung gestrichen (Widerspruch zu `src/lib/terminort.ts`). Siehe OFFENE FRAGEN.
2. Halterbestätigung bei Leasing und Firma (im Kasten, in der Liste und in der FAQ): Bitte die genaue Form nennen (Vollmacht, Schreiben, Mietvertrag).
3. „Wir arbeiten zerstörungsfrei“ als feste Aussage im Kopf. Die Einschränkung („ob das gelingt, sehen wir vor Ort“) steht erst weiter unten. Reicht das so?

## OFFENE FRAGEN
- OFFENE FRAGE: „Vollmacht des Halters“ bei fremdem Halter steht jetzt auf allen sieben Seiten (nach der Nachbesserung auch auf „Fahrzeugöffnung“). Der Bestand trägt die Vollmacht bereits als Berechtigungsnachweis: `src/lib/rubriken.ts:55` („Fahrzeugschein auf den Besteller oder Vollmacht“), Unterlagenart `vollmacht` in `src/payload/collections/Kundendateien.ts:44` und `src/lib/server/unterlagen-pflicht.ts:50`. Offen ist nur der genaue Wortlaut für Privatleute mit geliehenem Fahrzeug: Reicht eine formlose schriftliche Bestätigung des Halters, oder muss es eine Vollmacht sein (R4, R13)?
- OFFENE FRAGE: Fahrzeugöffnung, Ort der Arbeit. Der Punkt „Das Fahrzeug steht bei uns“ („öffnen wir es in unserem Betrieb“) ist gestrichen, weil `src/lib/terminort.ts` (`LEISTUNGEN_BEIM_KUNDEN`, `BEIM_KUNDEN_HINWEIS`) die Öffnung als Leistung beim Fahrzeug des Kunden festlegt. Öffnet der Betrieb auch Fahrzeuge, die gebracht werden? Wenn ja, bitte den Satz freigeben; dann gehört er auch in `terminort.ts`.
- OFFENE FRAGE (Folgepunkt, außerhalb der Schreibrechte): In „Passend dazu“ steht derselbe Link zu `/autoschluessel/anfrage` mit anderem Text als der Hauptknopf „Termin anfragen“: „Anfrage starten“ auf Nachmachen, Funkschlüssel und Smart Key (`content/seo.json` Felder `seo.internalLinks`, Zeilen 76, 157, 184; `src/lib/data/defaults/content.ts:69, 117, 134`), „Termin mit Fahrzeug buchen“ auf Programmieren (`seo.json:103`, `content.ts:84`). `ServiceArticle` stellt `seo.internalLinks` vor `related` (`service-article.tsx:86`). Das widerspricht A-031. Vorschlag: in FA-SEO-01 oder einem kleinen eigenen Paket diese Labels auf „Termin anfragen“ setzen.
- OFFENE FRAGE: Fahrzeugöffnung, FAQ „Wie erreiche ich Sie?“ verweist weiter nur auf die Kontaktseite. Die Standard-Erreichbarkeit aus `erreichbarkeit(settings)` enthält „Notdienst rund um die Uhr“. Ohne Freigabe würde das auf dieser Seite einen Notdienst für Öffnungen versprechen. Deshalb nicht eingebunden. Soll der Satz aus den Einstellungen hier erscheinen?
- OFFENE FRAGE: Die Komponente `ServiceArticle` gibt sechs Abschnitte fest vor (Was, Wann, Brauchen, Abgrenzung, Fragen, nächster Schritt). Die Paketvorgabe nennt höchstens vier. Die Abschnitte sind gekürzt, aber nicht entfernt, weil die Komponente gesperrt ist. Ein eigener Abschnitt „Was es kostet“ ist nicht möglich. Die Preisaussage steht daher im Ablauf und in der FAQ. Für eine Umstellung braucht es ein Folgepaket mit Schreibrecht auf `src/components/autoschluessel/service-article.tsx`.
- OFFENE FRAGE: Die Rückfall-Metadaten in den Seiten (`generateMetadata`, z. B. „Autoschlüssel nachmachen — Zweit- und Ersatzschlüssel“) und `title`/`description` in `content.ts` tragen weiter Gedankenstriche. Sie gehören zu FA-SEO-01. Der Plan nennt dieses Paket nicht.
- OFFENE FRAGE: Gegenlesen durch zwei unabhängige Agenten (Haiku als Laie, Opus für Tatsachen) gegen den git diff. Der Orchestrator sollte es nachholen. Ebenso eine Messung mit `stil.mjs` bei laufendem Server.
- `ON_SITE_HINT` in `src/components/autoschluessel/key-kinds.tsx` wird auf vier dieser Seiten gezeigt und ist noch nicht überarbeitet (Komponente gesperrt).

## PRÜFUNG
Über die Datenweiche (`sicher.sh --json`):
- `npx vitest run`: 182 Testdateien, 2365 Tests, alle bestanden.
- `npm run typecheck`: ohne Fehler.
- `npm run lint`: ohne Fehler.
- Zusatz: `seo.json` und `content.ts` sind für die sieben Routen in `headline`, `subline` und `intro` wortgleich (0 Abweichungen). `car-key-services.json` und `pricing.ts` sind in `description` wortgleich.
- Kein Build, kein Server, kein git, keine `--pg`-Befehle.

## NACHBESSERUNG
Befunde der zwei Gegenprüfer, je Befund am Code geprüft.

1. `seo.json:95` Intro „Programmieren“ beginnt mit „Dafür“ ohne Bezug: **behoben.** Das Intro steht in `service-article.tsx:108` als erster Absatz unter der Abschnittsüberschrift, nicht neben der Unterzeile. Neu an allen drei Stellen (`seo.json`, `content.ts`, Rückfall der Seite): „Zum Anlernen brauchen wir in aller Regel Ihr Fahrzeug. Per Versand lässt sich das nicht lösen.“
2. Fahrzeugöffnung „öffnen wir es in unserem Betrieb“: **behoben.** Der Punkt „Das Fahrzeug steht bei uns“ ist gestrichen, weil `src/lib/terminort.ts:25` und `:38` die Öffnung beim Fahrzeug des Kunden festlegen. Die Frage nach dem Ort steht als OFFENE FRAGE oben, der Punkt in der Schlussredaktion verweist darauf.
3. Nachweis auf „Fahrzeugöffnung“ nur für Leasing und Firma: **behoben.** Listenpunkt „Fahrzeugschein“ jetzt: „Steht das Fahrzeug nicht auf Ihren Namen, brauchen wir zusätzlich eine Vollmacht oder Bestätigung des Halters. Das gilt auch für Leasing- und Firmenfahrzeuge.“ Der Hinweiskasten mit Ton `legal` und die FAQ bleiben wörtlich; sie werden erst nach Freigabe angeglichen.
4. Smart Key „öffnen sich die Türen“: **behoben.** Jetzt: „Ist der Schlüssel in der Nähe, lassen sich die Türen öffnen und der Motor per Knopf starten.“
5. Kopieren „Genau das soll die Wegfahrsperre verhindern“: **behoben.** Jetzt: „Die Elektronik wird nicht mitkopiert. Deshalb startet die Kopie den Motor oft nicht. Das ist kein Fehler, so soll die Wegfahrsperre wirken.“ („oft“, weil die Seite Fahrzeuge ohne Wegfahrsperre ausdrücklich nennt.)
6. Kopieren, Zubehör unter „nur aufschließen“: **behoben.** Getrennt: „… oder als Reserve für den Notfall. Zubehör wie Dachbox oder Anhängerkupplung hat oft eigene Schlösser. Auch diese Schlüssel kopieren wir.“ Keine Aussage zu Elektronik im Zubehör, weil der Bestand sie nicht trägt.
7. Überschrift „So läuft es ab“ ohne Ablauf darunter: **behoben.** Auf Nachmachen, Programmieren, Kopieren, Funkschlüssel, Smart Key und Fahrzeugöffnung heißt der Abschnitt jetzt „Was wir machen“, weil darunter Erklärung und Leistung stehen. Auf „Schlüsselbart fräsen“ bleibt „So läuft es ab“; dort beschreiben die Absätze tatsächlich die Schritte (einspannen, fräsen, Vorlage, Elektronik).
8. Linktexte in „Passend dazu“ (`seo.internalLinks`): **zutreffend, nicht im Paket behebbar.** Das Feld liegt außerhalb der Schreibrechte (nur `headline`, `subline`, `intro`, `faq`). Als OFFENE FRAGE mit Fundstellen und Folgepaket-Vorschlag aufgenommen.
9. Abgehackte Sätze „Und was …“ / „Und unter welcher Nummer …“: **behoben.** Smart Key: „Wir prüfen, ob sich der verlorene Schlüssel aus dem Fahrzeug entfernen lässt und was ein Ersatz erfordert.“ Fahrzeugöffnung: „Sagen Sie uns, wo das Fahrzeug steht und unter welcher Nummer wir Sie erreichen.“
10. OFFENE FRAGE zur Vollmacht klingt unsicherer als der Bestand: **behoben.** Die Frage nennt jetzt die Belege im Code (`rubriken.ts:55`, `Kundendateien.ts:44`, `unterlagen-pflicht.ts:50`) und ist auf den Wortlaut für Privatleute begrenzt.
11. wie 1: **behoben** (dieselbe Änderung).
12. wie 5: **behoben** (dieselbe Änderung).
13. wie 9 (Smart Key): **behoben** (dieselbe Änderung).
14. wie 9 (Fahrzeugöffnung): **behoben** (dieselbe Änderung).
15. „Ihr fehlt der Transponder“ liest sich als Anrede: **behoben.** „Der Kopie fehlt der Transponder, ein kleiner Chip im Schlüssel.“ in `seo.json`, `content.ts` und dem Rückfall der Seite.
16. Kurztext Fahrzeugöffnung zu eng: **behoben.** `car-key-services.json` und `pricing.ts` wortgleich: „Wir öffnen Ihr Fahrzeug zerstörungsfrei, wenn Sie ausgesperrt sind.“ Die Unterzeile der Seite hatte dieselbe Enge („wenn der Schlüssel darin liegt“) und heißt jetzt in `seo.json`, `content.ts` und Rückfall gleich: „Wir öffnen Ihr Fahrzeug, wenn Sie ausgesperrt sind.“

Prüfung nach der Nachbesserung über die Datenweiche (`sicher.sh --json`): `npx vitest run` 183 Testdateien, 2372 Tests, alle bestanden; `npm run typecheck` ohne Fehler; `npm run lint` ohne Fehler. Abgleich `seo.json` gegen `content.ts` (headline, subline, intro der sieben Routen) und `car-key-services.json` gegen `pricing.ts` (description): 0 Abweichungen. Kein Build, kein Server, kein git.

=== ENDE FA-INHALT-03A · BERICHT ===
