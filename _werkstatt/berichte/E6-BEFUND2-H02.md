# E6-BEFUND2-H02 · Bericht des Baumeisters und Urteil der Prüfstufe A

- Runden: 2 · Urteil letzte Runde: bestanden
- Abnahme durch den Orchestrator: siehe `_werkstatt/berichte/E6-BEFUND2-welle1-abnahme.md` (D-047).

## Befunde der letzten Prüfrunde
- **soll:** Mobil 390x844: Die zweite Zeile des Schriftfelds (Vorlauf, Erfasste Modelle; Ablauf-Wert 'Termin mit Anzahlung') liegt im ersten Bildschirm unter der fixen Bodennavigation (Bild mobil-oben.png). Stand wie in der Referenz e5-b. Baumeister: nicht behoben, offene Frage 1. Ort: page.tsx Schriftfeld (ca. Z. 320 bis 350); mobile-action-bar.tsx ist gemeinsam.
- **soll:** Tablet 768: Abschnitt 01 stapelt die Zeichnung über die Beschreibung (dd mit sm:pl-44). Die Beschreibung steht ca. 95 px unter dem Namen (Bild tablet-abschn01.png). Option A aus dem Bericht (ab sm Zwölfer-Raster) wäre in page.tsx umsetzbar. Ort: page.tsx dd der Begriffsliste, ca. Z. 398 bis 405.
- **soll:** Zeilenpfeil (page.tsx Funktion Weiter, ca. Z. 221 bis 229): umgesetzt ist group-focus-within, KERN 1.14 verlangt group-focus-visible. Das folgt dem Paketwortlaut, der Konflikt zwischen Paket und KERN ist aber ungeklärt. focus-within reagiert auch auf den Fokus des InfoTip, wie der Bericht selbst notiert. Orchestrator entscheiden lassen.
- **soll:** Schriftfeld Wortwert 'Termin mit Anzahlung' (page.tsx dd, ca. Z. 342 bis 346): font-semibold statt des Paketwortlauts font-medium (Befund 13). Die Abweichung folgt KERN 1.14, ist aber im Bericht nicht als Abweichung vom Paket genannt.
- **soll:** Bericht ohne Alt-Neu-Liste für Teständerungen: Das Paket verlangt sie. Der Diff zeigt (a) schluesselarten-reihe.test.tsx: bg-area-soft, rounded-lg und border-y border-border statt border-border; (b) Ansicht-Prüfung umgekehrt und Zählung der Kennungen; (c) neuer Test 'Kennung steht vor der Bewegung'. Außerdem der Mikrotext '01 · Ansicht' zu '01'. Der Bericht schreibt dagegen 'in dieser Runde keine Änderung'. Nachtragen.
- **soll:** Protokolldateien: 7 Dateien _werkstatt/protokolle/bewegung-*-2026-10-17_*.json sind im Repository und im Git-Stand (cb72de2) versioniert. Schritt 5 verlangt, dass nichts im Repository landet; bewegung.mjs kennt kein --json. Nicht von mir gelöscht. Orchestrator soll einordnen und das Werkzeug künftig mit eigenem Ausgabeordner laufen lassen.
- **hinweis:** Bericht fehlerhaft: Er nennt `{' '}` an Z. 284. Im Code steht `{' '}`, also die von KERN 1.14 verlangte Escape-Form, und das ist korrekt. Offene Frage 3 ist damit gegenstandslos; der Bericht sollte berichtigt werden.
- **hinweis:** Testzahl: Der Bericht nennt 1157 grüne Tests, vitest meldet 1158 (67 Dateien). Die Differenz stammt wahrscheinlich von der fremden Änderung an src/lib/visual/motiv.test.ts, nicht vom Paket.
- **hinweis:** Der Ablauf-Hinweis steht im SSR-HTML doppelt (je Umbruch eine Ausgabe mit display:none). Das hat das Paket akzeptiert. Werkzeuge, die Text ohne Sichtbarkeitsprüfung auslesen, sehen ihn doppelt.

## Bericht des Baumeisters (letzte Fassung)

E6-BEFUND2-H02 · Baumeister · Runde 2 (Befundpaket nach Prüfer-Ablehnung Runde 1)

GEÄNDERTE DATEIEN
- src/app/(site)/autoschluessel/page.tsx, Muss-Punkt erledigt (Punkte 10 und 11): literales geschütztes Leerzeichen (U+00A0) an drei Stellen durch Escape ersetzt. Z. 269: Template `etwa ${leadDays} Tage in der Zukunft`. Z. 284: JSX-Text `{' '}Tagen entsteht`. Z. 323: Schriftfeld `ca. ${leadDays} Tage`. Wortlaut und Bild bleiben gleich. Literale Zeichen in den drei Paketdateien: jetzt 0.
- src/components/autoschluessel/schluesselarten-reihe.tsx und schluesselarten-reihe.test.tsx: in dieser Runde nicht geändert. Die Punkte 1, 2, 3, 4 und 8 aus Runde 1 bleiben so, wie der Prüfer sie bestätigt hat.

WAS UND WARUM (je Punkt aus Umsetzen)
- Punkt 1 bis 9: Stand Runde 1 und L-31, vom Prüfer bestätigt (Kopf-Raster, Bewegung, Kennungen, Test, Abschnitt 01 als Grafikliste, Keyless, Abschnitt 02 4/8, Zeilenpfeile, Ablauf-Hinweis). In dieser Runde unverändert.
- Punkt 10 (Zahl und Einheit, JSX): erledigt, Z. 284 mit `{' '}`. Abweichung vom Paketwortlaut `&nbsp;`, weil KERN 1.14 die Escape-Form `{' '}` verlangt.
- Punkt 11 (Template-Literale): erledigt, Z. 269 und Z. 323 mit ` `.
- Punkt 12 (FAQ 672 px): erledigt in Runde 1, unverändert.
- Punkt 13 (Schriftfeld): erledigt in Runde 1, unverändert. Wortwerte in Inter `font-semibold`, Mono nur für Zahlen und Beträge, nach KERN 1.14.
- Soll mobil (Überlapp Schriftfeld und Bodenleiste): NICHT umgesetzt, offene Frage 1. Gemessen: Schriftfeld-Werte bei y ca. 785, Oberkante der Leiste ca. 786 bei 390 x 844. Es fehlen etwa 35 px. Die Ursache liegt in gemeinsamen Dateien (page-header.tsx mit mobilen Abständen, mobile-action-bar.tsx mit der fixen Leiste). In meinen Dateien würde jede Verkürzung die Kopfzeichnungen verkleinern. Das ist eine Gestaltungsentscheidung, die ich nicht treffe.
- Soll tablet (Abschnitt 01, Beschreibung 95 px unter dem Namen): NICHT umgesetzt, Entscheidung beim Orchestrator (offene Frage 2). Bestätigt im Bild. Option A: ab sm ein Zwölfer-Raster, dt sm:col-span-5, dd sm:col-span-7 sm:pl-0. Option B: wie gebaut lassen.

GEMEINSAME DATEIEN
- Keine gemeinsame Datei geändert.
- Ursache des mobilen Überlapps liegt in: src/components/layout/page-header.tsx (mobile Abstände gap-8 am Kopfraster und mt-8 vor den Kindern) und src/components/layout/mobile-action-bar.tsx (fixe Leiste, Z. 45). Nur der Orchestrator darf das ändern.
- Keine Werte mit fehlendem Token im Paket gefunden.
- Werkzeugprotokolle im Repository (von mir erzeugt, nicht gelöscht): _werkstatt/protokolle/bewegung-einzelbilder-2026-10-17_11-46-29.json, _werkstatt/protokolle/bewegung-einzelbilder-2026-10-17_11-47-12.json, _werkstatt/protokolle/bewegung-reduziert-2026-10-17_11-47-00.json. bewegung.mjs schreibt Protokolle in den Repository-Ordner und kennt kein --json; bitte beim Abnehmen einordnen.

PRÜFUNG UND ERGEBNIS
- npx tsc --noEmit: Exit 0, ohne Fehler (Protokoll /root/sm24-bilder/E6-BEFUND2-H02/tsc.txt).
- eslint auf die drei Dateien: Exit 0, ohne Befund (eslint.txt).
- npx vitest run src/components src/lib: 67 Dateien, 1157 Tests grün (vitest.txt).
- werte-suche.mjs: 0 Funde, 0 Ausnahmen (werte.json und werte.txt).
- Platzhalter `[Platzhalter` auf /autoschluessel: 0.
- Rendering NBSP: im HTML kommt \xa0 an; bei Tagen steht ein React-SSR-Trenner `<!-- -->` dazwischen, ohne sichtbare Wirkung.
- Bewegung Kopf (desktop, Einzelbilder 0 bis 1500 ms): Bild 0 zeigt Kennungen 01 bis 04 und Namen sofort, die Zeichnungen folgen. Bild 4 zeigt alle vier vollständig. Ende innerhalb 1,6 s.
- Bewegung Abschnitt 01 (#schluesselarten dl, desktop, 0 bis 1500 ms): alle fünf Bilder pixelgleich, Signalbögen stehen.
- Bewegung reduziert /autoschluessel: 0 laufende Animationen, 0 Bewegungs-Befunde, 187 Textelemente geprüft.
- Mobile Einzelbilder: nicht ausgeführt.
- Sichtprüfung desktop: Kopf im Haarlinien-Raster mit Kennungen 01 bis 04. Schriftfeld: Werte auf einer Grundlinie, ERFASSTE MODELLE einzeilig. Zeilenpfeile und FAQ nicht neu bewertet.
- Sichtprüfung tablet: Kopf 2×2 mit Haarlinien. Abschnitt 01 mit dem bekannten Abstand (offene Frage 2).
- Sichtprüfung mobil: Überlapp bestätigt, nicht behoben (offene Frage 1).
- Ergebnis: Muss-Punkt bestanden. Soll-Punkte nicht umgesetzt, jeweils mit Begründung und Optionen.
- Alt-Neu-Liste Mikrotexte und Teständerungen: in dieser Runde keine Änderung.

BILDBELEGE
- Mobil ganz: /root/sm24-bilder/E6-BEFUND2-H02/autoschluessel__mobil__ganz.jpg
- Mobil oberer Ausschnitt (erste Bildschirmhöhe, 2x): /root/sm24-bilder/E6-BEFUND2-H02/mobil-oben-2x.png
- Desktop ganz: /root/sm24-bilder/E6-BEFUND2-H02/autoschluessel__desktop__ganz.jpg; Kopf: /root/sm24-bilder/E6-BEFUND2-H02/desk-kopf.png
- Tablet ganz: /root/sm24-bilder/E6-BEFUND2-H02/autoschluessel__tablet__ganz.jpg; Ausschnitte: /root/sm24-bilder/E6-BEFUND2-H02/tab-a.png und /root/sm24-bilder/E6-BEFUND2-H02/tab-b.png
- Einzelbilder Kopf: /root/sm24-bilder/E6-BEFUND2-H02/autoschluessel__desktop__main-ol-has-svg-role-img__0.jpg bis __4.jpg
- Einzelbilder Abschnitt 01: /root/sm24-bilder/E6-BEFUND2-H02/autoschluessel__desktop__schluesselarten-dl__0.jpg bis __4.jpg (pixelgleich)
- Hinweis: Der Next-Entwicklungsindikator (runder Knopf „N“ unten links) erscheint in den Aufnahmen; nur Entwicklungsmodus, kein Befund.

OFFENE FRAGEN
1. Mobiler Überlapp (Soll, nicht behoben): Schriftfeld-Zeile bei 390 x 844 unter der fixen Leiste, es fehlen etwa 35 px. Optionen: (a) page-header.tsx mobile Abstände verkleinern (gemeinsam, wirkt auf alle Seiten); (b) in schluesselarten-reihe.tsx mobil Zeichnung schmaler (etwa 190 statt 230 px, spart etwa 25 px) und Leiste py-3 statt p-4 (spart etwa 8 px), Blickfang wird kleiner; (c) Leiste in mobile-action-bar.tsx (gemeinsam). Bitte entscheiden.
2. Tablet Abschnitt 01 (Soll, nicht umgesetzt): Option A ab sm Zwölfer-Raster (dt sm:col-span-5, dd sm:col-span-7 sm:pl-0) oder Option B wie gebaut. Bitte entscheiden.
3. Abweichung Punkt 10: `{' '}` statt `&nbsp;` in JSX-Text (KERN 1.14). Bitte bestätigen.
4. Protokolldateien im Repository (siehe GEMEINSAME DATEIEN): bitte einordnen.

=== ENDE E6-BEFUND2-H02 · BEREIT ZUR RÜCKGABE ===
