# E6-BEFUND2-H01 · Bericht des Baumeisters und Urteil der Prüfstufe A

- Runden: 3 · Urteil letzte Runde: nicht bestanden
- Abnahme durch den Orchestrator: siehe `_werkstatt/berichte/E6-BEFUND2-welle1-abnahme.md` (D-047).

## Befunde der letzten Prüfrunde
- **muss:** KERN K-011 Bildrate nicht erfuellt: B-01 mobil (390 px, 4-fach gedrosselt, 1600 ms, 5 Laeufe) ergibt Anteile 48,2 / 48,2 / 54,1 / 50,9 / 42,7 %, Median 48,2 % gegen Schwelle 5 % (bildrate-r3.json). Der Baumeister meldet 45,5 %. Die Messung lief auf dem Entwicklungsserver 3001 (ungebaut); die vermutete Ursache (Hydrierung im Messfenster) ist nicht geprueft. Entscheidung Messfenster oder Anlauf beim Orchestrator.
- **muss:** Stationen 1 bis 5 im Ablauf (page.tsx Z. 310, text-area-strong) verletzen KERN 1.14 K-006: nicht klickbare Stationen stehen in text-foreground. Die Bereichsfarbe Autoschluessel (220 76% 41%, src/lib/visual/area-theme.ts) liegt nah am Primaerblau (214 80% 40%). Der Baumeister hat die Stelle offen gelassen; die Anpassung des Orchestrators deckt nicht klickbare Nummern in text-foreground ab. Eine Klassenaenderung an Z. 310 genuegt.
- **muss:** Grenze verletzt: Der Baumeister hat ausschnitte/einstieg-390.png im eigenen Protokollordner ueberschrieben, statt einen neuen Ordner anzulegen (laut Bericht selbst eingeraeumt). Das Ersatzbild stammt laut Bericht von Port 3001; das Fehlbild ist nicht mehr vorhanden. Geringes Gewicht, aber eine verletzte Grenze.
- **hinweis:** Schnelleinstieg-Nummer (page.tsx Z. 238) steht in text-foreground-muted statt im Paketwortlaut text-foreground-subtle. Die Begruendung KERN 1.6 trifft nicht zu: die Section hat Standardton (Z. 206), keine surface-sunken- oder muted-Flaeche. Die Aenderung erhoeht den Kontrast und ist unbedenklich, sollte aber als Abweichung benannt werden.
- **hinweis:** Direktkauf-Pfeil (Z. 398) hat Hover und Tastaturfokus in text-area-strong statt im Paketwortlaut text-primary. Das folgt KERN 1.14 (Pfeil in der Bereichskachel, AreaScope Z. 388) und ist richtig, steht aber nicht in der Abweichungsliste des Berichts.
- **hinweis:** SectionHeading Warum wir (Z. 329) traegt zusaetzlich lg:-mt-1.5 (nicht im Paket, im Bericht gelistet). Am Desktop-Bild steht die Augenbraue auf der Oberkante der Haarlinie; optisch in Ordnung.
- **hinweis:** B-01 Zahnkranz am Fensterrand: Einzelbild 0 ms ohne Fraeser, Einzelbild 395 ms mit vollstaendig sichtbarem Zahnkranz (Zoom). Die Zeitspanne 100 bis 300 ms ist nicht belegt, weil die Einzelbild-Funktion nur fuenf feste Zeitpunkte liefert. Das Risiko von etwa 3,5 Einheiten ist weder bestaetigt noch ausgeschlossen.
- **hinweis:** Entwicklungsanzeigen in den Bildern: Next-Dev-Indikator unten links und der Redaktionshinweis im Fuss (nur im Entwicklungsmodus nach D-016). Kein Produktfehler; bei der Abnahme nicht als Befund werten.
- **hinweis:** Angaben widerspruechlich: Die Aufgabe nennt KERN 1.14, KERN.md und das Paket fuehren 1.15. Das Paket nennt Stand HEAD bb549bc, der Bericht HEAD d4a1d47. Der Diff gegen 69d821308 ist wie beauftragt geprueft. Der Orchestrator sollte die Angaben vereinheitlichen.
- **hinweis:** Ratgeber-Kennung 03 GLEICHSCHLIESSENDE ZYLINDER bricht im Tablet (768 px) ueber zwei Zeilen um. Ausserhalb des Pakets, nur vermerkt.
- **hinweis:** Die 360-px-Messung des Baumeisters (messung-einstieg-3001.json: Karte 192 px, Kennung eine Zeile, kein Ueberlauf) habe ich nicht nachgemessen. Die Daten sind in sich konsistent.

## Bericht des Baumeisters (letzte Fassung)

E6-BEFUND2-H01 · Baumeister · Bericht Runde 3 (Nachlauf nach Prüfung Runde 2)

GEÄNDERTE DATEIEN
Keine Datei in diesem Lauf geändert. git status ist sauber. Der Stand von src/app/(site)/page.tsx (13 Hunks, 71 Einfügungen, 54 Löschungen gegen 69d821308) liegt in HEAD d4a1d47. Nichts committet, nichts gepusht, nichts gelöscht.

WAS UND WARUM (je Punkt aus „Umsetzen“)
1. Kopf mobil (Befund 1): erledigt. KOPF_AUSSCHNITT_MOBIL in page.tsx Z. 38 bis 52 (x 126, hoehe 190, Vollmaße des Generators). ImagePlaceholder Z. 129 bis 133 mit className „sm24-ausschnitt-bemasst“ und ausschnitt. Die E6-L-31-Regel in globals.css Z. 698 bis 701 ist vorhanden. Die Halm-Bemaßung „Halm · 6 Einschnitte“ steht im Bild, die Nummern 1 bis 6 sind lesbar, der Streifen am linken Rand ist weg. Der Hauptknopf steht im ersten Bildschirm über der Aktionsleiste.
2. Warum wir (Befunde 2 und 3): erledigt. Z. 324 bis 357. Mobil Zeilen Nummer | Text (Textspalte etwa 290 px). Ab 1024 px Liste links in 7 Spalten, Kopf rechts in 5, die Augenbraue steht auf der Oberkante der Haarlinie. Abweichung: SectionHeading Z. 329 trägt zusätzlich `lg:-mt-1.5` zur Ausrichtung (nicht im Paket-Wortlaut).
3. Details Befund 4 (7 Tagen, ca. 7 Tage): erledigt. Z. 101 `Frühester Termin nach etwa ${leadDays} Tagen Vorlauf.`, Z. 180 `ca. ${leadDays} Tage`. Schritttext Z. 315 mit text-pretty.
4. Details Befund 5 (Linkwörter): erledigt. „Codelinien“ und „Zum Konfigurator“ entfernt (grep ohne Treffer). Der Pfeil steht in der Titelzeile (Z. 396 bis 399), die Beschreibung ist ohne flex-1.
5. Details Befund 6 (Schnelleinstieg mobil): erledigt. Z. 223 basis-3/5. Nummer Z. 238 absolut oben rechts, Textspalte Z. 246, Kennung Z. 251 mit mt-auto, uppercase und Grundlinie. Abweichung: Nummer in text-foreground-muted statt text-foreground-subtle (KERN 1.6).
6. Querbefund Zeilenpfeil (H02 Nr. 11): erledigt. Ratgeber Z. 483 (muted, Hover primary), Schnelleinstieg Z. 255 (muted, Hover area-strong), Direktkauf Z. 398 (muted, Hover area-strong). Textlinks behalten die Linkfarbe. Ratgeber-Pfeil nur im Code geprüft.
7. Querbefund Primärblau: Warum-wir-Nummern Z. 348 in text-foreground, gedeckt durch KERN 1.14 K-006. Stationen Z. 310 bleiben text-area-strong (offen, siehe unten).
8. Alt-Neu-Liste (Mikrotexte und Wortlaut):
- „Codelinien →“ entfällt (Direktkauf Schlüssel nach Code).
- „Zum Konfigurator →“ entfällt (Direktkauf Gleichschließende Zylinder). „Konfigurator“ steht nur noch sinngemäß im Kartentext („selbst zusammenstellen“).
- „nach etwa 7 Tagen Vorlauf“ mit geschütztem Leerzeichen zwischen 7 und Tagen, Wortlaut unverändert.
- Schriftfeld „ca. 7 Tage“ mit geschützten Leerzeichen, Wortlaut unverändert.
- Mobil neu sichtbar: Nummern 01 bis 08 und die Ablauf-Kennungen im Schnelleinstieg, Wortlaut unverändert aus navigation.ts.
Teständerungen: keine.

Nicht umgesetzt wie im Paket vorgesehen: PROFILSCHNITT_AUSSCHNITT und profilschnitt.tsx, Hero und SpaetVorladen, HERO_ZIELE, prefetch, PLAN_MOBIL, Texte mit Inhalt, Metadaten, JSON-LD, Datenabrufe, Hooks, Handler.

GEMEINSAME DATEIEN
Keine gemeinsame Datei verändert. Genutzt: `.sm24-ausschnitt:not(.sm24-ausschnitt-bemasst) [data-bemassung]` aus src/app/(site)/globals.css (Z. 698 bis 701). Generator PROFILSCHNITT_AUSSCHNITT unverändert. Kein Wert ohne Token (werte-suche null Funde). Kein lucide in page.tsx.

PRÜFUNG UND ERGEBNIS
Schnellprüfung (Stufe A), Protokolle in /root/sm24-bilder/E6-BEFUND2-H01-r3/:
- tsc --noEmit: Exit 0, ohne Ausgabe (tsc.log).
- eslint "src/app/(site)/page.tsx": Exit 0 (eslint.log).
- vitest run src/components src/lib seitenstruktur.test.ts: 1161 Tests bestanden, 0 fehlgeschlagen (vitest.json).
- werte-suche: null Funde (werte.json).
- Platzhalter auf / und /schluessel-nach-code/ms-01: je 0.
- Lock /tmp/sm24-messfenster.lock war während des Laufs nicht vorhanden.
- Entwicklungsserver 3001 liefert den aktuellen Stand (basis-3/5 im HTML).

Messungen:
- Bildrate B-01 mobil, 390 px, 4-fach gedrosselt, 1600 ms, 5 Läufe (bildrate-mobil-r3.json): Einzelwerte 46,8 / 47,3 / 45,5 / 44,5 / 40,4 %. Median 45,5 %, Schwelle 5 %. NICHT ERFÜLLT (K-011, Muss). Die Prüfer-Messung (Median 50,0 %) liegt in derselben Größenordnung.
- Einzelbilder mobil 0 bis 1580 ms (einzelbilder-start/, Protokoll einzelbilder-start.json): Bild 0 zeigt Rohling und Bemaßung, der Fräser ist noch nicht sichtbar. Bild 2 bei 790 ms zeigt den Fräser und das angefräste Profil. Die Zahnkranz-Beschneidung am Fensterrand habe ich nicht vermessen.
- Schnelleinstieg bei 390 px (Karte 210 px) und 360 px (Karte 192 px): Kennungen einzeilig, Textbreite 185 bzw. 167 px, kein Überlauf (messung-einstieg-3001.json, dom-pruefung-3001.json).

Falsche Ausgaben (bleiben liegen, da Port 3000 statt 3001 gemessen wurde): dom-pruefung.json, messung-einstieg.json, messung-360.json. Außerdem wurde ausschnitte/einstieg-390.png beim Neulauf auf 3001 überschrieben; das Fehlbild von Port 3000 existiert nicht mehr. Das ist mein Fehler.

Abgleich mit den Sichtabnahme-Bildern:
- e5-b H01-start__mobil__00 gegen heute: Streifen der Reide weg, Halm-Bemaßung neu sichtbar. Befund 1 behoben.
- e5-b H01-start__mobil__03 (2×2 eng) gegen heute: Zeilen Nummer | Text. Befund 2 behoben.
- e5-b H01-start__desktop__03 (vier Gleichteile) gegen heute: Liste links 7, Kopf rechts 5. Befund 3 behoben.
- Direktkauf: Die Zeichnungen fehlen in den Element-Aufnahmen, weil die Animation noch nicht lief. Im Vollbild mobil sind sie vorhanden.

BILDBELEGE
Vollbilder in /root/sm24-bilder/E6-BEFUND2-H01-r3/: start__mobil__ganz.jpg, start__tablet__ganz.jpg, start__desktop__ganz.jpg, schluessel-nach-code-ms-01__mobil__ganz.jpg.
Ausschnitte in /root/sm24-bilder/E6-BEFUND2-H01-r3/ausschnitte/: start-mobil-kopf.png, ms01-zeichnung.png (ms01-kopf.png zeigt nur den Seitenkopf), warum-wir-mobil.png, warum-wir-desktop.png, direktkauf-mobil.png, direktkauf-desktop.png, einstieg-390.png.
Einzelbilder: einzelbilder-start/ (0 bis 4).
Vergleich: /root/sm24-bilder/e5-b/H01-start__mobil__00.jpg, __03.jpg, H01-start__desktop__03.jpg.

Gegenprobe ms-01 mobil: Der angeschnittene Griff am linken Rand bleibt sichtbar, Befund 1 (halbe Form am Rand) auf dieser Seite unverändert. Keine Bemaßungsstummel. Erfüllt.

OFFENE FRAGEN
1. K-011 (Muss) NICHT ERFÜLLT: Bildrate mobil Median 45,5 % gegen 5 %. Entscheidung Messfenster oder Anlauf beim Orchestrator. Die Baumeister-Diagnose (Hydrierung im Messfenster) habe ich NICHT isoliert geprüft. Das Werkzeug bietet keine Wartezeit-Option; eine Variante mit Wartezeit wäre eine eigene Messung.
2. ms-01: Soll der Ausschnitt auf eine eigene Konstante umgestellt werden? Der gemeinsame Generator bleibt unverändert, Entscheidung beim Orchestrator.
3. Stationen Z. 310 (text-area-strong) gegen KERN 1.14 (Stationen in text-foreground): nicht im Paket, nicht geändert.
4. Abweichungen zur Bestätigung: Schnelleinstieg-Nummer in foreground-muted (Z. 238), SectionHeading Warum wir mit lg:-mt-1.5 (Z. 329).
5. Offen geblieben: optionaler Hero-Kommentar Z. 112 bis 117 nicht ergänzt. Ratgeber-Pfeil nur im Code, nicht im Bild geprüft.

=== ENDE E6-BEFUND2-H01 · BEREIT ZUR RÜCKGABE ===
