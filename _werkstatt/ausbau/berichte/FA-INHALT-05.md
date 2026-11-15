# Bericht FA-INHALT-05 · Schließanlagen, Zutritt, Sicherheitstechnik: kleine Lücken

## GEÄNDERTE DATEIEN
- `src/app/(site)/schliessanlagen/konfigurator/projekt-konfigurator.tsx` (Zielgruppen, Frage übergreifende Schlüssel, Prüfung, Zusammenfassung; reine Hilfsfunktionen exportiert für Tests)
- `src/app/(site)/schliessanlagen/konfigurator/zielgruppen.test.ts` (neu)
- `src/app/(site)/elektronische-zutrittsloesungen/konfigurator/zutritt-konfigurator.tsx` (Frage Erweiterbarkeit, Prüfung, Zusammenfassung; Hilfsfunktionen exportiert)
- `src/app/(site)/elektronische-zutrittsloesungen/konfigurator/page.tsx` (Abfrageliste: „Umfang und Erweiterung“)
- `src/app/(site)/elektronische-zutrittsloesungen/konfigurator/erweiterung.test.ts` (neu)
- `content/service-pages.json` und `src/lib/data/defaults/service-pages.ts` (nur Eintrag `sicherheit-smarte-funktionen`)
- `src/app/(site)/sicherheitstechnik/rechtshinweis-ton.ts` (neu, Wortlaut an einer Stelle)
- `src/app/(site)/sicherheitstechnik/page.tsx`, `src/app/(site)/sicherheitstechnik/[slug]/page.tsx`, `src/app/(site)/sicherheitstechnik/sicherheitscheck/sicherheitscheck.tsx` (Hinweis eingebunden)
- `src/app/(site)/sicherheitstechnik/rechtshinweis-ton.test.ts` (neu)

## WAS UND WARUM
- FA-16-06: Zielgruppe heißt sichtbar „Gewerbe“, Beschreibung „Unternehmen, Betrieb, Büro, Praxis, Werkstatt, Handel oder Lager.“ Der gespeicherte Wert bleibt `unternehmen`; alte Vorgänge und Entwürfe bleiben gültig. Die Zusammenfassung zeigt nun „Gewerbe“.
- FA-16-09: Neue wählbare Zielgruppe „Mehrere Liegenschaften“ (Wert `mehrere-liegenschaften`). Bei Wahl springt das Zählfeld auf mindestens 2. Im Schritt Objekt erscheint die Pflichtfrage „Sollen einzelne Schlüssel mehrere Liegenschaften öffnen?“ (Ja, Nein, Noch nicht entschieden). Prüfung: mindestens 2 Liegenschaften und eine Antwort. Die Zusammenfassung (Kunde in der Bestätigung und Vorgangsblatt für den Admin, beides aus `summary`) nennt Zielgruppe, Anzahl Liegenschaften und übergreifende Schlüssel; die Einordnung nennt übergreifende Schlüssel als Grund. Neues Feld `crossPropertyKeys` geht über `payload` mit; alte Entwürfe erhalten es über das Zusammenführen mit den Startwerten in `useFlow`.
- FA-17-18: Im Schritt 2 (Umfang) des Zutrittskonfigurators steht die Pflichtfrage „Sollen später Türen oder Nutzer hinzukommen?“ (Nein, weitere Türen, weitere Nutzer, beides, noch nicht absehbar) und bei Ja das freiwillige Feld „Ungefähr wie viele?“. Die acht Abfragen bleiben acht; die Liste auf der Seite heißt nun „Umfang und Erweiterung“. Zusammenfassung und damit Vorgangsblatt führen „Spätere Erweiterung“ und „Ungefährer Zuwachs“. Eine eigene serverseitige Nutzlastprüfung für diesen Konfigurator gibt es nicht (nur das allgemeine `payloadSchema`); daher nichts mitzuziehen.
- FA-18-09: Leistung heißt „Smart-Home-Sicherheitsfunktionen“ (Titel, SEO-Titel, Bildmotiv). Kennung und Adresse `smarte-funktionen` bleiben. JSON und TypeScript-Startwerte tragen denselben Stand (Test vergleicht den Eintrag vollständig). Der Seed gleicht für Leistungsseiten `titel`, `zusammenfassung`, `stichpunkte.text`, `ctaHref`, `ctaLabel` und SEO ab; der alte Titel steht im Schnappschuss `content/startwerte/2026-10-25/`, also übernimmt der Seed den neuen Titel, solange der Betrieb ihn nicht geändert hat. Keine Migration.
- FA-18-13, FA-18-14: Ein kurzer Hinweis (Wortlaut unten) steht auf der Bereichsseite im Abschnitt „Recht und Verantwortung“, im Kasten der Leistungsseiten mit rechtlichem Bezug (darunter Videoüberwachung) und im Sicherheitscheck, sobald Video oder Audio gewählt ist. Bestehende Sätze sind unverändert. Prüfung auf Werbung: Suche nach verdeckt, versteckt, heimlich, Abhören, Mikrofon, Audio, Spion, Wanze, Minikamera in `content` und `src` ergab keine Bewerbung verdeckter Überwachung, Abhörtechnik oder versteckter Kameras; die Treffer sind die ablehnenden Hinweise selbst oder fachfremd (Honigtopf-Feld, Zeichnungen).

## PRÜFUNG UND ERGEBNIS
- `sicher.sh --json -- npx vitest run`: 179 Testdateien, 2305 Tests, alle bestanden (darunter 11 neue).
- `sicher.sh --json -- npm run typecheck`: ohne Fehler.
- `sicher.sh --json -- npm run lint`: ohne Fehler.
- Kein Build, kein Server, kein git.

## ENTWURF ZUR ANWALTLICHEN PRÜFUNG
Wörtlich, in `src/app/(site)/sicherheitstechnik/rechtshinweis-ton.ts`:

> Verdeckte Tonaufnahmen und heimliche Aufzeichnungen bieten wir nicht an. Bei Ton und Aufzeichnung gelten Datenschutz und Strafrecht. Wir planen nur Technik, die rechtmäßig eingesetzt werden kann.

## OFFENE FRAGEN
- OFFENE FRAGE: Die Landingpage `src/app/(site)/schliessanlagen/page.tsx` zeigt in ihren Zielgruppenkacheln weiter „Unternehmen“ und „Mehrere Gebäude“. Sie liegt außerhalb der Schreibrechte; soll sie an „Gewerbe“ und „Mehrere Liegenschaften“ angeglichen werden?
- OFFENE FRAGE: Antwortoptionen der Erweiterbarkeit im Zutritt und der übergreifenden Schlüssel sind vorgeschlagen; Festlegung durch den Inhaber (laut Befund „Nur Menschen“).
- OFFENE FRAGE: Fachliche Freigabe des Leistungsumfangs „Smart-Home-Sicherheitsfunktionen“; Zusammenfassung und Stichpunkte sind unverändert.
- OFFENE FRAGE: Der bestehende Satz „Verdeckte Audioüberwachung bieten wir nicht als Standardprodukt an“ bleibt stehen und klingt neben dem neuen Hinweis weicher. Ob er nach der Rechtsprüfung entfallen oder angeglichen werden soll, entscheidet der Inhaber.
- Der Hinweis in `datenschutz-inhalt.tsx` (Rechtstext) wurde nicht berührt (G9).

## Nachbesserung
Zwei Gegenprüfer, neun Befunde. Jeden am Code geprüft.

1. [rot] Menülabel „Smarte Funktionen“ in `src/lib/navigation.ts:244`: zutreffend. Behoben hier nur im Bericht, weil die Datei laut Paket gesperrt ist. Steht jetzt unten als OFFENE FRAGE mit der Bitte um ein Folgepaket.
2. [rot] Widerspruch „nicht als Standardprodukt“ neben „bieten wir nicht an“: zutreffend. Er steht in `sicherheitstechnik/[slug]/page.tsx:164/169`, `sicherheitstechnik/page.tsx:325/328`, `sicherheitscheck.tsx:394/397`, und der alte Satz zusätzlich im Rechtstext `datenschutz-inhalt.tsx:190` (G9). Der Code bleibt unverändert. Welcher der beiden Sätze sachlich stimmt, kann nur der Inhaber nach Rechtsprüfung (R10) entscheiden. Seine eigene Vorgabe („nicht als normales Standardprodukt bewerben“) passt eher zum alten Satz, der Paketauftrag eher zum neuen. Den neuen Hinweis nur in einen anderen Listenpunkt zu schieben, hebt den Widerspruch auf derselben Seite nicht auf. Unten als blockierende Inhaberentscheidung für MENSCHEN.md vorgelegt; beide Sätze gehen gemeinsam in die Rechtsprüfung.
3. [gelb] `content/seo.json:374` nennt „Unternehmen und Hausverwaltungen“: zutreffend. Die Datei liegt außerhalb der Schreibrechte, deshalb in die OFFENE FRAGE zur Landingpage aufgenommen.
4. [gelb] Anzahl Liegenschaften doppelt in der Zusammenfassung: zutreffend und behoben. Der Block Kundentyp führt nur noch „Übergreifende Schlüssel“, die Anzahl steht einmal unter „2. Objekt“. Test angepasst.
5. [gelb] Altwert `crossPropertyKeys` in der Nutzlast: zutreffend und behoben. Wechselt die Zielgruppe weg von „Mehrere Liegenschaften“, wird der Wert geleert. Außerdem filtert `buildPayloadBase` beim Absenden, das deckt auch ältere Entwürfe ab. Test ergänzt. Den Zutrittsteil dieses Befunds behebt Punkt 9.
6. [gelb] Gleich wie Befund 1: zutreffend, als OFFENE FRAGE nachgetragen.
7. [gelb] Gleich wie Befund 2: zutreffend, gleich behandelt (Inhaberentscheidung, priorisiert).
8. [gelb] „Ungefähr wie viele?“ auch bei „Noch nicht absehbar“: zutreffend und behoben. Neue Funktion `fragtZuwachs` (nur `tueren`, `nutzer`, `beides`), genutzt für das Feld, die Zusammenfassung und die Nutzlast. Testfall in `erweiterung.test.ts` ergänzt.
9. [gelb] Altwert `erweiterungUmfang` in der Nutzlast: zutreffend und behoben. Wer „Nein“ oder „Noch nicht absehbar“ wählt, leert das Feld (`flow.update`). Zusätzlich filtert `buildPayload` beim Absenden. Test ergänzt.

Geänderte Dateien der Nachbesserung: `projekt-konfigurator.tsx`, `zielgruppen.test.ts`, `zutritt-konfigurator.tsx`, `erweiterung.test.ts`, dieser Bericht.

Prüfung nach der Nachbesserung über die Datenweiche: `npx vitest run` mit 182 Testdateien und 2329 Tests, alle bestanden. `npm run typecheck` ohne Fehler. `npm run lint` ohne Fehler. Kein Build, kein Server, kein git.

### Zusätzliche OFFENE FRAGEN aus der Nachbesserung
- OFFENE FRAGE (für den Orchestrator): Im Menü steht unter `src/lib/navigation.ts:244` weiter „Smarte Funktionen“. FA-18-09 ist erst erfüllt, wenn dort „Smart-Home-Sicherheitsfunktionen“ steht. Dafür braucht es ein Folgepaket mit Schreibrecht auf `navigation.ts`, das auch `navigation.test.ts` prüft. Die Adresse `/sicherheitstechnik/smarte-funktionen` bleibt.
- OFFENE FRAGE, BLOCKIERT DEN LIVEGANG (Eintrag in MENSCHEN.md durch den Orchestrator): Auf den Seiten der Sicherheitstechnik stehen „Verdeckte Audioüberwachung bieten wir nicht als Standardprodukt an“ und „Verdeckte Tonaufnahmen und heimliche Aufzeichnungen bieten wir nicht an“ nebeneinander. Fundstellen: `sicherheitstechnik/[slug]/page.tsx:164/169`, `sicherheitstechnik/page.tsx:325/328`, `sicherheitscheck.tsx:394/397`, zusätzlich der Rechtstext `datenschutz-inhalt.tsx:190`. Frage an den Inhaber: Soll der alte Satz die Worte „als Standardprodukt“ verlieren, ganz entfallen, oder soll stattdessen der neue Hinweis weicher werden? Beide Sätze gehen dafür gemeinsam in die anwaltliche Prüfung. Bis zur Entscheidung bleibt der Wortlaut unverändert.
- OFFENE FRAGE (Ergänzung zur Landingpage): `content/seo.json:374` nennt „Privat, Unternehmen und Hausverwaltungen“. Zusammen mit den Kacheln in `src/app/(site)/schliessanlagen/page.tsx:110` („Unternehmen“) und `:137` („Mehrere Gebäude“) sollte das in einem Folgepaket an „Gewerbe“ und „Mehrere Liegenschaften“ angeglichen werden.
