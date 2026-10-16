# E4-BAUMEISTER-13 · Bericht und Abnahme

Workflow `wf_c44b91da-611`, 3 Prüfrunden, letzte Prüfung nicht bestanden. Fertigstellung und Abnahme durch den Orchestrator siehe D-029.

## Letzter Bericht des Baumeisters

E4-BAUMEISTER-13, Runde 3, Bericht (Zylinder-Konfigurator H07, /gleichschliessende-zylinder/konfigurator)

GEÄNDERTE DATEIEN
- /home/user/schluesselmacher24/src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx
  Diese Runde: `<p className="text-right">` der Zwischensumme ist jetzt `<p className="ml-auto text-right">`. Dadurch steht der Betrag auf 390 px rechtsbündig. Die Maß-Selects haben className mit font-mono font-semibold tabular-nums text-foreground (aus der vorherigen Runde, Font bestätigt). Der Wert `measureFigure` steht in Zeile 664 (uncommitted), ist aber ungenutzt.
- page.tsx: in dieser Runde nicht geändert. Die Datei erfüllt den Schritt 2 bereits.

WAS UND WARUM
- Zwischensumme mobil: Die Zeile wickelt unter die Mengenangabe, dort wirkte der Absatz linksbündig. `ml-auto` schiebt ihn ans Zeilenende, auf Desktop und Tablet bleibt er rechts (justify-between).
- Nicht gelöst, weil die Ursache außerhalb des Schreibrechts liegt (Details unter GEMEINSAME DATEIEN):
  - Mobiles Funktionsfeld (Muss 3): Das Info-Symbol überdeckt „ohne Aufpreis“, Ursache in OptionCard.
  - Maß-Select-Farbe (Soll): Ursache gefunden. `text-input` ist sowohl Schriftgrößen- als auch Farb-Token (`input`); die Farbe überschreibt text-foreground. Fix in tailwind.config.ts / controls.tsx.
  - Maßzeichnung-Schrift (Soll): Wunsch an zylinder-mass / zylinder-mass-live.tsx.
- Logik unverändert. Hooks, Handler, Zustände und Speicherschlüssel sind gleich.

GEMEINSAME DATEIEN
- src/components/forms/option-card.tsx: Überlappung im Funktionsfeld (Info-Symbol absolut rechts oben, meta läuft in die Titelzeile).
- tailwind.config.ts und src/components/forms/controls.tsx: Farbtoken `input` und Schriftgrößen-Token `input` kollidieren. Die Klasse text-input setzt `color: hsl(var(--input))`, sie steht im CSS nach `.text-foreground`. Gemessen: Select rgb(203,213,226) auf 390 und 1440 px, Token-Probe `.text-foreground` rgb(25,33,51). Betrifft alle Felder mit text-input.
- src/components/visual/generators/zylinder-mass.* und src/components/visual/interaktiv/zylinder-mass-live.tsx: Mindestschrift für A/I, außen/innen, „Mitte Stulpschraube“ (auf 390 px ca. 7-8 px).
- _werkstatt/werkzeuge/logik-ausnahmen.json: Ausnahme für B-17, falls B-17 bestehen bleibt (Orchestrator).

PRÜFUNG UND ERGEBNIS
- tsc --noEmit: 0 Fehler (Exit 0). Ausgabe /root/sm24-bilder/E4-BAUMEISTER-13/tsc-r3.txt
- eslint (beide Dateien): 0 Fehler, 1 Warnung, konfigurator.tsx:664 measureFigure. NICHT ohne Befund.
- vitest run src/components: 28 Dateien, 750 Tests, grün. Ausgabe /root/sm24-bilder/E4-BAUMEISTER-13/vitest-r3.txt
- werte-suche (beide Dateien): null Funde. Protokoll _werkstatt/protokolle/werte-suche-2026-10-16_08-18-23.json (vom Werkzeug angelegt).
- lucide-react: kein Treffer.
- Logikwächter: konfigurator.tsx ABWEICHEND, nur Teil B (B-17). Teil A gleich. Nicht bestanden, siehe Frage 1 und 2.
- Entwicklungsserver 3001 lief. Kein Messfenster-Lock.
- Bilder: mobil, tablet, desktop (--ganz) in /root/sm24-bilder/E4-BAUMEISTER-13-runde3/ (neuer Ordner, nichts überschrieben). Mobil visuell geprüft: Zwischensumme rechtsbündig (behoben); Funktion mit Überdeckung (offen); Maßbeschriftungen klein (Wunsch). Tablet und Desktop nicht einzeln durchgesehen.
- B-17: in dieser Runde nicht erneut gefahren, da nur ein className geändert wurde. Nachweis aus dem letzten Lauf: /root/sm24-bilder/E4-BAUMEISTER-13/b17-nachher.png.
- Hilfsdateien: /root/sm24-bilder/E4-BAUMEISTER-13-runde3/ (Bilder, bild-*.json, farbe*.mjs, ausschnitt-*.png). Die Textausgaben tsc-r3.txt und vitest-r3.txt liegen im älteren Ordner /root/sm24-bilder/E4-BAUMEISTER-13/ (neue Dateinamen, nichts überschrieben).
- Nichts gelöscht, nichts committet, nichts gepusht.

BILDBELEGE
- /root/sm24-bilder/E4-BAUMEISTER-13-runde3/gleichschliessende-zylinder-konfigurator__mobil__ganz.jpg
- /root/sm24-bilder/E4-BAUMEISTER-13-runde3/gleichschliessende-zylinder-konfigurator__tablet__ganz.jpg
- /root/sm24-bilder/E4-BAUMEISTER-13-runde3/gleichschliessende-zylinder-konfigurator__desktop__ganz.jpg
- /root/sm24-bilder/E4-BAUMEISTER-13-runde3/ausschnitt-zwischensumme-mobil3.png (Betrag 39,00 € rechtsbündig)
- /root/sm24-bilder/E4-BAUMEISTER-13-runde3/ausschnitt-funktion-mobil.png (Überdeckung „ohne Aufpre…“)

OFFENE FRAGEN
1. MUSS, Logikwächter ABWEICHEND (konfigurator.tsx, Teil B, B-17). Schritt-5-Vorgabe „abweichend: 0“ widerspricht B-17. Empfehlung: B-17 behalten und die Abweichung als Ausnahme in logik-ausnahmen.json eintragen. Entscheidung beim Orchestrator.
2. MUSS, ESLint konfigurator.tsx:664 (measureFigure ungenutzt). Entfernen wäre eine Teil-A-Abweichung und braucht ebenfalls eine Ausnahme. Empfehlung: entfernen plus Ausnahme zusammen mit Frage 1. Entscheidung beim Orchestrator.
3. MUSS, Mobil Funktionsfeld: Info-Symbol überdeckt „ohne Aufpreis“. Ursache in OptionCard, nicht in meinem Schreibrecht. Bitte an den Verantwortlichen für OptionCard geben.
4. SOLL, Maß-Select-Farbe: Ursache gefunden (tailwind.config.ts / controls.tsx). Umsetzung beim Orchestrator.
5. Fremde Dateien, separat gemeldet: Logikwächter ABWEICHEND bei schluessel-nach-code/[slug]/bestell-formular.tsx (Teil B, code={codeValid ? normalized : ""}). Nicht angefasst. Außerdem uncommittet geändert: tuer-und-schliesstechnik/page.tsx (nicht von mir), nicht angefasst.
6. Hinweis: B-17 in dieser Runde nicht erneut gefahren.

=== ENDE E4-BAUMEISTER-13 · BEREIT ZUR RÜCKGABE ===

## Letzte Prüfung (Runde 3)

- **muss:** Logikwächter zeigt ABWEICHEND für konfigurator.tsx (Teil B, B-17): slot={measureFigure} ist durch aussen={item.measureAMm}, innen={item.measureBMm}, form={item.form}, name={form.label} an ZylinderMassLive ersetzt (ca. Z. 780–785). Die Änderung ist im Kern B-17 vorgegeben, es fehlt aber ein Eintrag in _werkstatt/werkzeuge/logik-ausnahmen.json. Teil A ist laut git diff e3ad5bb unverändert (nur Importe, JSX, JSX-Text, className). Das Werkzeug vergleicht gegen Basis b49fe04, nicht gegen e3ad5bb. Entscheidung Orchestrator.
- **muss:** ESLint-Warnung konfigurator.tsx:664 'measureFigure' ungenutzt. Die Schnellprüfung verlangt eslint ohne Befund. Das Entfernen der Konstante ist aber eine Teil-A-Änderung und braucht ebenfalls eine Ausnahme. Konflikt zwischen Schnellprüfung und Logikregel, Entscheidung Orchestrator.
- **muss:** Mobil (390 px), Funktionsfeld, Option „Standardfunktion“: Das Info-Symbol überdeckt „ohne Aufpreis“ (Ausschnitt ausschnitt-funktion-mobil-r3b.png, im Bild abgeschnitten bei „Aufpre…“). Ursache in src/components/forms/option-card.tsx Z. 82–96: das Info-Symbol ist absolut rechts oben positioniert, das Meta steht in derselben Titelzeile. Liegt außerhalb des Schreibrechts; Befund des Baumeisters bestätigt.
- **soll:** Maß-Selects (Maß A/B) erscheinen in allen drei Ansichten hellgrau statt in text-foreground. Ursache: text-input ist sowohl Schriftgrößen- als auch Farb-Token „input“ (tailwind.config.ts Z. 45 und 118; controls.tsx Z. 9). Die Farbe überschreibt text-foreground. Außerhalb des Schreibrechts; Ursachenbefund des Baumeisters bestätigt.
- **soll:** Maßzeichnung mobil (zylinder-mass-Generator, außerhalb des Schreibrechts): Beschriftungen „außen“, „innen“, „Mitte Stulpschraube“ und die A/I-Maße sind auf 390 px etwa 7–8 px groß und kaum lesbar.
- **soll:** Alt-Neu-Liste für die Mikrotext-Änderungen fehlt im Bericht. Der Platzhalter-Hinweis wurde neu gefasst, KERN verlangt dafür eine Liste.
- **hinweis:** Eigener Prüflauf: werte-suche ohne --json hat ein Protokoll im Repository angelegt, _werkstatt/protokolle/werte-suche-2026-10-16_08-21-22.json. Nicht gelöscht, nicht committet. Künftig mit --json in /root/sm24-bilder.
- **hinweis:** page.tsx: in Zeile 1 steht eine neue leere Zeile (Diff gegen e3ad5bb). Ohne Wirkung. ROUTE, Promise.all und Props sind unverändert.
- **hinweis:** Fremde Dateien, getrennt gemeldet und nicht bewertet: schluessel-nach-code/[slug]/bestell-formular.tsx meldet Logikwächter ABWEICHEND (code={codeValid ? normalized : ""}). tuer-und-schliesstechnik/page.tsx ist uncommitted geändert.

Prüfungen: tsc --noEmit: Exit 0, 0 Fehler (/root/sm24-bilder/E4-BAUMEISTER-13-pruefung-r3/tsc.txt).
eslint beide Dateien: 0 Fehler, 1 Warnung (konfigurator.tsx:664 measureFigure). Nicht ohne Befund.
vitest run src/components: 28 Dateien, 750 Tests, alle grün (vitest.txt).
werte-suche (beide Dateien): 0 Funde, Ausnahmen 0.
grep lucide-react: kein Treffer.
Logikwächter: abweichend 2. konfigurator.tsx ABWEICHEND (Teil B, B-17), bestell-formular.tsx (fremd) ABWEICHEND.
Bilder über Port 3001, --ganz, mobil/tablet/desktop in /root/sm24-bilder/E4-BAUMEISTER-13-pruefung-r3 (bild.json): kein sichtbarer Überlauf, nichts sichtbar abgeschnitten, Zwischensumme rechtsbündig (mobil 39,00 €), Zeichnungen vollständig, keine Platzhalter. Maß-Selects hellgrau (Soll). Mobil Funktionsfeld überdeckt (muss). Mobile Zeichnungsbeschriftung klein (Soll).
B-17: eigenes Skript (desktop) bestätigt Live-Wechsel der Zeichnung 35 mm auf 27 mm beim Ändern von Maß A.
Ganzseitenbilder: keine Zeichnung mitten in der Animation gefunden.
Lock /tmp/sm24-messfenster.lock: nicht vorhanden.
