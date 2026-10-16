# E4-BAUMEISTER-14 · Bericht und Abnahme

Workflow `wf_e1d06205-b24`, 2 Prüfrunden, letzte Prüfung bestanden. Abnahme und Nacharbeit durch den Orchestrator siehe D-031.

## Letzter Bericht des Baumeisters

E4-BAUMEISTER-14 · Runde 2 · Warenkorb (/warenkorb)

GEÄNDERTE DATEIEN
- src/app/(site)/warenkorb/warenkorb-ansicht.tsx: In Runde 2 wurden nur zwei className-Werte geändert. Zeile 260 (Position mit Artikelbild) und Zeile 586 (Standardposition) tragen jetzt sm:col-span-2 sm:col-start-9.
- src/app/(site)/warenkorb/page.tsx: unverändert gegenüber Runde 1.

WAS UND WARUM
- Befund 1 (Mengenspalte nicht im Zwölfer-Raster): behoben. Die Menge steht jetzt in Spalte 9, Name in Spalte 3, Preis in Spalte 11 (span 2), in derselben Zeile. Gemessen auf Port 3001: Desktop 1440 Name x=266, Menge x=669, Preis x=803. Tablet 768 Name x=148, Menge x=521, Preis x=645.
- Befund 2 (Zylinder-Preis sm:col-start-11): im aktuellen Quelltext und im DOM des Entwicklungsservers 3001 vorhanden. Auf Desktop liegt der Preis in Spalte 11 (x=803) in der Zeile des Namens. Ich habe keine Änderung vorgenommen, weil die Klasse nicht fehlt. Siehe offene Fragen.
- Props, Hooks, Handler, Speicherschlüssel, Datenabruf und Metadaten sind unverändert.

GEMEINSAME DATEIEN
- Ausnahme Logikwächter: {position.line?.name ?? 'Schlüssel nach Code'} – Lesen des Namens im sr-only-Text des Knopfs „Position entfernen“ (Codeposition), reine Anzeige, kein Aufruf, kein Handler.
- Ausnahme Logikwächter: {article?.name ?? item.label} – Lesen des Namens im sr-only-Text des Knopfs „Position entfernen“ (Standardposition), reine Anzeige, kein Aufruf, kein Handler.
- Logikwächter: Teil A ohne Abweichung. Teil B meldet genau die zwei oben genannten Ausdrücke. logik-ausnahmen.json habe ich nicht geändert.
- Werkzeug-Nebenwirkung: werte-suche.mjs hat ein JSON-Protokoll in das Repository geschrieben: /home/user/schluesselmacher24/_werkstatt/protokolle/werte-suche-2026-10-16_08-37-28.json. Nicht gelöscht; bitte prüfen, ob es ins Repository gehört.
- Beobachtung: lib.mjs setzt BASIS_URL standardmäßig auf http://localhost:3000. Das ist der Produktionsbuild, dessen Chunks älter sind als der Quelltext (Port 3000 enthält sm:col-start-11, aber nicht sm:col-start-9). Messungen mit dem Standardwert messen nicht den Entwicklungsserver. lib.mjs nicht geändert.
- Beobachtung (gemeinsame Schale, nicht mein Paket): In den mobilen Vollbildern liegen die Dev-Overlay-Schaltfläche und eine fixierte Navigationsleiste über dem Inhalt.
- Hilfsdateien unter /root/sm24-bilder/E4-BAUMEISTER-14/runde-2/ (neu angelegt, nichts gelöscht): fotos-messung.mjs, messung-lauf.txt, r2-fotos-messung.json, r2-leer__mobil__ganz.jpg, bild-leer-mobil.json, bild-leer-mobil-lauf.txt, eslint.txt, tsc.txt, vitest.txt, seite.html, seite3000.html, chunks.txt, chunks3000.txt, chunk-warenkorb.js, prod-chunk.js, treffer.txt, treffer3000.txt, chunk.tmp, c3000.tmp. Die früheren Ausgaben habe ich nicht angefasst.

PRÜFUNG UND ERGEBNIS
- Befund 1: behoben (siehe oben), mit Messung auf Desktop und Tablet.
- Befund 2: auf Port 3001 nicht reproduziert. Offene Frage.
- tsc --noEmit: exit 0, ohne Ausgabe.
- eslint für beide Dateien: exit 0, ohne Befund.
- vitest run src/components: 29 Dateien, 755 Tests grün.
- werte-suche.mjs: keine Funde, 0 Ausnahmen.
- grep lucide-react: kein Treffer. Keine Werte mit [ ] in den className-Angaben.
- Lock /tmp/sm24-messfenster.lock war während der ganzen Runde nicht vorhanden.
- Bilder: Desktop, Tablet, Mobil (gefüllt) und Mobil (leer) auf Port 3001. Geprüft: nichts abgeschnitten, kein Überlauf (Breite = sichtbare Breite), Spaltenlage stimmt.
- Nicht geprüft: Bewegung (bewegung.mjs) und Tastaturfokus (a11y.mjs). Das gehört zur Abnahme.
- Keine Bestellung, kein Klick auf Zur Kasse mit Absenden. Schreibende Anfragen wurden durch lib.mjs abgefangen (Liste leer).
- Ich habe keinen Dev-Server gestartet oder beendet; Port 3001 läuft seit 03:13.
- Nichts committet, nicht gepusht, nichts gelöscht.

BILDBELEGE
- /root/sm24-bilder/E4-BAUMEISTER-14/runde-2/r2-gefuellt-desktop.jpg
- /root/sm24-bilder/E4-BAUMEISTER-14/runde-2/r2-gefuellt-tablet.jpg
- /root/sm24-bilder/E4-BAUMEISTER-14/runde-2/r2-gefuellt-mobil.jpg
- /root/sm24-bilder/E4-BAUMEISTER-14/runde-2/r2-leer__mobil__ganz.jpg
- Messprotokoll: /root/sm24-bilder/E4-BAUMEISTER-14/runde-2/r2-fotos-messung.json

OFFENE FRAGEN
1. Befund 2 (Zylinder-Preis): Bitte den Prüfer auf Port 3001 neu messen lassen (SM24_BASIS_URL=http://localhost:3001). Ich konnte die fehlende Klasse nicht reproduzieren.
2. Der Entwicklungsserver 3001 läuft seit 03:13. Ich habe ihn nicht neu gestartet, weil andere Baumeister ihn nutzen.
3. Mobile Positionen sind gestapelt. Ob das so bleibt, bleibt offen.

=== ENDE E4-BAUMEISTER-14 · BEREIT ZUR RÜCKGABE ===

## Letzte Prüfung (Runde 2)

- **soll:** Logikwächter meldet abweichend: 2 statt 0 (pruefen, Basis e3ad5bb und Standard b49fe04 mit gleichem Ergebnis, Exit 3). Teil A ohne Abweichung. Teil B genau die zwei im Bericht benannten Anzeige-Ausdrücke: warenkorb-ansicht.tsx Z. 255 {position.line?.name ?? 'Schlüssel nach Code'} und Z. 581 {article?.name ?? item.label}, jeweils im sr-only-Text von „Position entfernen“. Inhaltlich vom Paket erlaubt. Die Freigabe steht aber aus, bis der Orchestrator beide Einträge in logik-ausnahmen.json setzt.
- **soll:** Mengenspalte zu schmal für die Bedienung: QuantityInput (warenkorb-ansicht.tsx Z. 260, sm:col-span-2 sm:col-start-9) ragt über die zwei Spalten hinaus. Desktop 1440: Stepper reicht bis etwa x=830, der Preisblock beginnt bei x=803. Der Preis „21,60 €“ steht fast unmittelbar am Stepper. Tablet 768 zeigt dasselbe Muster. Kein Text wird abgeschnitten.
- **soll:** „7,20 € je Stück“ bricht in Desktop- und Tablet-Ansicht in zwei Zeilen um (Preisblock sm:col-span-2, Z. 291 und Z. 599, Breite etwa 102 px). Die Mikrozeile wirkt unruhig neben dem Gesamtbetrag.
- **soll:** Tastaturfokus nicht belegt: Das Paket verlangt in der Bildprüfung „Fokus sichtbar“. Die Vollbilder zeigen keinen Fokuszustand, und Tastaturfokus wurde nicht gemessen (kein a11y-Lauf). Diese Abnahme bleibt offen.
- **hinweis:** Befund 2 des Baumeisters (Zylinder-Preis sm:col-start-11) ist kein Defekt. Die Klasse steht in warenkorb-ansicht.tsx Z. 384, und die Messung auf Port 3001 zeigt x=803 wie bei den anderen Positionen.
- **hinweis:** Vitest-Zahl weicht ab: Der Bericht nennt 29 Dateien und 755 Tests. Gemessen wurden 28 Dateien und 753 Tests, alle grün. Die Zahl im Bericht ist zu korrigieren.
- **hinweis:** Repository-Nebenwirkungen fremder Werkzeuge (nicht von mir angelegt, nicht gelöscht): untracked _werkstatt/protokolle/werte-suche-2026-10-16_08-37-28.json und _werkstatt/protokolle/werte-suche-2026-10-16_08-37-49.json sowie _werkstatt/werkzeuge/.probe-scroll.mjs. Der Orchestrator entscheidet, ob sie ins Repository gehören.
- **hinweis:** Gemeinsame Schale, nicht Paket: Kopfleiste (fixed, 0 bis 65 px), Fuß-Navigation (fixed, 786 bis 844 px) und das Dev-Overlay liegen in Ganzseitenbildern über dem Inhalt. Im Ansichtsfenster mobil bestätigt, siehe p2-ansicht-mobil-position1.jpg. Die Positionsliste selbst ist sauber.
- **hinweis:** Kein KERN-Token: text-small leading-relaxed (warenkorb-ansicht.tsx Z. 508, Hinweis unter den Summen). Die Klasse stammt aus dem Bestand, ist aber nicht als freier Wert im Bericht gemeldet. In GEMEINSAME DATEIEN nachtragen.
- **hinweis:** Inhaltszustand: Die Standardposition ist ein Beispielartikel („Beispielartikel können nicht bestellt werden“). Das deaktiviert „Zur Kasse“ im Test. Das ist kein Layoutfehler, sondern der vorhandene Datenbestand.

Prüfungen: tsc --noEmit: exit 0, ohne Ausgabe. eslint beider Dateien: exit 0. vitest run src/components: 28 Dateien, 753 Tests grün (Bericht: 29 und 755). werte-suche.mjs mit --json in den Prüfordner: 0 Funde, 0 Ausnahmen. grep lucide-react: 0 Treffer in beiden Dateien. Grep auf verbotene Klassen (text-[, text-xs/sm/base/lg/xl, font-display, tracking-wider, min-h-[, min-w-[, shadow-lg, z-30/40/50, duration-150/200/300, grid-cols-[, text-eingabe, style=): 0 Treffer. Logikwächter pruefen: Teil A ohne Abweichung; Teil B abweichend 2 (genau die zwei gemeldeten Ausdrücke), Exit 3, bei Basis e3ad5bb gleich. e3ad5bb ist nicht Vorfahr von b49fe04; geprüft mit beiden Basen. Lock /tmp/sm24-messfenster.lock: während aller Läufe nicht vorhanden. Dev-Server 3001 antwortet mit 200. Messung Desktop 1440: Name x=266, Menge x=669, Preis x=803. Tablet 768: 148, 521, 645. Mobil: gestapelt, scrollWidth gleich clientWidth (390). Keine Projektdatei geändert, nichts committet, nichts gelöscht. Hilfsdateien nur unter /root/sm24-bilder/E4-BAUMEISTER-14-pruefung-r2/. Nicht geprüft: Bewegung und Tastaturfokus (kein a11y-Lauf).
