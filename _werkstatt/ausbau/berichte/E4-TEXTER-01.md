# E4-TEXTER-01 · Texte Hub, Kacheln, Autoschlüssel-Rubrik

Stand 2026-11-03 · Protokoll: `_werkstatt/ausbau/protokolle/E4-TEXTER-01-laengen.log`

## GEÄNDERTE DATEIEN
- `content/rubriken.json`: 16 Felder (13 erklaerung, 1 laienname, 2 ablauf)
- `content/seo.json`: 10 Felder (1 Startseite, 9 Autoschlüssel-Seiten; subline und intro)

## WAS UND WARUM
- **Regeln:** Fünf Gedankenstriche in den Autoschlüssel-Seiten durch Satzende, Komma oder Doppelpunkt ersetzt. Die vage Wendung „mit klarem Ablauf“ gestrichen.
- **Länge:** „Türen und Schließtechnik“ brauchte drei Zeilen. Jetzt „Türen und Schlösser“, zwei Zeilen.
- **Ehrlichkeit:** Die Startseiten-Subline sagte „verschicken sie“ und meinte alle Schlüssel. Belegt ist Versand nur für Schlüssel nach Code. Neu: „Wir fertigen in Wetzlar. Schlüssel nach Code schicken wir in ganz Deutschland.“
- **Kosten (K-010):** 13 Rubrik-Erklärungen nennen jetzt den Kostenschritt aus dem Ablauf. Keine neuen Zahlen, Fristen oder Versprechen.
- **Laiensprache (Glossar K-012a):** Transponder, Bart, Wegfahrsperre, Anlernen, Maß A und B beim ersten Auftreten erklärt. „Rubrik“ entfernt. Titel „Transponder klären“ jetzt „Chip im Schlüssel klären“.
- **Unverändert:** id, name, ziel, icon, status, reihenfolge, navigation, imHub, bereich, abschluss, nachweis, pflichtUploads, Platzhalter, Anzahlung (G9), Preise, Rechtstexte, seo.title, seo.description, zusatz „ein Schlüssel für alle Türen“.

Gemessene Zeilen (alle Felder im Protokoll):

| Feld | Zeilen vorher → nachher | Grund |
|---|---|---|
| tuer-und-schliesstechnik.laienname (101 px, 15 px) | 3 → 2 | Grenze zwei |
| seo startseite.subline (350 px, 18 px) | 2 → 2 | Versand präzisiert |
| seo autoschluessel.subline (350 px) | 4 → 3 | Richtwert |
| seo autoschluessel/programmieren.subline | 2 → 2 | Transponder erklärt |

## GEMEINSAME DATEIEN (gewünschte Änderungen als exakte Liste)
**Blocker:** Der Test „content/rubriken.json entspricht dem Startinhalt“ (`src/lib/rubriken.test.ts`, Zeile 35) wird rot, weil die Startwerte im Code alt sind. Gewünscht in `src/lib/data/defaults/rubriken.ts`, Werte 1:1 aus `content/rubriken.json`:

autoschluessel.erklaerung · motorradschluessel.ablauf[2].titel · autoschluessel-gehaeuse.erklaerung · schluessel-nach-code.erklaerung · schluessel-nach-foto.erklaerung · schluessel-einschicken.erklaerung · sperrschliessung.erklaerung · sperrschliessung.ablauf[1].text · schliessanlage.erklaerung · elektronische-schliesssysteme.erklaerung · sicherheitstechnik.erklaerung · schluesseldienst-vor-ort.erklaerung · beratung.erklaerung · transponder-kopie.erklaerung · tuer-und-schliesstechnik.laienname · tuer-und-schliesstechnik.erklaerung

## PRÜFUNG UND ERGEBNIS
- Beide JSON-Dateien gültig, `git diff` zeigt nur die 26 Felder.
- Messung: Chromium 153, IBM Plex Sans aus `src/fonts`, Trennung `auto 4 5`. Größte Zeilenzahl: Laienname 2 (Grenze 2), Zusatz 2 (Grenze 2), Startseiten-Subline 2 (Grenze 2 bei 390 px). Ohne Trennung ebenfalls 2.
- Im Umfang keine Gedankenstriche, Ausrufe, Fragezeichen oder Floskeln. Jede erklaerung höchstens 140 Zeichen.
- Vitest Paketumfang (`sicher.sh --json`): 8 Dateien, 63 Tests grün.
- Ergänzend: `seitentexte.test.ts` 8 von 8 grün. `rubriken.test.ts` 11 von 12 grün, der rote Test ist der Blocker oben.
- `sicher.sh` schreibt `protokolle/datenweiche.log` fort (Werkzeug, nicht von mir geändert).

## BELEGE
- Scratchpad: `messen.js`, `ergebnis-vorher.json`, `ergebnis-nachher.json`, `vitest-paket.out`, `vitest-zusatz.out`
- Quellen: KERN K-010 und K-012a (Glossar), AUFTRAG Abschnitt 14, Ablauf in `content/rubriken.json`

## OFFENE FRAGEN
1. **R13 (Berechtigungsnachweis):** Die Ablauftexte von schluessel-nach-code, schluessel-nach-foto, schluessel-einschicken und transponder-kopie nennen den Nachweis nicht (Feld `nachweis`). Nicht ergänzt, weil der Schritt im Bestand fehlt. Entscheidung nötig.
2. **Kosten bei schluesselfinder:** Der Bestand nennt keinen Preis. Erklärung unverändert. Inhaber-Antwort nötig.
3. **Außerhalb des Umfangs:** Gedankenstriche in seo.json bei schluessel-nach-vorlage (subline, Linktext), schluessel-einschicken.subline, schluessel-nach-code.intro, elektronische-zutrittsloesungen.intro und partner-werden.subline. Dazu neun Linktexte als Fragen. Für ein Folgepaket.
4. **Datenbank-Seed:** `src/payload/seed.ts` gleicht die Rubrik-Texte ab. Die Änderungen wirken dort erst bei einem Seed-Lauf. Ungeprüft: ob im Admin gepflegte Werte überschrieben werden.
5. **Hub-Trennung:** „Schlüsseldienst vor Ort“ wird bei 101 px als „Schlüsseld-ienst“ getrennt. Regelkonform, aber unschön. Ändern nur über den Namen.
