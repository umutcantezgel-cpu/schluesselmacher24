# FA-SOFORT-05 · Hub „Wobei können wir Ihnen helfen?“ mit den 14 Hauptzugängen des Inhabers

Baumeister, 15.11.2026. Kein git, kein Server. Eine additive Migration, gegen Postgres getestet.

Ergebnis vorab: Typprüfung, Lint, Datenbanktests und Build sind grün. Bei den Unit-Tests schlägt **ein**
Test fehl (`src/lib/wege/ablauf.test.tsx`, „zeigt auf jeder Live-Rubrikseite den Ablauf aus den
Rubrikdaten“). Die vier neuen Einstiegsseiten zeigen den Ablauf aus den Rubrikdaten nicht. Beheben ginge
nur über die Seiten selbst (nicht in den Schreibrechten) oder über eine Ausnahme im Test (G8). Siehe
OFFENE FRAGEN 1, dort steht der fertige Vorschlag.

## GEÄNDERTE DATEIEN

Neu
- src/migrations/20261115_182441_rubrik_symbole_fahrzeugklassen.ts und .json (Wertelisten additiv, Datenmigration Reihenfolge und Hub-Haken)
- src/payload/rubriken-hub.db.test.ts (Datenbanktest: frische und bestehende Datenbank, Seed-Abgleich)

Geändert
- content/rubriken.json und src/lib/data/defaults/rubriken.ts (gleichlautend; vier neue Rubriken, Namen, Kachelnamen, Reihenfolge)
- src/lib/rubriken.ts (`RUBRIK_ICONS` um vier Symbole, `RUBRIK_NACHWEISE` um `ersatznachweis`)
- src/lib/types.ts (nur `RubrikNachweis`)
- src/payload/collections/Rubriken.ts (nur Hilfetexte; die Wertelisten kommen aus src/lib/rubriken.ts)
- src/payload-types.ts (von Payload bei `migrate:create` erzeugt: Symbole, Nachweis, Hilfetexte)
- src/migrations/index.ts
- src/payload/seed.ts (nur Rubriken: `reihenfolge` und `imHub` im Abgleich)
- src/components/hub/intent-hub.tsx, src/components/hub/hub-kachel.tsx
- src/lib/navigation.ts (Zwischenzeile „Weitere Fahrzeuge“, `rubrikAbschnitte`, „Fahrzeug nicht gefunden?“)
- src/components/layout/site-header.tsx (nur die Zwischenzeile in Menü und Schublade)
- src/lib/actions/records.ts (nur die Zuordnung Klasse zu Rubrik)
- src/lib/fahrzeuge/anfrage-klassen.ts (nur `indexierbar` für Roller und Fahrrad, mit Begründung)
- src/app/llms.txt/route.ts (Abschnitt „Weitere Fahrzeuge“ mit den freigegebenen Einstiegsseiten)
- Tests: src/components/hub/hub.test.tsx, src/lib/rubriken.test.ts, src/lib/navigation.test.ts,
  src/components/layout/site-footer.test.tsx, src/lib/actions/security.test.ts,
  src/components/fahrzeug-anfrage/kern.test.ts, src/components/fahrzeug-anfrage/seiten.test.tsx, src/app/sitemap.test.ts
- dieser Bericht

Nicht angefasst: src/app/(site)/page.tsx (der Hub bekommt schon alles, der Satz kommt weiter aus
content/seo.json), src/app/sitemap.ts (liest den Schalter schon selbst), site-footer.tsx (Namen und neue
Einträge kommen aus den Rubriken), Seiten und Formulare der Rubriken, unterlagen-pflicht.ts, Preise,
Rechtstexte, content/seo.json, Farben, Marke.

## WAS UND WARUM

1. **14 Hauptzugänge in der Reihenfolge des Inhabers** (A-052), Reihenfolge 10 bis 140:
   Autoschlüssel · Motorradschlüssel · Roller und Kleinstfahrzeuge · E-Scooter und ähnliche
   Elektrofahrzeuge · Seniorenmobile und vergleichbare Fahrzeuge · Fahrradschlüssel · Schlüssel nach
   Vorlage oder einschicken · Schlüssel nach Code · Sperrschließungen und gleichschließende Zylinder ·
   Schließanlagen · Elektronische Zutrittslösungen · Sicherheitstechnik · Service vor Ort nach Termin ·
   Allgemeine Anfrage (für Sonderfälle). Ohne Kachel, Seite und Navigation bleiben: Autoschlüsselgehäuse
   (150), Schlüssel einschicken (160); danach Transponder (170, später), Finder (180), Türen (190).
   Kennungen und Adressen bleiben. Feld `name` trägt den vollen Namen des Inhabers (Navigation, Fuß,
   Kachel ab 768 px, zugänglicher Name), `laienname` den kurzen Kachelnamen fürs Telefon: Auto, Motorrad,
   Roller, E-Scooter, Seniorenmobil, Fahrrad, Nach Vorlage, Nach Code, Zylinder, Schließanlage, Zutritt,
   Sicherheitstechnik, Vor Ort, Anfrage. Jeder kurze Name steckt im vollen (Test).
2. **Vier neue Rubriken** nach FA-KERN-02B (Abschnitt GEMEINSAME DATEIEN): Symbol, Adresse, Abschluss
   `anfrage`, Ablauf mit den dort genannten Schritten. Nachweis: Roller `fahrzeugschein` (der Ablauf sagt
   „bei Versicherungskennzeichen einen Ersatznachweis“), E-Scooter, Seniorenmobil, Fahrrad
   `ersatznachweis`; Pflicht-Uploads `dokument` und `schluesselfoto` (Roller nur `schluesselfoto`, weil
   der Nachweis je Weg wechselt). Erklärung und Ablauftexte aus den Seiten von FA-KERN-02B abgeleitet,
   keine Preise, Zeiten oder Marken. Status `live`, damit die Kachel steht. Motorrad: Erklärung „Anfrage mit
   Fahrzeugschein und drei Fotos Ihres Schlüssels, wir melden uns mit Preis und Termin.“
3. **Allgemeine Anfrage → /beratung.** Geprüft: `/service-und-termin/anfrage` fragt zuerst „Worum geht
   es?“ mit neun Fachbereichen (Vorwissen nötig, bei Autoschlüssel und Vorlage zusätzlich das Tor „Was
   möchten Sie?“). `/beratung` nimmt ein Anliegen in eigenen Worten an (Thema „Etwas anderes“ möglich),
   dazu Telefon für den Rückruf. Die Rubrik `beratung` heißt jetzt „Allgemeine Anfrage“, Erklärung „für
   Sonderfälle“, Ziel bleibt `/beratung`; unter „Mehr“ steht sie damit weiter.
4. **Schema** (additiv, G6): Wertelisten Symbol (Rubrik und Ablauf, je mit Versionstabelle) um `roller`,
   `e-scooter`, `seniorenmobil`, `fahrradschluessel`; Nachweis um `ersatznachweis`. Erzeugt mit
   `sicher.sh --pg -- npx payload migrate:create rubrik_symbole_fahrzeugklassen`, dann `ADD VALUE IF NOT
   EXISTS` (wiederholbar). Dieselbe Migration setzt in bestehenden Datenbanken Reihenfolge und Hub-Haken
   (Gehäuse aus dem Hub), wie `20261115_120000_rubrik_nach_vorlage`, nur auf `rubriken` (Versionen bleiben
   Verlauf). `down` stellt die alte Reihenfolge her; die Wertelisten lassen sich nur zurückbauen, wenn
   die vier neuen Rubriken vorher gelöscht sind (Kommentar in der Datei).
5. **Seed** (wiederholbar): legt die vier Rubriken an; Namen, Kachelnamen, Erklärung (auch das entfallene
   `zusatz` bei Vor Ort) über den vorhandenen Startwert-Abgleich; neu im Abgleich `reihenfolge` und
   `imHub`, damit spätere Änderungen im Inhalt ankommen, solange der Betrieb sie nicht geändert hat.
6. **Raster** (`hubRaster` neu): Telefon drei Spalten (3, 3, 3, 3, 2), ab 768 px vier Spalten ohne
   Leitkachel (4, 4, 4, 2), letzte Reihe linksbündig (Standard des Rasters); bis drei Kacheln drei Spalten.
   Die Leitkachel ist entfernt (Regel und Prop). Kein Wischen, kein Karussell, kein Einklappen.
7. **Kachel flacher auf dem Telefon** (Mittel in der Reihenfolge des Pakets): Symbol 20 statt 28 px,
   Innenabstand `py-1.5 px-1.5`, `gap-1`, Mindesthöhe 44 px statt 96 px, kurzer Name in `text-small`
   (15 px, eine bis zwei Zeilen). Ab 768 px wie bisher (Symbol 40 px, `p-4`, Mindesthöhe 96 px) mit vollem
   Namen; ab 1280 px Titel in `text-body` (18 px) und `px-3`, damit „Sperrschließungen“ (151 px) in die
   Kachel (158 px) passt. Abstände knapper: `pt-3`, Satz `mt-1`, Raster `mt-2`, Anrufen `mt-2`; Satz auf dem
   Telefon in `text-small`, ab 640 px wie bisher `text-lead`. Die Frage bleibt mit 34 px das größte
   Element. Fokusrahmen: globaler Ring aus globals.css (`ring-2`, Abstand 2 px) bleibt; Leuchten nur bei
   Bewegung.
8. **Zugänglicher Name**: kurzer Name `aria-hidden` und ab 768 px ausgeblendet; voller Name `sr-only`,
   ab 768 px sichtbar; Erklärung ebenso, für Screenreader mit Komma abgesetzt. Die Erklärung der
   Sperrschließung („ein Schlüssel für alle Türen“) steht auch auf dem Telefon sichtbar
   (`ZUSATZ_AUF_DEM_TELEFON`, G-09: „überall“).
9. **Navigation**: Gruppe Autoschlüssel mit Zwischenzeile „Weitere Fahrzeuge“ für die vier neuen
   Rubriken (Menü und Schublade), Unterpunkt „Fahrzeug nicht gefunden?“ in der Spalte Fahrzeuge. Namen
   kommen aus den Rubriken: „Elektronische Zutrittslösungen“, „Service vor Ort nach Termin“,
   „Sperrschließungen und gleichschließende Zylinder“, „Allgemeine Anfrage“ in Navigation und Fuß. In der
   Gruppe „Schlüssel nach Code“ steht jetzt „nach Vorlage“ vor „nach Code“ (Reihenfolge des Inhabers).
10. **Klasse und Rubrik** (records.ts): Die gemeinsame Anfrage (Quelle `fahrzeug-anfrage`) prüft zusätzlich,
    dass die Rubrik ihrer Klasse besteht (Motorrad → motorradschluessel, Roller →
    roller-und-kleinstfahrzeuge, E-Scooter → e-scooter, Seniorenmobil → seniorenmobile, Fahrrad →
    fahrradschluessel, nicht gefunden und Auto → autoschluessel); abgeschaltet (Status „aus“) oder gelöscht
    heißt: abgelehnt. Die Pflichtunterlagen entscheidet weiter allein unterlagen-pflicht.ts; die Prüfung
    kommt nach ihr und lockert nichts. Vollständigkeit der Zuordnung prüft der Compiler
    (`satisfies Record<AnfrageKlasse, string>`); die Zuordnung bleibt in der `'use server'`-Datei intern.
11. **Index-Regel**: Roller und Fahrrad freigegeben (`indexierbar: true`): eigener Nutzen
    (Versicherungskennzeichen, Chip; Schloss, Schlüsselnummer, Codekarte), kein Platzhalter, eigener Text.
    E-Scooter und Seniorenmobil bleiben auf noindex: gleiche Unterzeile wortgleich, Einleitung,
    „Was wir für Sie tun“ und Absatz „Nachweis statt Fahrzeugschein“ fast gleich (R3). Die Kacheln gibt
    es trotzdem. Sitemap und llms.txt folgen dem Schalter.

## PRÜFUNG UND ERGEBNIS

Alles über `_werkstatt/ausbau/werkzeuge/sicher.sh`:
- `--json -- npx vitest run`: 192 Dateien, 2.784 Tests, davon **2.783 bestanden, 1 fehlgeschlagen**
  (`src/lib/wege/ablauf.test.tsx` › „zeigt auf jeder Live-Rubrikseite den Ablauf aus den Rubrikdaten“:
  `/roller-und-kleinstfahrzeuge/page.tsx` enthält kein `<RubrikAblauf…>`; ebenso die drei anderen neuen
  Einstiegsseiten). Vorher 192 Dateien und 2.760 Tests.
- `--json -- npm run typecheck`: ohne Fehler.
- `--json -- npm run lint`: ohne Befund.
- `--pg -- npx vitest run -c vitest.db.config.ts`: 18 Dateien, 106 Tests bestanden (neu:
  rubriken-hub.db.test.ts mit drei Tests; Migration in der globalen Einrichtung frisch gelaufen, im Test
  zweimal auf einer nachgestellten alten Datenbank).
- `--json -- npm run build`: erfolgreich, **177 von 177 Seiten**.

Neue und geänderte Tests (Auswahl):
- Hub: genau die 14 Zugänge in Reihenfolge; Raster 14 → Telefon 5 Reihen, ab 768 px 4 Reihen, nie
  Leitkachel; kurzer Name `aria-hidden` und `md:hidden`, voller Name `sr-only md:not-sr-only`, kurzer im
  vollen Namen; keine Kachelschrift unter 13 px (kein `text-caption`), Trefferfläche `min-h-touch`;
  Erklärung auf dem Telefon nur bei der Sperrschließung.
- Rubriken: Reihenfolge in Zehnerschritten in JSON und Startinhalt; jede Kachel hat eine page.tsx;
  Namen des Inhabers; Kachelnamen höchstens zwei Wörter; kein Notdienstwort bei Vor Ort (R9);
  Nachweise der neuen Rubriken (R13); Gehäuse und Einschicken ohne Kachel, aber live.
- Navigation: „Weitere Fahrzeuge“ mit den vier Rubriken, „Fahrzeug nicht gefunden?“, neue Namen,
  Beratung unter Mehr. Fuß: neue Namen da, alte weg.
- Anfrage: je Klasse sperrt die abgeschaltete eigene Rubrik den Weg, eine fremde nicht; unbekannte Klasse
  abgelehnt; Pflichtregel unverändert streng (ohne Fahrzeugschein abgelehnt).
- Index: Roller und Fahrrad ohne noindex und in der Sitemap, E-Scooter, Seniorenmobil und „nicht
  gefunden“ mit noindex und ohne Sitemap; Umschalten in beide Richtungen.
- Datenbank: frische Datenbank mit 14 Kacheln, neuen Symbolen und `ersatznachweis`; alte Reihenfolge und
  Gehäuse im Hub → Migration (zweimal) → 14 Kacheln; alte Namen mit Startwert → Seed gleicht ab,
  gepflegter Name bleibt, zweiter Lauf ändert nichts.

### Höhenrechnung 390 × 844 (aus den Klassen)

Werte: Schrift IBM Plex Sans aus node_modules/@fontsource mit fontkit gemessen; `text-display` bei 390 px
34 px, Zeilenhöhe 1,04; `text-small` 15 px; `leading-tight` 1,25; `min-h-touch` 44 px. Innenbreite
`shell` 350 px; Kachel (350 − 2 × 8) / 3 = 111,3 px, innen 111,3 − 2 − 12 = 97,3 px.

| Teil | Klassen | Höhe |
|---|---|---|
| Kopfleiste (fest, `main pt-header`) | `--header-height` 4rem | 64,0 |
| Abstand oben | `pt-3` | 12,0 |
| Bühnenband | `h-14` + `mb-2` | 64,0 |
| Frage, 2 Zeilen („Wobei können wir“ 273 px / „Ihnen helfen?“) | `text-display` 34 × 1,04 × 2 | 70,7 |
| Satz, 3 Zeilen (750 px Text auf 350 px) | `mt-1` + `text-small` 15 × 1,5 × 3 | 71,5 |
| Abstand zum Raster | `mt-2` | 8,0 |
| Reihe 1 Auto, Motorrad, Roller (je eine Zeile) | 2 + 12 + 20 + 4 + 18,75 | 56,75 |
| Reihe 2 E-Scooter, Seniorenmobil (101 px → 2 Zeilen), Fahrrad | 2 + 12 + 20 + 4 + 37,5 | 75,5 |
| Reihe 3 Nach Vorlage (92 px), Nach Code, Zylinder + „ein Schlüssel für alle Türen“ (2 Zeilen) | 2 + 12 + 20 + 4 + 18,75 + 4 + 37,5 | 98,25 |
| Reihe 4 Schließanlage (99 px → 2), Zutritt, Sicherheitstechnik (2) | wie Reihe 2 | 75,5 |
| Reihe 5 Vor Ort, Anfrage | wie Reihe 1 | 56,75 |
| Lücken zwischen den Reihen | 4 × `gap-2` | 32,0 |
| Anrufen: Nummer und Erreichbarkeit | `mt-2` + `min-h-touch` 44 + 15 × 1,5 | 74,5 |
| **Unterkante Zeile Anrufen** | | **759,7** |

Untere Leiste: `min-h-touch-lg`, Inhalt `py-2` 16 + Symbol 20 + `gap-1` 4 + Beschriftung 15, Rand 1 =
56 px, Oberkante bei 844 − 56 = **788 px**. Reserve **28 px**: Frage, Satz, alle 14 Kacheln und die Zeile
Anrufen stehen über der Leiste. Ungünstigster Fall (jede Reihe zweizeilig) wären 797 px; das tritt nur
ein, wenn auch „Auto“, „Motorrad“, „Roller“, „Vor Ort“ umbrechen (33 bis 64 px breit bei 97 px Platz).

360 × 780: Oberkante Leiste 724 px. Kachel innen 87,3 px; „Nach Vorlage“ zweizeilig, die Erklärung der
Sperrschließung bis drei Zeilen (Reihe 3: 117 px). Bis zum Raster 290,2 px; Unterkante Reihe 4 (12
Kacheln) **639 px**, Reihe 5 (14 Kacheln) **704 px** ≤ 724. Die Zeile Anrufen endet bei 778 px und liegt
dort teilweise unter der Leiste (verlangt sind zwölf Kacheln).

Sichtprobe bei 360, 390, 768, 1024, 1440 steht beim Orchestrator aus (kein Server in diesem Paket).

## BELEGE

- G12: gelesen node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-server.md (eine Datei
  mit `'use server'` oben macht ihre Ausfuhren zu Serverfunktionen); `KLASSE_RUBRIK` bleibt darum intern,
  records.ts führt weiter nur ihre Aktionen aus.
  Keine neue Next-Schnittstelle; Metadaten und Sitemap lesen den vorhandenen Schalter.
- Messung der Textbreiten: fontkit mit `@fontsource/ibm-plex-sans` (400/600/700), Laufweite der Frage
  −0,025 em. Skript nur im Scratchpad.
- Migration erzeugt mit `sicher.sh --pg -- npx payload migrate:create rubrik_symbole_fahrzeugklassen`;
  Payload schrieb dabei src/payload-types.ts neu (nur die drei Wertelisten und Hilfetexte im Diff).
- Keine echten Daten, Mails, Zahlungen; Tests mit erfundenen Namen und Dateien.

## OFFENE FRAGEN

1. **Ablauf auf den vier Einstiegsseiten (Test rot).** `ablauf.test.tsx` verlangt auf jeder Live-Rubrikseite
   `<RubrikAblauf…>` und `getRubrik('<kennung>')`. Die Einstiegsseiten aus FA-KERN-02B zeigen den Ablauf
   nicht. Seiten sind nicht in meinen Schreibrechten, eine Ausnahme im Test wäre eine Lockerung (G8).
   Vorschlag (eigenes kleines Paket oder Freigabe durch den Orchestrator): `EinstiegSeite`
   (src/components/fahrzeug-anfrage/seiten.tsx) nimmt eine Eigenschaft `ablauf?: ReactNode` und setzt sie
   vor „Das brauchen wir von Ihnen“; jede der vier page.tsx übergibt
   `ablauf={<RubrikAblaufAbschnitt rubrik={await getRubrik('<kennung>')} nummer="04" titel="So läuft Ihre Anfrage ab" />}`
   (Kennungen roller-und-kleinstfahrzeuge, e-scooter, seniorenmobile, fahrradschluessel; Nummer passend
   zur Zahl der Abschnitte). Dann ist der Test ohne Änderung grün.
2. **Satz unter der Frage auf dem Telefon drei Zeilen, nicht zwei.** Der feste Wortlaut aus content/seo.json
   (113 Zeichen) braucht bei 350 px in 15 px drei Zeilen, in 14 px knapp drei, erst 13 px ergäben zwei. Der
   Bestand hat keine Schriftstufe unter 15 px außer 12 px und nutzt keine freien Werte; Tailwind-Konfiguration
   und globals.css sind nicht in den Schreibrechten. Die Höhe reicht auch mit drei Zeilen (Reserve 28 px).
   Soll eine Stufe 13 px kommen oder der Satz kürzer werden (Inhaber)?
3. **1440 × 900:** Mit den vollen Namen sind die Kacheln ab 768 px höher (Sperrschließung: Name 3 bis 4
   Zeilen plus Erklärung). Geschätzt endet die vierte Reihe bei rund 1.000 px, also unter dem ersten
   Bildschirm; Anrufen steht rechts neben der Bühne trotzdem im Bild. Das Paket verlangt es für 390 und 360;
   die frühere Zusage im Kommentar (1440 × 900 alle Kacheln) habe ich gestrichen. Bitte in der Sichtprobe
   prüfen; Abhilfe wären kürzere Namen ab 768 px oder ein breiteres Raster neben einer schmaleren Bühne.
4. **E-Scooter und Seniorenmobil noch auf noindex** (R3, doppelter Text). Freigabe nach eigenem Text je
   Seite: Unterzeile und Einleitung in content/seo.json, Abschnitte in den page.tsx.
5. **Alte Namen außerhalb der Schreibrechte:** „Elektronische Schließsysteme“ steht noch im Wegweiser der
   Beratungsseite (src/app/(site)/beratung/page.tsx Zeile 22) und als Themenwert der Rückruf-Anfrage
   (beratung/kern.ts Zeile 12, wird im Vorgang gespeichert, Änderung braucht Rücksicht auf alte Vorgänge).
   „Schlüsseldienst vor Ort (Tür, Schloss, Zylinder)“ steht als Leistungsart im Partnervertrag
   (src/lib/pdf/partnervertrag.ts, src/payload/collections/Partnerbetriebe.ts): Vertragstext, G9. Dazu
   der Leitfaden unter docs/ (Quelle, nicht Seite) und ein Code-Kommentar im Symbol vor-ort.tsx.
6. **Zwei Seiten „Allgemeine Anfrage“:** Die Kachel führt nach /beratung (Seitentitel „Beratung mit
   Rückruf“), die Seite /service-und-termin/anfrage heißt ebenfalls „Allgemeine Anfrage“. Soll die
   Beratungsseite einen Kopf „Allgemeine Anfrage“ bekommen, oder die andere Seite anders heißen?
7. **Kachelnamen „Auto“ und „Motorrad“** gehen über die Beispiele des Pakets hinaus (Reihe 1 liest sich
   „Auto, Motorrad, Roller“, wie „Fahrrad“). Bitte bestätigen; sonst „Autoschlüssel“ (bricht auf dem
   Telefon in zwei Zeilen um, die Höhe reicht).
8. **Erklärung „Schlüssel nach Vorlage oder einschicken“:** Der bisherige Zusatz „per Foto anfragen oder
   einschicken“ hätte „einschicken“ doppelt gezeigt; jetzt „per Foto anfragen“. Bei „Service vor Ort nach
   Termin“ ist der Zusatz „vor Ort, mit Termin“ entfallen (stand schon im Namen).
9. **Pflicht-Uploads Roller** stehen nur auf `schluesselfoto`, weil der Nachweis je Weg wechselt
   (Fahrzeugschein oder Ersatznachweis); maßgeblich ist die Pflichtregel. `nachweisPruefen` kennt
   `ersatznachweis` nicht (liefert keine Meldung); das betrifft nur Wege über `QUELLE_RUBRIK` (Motorrad
   alt, Gehäuse), nicht die neuen Rubriken.
10. **Erklärungen ab 768 px**: Auf dem Telefon sind die Erklärungen von Schließanlage („wer öffnet welche
    Tür“), Vorlage und Anfrage nur für Screenreader da, sichtbar ab 768 px. G-09 verlangt die Erklärung
    überall nur für die Sperrschließung; die steht auch auf dem Telefon.

## FÜR MENSCHEN

- Inhaber: Kachelnamen fürs Telefon bestätigen (Auto, Motorrad, Roller, E-Scooter, Seniorenmobil, Fahrrad,
  Nach Vorlage, Nach Code, Zylinder, Schließanlage, Zutritt, Sicherheitstechnik, Vor Ort, Anfrage).
- Inhaber: Erklärung und Ablauftexte der vier neuen Rubriken freigeben (Backend → Rubriken), erst wenn
  der Ablauf auf den Einstiegsseiten steht (Nachbesserung, Befund 1 und 11).
- Inhaber: eigene Texte für die Seiten E-Scooter und Seniorenmobil, danach Freigabe für Suchmaschinen.
- Inhaber: Satz unter der Frage kürzer (zwei Zeilen auf dem Telefon) oder so lassen.
- Orchestrator: Entscheidung zu OFFENE FRAGEN 1 (Ablauf auf den Einstiegsseiten) und Sichtprobe bei 360,
  390, 768, 1024 und 1440 mit Bildern.
- Betrieb nach dem Livegang: Die Migration ordnet die Kacheln in der Datenbank einmal neu; eine eigene
  Reihenfolge im Backend danach bleibt erhalten.

## Nachbesserung (15.11.2026, nach zwei Gegenprüfungen)

Kein git. Schreibrechte wie im Paket. Alle Prüfungen über `sicher.sh`.

### Je Befund

1. **[rot] Einstiegsseiten zeigen den Ablauf nicht (ablauf.test.tsx:61).** Zutreffend, **nicht behoben:**
   Die Änderung liegt in src/components/fahrzeug-anfrage/seiten.tsx und den vier page.tsx, außerhalb der
   Schreibrechte; die Nachbesserung hat keine erweiterten Rechte gegeben, und eine Ausnahme im Test wäre
   eine Lockerung (G8). Fertig und geprüft liegt der Patch bereit:
   `/tmp/claude-0/-home-user-schluesselmacher24/50ccec0a-b61b-52e7-997c-918359eccaec/scratchpad/ablauf-einstiegsseiten.patch`
   (146 Zeilen, `patch -p1` im Repository). Inhalt: `EinstiegSeite` nimmt `ablauf?: ReactNode` und setzt
   ihn vor „Das brauchen wir von Ihnen“ (Nummer der Unterlagen rückt um eins); jede der vier Seiten
   übergibt `<RubrikAblaufAbschnitt rubrik={await getRubrik('<kennung>')} nummer={…} titel="So läuft Ihre
   Anfrage ab" />`. In einer Kopie des Arbeitsbaums (Scratchpad, wieder gelöscht) geprüft:
   src/lib/wege und src/components/fahrzeug-anfrage 8 Dateien, 72 Tests grün, `tsc --noEmit` ohne Fehler.
   Der Punkt „Ablauftexte freigeben“ unter FÜR MENSCHEN wartet darauf.
2. **[rot] „Elektronische Schließsysteme“ auf /beratung.** Zutreffend, **nicht behoben:**
   src/app/(site)/beratung/page.tsx:22 und beratung/kern.ts:12 liegen außerhalb der Schreibrechte (Seiten
   der Rubriken). Für das Nachpaket: Label in page.tsx auf „Elektronische Zutrittslösungen“; in kern.ts
   den neuen Wortlaut als Anzeige, der gespeicherte alte Wert bleibt gültig (Zuordnung alt auf neu bei
   Anzeige und Prüfung).
3. **[gelb] „Allgemeine Anfrage“ mit zwei Zielen.** Zutreffend, **in der Navigation behoben:** Der Link
   nach /service-und-termin/anfrage heißt in navigation.ts jetzt „Anfrage zu einer Leistung“ (Zusatz
   „Fachbereich wählen und anfragen“). „Allgemeine Anfrage“ führt in Navigation und Fuß nur noch nach
   /beratung; neuer Test: Kein Navigationslink trägt den Namen einer Rubrik mit anderem Ziel. Offen
   (außerhalb der Rechte): Die Seite /service-und-termin/anfrage nennt sich selbst „Allgemeine Anfrage“
   (anfrage/page.tsx:14 und 50, anfrage-formular.tsx:294), ebenso die Übersicht /service-und-termin
   (page.tsx:42) und content.ts:423; Titel und Brotkrume von /beratung lauten „Beratung mit Rückruf“
   (OFFENE FRAGE 6).
4. **[gelb] „Vor-Ort-Leistungen“ in der Navigation.** Zutreffend, **behoben** in navigation.ts (Spalte
   Service: „Service vor Ort nach Termin“, Test). Offen (außerhalb der Rechte): Titel und Brotkrume der
   Seite (service-und-termin/vor-ort/page.tsx:18 und 103), Übersicht service-und-termin/page.tsx:54,
   Querverweis autoschluessel/fahrzeugoeffnung/page.tsx:204.
5. **[gelb] Admin-Bezeichnung „Laienerklärung (immer sichtbar)“.** Zutreffend, **behoben:** jetzt
   „Laienerklärung (ab Tablet sichtbar)“ (Rubriken.ts); die Hilfezeile nennt die Sperrschließung.
   Keine Schemaänderung.
6. **[gelb] E-Scooter-Ablauf verspricht eine Frage nach dem Schloss.** Zutreffend, **behoben** in
   content/rubriken.json und src/lib/data/defaults/rubriken.ts: „Ob Sie noch einen Schlüssel haben. Für
   welches Schloss Sie ihn brauchen, schreiben Sie in die Beschreibung.“ Das deckt sich mit der Seite
   /e-scooter („Schreiben Sie in die Beschreibung, für welches Schloss …“).
7. **[gelb] Abgeschaltete Rubrik führt in eine falsche Fehlermeldung.** Zutreffend, **in records.ts
   behoben:** Steht die Rubrik der Klasse nicht auf „live“ (abgeschaltet, „später“ oder gelöscht), lautet
   die Meldung „Diese Anfrage ist gerade nicht möglich. Bitte rufen Sie uns an: <Nummer>.“ (ohne Nummer,
   solange in den Einstellungen ein Platzhalter steht). „Später“ sperrt jetzt ebenfalls. Unbekannte
   Klasse oder falscher Bereich bleiben bei der allgemeinen Meldung. Tests je Klasse für „aus“ und
   „später“. Offen (außerhalb der Rechte): Einstiegs- und Anfrageseiten bei abgeschalteter Rubrik auf
   notFound oder noindex und aus der Sitemap (Nachpaket).
8. **[gelb] „einschicken“ fehlt auf dem Telefon.** Zutreffend in der Sache, **nicht geändert:** Das Paket
   nennt „Nach Vorlage“ ausdrücklich als Kachelnamen (Entscheidung A-052, Punkt 1). Messung für den
   Inhaber: „Vorlage oder einschicken“ bricht bei 390 px in zwei Zeilen („Vorlage oder“ 87,9 px bei 97,3 px
   Platz), bei 360 px in drei (87,3 px Platz); Reihe 3 wird in beiden Fällen nicht höher, weil die
   Zylinder-Kachel mit Erklärung höher ist. Dann wären es drei Wörter (Test und Paketregel „höchstens zwei
   Wörter je Zeile“ anpassen). Steht unter FÜR MENSCHEN bei den Kachelnamen.
9. **[gelb] 1440 × 900: Hub nicht ganz im ersten Bildschirm.** Zutreffend (nachgerechnet: letzte Reihe
   bei rund 1.060 px), **behoben** ab 1280 px, ohne den vollen Namen aufzugeben: Kachel `xl:p-3`,
   `xl:gap-1.5`, Symbol `xl:size-8` (32 px), Mindesthöhe `xl:min-h-20`, Name `xl:text-small` (15 px statt
   18 px); Hub `xl:pt-6`, Satz `xl:mt-2`, Raster und rechte Spalte `xl:mt-6`. Rechnung unten. Die
   Zusage steht wieder im Kommentar; die Sichtprobe bei 1440 × 900 bleibt verbindlich.
10. **[gelb] Satz unter der Frage drei statt zwei Zeilen.** Zutreffend, **nicht erfüllt und nicht als
    erfüllt gemeldet:** Der Wortlaut kommt aus content/seo.json (nicht in den Rechten), eine Schriftstufe
    unter 15 px gibt es nicht (12 px wäre unter der Grenze von 13 px). Bleibt Entscheidung des Inhabers
    (FÜR MENSCHEN: Satz auf rund 80 Zeichen kürzen).
11. **[rot] Suite rot (dieselbe Ursache wie 1).** Zutreffend, **nicht behoben**, siehe Befund 1. Der Test
    ist unverändert; nach dem Patch grün.
12. **[gelb] `ersatznachweis` fällt in nachweisPruefen auf null.** Zutreffend, **nicht behoben:**
    src/lib/server/unterlagen-pflicht.ts liegt außerhalb der Schreibrechte. Heute ohne Wirkung (die neuen
    Rubriken laufen nicht über QUELLE_RUBRIK). Nachpaket: bei `ersatznachweis` mindestens ein Upload der
    Kategorie `dokument` verlangen (fail-closed), Test mit QUELLE_RUBRIK-Rubrik ohne Dokument.
13. **[gelb] Migration überschreibt eine vom Betrieb geänderte Reihenfolge.** Zutreffend, **behoben:**
    `UPDATE … SET reihenfolge = neu WHERE kennung = k AND reihenfolge = alt`, in `down` umgekehrt;
    Hub-Haken des Gehäuses bleibt fest (Entscheidung des Inhabers). Neuer Datenbanktest: Der Betrieb hat
    die Beratung auf 5 gestellt, zwei Migrationsläufe, sie bleibt bei 5, die übrigen stehen auf dem
    neuen Wert.
14. **[gelb] Einzelne Kachel bei 13 Kacheln, `reihenTelefon` und `reihenTablet` nur im Test.** Zutreffend,
    **behoben:** Die beiden Felder sind entfernt (`hubRaster` liefert nur `spalten`). Neue Tests prüfen
    die gezeichneten Spaltenklassen bei 14, 13 und 3 Kacheln und die Reihen daraus; 13 Kacheln (letzte
    Reihe eine Kachel) ist im Kommentar als bewusst hingenommen genannt (ohne Spannen nicht vermeidbar).
15. **[gelb] Name im Namen nur als Wortteil.** Zutreffend, **behoben:** `kurzImNamen` prüft ganze Wörter
    (auch mit Umlauten). Steht der kurze Name als Wort im vollen (Roller, E-Scooter, Nach Vorlage, Nach
    Code, Zylinder, Sicherheitstechnik, Vor Ort, Anfrage), bleibt er für Screenreader verborgen. Sonst
    (Auto, Motorrad, Seniorenmobil, Fahrrad, Schließanlage, Zutritt) ist er auf dem Telefon Teil des
    zugänglichen Namens und steht vorn: „Auto, Autoschlüssel“. Ab 768 px ist er ausgeblendet, dann gilt
    der volle Name. Test mit Wortgrenzen statt `toContain`.

### Höhenrechnung 1440 × 900 (aus den Klassen, Schriften mit fontkit gemessen)

Raster `xl:col-span-8` in `shell` (1.240 − 2 × 32 = 1.176 px, Spalte 68,7 px, Abstand 32 px) = 773 px;
Kachel (773 − 3 × 12) / 4 = 184 px, innen 184 − 2 − 24 = 158 px. Name 15 px × 1,375; Kachel ohne Text
12 + 12 + 2 + 32 + 6 = 64 px, Erklärung + 6 px, mindestens 80 px.

| Teil | Klassen | Höhe |
|---|---|---|
| Kopfleiste | `--header-height-md` 5rem | 80,0 |
| Abstand oben | `xl:pt-6` | 24,0 |
| Frage, eine Zeile | `text-display` 60 × 1,04 | 62,4 |
| Satz, zwei Zeilen (1.000 px Text, `max-w-measure`) | `xl:mt-2` + `text-lead` 20 × 1,55 × 2 | 70,0 |
| Abstand zum Raster | `xl:mt-6` | 24,0 |
| Reihe 1 (E-Scooter, Seniorenmobil 3 Zeilen) | 64 + 3 × 20,6 | 125,9 |
| Reihe 2 (Vorlage 3 Zeilen + Erklärung) | | 152,5 |
| Reihe 3 (Sperrschließung 4 Zeilen + Erklärung 2) | | 173,1 |
| Reihe 4 (Anfrage 2 Zeilen + Erklärung) | | 111,3 |
| Lücken | 3 × `gap-3` | 36,0 |
| **Unterkante Reihe 4** | | **859,2** |

Vorher (18 px, Symbol 40 px, `p-4`, `pt-10`, `mt-4`, `mt-8`): rund 1.060 px. Reserve jetzt rund 40 px bis
900; die Leiste des Browsers ist darin nicht gerechnet, darum die Sichtprobe. Anrufen steht in der
rechten Spalte innerhalb der Rasterhöhe. Telefon und 768 bis 1279 px unverändert.

### Prüfung nach der Nachbesserung

- `--json -- npx vitest run`: 192 Dateien, 2.787 Tests, **2.786 bestanden, 1 fehlgeschlagen**
  (unverändert `ablauf.test.tsx` › „zeigt auf jeder Live-Rubrikseite den Ablauf aus den Rubrikdaten“,
  Befund 1 und 11; mit dem Patch grün).
- `--json -- npm run typecheck`: ohne Fehler.
- `--json -- npm run lint`: ohne Befund.
- `--pg -- npx vitest run -c vitest.db.config.ts`: 18 Dateien, **107 Tests bestanden** (neu: Reihenfolge
  des Betriebs bleibt).
- `--json -- npm run build`: erfolgreich, **177 von 177 Seiten**.

### Geänderte Dateien der Nachbesserung

content/rubriken.json, src/lib/data/defaults/rubriken.ts, src/lib/actions/records.ts,
src/lib/actions/security.test.ts, src/lib/navigation.ts, src/lib/navigation.test.ts,
src/payload/collections/Rubriken.ts, src/migrations/20261115_182441_rubrik_symbole_fahrzeugklassen.ts,
src/payload/rubriken-hub.db.test.ts, src/components/hub/intent-hub.tsx, src/components/hub/hub-kachel.tsx,
src/components/hub/hub.test.tsx, dieser Bericht.

### Für Menschen (zusätzlich)

- Orchestrator: Schreibrechte für src/components/fahrzeug-anfrage/seiten.tsx und die vier Einstiegsseiten
  freigeben und den Patch anwenden (Befund 1 und 11), oder Nachpaket.
- Nachpaket (außerhalb der Rechte): Namen auf /beratung (Befund 2), Titel und Brotkrumen der Seiten
  „Allgemeine Anfrage“ und „Vor-Ort-Leistungen“ (Befund 3 und 4), Einstiegsseiten bei abgeschalteter
  Rubrik (Befund 7), `ersatznachweis` in nachweisPruefen (Befund 12).
- Inhaber: Kachelname „Nach Vorlage“ oder „Vorlage oder einschicken“ (Befund 8); Satz unter der Frage
  kürzen (Befund 10).
- Orchestrator: Sichtprobe bei 1440 × 900 verbindlich vor der Abnahme (Befund 9).

=== ENDE FA-SOFORT-05 · BEREIT ZUR RÜCKGABE ===
