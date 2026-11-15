# Bericht FA-INHALT-03B · Texte menschlicher: Leistungsseiten Sicherheitstechnik und Tür- und Schließtechnik

## GEÄNDERTE DATEIEN
- `content/service-pages.json` (nur `summary` und `bullets` der 17 Leistungen)
- `src/lib/data/defaults/service-pages.ts` (dieselben Texte, wortgleich; die SEO-Beschreibung steht jetzt als eigenes fünftes Feld je Eintrag, weil sie vorher aus `summary` abgeleitet wurde und sonst mitgewandert wäre)
- `src/app/(site)/tuer-und-schliesstechnik/page.tsx` (nur feste Texte)
- `src/app/(site)/tuer-und-schliesstechnik/[slug]/page.tsx` (ein Linktext)
- `src/app/(site)/sicherheitstechnik/page.tsx` (nur feste Texte)
- `src/lib/data/defaults/service-pages.test.ts` (neu)
- dieser Bericht

Nicht berührt: `seo.title`, `seo.description`, Titel der Leistungen, `ctaHref`, `ctaLabel`, Bildstellen (`motif`, `ratio`, `note`), `rechtshinweis-ton.ts`, der Kasten „Recht und Verantwortung“ auf den Leistungsseiten (wörtlich), `content/seo.json`, `content.ts`, Navigation, Sicherheitscheck, Rückfall-Metadaten in `generateMetadata` (SEO), Code-Kommentare.

## WAS UND WARUM
**Leistungsseiten (17, Daten):**
- Kurztext oben jetzt als ein bis zwei ganze Sätze mit „Wir …“: was wir tun und woran (z. B. „Wir tauschen Einsteckschlösser an Zimmer-, Wohnungs- und Haustüren aus und passen sie an.“). Vorher oft Satzfragmente („Kontrolliertes Schließen von …“) oder Gedankenstriche.
- Die vier Punkte je Seite bleiben vier; Nominalketten aufgelöst („Reparatur klemmender oder defekter Schlösser“ → „Reparatur, wenn das Schloss klemmt oder defekt ist“). Fachwörter mit Halbsatz erklärt: Außenhaut, Bandseite, Kernziehschutz, Zylinderüberstand, Endschlag, Gewerk, gleichschließend.
- „im passenden Leistungsrahmen“ (unklar) heißt jetzt „im Rahmen unserer Leistungen“ (Inhalt gleich, siehe Schlussredaktion).
- Keine Titeländerung (kein Titel trug einen Gedankenstrich). Knöpfe unverändert („Anfrage starten“, „Sicherheitscheck starten“).

**Bereichsseite Tür- und Schließtechnik:**
- Entfernt, weil nicht belegt (R4, R9, Paketvorgabe zu Normen): Empfehlung „mindestens RC2, bei erhöhtem Schutzbedarf RC3“ und „DIN EN 1627“; „strenge gesetzliche Normen (EN 179 … EN 1125 …)“ in der FAQ; „Wir sind zertifiziert … nach DIN EN 179 und DIN EN 1125“ (ohne Nachweis im Bestand; `Nachweise.ts` verlangt für „zertifiziert“ einen Nachweis); „eine der häufigsten Einbruchmethoden“ (Zahl ohne Quelle); „T30“. Alles steht unter OFFENE FRAGEN.
- Der Punkt „Widerstandsklassen (RC)“ ist ersetzt durch „Schloss und Schließblech“ (Aussage aus dem Fließtext derselben Seite). „Zieh- und Bohrschutz … verhindern“ heißt „Ziehschutz … erschweren“ (ehrlicher, die Beschreibung nannte nur Kernziehen).
- Werbesprache ersetzt: „Ganzheitliche …“, „Architektur der Sicherheit“, „Technische Spezialisierung“, „Kernkompetenzen … Präzise Handwerkskunst trifft auf modernste Sicherheitstechnik“, „Regulatorik“, „höchste fachliche Expertise“, „Systemerweiterungen / Gewerkeübergreifende Lösungen“, „Ideal für“, „Die flexible Alternative“, „transparente Aufklärung … komplexesten Fragen“.
- FAQ: gleiche fünf Fragen, gleiche Kernaussagen, kurze Sätze. Längster Satz vorher 31 Wörter, jetzt 20. Die FAQ ist zugleich die Strukturdatenquelle (R8: Sichtbares und Strukturdaten bleiben gleich).
- Knopf im Kopf „Beratungstermin vereinbaren“ heißt „Anfrage starten“ wie auf allen Leistungsseiten mit demselben Ziel (A-031). Das Ziel ist eine Anfrage, kein fester Termin.
- Rückfalltitel und -untertitel im Kopf (nur sichtbar ohne Daten) an `content.ts` angeglichen.

**Bereichsseite Sicherheitstechnik:**
- Gedankenstriche aus den drei Grundsatz-Texten und zwei Punkten des Rechtskastens entfernt (dort nur Satzzeichen getauscht, Wortlaut gleich). Der Satz zur verdeckten Audioüberwachung und `HINWEIS_TON_UND_AUFZEICHNUNG` sind wörtlich unverändert; ein neuer Test hält den Satz auf beiden Seiten fest.
- „Sieben Bereiche, die zusammen gedacht werden“ (feste Zahl, Floskel „Stückwerk“) heißt „Die Bereiche im Einzelnen“.
- Zweiter Knopf zum Sicherheitscheck hieß „Bestandsaufnahme starten“, jetzt „Sicherheitscheck starten“ wie der Kopfknopf (A-031).

**Vorlage Tür-Leistungsseite:** „Leistungsdetails“ heißt „Ansehen“ wie in der Sicherheitstechnik.

**Neuer Test** `service-pages.test.ts`: JSON und Rückfall gleich (alle 17, vorher nur eine Seite geprüft); `seo.description` und Titel gleich den Startwerten 2026-10-25 (Ausnahme: der bereits umbenannte Titel „Smart-Home-Sicherheitsfunktionen“); keine Gedankenstriche, kein Satz über 25 Wörter, Kurztext höchstens zwei Sätze, höchstens vier Punkte; Audiosatz wörtlich vorhanden.

Seed: `zusammenfassung` und `stichpunkte` stehen im Startwert-Abgleich. Der Seed übernimmt die neuen Texte nur, wo der Betrieb sie im Backend nicht geändert hat.

## ZAHLEN VORHER UND NACHHER
`stil.mjs` misst gerenderte Seiten und braucht den Server; das Paket verbietet ihn. Gemessen mit einer Heuristik über den Quelltext (Titel, Kurztext, Punkte, Knopftext je Leistung; alle sichtbaren Zeichenketten der Seitendateien ohne SEO-Felder und Bildvermerke). Sätze unter vier Wörtern zählen nicht. Die Leistungsseiten zeigen zusätzlich den Ablaufkasten, „Weitere Bereiche“, „Passende Seiten“ und auf fünf Sicherheitsseiten den Rechtskasten; diese Teile stecken in der Zeile „Vorlage“.

| Seite | Wörter vorher → nachher | Satzlänge Mittel | längster Satz | > 25 Wörter | Gedankenstriche | offene Stellen |
|---|---|---|---|---|---|---|
| Profilzylinder und Spezialzylinder | 41 → 50 | 7,2 → 7,5 | 15 → 12 | 0 | 1 → 0 | SEO-Beschreibung trägt weiter „—“ |
| Einsteckschlösser | 35 → 60 | 6,4 → 9,5 | 10 → 13 | 0 | 0 | Maße nicht erklärt |
| Mehrfachverriegelungen | 29 → 50 | 5,8 → 7,8 | 8 → 15 | 0 | 0 | |
| Schutzbeschläge | 32 → 56 | 5,8 → 8,8 | 9 → 11 | 0 | 0 | |
| Türzusatzschlösser | 28 → 43 | 6,3 → 7,4 | 10 → 9 | 0 | 0 | Montage nur allgemein belegt |
| Türschließer | 31 → 53 | 6,3 → 9,4 | 8 → 15 | 0 | 0 | „Leistungsrahmen“ |
| Panik- und Fluchttürtechnik | 47 → 60 | 8,4 → 9,2 | 13 → 12 | 0 | 0 | Normen (s. u.) |
| Reparatur und Austausch | 41 → 54 | 6,5 → 7,4 | 11 → 14 | 0 | 0 | |
| Technische Beratung | 37 → 45 | 6,4 → 7,2 | 12 → 16 | 0 | 0 | |
| Montage und Anpassung | 32 → 42 | 6,0 → 6,8 | 9 → 13 | 0 | 1 → 0 | SEO-Beschreibung trägt weiter „—“ |
| Videoüberwachung | 41 → 53 | 7,6 → 8,3 | 10 → 11 | 0 | 0 | |
| Alarmtechnik | 30 → 44 | 6,0 → 7,6 | 9 → 12 | 0 | 0 | |
| Sicherung der Außenhaut | 32 → 46 | 6,0 → 7,6 | 11 → 13 | 0 | 0 | |
| Mechanischer Schutz | 29 → 47 | 5,3 → 8,0 | 6 → 12 | 0 | 0 | „Rahmen“ bei Gittern |
| Smart-Home-Sicherheitsfunktionen | 21 → 40 | 5,0 → 8,0 | 6 → 13 | 0 | 0 | |
| Panik- und Alarmtaster | 33 → 49 | 6,5 → 7,3 | 11 → 12 | 0 | 0 | |
| Kombinierte Sicherheitskonzepte | 26 → 36 | 5,7 → 7,3 | 9 → 12 | 0 | 0 | |
| Bereich Tür- und Schließtechnik | 941 → 817 | 12,4 → 9,0 | 31 → 20 | 2 → 0 | 5 → 0 | Normen, Pflege |
| Bereich Sicherheitstechnik | 335 → 326 | 10,9 → 11,0 | 23 → 23 | 0 | 4 → 0 | Rechtskasten nur Satzzeichen |
| Vorlage Leistungsseite Tür | 13 → 13 | | | 0 | 0 | |
| Vorlage Leistungsseite Sicherheit | 76 → 76 | 9,1 | 18 | 0 | 0 | Rechtskasten wörtlich |

Die Leistungsdaten werden länger, weil sie vorher fast nur aus Stichworten bestanden. Die Paketvorgabe verlangt oben ein bis zwei Sätze „was wir tun und für wen“ und Fachwörter mit Erklärung; beides kostet Wörter. Auf der Seite bleibt es bei 40 bis 60 Wörtern eigener Text. Die Bereichsseite Tür verliert 13 Prozent, die langen Sätze und alle Gedankenstriche. Der längste Satz der Sicherheitsseite (23 Wörter) steht im Rechtskasten und blieb wörtlich.

Gegenlesen: Diese Teilaufgabe hatte kein Werkzeug, um unabhängige Agenten zu starten, und kein git. Die alte Fassung liegt zum Vergleich im Scratchpad. Die zwei Lesungen (älterer Kunde ohne Fachwissen; Tatsachen gegen die alte Fassung und die Belege) habe ich selbst in zwei getrennten Durchgängen gemacht. Eingearbeitet: Fragen im Fließtext vermieden („Klemmt der Schlüssel, …, suchen wir den Fehler.“ statt rhetorischer Frage), doppelte Aussagen zwischen Kurztext und Punkten gestrichen (Video, Reparatur, Beratung), jede neue Aussage gegen Bestand belegt („montieren“: Rechtskasten „Wir liefern und montieren die Technik“; „Einsteckschloss bewegt den Riegel“: Fließtext der Bereichsseite; „bewohnt wirken“: Erklärung von Anwesenheitssimulation). Ein Gegenlesen durch zwei unabhängige Agenten steht noch aus (OFFENE FRAGE).

## SCHLUSSREDAKTION (Liste für den Menschen)
**Profilzylinder und Spezialzylinder**
1. „Zylinder in der Länge, die zur Stärke Ihrer Tür passt“ (alt: „nach Maß für Ihre Türstärke“): fachlich richtig verkürzt?
2. „Auf Wunsch schließen mehrere Türen mit demselben Schlüssel“ (alt: „Umstellung auf gleichschließende Lösungen möglich“): Ist das Angebot so gemeint?
3. „Sonderbauformen für Möbel, Technik und Außenanlagen“: Welche bietet der Betrieb wirklich an?

**Einsteckschlösser**
1. „Dornmaß, Entfernung und Stulpmaß“ sind nicht erklärt. Ein Halbsatz für Laien wäre gut.
2. „Wechselgarnitur“ ist nicht erklärt.
3. „Das Einsteckschloss sitzt in der Tür und bewegt den Riegel.“ Reicht diese Erklärung?

**Mehrfachverriegelungen**
1. „Nachrüstung, wenn Ihre Tür dafür geeignet ist“: Woran erkennt der Kunde das? Soll ein Hinweis auf die Beratung stehen?
2. „Falle, Riegel und Bolzen“ ohne Erklärung.
3. Kurztext nennt „Haus- und Wohnungseingangstüren“. Auch Nebentüren?

**Schutzbeschläge**
1. Kernziehschutz „erschwert das Herausziehen des Zylinderkerns“: fachlich korrekt?
2. „montieren ihn bei Ihnen“: Immer vor Ort?
3. „Angriffe von außen“ (alt: „mechanische Angriffe“): passend?

**Türzusatzschlösser**
1. „verriegelt Ihre Tür ein zweites Mal“: Bei Querriegelschlössern stimmt das bildlich. Für Kastenzusatzschlösser auch?
2. „Geeignet für Wohnungstüren und Nebentüren“: Nicht für Haustüren?
3. Montage ist nur über den Bereich belegt („Beratung, Montage und Reparatur“).

**Türschließer**
1. „im Rahmen unserer Leistungen“ für Flucht- und Rauchschutztüren: Was genau darf der Betrieb dort tun?
2. „Endschlag, dem letzten Stück vor dem Schloss“: richtig erklärt?
3. „Objekttüren“: verständlich genug?

**Panik- und Fluchttürtechnik**
1. Welche Panikschlösser und Panikstangen bietet der Betrieb an („im Rahmen unserer Leistungen“)?
2. „Die Anforderungen hängen vom Gebäude ab und müssen vorab geklärt werden“: Wer klärt das, Kunde oder Betrieb?
3. Bereichsseite: Zertifizierung nach DIN EN 179 und 1125 gestrichen. Falls es sie gibt, als Nachweis hinterlegen.

**Reparatur und Austausch**
1. „Türfalz“ ohne Erklärung.
2. „wackelt der Beschlag“ (alt: „schlägt aus“): gleiche Bedeutung?
3. „Ersatzteile passend zur vorhandenen Technik“: auch für ältere Schlösser?

**Technische Beratung**
1. „Grundlage für ein genaues Angebot“ (alt: „belastbares Angebot“): Ist die Beratung kostenlos oder Teil des Angebots? Das steht nirgends.
2. „Wir zeigen Ihnen, wo die Schwachstellen liegen“: vor Ort oder schriftlich?
3. Für wen (Mieter, Eigentümer, Verwaltung)? Nicht belegt, daher weggelassen.

**Montage und Anpassung**
1. „gelieferte Teile“: von uns geliefert oder auch vom Kunden gekauft?
2. „Ziel ist, dass die Technik dauerhaft funktioniert“: als Ziel formuliert, nicht als Zusage. Passt das?
3. „Übergabe mit Einweisung“: immer?

**Videoüberwachung**
1. „Aufzeichnung vor Ort oder im Netzwerk“ (alt: „lokal“): richtig?
2. „Bei der Planung der Blickfelder beachten wir die rechtlichen Vorgaben“: Mit dem Rechtskasten abgleichen (MA-40).
3. „Sie sehen die Bilder per App“: gilt für alle angebotenen Systeme?

**Alarmtechnik**
1. „erkennt, wenn an Tür, Fenster oder im Raum etwas geschieht“ (alt: „auffällige Ereignisse zuverlässig erkennen“): „zuverlässig“ gestrichen, weil eine Zusage. Einverstanden?
2. Montage nicht ausdrücklich genannt, nur „planen“. Soll „einbauen“ stehen?
3. „Kontakte an Türen und Fenstern, die von außen erreichbar sind“: richtig verstanden?

**Sicherung der Außenhaut**
1. Erklärung „Zur Außenhaut gehören alle Stellen, an denen man von außen ins Gebäude kommt“: fachlich passend?
2. „von der Haustür bis zum Kellerfenster“: Umfang realistisch?
3. Kellerfenster stehen doppelt (Kurztext und Punkt). Bewusst so gelassen; eins streichen?

**Mechanischer Schutz**
1. „Gitter und Rollladensicherungen im Rahmen unserer Leistungen“ (alt: „im passenden Rahmen“): Was war gemeint?
2. „erst beides zusammen ergibt den Schutz“: zu absolut?
3. „Sicherheitszylinder“: welche?

**Smart-Home-Sicherheitsfunktionen**
1. „lassen das Gebäude bewohnt wirken“: als Erklärung der Anwesenheitssimulation in Ordnung?
2. „die beim Schutz helfen“: Zusage vorsichtig genug?
3. „Passende Schaltmodule“: welche Systeme?

**Panik- und Alarmtaster**
1. „legen vorab fest, wer sie erhält“: Wer legt fest, der Betrieb oder der Kunde mit dem Betrieb?
2. „Einsatz nur für zulässige Zwecke“: Mit dem Rechtskasten abgleichen.
3. Wird die Benachrichtigung an Dritte (Leitstelle) angeboten? Nicht belegt, nicht genannt.

**Kombinierte Sicherheitskonzepte**
1. „Für jedes beteiligte Handwerk ist klar, wer zuständig ist“: arbeitet der Betrieb mit Partnern?
2. „Übergabe mit Dokumentation“: Was enthält sie?
3. „Ausbau in Schritten möglich“: ohne Bedingungen?

**Bereichsseite Tür- und Schließtechnik**
1. FAQ Pflege: „Teflon- oder Graphitbasis“ und Schmierfett für Falle und Riegel. Stimmt das mit den Herstellerempfehlungen überein?
2. FAQ Elektronik: „Oft ja“ (alt: „In den meisten Fällen ja“) und „Not- und Gefahrenfunktion“: fachlich prüfen.
3. Abschnitt 03: „Im Schadensfall kann das zu Fragen der Haftung führen.“ Ist das rechtlich so in Ordnung?

**Bereichsseite Sicherheitstechnik**
1. Rechtskasten: Nur Gedankenstriche durch Kommas ersetzt. Bitte mit der anwaltlichen Prüfung (MA-40) abgleichen.
2. „kosten einen Einbrecher Zeit und Kraft“: Ton in Ordnung (keine Angstmache)?
3. „Welche Bereiche zu Ihrem Gebäude passen, klären wir im Sicherheitscheck“: Der Check sammelt Angaben; klärt der Betrieb danach?

## OFFENE FRAGEN
- OFFENE FRAGE: Normen und Klassen von der Bereichsseite Tür gestrichen, weil nicht in `FACHWISSEN.md` oder den Daten belegt: DIN EN 1627, Empfehlung RC2/RC3, EN 179, EN 1125, T30. Soll der Inhaber Quellen liefern, damit sie zurückkommen?
- OFFENE FRAGE: „Wir sind zertifiziert für … Flucht- und Rettungswegtechnik nach DIN EN 179 und DIN EN 1125“ gestrichen. Liegt ein Nachweis vor, gehört er in die Sammlung Nachweise (dann zeigt die Seite ihn über `NachweiseListe`).
- OFFENE FRAGE: Die SEO-Beschreibungen von „Profilzylinder und Spezialzylinder“ und „Montage und Anpassung“ tragen weiter Gedankenstriche, ebenso die Rückfall-Metadaten der Bereichsseite Tür („Ganzheitliche …“) und `content.ts`. Das gehört zu FA-SEO-01.
- OFFENE FRAGE: Die Leistungsseiten bestehen aus Kurztext und vier Punkten. Einen eigenen Abschnitt „Was es kostet“ oder „Ihr Nachweis“ gibt es nicht; der Datentyp hat keine Felder dafür. Ein Ausbau braucht ein Paket mit Datenschema.
- OFFENE FRAGE: Der Hinweis im Ablaufkasten („Wir prüfen Ihren Fall und melden uns mit Machbarkeit und Preis.“) kommt aus `PROCESS_LABELS` in `src/lib/navigation.ts` (gesperrt) und blieb.
- OFFENE FRAGE: Gegenlesen durch zwei unabhängige Agenten (Haiku als Laie, Opus für Tatsachen) gegen den git diff nachholen, ebenso eine Messung mit `stil.mjs` bei laufendem Server.
- R13 (Berechtigungsnachweis) betrifft diese Seiten nicht unmittelbar: Kein Schlüsselweg beginnt hier. Die Anfrage läuft über `/service-und-termin/anfrage`.

## PRÜFUNG
Über die Datenweiche (`sicher.sh --json`):
- `npx vitest run`: 184 Testdateien, 2376 Tests, alle bestanden (davon 4 neu in `service-pages.test.ts`).
- `npm run typecheck`: ohne Fehler.
- `npm run lint`: ohne Fehler.
- Kein Build, kein Server, kein git, keine `--pg`-Befehle.

=== ENDE FA-INHALT-03B · BERICHT ===
