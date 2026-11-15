# FA-PLATTFORM-02 · Bericht · Partnergewinnung: Startseiten-Sektion und vier Seiten

Stand 2026-11-15 · Stufe 3 · kein git, kein Build, kein Server.

## GEÄNDERTE DATEIEN
Neu:
- `src/lib/partner/gewinnung.ts` (Daten: vier Seiten, Startseiten-Sektion, Leistungsliste, Qualitätsstandard, Bundesländer, Klarstellung)
- `src/lib/partner/gewinnung.test.ts` (15 Regeltests)
- `src/components/partner/gewinnung-seite.tsx` (gemeinsame Seitenvorlage, dazu `PunktListe`, `GewinnungLink`)
- `src/components/partner/partner-sektion.tsx` (Startseiten-Baustein, Server-Komponente)
- `src/components/partner/partner.test.tsx` (8 Darstellungstests)
- `src/app/(site)/partner-werden/auftraege-erhalten/page.tsx`
- `src/app/(site)/partner-werden/netzwerk-deutschland/page.tsx`
- `src/app/(site)/partner-werden/kfz-betriebe/page.tsx`
- `src/app/(site)/partner-werden/kooperation/page.tsx`

Geändert:
- `src/app/(site)/partner-werden/page.tsx`: nur Klarstellung im Kopf, neuer Abschnitt 01 „Nur Autoschlüssel und Fahrzeugschlüssel“ mit der Leistungsliste des Inhabers, neuer Abschnitt 04 „Alles zum Partnernetz“ als Stückliste der vier Seiten; Nummern 01 bis 05 und Flächenwechsel angepasst. Ablauf, Prüfliste, Formular und seine Logik unverändert.
- `src/app/sitemap.ts`: die vier Pfade aus `GEWINNUNG_SEITEN` (Priorität 0.4 wie die Hauptseite).
- `src/app/sitemap.test.ts`: ein Test für Hauptseite und vier Seiten.

## WAS UND WARUM
- Schnitt nach R2 wie im Paket: `/partner-werden` bleibt Hauptseite mit Bewerbung; vier neue Seiten mit eigenem Anliegen:
  - Aufträge erhalten: Ablauf in fünf Stationen (Anfrage, Zuordnung, Zahlung, Freigabe, Auszahlung) als Liste (`RubrikAblauf`) und Grafik (Generator `ablauf`, schmal und breit); eigene Abschnitte Weitergabe, Einblick vor der Annahme (belegt durch `src/lib/partner/sichtbarkeit.ts`: Kontaktdaten erst ab „angenommen“, nie Zahlungsdaten, Notizen, andere Partner), Aufgabenteilung, Voraussetzung Freischaltung.
  - Netzwerk Deutschland: Plattformgedanke (Wortlaut des Inhabers), Leistungsliste und Qualitätsstandard in voller Länge, 16 Bundesländer als Übersicht mit dem Satz, dass die Liste keine bestehenden Partner behauptet, Zuordnung nach Region und Leistung.
  - Kfz-Betriebe: Zielgruppen, Ausstattung, Fälle, Berechtigungsnachweis (R13), wie Anfragen kommen.
  - Kooperation: Unterschied zu Partnerbetrieb, Zielgruppen (Autohäuser, Fuhrparks, Pannenhilfe, Hausverwaltungen mit Fahrzeugen), typische Fälle, nötige Angaben samt Fahrzeugschein oder Vollmacht, Kontaktweg über `/service-und-termin/anfrage`.
- Jede Seite: eigener Titel (höchstens 60 Zeichen auch mit „ | SCHLÜSSELMACHER24“), eigene Beschreibung (120 bis 160), eigene Überschriften, mindestens drei eigene Abschnitte, Klarstellung „nur Autoschlüssel und Fahrzeugschlüssel, keine Türöffnungen“ (FA-07-02), Canonical, Brotkrumen, `pageGraphSchema`, Verweise auf alle Partnerseiten, nächster Schritt (Bewerbung oder Anfrage) und Telefonnummer aus den Einstellungen (`telefonLink`, Platzhalter ohne Link).
- Gemeinsame Bausteine: Leistungsliste voll auf Hauptseite und Netzwerk (2), Qualitätsstandard voll nur auf Netzwerk; sonst Verweis. Test sichert das.
- Nichts erfunden (R4): Test verbietet Ziffern, Prozent, Euro, Fristen und Siegel in allen Texten; Provision, Abrechnung, Auszahlung heißen „regeln wir im Partnervertrag“. Keine Gedankenstriche (Test).
- Gestaltung nur mit vorhandenen Bausteinen (PageHeader, Section, SectionHeading, Alert, ButtonLink, Glyphen, Fach-Icons, Ablauf-Generator), Knöpfe mobil volle Breite, `size="lg"`, keine neuen Farben, keine Bilder, keine Herstellerlogos.
- G12: `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md` (alternates.canonical) und `03-file-conventions/01-metadata/sitemap.md` gelesen; Muster der Codebasis passt.

## GEMEINSAME DATEIEN (gewünschte Änderungen als exakte Liste)
1. `src/app/(site)/page.tsx`: `import { PartnerSektion } from '@/components/partner/partner-sektion';` und `<PartnerSektion />` (Fläche default) direkt vor dem Abschnitt „Ratgeber“ (`<Section tone="muted" tight labelledBy="ratgeber-titel">`) einfügen, also nach der Bereichsübersicht. Der Baustein bringt seine eigene `Section` mit `aria-labelledby="partner-sektion-titel"` mit.
2. `src/components/layout/site-footer.tsx`, `FOOTER_PARTNER`: ergänzen um `{ href: '/partner-werden/auftraege-erhalten', label: 'Aufträge für Partner' }` und `{ href: '/partner-werden/kooperation', label: 'Kooperation für Betriebe' }` (sprechende Namen, keine Suchbegriffsanker, R6). Die beiden übrigen Seiten sind über die Verweislisten der Partnerseiten erreichbar.
3. `src/lib/navigation.ts:313`: Beschreibung „Für Schlüsseldienste und Betriebe aus ganz Deutschland“ ersetzen durch „Für Autoschlüssel-Fachbetriebe aus ganz Deutschland“ (FA-07-02; Test `navigation.test.ts` prüfen).
4. `content/seo.json`, Route `partner-werden`, nach Freigabe des Inhabers:
   - `seo.title` (Gedankenstrich) wird „Autoschlüssel-Partner werden“.
   - `seo.description` („Für Schlüsseldienste und Fachbetriebe“, „rechnen direkt mit dem Kunden ab“) wird „Für Fachbetriebe für Autoschlüssel und Fahrzeugschlüssel: Werden Sie Partner von SCHLÜSSELMACHER24. Wir geben geprüfte Anfragen aus Ihrer Region weiter.“ (152 Zeichen, ohne Aussage zum Zahlweg; gleich dem neuen Ersatzwert in `page.tsx`).
   - `subline` („… vor Ort — vor allem für Autoschlüssel“, Gedankenstrich, widerspricht „ausschließlich“) wird „Wir geben geprüfte Anfragen zu Autoschlüsseln und Fahrzeugschlüsseln an Fachbetriebe vor Ort weiter.“
   - `internalLinks` um `/partner-werden/netzwerk-deutschland` erweitern.
6. `src/lib/data/defaults/content.ts:419-433` (JSON-Fallback der Route `partner-werden`): `subline`, `title` und `description` genauso wie unter 4 angleichen, im selben Schritt wie `content/seo.json`.
7. Bei Umstellung auf `PARTNERMODELL: B` (MA-09): `content/seo.json` und `defaults/content.ts` enthalten dann keine Aussage zum Zahlweg mehr (nach 4 und 6). Hauptseite, Partnerseiten und Sektion folgen dem Schalter `PARTNERMODELL_B=aktiv` von selbst (siehe Nachbesserung, Befund 1).
8. Wunsch an die Anfrage: ein eigenes Thema „Kooperation“ in `?thema=` (heute vorbelegt mit `autoschluessel`).
5. `src/app/llms.txt/route.ts:46`: die vier Seiten als Unterpunkte ergänzen (gleiche Kurztexte wie `kurztext` in `gewinnung.ts`).

## PRÜFUNG UND ERGEBNIS
- `sicher.sh --json -- npx vitest run`: 182 Testdateien, 2324 Tests bestanden, 0 Fehler.
- `sicher.sh --json -- npm run typecheck`: ohne Fehler.
- `sicher.sh --json -- npm run lint`: ohne Fehler und Warnungen.

## BELEGE
- Vorgaben: Paketdatei (Abschnitte 05, 07, 08 wörtlich), `berichte/FA-ABGLEICH.md` Block 03, `FA-KUNDSCHAFTER-03.md`, `FA-BLINDPRUEFUNG-03.md`.
- Sichtbarkeit für Partner: `src/lib/partner/sichtbarkeit.ts:1-5, 33-44`.
- Berechtigungsnachweis „Fahrzeugschein auf den Besteller oder Vollmacht“: `src/lib/rubriken.ts:55`.
- Bundesländer: `berichte/FA-KUNDSCHAFTER-04.md:76-96` (16 Länder, nur Namen übernommen, keine Zahlen, keine Reihenfolge, G13).
- Tests: `src/lib/partner/gewinnung.test.ts`, `src/components/partner/partner.test.tsx`, `src/app/sitemap.test.ts`; `canonical.test.ts` greift die neuen Seiten automatisch.

## OFFENE FRAGEN
1. Zahlweg (G9, MA-09), Stand nach Nachbesserung: Die Texte folgen jetzt dem Schalter, live steht Modell A; Modell B erscheint erst mit `PARTNERMODELL_B=aktiv`. Der Inhaber entscheidet, ob und wann Modell B gilt. Ursprünglicher Befund: Die Seite „Aufträge erhalten“ und die Startseiten-Sektion beschrieben nach Abschnitt 05 die zentrale Vereinnahmung (Kunde zahlt an SCHLÜSSELMACHER24, Freigabe nach Zahlung, Auszahlung nach Bestätigung). Im Bestand ist Modell A aktiv und Modell B gesperrt (`src/lib/partner/abrechnung.ts:1-8`); die Hauptseite sagt in Schritt 03 „rechnet direkt mit dem Kunden ab“ und in Schritt 04 „Vermittlungsprovision in Rechnung“, ebenso `content/seo.json`. Beides widerspricht sich jetzt. Der Inhaber muss entscheiden, ob die neuen Texte erst nach `PARTNERMODELL: B` live gehen oder ob die Hauptseite angepasst wird (nicht in meinen Schreibrechten).
2. Texte freigeben (FA-08-02 bis FA-08-08 „Nur Menschen“): alle Seitentexte und die Sektion brauchen die Freigabe des Inhabers, insbesondere die Zielgruppen der Kooperation und die Ausstattungsliste der Kfz-Betriebe.
3. (Nachbesserung: Kurzpunkt jetzt „Geprüfte Betriebe, nach Möglichkeit mit Besuch vor Ort“.) Kurzpunkt „Qualitätsstandard mit Besuch vor Ort“ war wörtlich aus dem Paket; der Inhaber sagt „nach Möglichkeit“. Im Fließtext steht „nach Möglichkeit“, im Kurzpunkt nicht. Bitte bestätigen oder kürzen.
4. Sitemap-Priorität: Der Befund FA-08-01 empfiehlt, `/partner-werden` anzuheben. Ich habe nur die neuen Routen ergänzt (0.4 wie die Hauptseite). Höhere Priorität braucht eine Entscheidung.
5. „Zuordnung nach Region und Leistung“ und „freigeschalteter Partner“ beschreiben den Soll-Ablauf; laut FA-07-19 prüft der Code `darfVermitteln` heute nicht. Die Texte setzen voraus, dass FA-PLATTFORM-01 oder ein Folgepaket das umsetzt, sonst ist es eine Zusage ohne Umsetzung (R4, R9).

## Nachbesserung (Gegenprüfung, zwei Prüfer, 15 Befunde)

Geänderte Dateien der Nachbesserung: `src/lib/partner/gewinnung.ts`, `src/lib/partner/gewinnung.test.ts`, `src/app/(site)/partner-werden/page.tsx`, die vier `page.tsx` unter `auftraege-erhalten`, `netzwerk-deutschland`, `kfz-betriebe`, `kooperation`, dieser Bericht.

1. [rot] Zahlweg widerspricht dem Code: **behoben.** Die Texte hängen jetzt am Zahlweg, der im Code gilt. `gewinnung.ts` hat `aktiverZahlweg()` (Modell A ohne Schalter; Modell B nur mit `PARTNERMODELL_B=aktiv`, demselben Schalter, mit dem `src/payload/collections/Partnerbetriebe.ts:44` Modell B freigibt) und `ZAHLWEG.A`/`ZAHLWEG.B`. Live steht Modell A: „Aufträge erhalten“ zeigt Anfrage, Zuordnung, Annahme, Einsatz, Provision („rechnen direkt mit dem Kunden ab“, „Vermittlungsprovision in Rechnung“, Wortlaut der Hauptseite); der Kurzpunkt der Sektion heißt „Abrechnung direkt mit dem Kunden“; auch Beschreibung, Kurztext, Aufgabenteilung und der Verweis auf Kfz-Betriebe folgen dem Modell. Die Hauptseite liest ihre Schritte 03 und 04 aus `HAUPTSEITE_ZAHLWEG` (unter A wortgleich zum Bestand). Der Text nach Abschnitt 05 (Modell B) bleibt gebaut und erscheint erst mit dem Schalter. Tests: ein Zahlweg auf Hauptseite, Partnerseiten und Sektion je Modell; Modell A ohne „Auszahlung“, „über die Plattform“, „nach der Zahlung“; Hauptseite ohne fest geschriebenen Zahlweg.
2. [rot] „Sie nennen in der Bewerbung, welche davon …“: **behoben.** Lead der Hauptseite jetzt „Niemand muss alle anbieten. Nennen Sie in der Bewerbung Ihre Leistungen und Geräte.“ (Feld Leistungen und freiwilliges Feld „Autohersteller und Systeme“ mit Hinweis auf Geräte gibt es heute). Netzwerk: „jetzt klar auf Fahrzeugschlüssel ausgerichtet“ gestrichen („Es baut auf dem bestehenden Partnerbereich … auf.“), Einleitung der Leistungsliste „Vor der Freischaltung halten wir fest, welche Leistungen Ihr Betrieb abdeckt.“, Zuordnung „Postleitzahl, Ort und den Radius“ wie im Formular. Kfz-Betriebe siehe 11. Test sperrt die alten Formulierungen. **Bedingung:** Das Formular bietet weiter Türöffnung, Schließtechnik, Zutritt und Sicherheitstechnik an (`partner-formular.tsx:34-38`, nicht in meinen Schreibrechten). FA-PLATTFORM-02 darf erst zusammen mit FA-PLATTFORM-01 (neun Leistungen, Geräte im Formular) live gehen.
3. [rot] Unterzeile und JSON-Fallback: **behoben, soweit in meinen Schreibrechten.** `content/seo.json` und `src/lib/data/defaults/content.ts` darf ich nicht ändern; beide stehen jetzt mit exaktem Wortlaut unter GEMEINSAME DATEIEN 4 und 6. Der Ersatzwert der Unterzeile in `page.tsx` ist angepasst (siehe 4).
4. [rot] Ersatzwerte in `generateMetadata` und Unterzeile: **behoben.** Titel „Autoschlüssel-Partner werden“, Beschreibung „Für Fachbetriebe für Autoschlüssel und Fahrzeugschlüssel: Werden Sie Partner von SCHLÜSSELMACHER24. Wir geben geprüfte Anfragen aus Ihrer Region weiter.“ (152 Zeichen; der Vorschlag mit „Bewerben Sie sich als“ hatte 163 und wäre über 160), Unterzeile „Wir geben geprüfte Anfragen zu Autoschlüsseln und Fahrzeugschlüsseln an Fachbetriebe vor Ort weiter.“
5. [gelb] Kurzpunkt „Qualitätsstandard mit Besuch vor Ort“: **behoben.** Jetzt „Geprüfte Betriebe, nach Möglichkeit mit Besuch vor Ort“; Test verlangt „nach Möglichkeit“ bei jedem Kurzpunkt mit Besuch.
6. [gelb] „Sie melden den Auftrag als erledigt“: **behoben.** Jetzt „Sie geben uns Bescheid, wenn der Auftrag erledigt ist.“ (in Modell A und B); Test sperrt die alte Formulierung.
7. [gelb] Prüfliste der Hauptseite ohne Besuch, Ausstattung, Region, Sperren: **behoben.** Unter der Prüfliste steht der Textverweis „Der ganze Qualitätsstandard“ auf `/partner-werden/netzwerk-deutschland#netzwerk-qualitaet` (Anker ist die `id` des Abschnitts). Den Gedankenstrich in Schritt 01 habe ich durch ein Komma ersetzt („…, was gebraucht wird, zum Beispiel Fahrzeug, Schlüsselart und Berechtigung.“), weil ein Punkt einen Satz ohne Verb hinterlassen hätte; Inhalt unverändert, keine G9-Stelle.
8. [gelb] „Kooperation anfragen“ ohne Vorauswahl: **behoben.** Ziel jetzt `/service-und-termin/anfrage?thema=autoschluessel` (Schlüssel aus `NAV_AREAS`, das Formular übernimmt ihn in `anfrage-formular.tsx:107`). Ein eigenes Thema „Kooperation“ steht als Wunsch unter GEMEINSAME DATEIEN 8. Der Routentest trennt jetzt `#` und `?`.
9. [gelb] Zeilenangabe llms.txt: **behoben.** Auf `route.ts:46` korrigiert.
10. [rot] Zahlweg (zweiter Prüfer, gleicher Befund wie 1): **behoben** wie unter 1, mit dem verlangten Test, dass Hauptseite und Partnerseiten denselben Zahlweg nennen. Ob und wann Modell B gilt, bleibt OFFENE FRAGE 1 an den Inhaber.
11. [gelb] „Wir fragen in der Bewerbung danach“: **behoben.** Jetzt „Wir erfassen Ihre Ausstattung vor der Freischaltung.“; nächster Schritt „Nennen Sie in der Bewerbung Ihre Leistungen, Ihre Geräte und Ihr Einsatzgebiet.“ Abhängigkeit von FA-PLATTFORM-01 wie unter 2 als Bedingung.
12. [gelb] Berechtigungsnachweis uneinheitlich, Prüfpflicht vor Ort neu: **behoben.** Wortlaut jetzt „Fahrzeugschein auf den Besteller oder Vollmacht“ (`RUBRIK_NACHWEISE`, `src/lib/rubriken.ts:55`); statt „Sie prüfen ihn vor Ort noch einmal“ steht „Was Sie vor Ort zusätzlich prüfen, regeln wir im Partnervertrag.“ Test sichert den Wortlaut. Prüfpflicht vor Ort ist OFFENE FRAGE 6.
13. [gelb] Kurzpunkt Besuch (zweiter Prüfer, gleicher Befund wie 5): **behoben** wie unter 5; Test `gewinnung.test.ts` angepasst.
14. [gelb] Doppelte Überschrift Alert und Abschnitt 01: **behoben.** Abschnitt 01 heißt „Leistungen im Partnernetz“ (Augenbraue „Leistungen“ bleibt); die Klarstellung steht nur noch im Alert.
15. [gelb] Canonical als fester Text: **behoben.** Alle vier Routen nutzen `alternates: { canonical: SEITE.pfad }` (gültige Form nach `generate-metadata.md`); Test prüft das je Route.

Prüfung nach der Nachbesserung (über die Datenweiche):
- `sicher.sh --json -- npx vitest run`: 182 Testdateien, 2335 Tests; 2334 bestanden, 1 Fehler in fremder Datei `src/app/(site)/sicherheitstechnik/rechtshinweis-ton.test.ts:14` (neue Datei eines gleichzeitig laufenden Pakets, nicht von mir; gemeldet, nicht behoben). Partnertests: `gewinnung.test.ts` 21, `partner.test.tsx` 8, `sitemap.test.ts` 6, `partner.test.ts` 10, alle grün.
- `sicher.sh --json -- npm run typecheck`: ohne Fehler.
- `sicher.sh --json -- npm run lint`: ohne Fehler und Warnungen.

Neue offene Fragen der Nachbesserung:
6. Prüft der Partner den Berechtigungsnachweis vor Ort selbst noch einmal? Wenn ja, gehört das in den Partnervertrag und kann danach auf die Seite.
7. Freigabe: FA-PLATTFORM-02 nur gemeinsam mit FA-PLATTFORM-01 übernehmen oder live schalten (Formular mit neun Leistungen, ohne Türöffnung).

=== ENDE FA-PLATTFORM-02 · BEREIT ZUR RÜCKGABE ===
