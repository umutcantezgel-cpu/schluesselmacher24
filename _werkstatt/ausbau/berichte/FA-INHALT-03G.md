# Bericht FA-INHALT-03G · Texte menschlicher: Kasse, Vorgangsseite, Terminstatus, Bestätigungen, Kundenmails

Stand 15.11.2026. Kein git, kein Server, kein Build. Prüfungen über die Datenweiche (Ergebnis unten unter PRÜFUNG).

## GEÄNDERTE DATEIEN
Nur sichtbarer Wortlaut, keine Logik, keine Platzhalter, keine Bedingungen, keine Links.
- `src/app/(site)/kasse/page.tsx`: Lead im Kopf. `metadata` unverändert.
- `src/app/(site)/kasse/kasse-formular.tsx`: Fehlermeldungen (E-Mail, Telefon, Versandart, Rückfall bei Serverfehler), Weiterleitungs- und Ladesätze, Leerzustand, Hinweis ohne Online-Zahlung, Info „Warum eine Telefonnummer?“, Satz unter dem Bestellknopf. Bestellknopf, beide Zustimmungstexte, die Info „Anfertigung nach Ihren Angaben“ (Widerruf) und die Preis- und Steuerzeilen unverändert.
- `src/app/(site)/bestellung/[id]/page.tsx`: Lead, Satz unter der Vorgangsnummer (Gedankenstrich), Hinweis zu Dateien, Begleitschein-Satz, „Wie es weitergeht“ bei erledigten Vorgängen, Statusabruf-Satz und Linktext, Überschrift „Fragen und Hilfe“.
- `src/app/(site)/bestellung/[id]/foto-ergebnis.tsx`: Titel „Preis noch offen“ (statt „Preis folgt“), zwei Sätze zur Fertigung, drei Einsende-Punkte als ganze Sätze. Der Rechtskasten „So erteilen Sie den Auftrag“ unverändert.
- `src/app/(site)/bestellung/[id]/jetzt-bezahlen.tsx`: Fehlermeldung beim Öffnen der Zahlungsseite mit nächstem Schritt.
- `src/lib/kundenstatus.ts`: Texte der allgemeinen Stände (neu, in Prüfung, geprüft, freigegeben, Rückfrage, in Arbeit, abgeschlossen, storniert), Bestellung „in Prüfung“ und neu „storniert“, „Was genau, steht in unserer E-Mail“ in den Rückfragen, „auf der Seite zu Ihrer Anfrage“ statt „auf Ihrer Vorgangsseite“. Labels und Titel unverändert; „terminiert“ unverändert (siehe OFFENE FRAGEN 3). Der neue Eintrag `storniert` in `BESTELLUNG` ist ein Text in einer vorhandenen Texttabelle, keine neue Bedingung.
- `src/lib/wege/naechste-schritte.ts`: alle Schrittexte; Titel „Sichtung“ heißt „Wir sehen uns alles an“. Reihenfolge, Auswahl und Anzahl der Schritte unverändert.
- `src/lib/zahlung/ansicht.ts`: Texte ohne Online-Zahlung, Storno ohne Termin (Titel „Storniert“), fehlgeschlagene Zahlung, Rückkehr von der Zahlungsseite (Gedankenstrich), abgelaufener Link, Freigabe (Titel „Freigegeben, Zahlung offen“ statt Halbgeviertstrich), nicht gestartete Zahlung, offene Zahlung.
- `src/app/(site)/service-und-termin/terminstatus/page.tsx`: Lead. Titel, `SeitenDaten` (FA-SEO-01C) und `metadata` unverändert.
- `src/app/(site)/service-und-termin/terminstatus/status-formular.tsx`: Hinweis am E-Mail-Feld, Satz bei „Nichts gefunden“, Kennzeile „Vorgangsnummer“ statt „Vorgang“, „Eingegangen am“, „Zuletzt geändert“, Hinweis unten ohne Frage.
- `src/components/weg/bestaetigung.tsx`: Satz zur Vorgangsnummer, Knopf „Stand abrufen“.
- `src/components/autoschluessel/bestaetigung.tsx`: Haken und Kennzeile „Eingegangen“ statt „Vorgang angelegt“, Satz zur Vorgangsnummer, Knopf „Stand abrufen“. Anzahlung, Verbindlichkeit und Partnerweg-Sätze unverändert.
- Kundenmails, Betreff ohne Gedankenstrich (Vorgangsnummer bleibt am Ende, jetzt in Klammern):
  - `src/lib/mail/vorlagen/status.ts`: alle sechs Betreffe; Texte zu Freigabe, Absage, Rückfrage (ohne „Vorgang“), Storno („Storniert (Nummer)“, „Die Stornierung ist bei uns eingetragen. Sie müssen nichts mehr tun.“).
  - `src/lib/mail/vorlagen/freigabe.ts`: drei Betreffe, Effekt-Doppelpunkte, Einsende-Liste (Aufzählungszeichen „•“ wie in der Erinnerung, ganze Sätze), Satz zum Zahlungslink, Satz ohne Preis. Unverändert: „Erst mit Ihrer Zahlung kommt der Vertrag zustande“, Widerrufshinweis § 312g, AGB-Verweis, „Fertigungszusage“.
  - `src/lib/mail/vorlagen/zahlung.ts`: nur Kundenmails (bezahlt, nicht abgeschlossen, erstattet): Betreffe, Gedankenstrich, „Vorgang“ ersetzt, Partnertermin nur noch mit dem gemeinsamen Satz `PARTNER_NICHT_ZUSTANDE`. Teammail `betriebBezahlt` unverändert.
  - `src/lib/mail/vorlagen/kunde-eingang.ts`: „sichten“ ersetzt, Semikolon-Sätze geteilt, Einsende-Einleitung. Betreffe, Eingangsbestätigung nach § 312i und der Knopf „Vorgang und Begleitschein ansehen“ unverändert (siehe OFFENE FRAGEN 2).
  - `src/lib/mail/vorlagen/erinnerung.ts`: Betreff, Hinweis „Wenn Sie nicht kommen können“ ohne Gedankenstrich, Satz zum Kalenderanhang.
  - `src/lib/mail/nachricht-vorlagen.ts`: „Danach geht es sofort weiter“ (Zeitzusage, R4) und „gute Nachricht:“ entfernt.
- Tests, deren Wortlaut sich änderte (nur Erwartungen angepasst, keine gelockert):
  - `src/lib/zahlung/ansicht.test.ts` (Titel „Freigegeben, Zahlung offen“)
  - `src/components/autoschluessel/bestaetigung.test.tsx` („Eingegangen“ statt „Vorgang angelegt“)
  - `src/lib/mail/freigabe.test.ts` (vier Betreffe)
  - `src/lib/mail/termin-mails.test.ts` (Betreff der Erinnerung)
  - `src/payload/hooks/vorgang-benachrichtigen.test.ts` (zwei Betreffe)
  - `src/lib/server/benachrichtigungen.test.ts` (Betreff „Zahlung erhalten“)
  - `src/lib/server/termin-erinnerungen.db.test.ts` (Betreff der Erinnerung; Datenbanktest, hier nicht gelaufen, kein `--pg`)
- Nicht geändert: `vertragsbestaetigung.ts`, `vertrag.ts`, `widerruf-eingang.ts`, `gemeinsam.ts` (der gemeinsame Satz „Fragen? Antworten Sie einfach …“ steht auch in Vertragsbestätigung und Widerrufsmail; eine kurze Änderung habe ich deshalb sofort zurückgenommen, die Datei ist gleich der alten Fassung), `ausfuehrung.ts`, `partner-freigabe.ts`, `nachricht.ts` (schon kurz), `auftrag-bestaetigen/[id]/*` (Knopf „Auftrag wurde ausgeführt: bestätigen“ beschreibt die Zustimmung des Kunden), Teammails, `src/lib/actions/**`.

## WAS UND WARUM
- Ein Satz, was geschehen ist, ein zweiter, was zu tun ist: Die allgemeinen Stände und Statusmails sagen jetzt „Sie müssen dafür nichts tun“, „Was genau, steht in unserer E-Mail“, „Sie müssen nichts mehr tun“. Bei „neu“ steht bewusst kein „Sie müssen nichts tun“: Bei Termin und Bestellung kann die Zahlung noch offen sein.
- Interne Wörter: „Vorgang“ steht nur noch mit „Vorgangsnummer“ (Kennzeile im Terminstatus, Knopf „Stand abrufen“, „Fragen und Hilfe“, „Ihre Angaben sind eingegangen“, „Ihre Anfrage wurde storniert“). Ausnahmen: siehe OFFENE FRAGEN 1 und 2.
- Gedankenstriche und Effekt-Doppelpunkte: auf der Vorgangsseite, in der Zahlungsansicht, in den Bestätigungen und in allen Kundenbetreffen entfernt. Geblieben ist der Gedankenstrich in der Kasse-Info „Anfertigung nach Ihren Angaben“, weil sie den Widerruf erklärt (G9).
- Fachwörter: „Zahlungsdienstleister angebunden“, „Sichtung“, „Profil“, „nachverfolgbar“, „Kalendereintrag (.ics)“, „Positionen“ und „Server“ sind ersetzt.
- Zusagen: „Danach geht es sofort weiter“ (Nachrichtvorlage) gestrichen (R4). Keine neue Zeit-, Preis- oder Verfügbarkeitsaussage. Erreichbarkeit nirgends selbst formuliert.
- Begriffe nach FA-KERN-03/04: „Anzahlung“, „Rest“, „Gesamtbetrag“ und der Partnerweg-Satz `PARTNER_NICHT_ZUSTANDE` sind unverändert. Im Partnerweg kommt keine Anzahlung neu hinzu (Test `partnerweg.test.ts` grün).
- Persönliche Links, Knöpfe zum Bezahlen und alle Platzhalter (`${…}`) sind technisch unverändert.
- Gegenlesen: Es gab kein Werkzeug für Unteragenten. Ich habe deshalb zwei Lesungen nacheinander selbst gemacht.
  - (1) Als älterer Kunde ohne Fachwissen. Ergebnis: „Stand abrufen“ statt „Stand des Vorgangs abrufen“, „Eingegangen“ statt „Vorgang angelegt“, ganze Sätze im Einsende-Ablauf, „mit Sendungsverfolgung“, Fehlermeldungen mit nächstem Schritt.
  - (2) Als Tatsachenprüfer gegen die Kopie der alten Fassung (Scratchpad `03g`/`vorher`, kein git) und den Code. Ergebnis, zurückgenommen oder berichtigt:
    - „Sie müssen nichts tun“ bei „neu“: Die Zahlung kann noch offen sein.
    - „So bekommen Sie kein falsches Teil“ war eine Zusage. Jetzt steht dort „So vermeiden wir eine falsche Anfertigung“.
    - „Datum, Uhrzeit und Ort stehen unten“ in der Terminmail ist ohne Zeilen beim Partnertermin falsch.
    - „noch nicht bezahlt“ in der Kasse passte nicht zum Abzeichen „Offen“.
    - Die Änderung am gemeinsamen Antwortsatz hätte die Vertragsbestätigung verändert.
  - Eine unabhängige Gegenlesung durch zwei andere Leser fehlt (OFFENE FRAGEN 6).

## ZAHLEN VORHER UND NACHHER
Messung: `stil.mjs` braucht einen laufenden Server, der hier nicht erlaubt ist. Gemessen habe ich mit `pruefeZeile` und `tsxZeilen` aus stil.mjs über die Quelldateien der Gruppe (Skript `scratchpad/03g/mess.mjs`, verkettete Zeichenketten zusammengezogen). Das ist eine Heuristik. Sätze mit `${…}` zählt sie nicht. Mehr Wörter kommen vor allem von den zweiten Sätzen („was Sie tun müssen“), die das Paket verlangt, und von ganzen Sätzen statt Satzfetzen.

| Gruppe | Wörter vorher → nachher | Sätze | Mittel | längster Satz | Gedankenstriche | übrige Befunde |
|---|---|---|---|---|---|---|
| Kasse | 408 → 450 | 84 → 91 | 4,9 → 4,9 | 22 → 22 (Widerrufs-Info, gesperrt) | 1 → 1 (dieselbe Info) | Frage 1 → 1 (Infotitel „Warum eine Telefonnummer?“), Platzhalter 1 → 1 („folgt“ in der gesperrten Info) |
| Vorgangsseite (Seite, Foto-Ergebnis, Bezahlknopf, Kundenstatus, Nächste Schritte, Zahlungsansicht) | 1418 → 1676 | 263 → 296 | 5,4 → 5,7 | 18 → 18 | 1 → 0 | Platzhalter („Preis folgt“) 1 → 0, Bindestrich 1 → 0 |
| Terminstatus | 74 → 78 | 19 → 20 | 3,9 → 3,9 | 15 → 12 | 0 → 0 | 0 |
| Bestätigungen | 211 → 200 | 42 → 41 | 5,0 → 4,9 | 16 → 16 | 0 → 0 | 0 |
| Kundenmails (ohne Vertragsbestätigung und Widerruf) | 1059 → 1167 | 150 → 171 | 7,1 → 6,8 | 23 → 18 | 5 → 0 (dazu 13 Betreffe mit „–“, die die Messung wegen `${…}` nicht sieht, jetzt 0) | Frage 1 → 0, Bindestrich 2 → 2 („Online-Zahlung“ und „E-Mail“-Komposita) |

Kein Satz über 25 Wörtern. Offene Stellen je Gruppe: Kasse die gesperrte Widerrufs-Info; Vorgangsseite „Vorgangsseite“ im Statushinweis aus `actions/booking.ts` (nicht mein Schreibrecht); Terminstatus der Titel „Stand Ihres Vorgangs“; Mails der Knopf „Vorgang ansehen“.

## SCHLUSSREDAKTION (Liste für den Menschen)
Kasse
1. Hinweis ohne Online-Zahlung: „Online bezahlen geht zurzeit nicht. Sie können trotzdem bestellen. Die Zahlung steht dann auf „offen“. Wir melden uns bei Ihnen mit den Angaben zur Zahlung.“ Stimmt das Verfahren so?
2. Unter dem Bestellknopf: „Beim Absenden rechnen wir den Preis noch einmal nach. Es gelten die Preise in unserem System.“ Rechtlich so gewollt (früher „Maßgeblich sind die dort hinterlegten Preise“)?
3. Info Telefon: „Ist eine Angabe unklar, rufen wir Sie kurz an, bevor wir fertigen.“ Rufen Sie wirklich an, oder schreiben Sie auch?

Vorgangsseite
1. Allgemeine Stände: „Wir prüfen Ihre Angaben und Unterlagen. Sie müssen dafür nichts tun.“ und „Wir haben alles erledigt. Sie müssen nichts mehr tun.“ Passt das für Termine mit Rest beim Termin?
2. Schritt Foto-Anfrage: „Wir bestimmen auf den Fotos die Form des Schlüssels und den passenden Rohling.“ Fachlich genau genug? Der Satz „lesen Beschriftungen aus“ ist weggefallen.
3. Storno ohne Termin: Titel „Storniert“, Text „Eine Zahlung ist nicht mehr nötig. Sie müssen nichts mehr tun.“

Terminstatus
1. Lead „Dann sehen Sie, wie weit Ihr Auftrag oder Ihre Anfrage ist.“
2. Satz bei „Nichts gefunden“: „Wenn Sie die Nummer nicht mehr haben, helfen wir Ihnen über die Kontaktseite weiter.“
3. Titel „Stand Ihres Vorgangs“ (OFFENE FRAGEN 1).

Bestätigungen
1. Haken „Eingegangen“ statt „Vorgang angelegt“ im Autoschlüssel-Termin.
2. „Bitte heben Sie diese Nummer auf. Mit ihr und Ihrer E-Mail-Adresse sehen Sie jederzeit den Stand nach.“
3. Seite `/auftrag-bestaetigen`: Knopf „Auftrag wurde ausgeführt: bestätigen“ (Doppelpunkt) ist geblieben, weil er die Zustimmung des Kunden beschreibt. Soll er „Ausführung bestätigen“ heißen?

Kundenmails
1. Betreffe enden jetzt mit der Nummer in Klammern, etwa „Ihr Termin steht (SM24-T-2026-0007)“. Findet das Team die Nummer so gut wie bisher nach dem Gedankenstrich?
2. Storno-Mail: Betreff „Storniert (Nummer)“, Text „die Stornierung ist bei uns eingetragen. Sie müssen nichts mehr tun.“ Gilt das auch, wenn der Kunde selbst storniert hat?
3. Nachrichtvorlage „Unterlagen fehlen“: „Danach arbeiten wir an Ihrem Auftrag weiter.“ statt „Danach geht es sofort weiter.“

## OFFENE FRAGEN
1. Titel der Terminstatus-Seite „Stand Ihres Vorgangs“: Er steht wortgleich als Name in den Strukturdaten (`SeitenDaten`, FA-SEO-01C). Wegen R8 habe ich ihn nicht allein geändert. Vorschlag für ein Paket mit Recht auf beide Stellen: „Stand Ihres Auftrags“ oder „Stand abrufen“.
2. Knopf „Vorgang ansehen“ und „Vorgang und Begleitschein ansehen“ in der Eingangsmail: Der zweite Name steht wörtlich im Statushinweis von `src/lib/actions/booking.ts` („über den Knopf „Vorgang und Begleitschein ansehen““). Diese Datei darf ich nicht ändern. Vorschlag: beide gemeinsam ändern, etwa „Angaben und Begleitschein ansehen“. Im selben Hinweis steht auch „Vorgangsseite“.
3. Stand „terminiert“: „Ihr Termin ist verbindlich eingeplant.“ ohne zweiten Satz. Ein „Sie müssen nichts tun“ wäre falsch, weil beim Autoschlüssel Ausweis und Fahrzeugschein mitzubringen sind. Ein Hinweis auf die Mitbringliste fehlt bei Partnerterminen ohne Termindaten. Der Satz ist auch in `vorgang-aendern.db.test.ts` gebunden. Bitte entscheiden, ob ein zweiter Satz gewünscht ist und wie er lautet.
4. Schritt „Anzahlung“ in `SCHRITTE_NACH_ART.termin` gilt für jeden Termin, auch im Partnerweg mit Gesamtbetrag. Die Auswahl der Schritte ist Logik (nicht mein Schreibrecht). Für FA-KERN-03/04: im Partnerweg eigene Schritte („Gesamtbetrag“, „vermittelter Termin“).
5. Fehlermeldungen aus Server-Aktionen sind nicht mein Schreibrecht: „Zu dieser Kombination aus Vorgangsnummer und E-Mail-Adresse wurde nichts gefunden.“, „Dieser Vorgang ist storniert.“ aus `actions/zahlung.ts`, `ergebnis.meldung` beim Bezahlen. Sie sagen „Vorgang“ und sollten mit den Texten hier angeglichen werden.
6. Eine unabhängige Gegenlesung durch zwei andere Leser (Haiku als älterer Kunde, Opus als Tatsachenprüfer) fehlt. Hier habe ich nur selbst in zwei Durchgängen gelesen.
7. Kasse-Zusammenfassung: Unterzeilen der Zylinder beginnen mit „— “ (`— ${zeile.label}` in `kasse-formular.tsx`, Zeile 209). Das ist ein Einrückungszeichen, kein Satz. Ich habe es gelassen, weil der Warenkorb (FA-SHOP-01) dieselbe Darstellung haben sollte. Vorschlag: beide gemeinsam auf eine Einrückung ohne Strich umstellen.

## FÜR MENSCHEN
- Rechtstexte, nur zur Prüfung, nicht geändert (G9, R10):
  - Kasse-Info „Anfertigung nach Ihren Angaben“: Sie hat einen Gedankenstrich und 22 Wörter in einem Satz. Kürzer wäre: „Schlüssel nach Code und gleichschließende Zylinder fertigen wir eigens für Sie, nach Ihrem Code oder Ihren Maßen. Solche Anfertigungen lassen sich nicht weiterverkaufen. Was das für Ihr Widerrufsrecht bedeutet, steht in der Widerrufsbelehrung.“
  - Zustimmungstext „Mir ist bekannt, dass …“ in der Kasse.
  - Kasten „So erteilen Sie den Auftrag“ auf der Vorgangsseite mit „Die Freigabe ist noch keine Fertigungszusage“: Er ist sprachlich lang, aber Rechtstext.
- Schlussredaktion oben: je Gruppe drei Stellen.
- Nicht in diesem Lauf geprüft: Datenbanktests (`--pg` war nicht erlaubt). Die angepasste Erwartung in `termin-erinnerungen.db.test.ts` läuft erst im nächsten Lauf mit Datenbank.

## PRÜFUNG
Schlusslauf über die Datenweiche: vitest 209 Dateien, 3169 Tests grün. typecheck 0 Fehler. lint 0 Fehler.

In Zwischenläufen waren fremde Stellen rot, im Schlusslauf aber grün:
- typecheck: Datenbanktests von FA-SHOP-01 (`shop-grundlage.db.test.ts`, `payload.db.test.ts`, `vorgaenge.db.test.ts`, `admin-alltag.db.test.ts`; Typen von `produkte` und `hersteller` im Umbau).
- vitest: je ein Test von FA-SEO-01C (`json-ld.test.ts`, `waisen.test.ts`).
