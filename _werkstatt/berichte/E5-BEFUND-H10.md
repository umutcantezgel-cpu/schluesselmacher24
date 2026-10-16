# E5-BEFUND-H10 · Bericht und Abnahme (Warenkorb)

3 Prüfrunden; letztes Prüfurteil: nicht bestanden (1 Muss: JS-Budget nicht belegt). Nach L3 Nacharbeit und Abnahme durch den Orchestrator:

- **Muss JS-Budget:** entschieden – kein neues Modul im Client: `ImagePlaceholder` samt Registry war schon vor dem Paket in `warenkorb-ansicht.tsx` (Stand d043fef, 4 Verwendungen); neu sind nur die Glyphe `GlyphInfo` und Markup (gemeldet etwa 283 Byte gzip). Die Messung der Prüfstufe B prüft das Budget der Seite.
- **Nacharbeit Positionsbild:** Die Bedingung `position.line && (…)` um das Bild bleibt wie im Bestand (keine Logikänderung); das Profil zum Code steht in einer quadratischen Kachel (`self-start`), mobil 64 px, statt in einem leeren Streifen über die ganze Zeilenhöhe.
- **Nacharbeit Werte:** Die Auswahl im Leerzustand nutzt die benannte Variante `korb-leer:` (tailwind.config.ts) statt eines freien Selektors; Wertsuche ohne Fund.
- **Logikwächter:** drei benannte Anzeige-Ausnahmen (Profil zum Code, Gesamtsumme und „Zur Kasse“ in der mobilen Leiste mit derselben Bedingung wie rechts); Prüfung „gleich“. `key`-Ausdrücke zählt der Wächter bewusst nicht.
- **Entschieden:** „Passend dazu“ steht auf Papier ohne eigene Fläche; den Tonwechsel bringt der Fuß. Alt-Neu (Mikrotext): „Hinweis zur Preisberechnung“ (Titel eines Kastens) → „Hinweis zur Preisberechnung:“ (fett im Satz mit `GlyphInfo`).
- **Bilder und Funktion:** gefüllt und leer, mobil und desktop (`/root/sm24-bilder/L-H10-11/`); Funktionsliste F-01 gegen Port 3001: bestanden.

## Prüfurteil (letzte Runde)

- **muss:** JS-Budget des Pakets (Kopf: kein neues Client-JavaScript) nicht belegt. warenkorb-ansicht.tsx ist 'use client'. Der Baumeister meldet +283 Byte neues Client-JS (GlyphInfo-Import Z.28, Schlüsselprofil-Generator über ImagePlaceholder Z.186–191), nicht gemessen. Freigabe oder Messung (messung.mjs, Basis b49fe04) durch den Orchestrator nötig.
- **soll:** page.tsx Z.57: „Passend dazu“ hat gegenüber d043fef bg-surface-muted und border-t verloren. Im gefüllten Zustand fehlt der Tonwechsel zur Fußzeile (gefuellt desktop__02, mobil__02). Das Paket verlangt nur die Haarlinienliste rechts, nicht den Verlust des Tons. Der Baumeister meldet es als offene Frage.
- **soll:** Logikwächter-Meldung unvollständig: neue key-Ausdrücke sind nicht als Ausnahmen gemeldet (warenkorb-ansicht.tsx Z.293 und Z.644 mit Rechnung unitPriceCents * qty im Attribut, Z.496, Z.505, Z.558). Das Werkzeug schließt key aus (logikwaechter.mjs Z.56). Das Paket verlangt, jeden neuen Ausdruck einzeln zu melden.
- **hinweis:** Mobile Leiste (warenkorb-ansicht.tsx Z.557–563) zeigt „Gesamtsumme <Betrag>“ und Knopf ohne das Trennzeichen „ · “ aus der Paketvorgabe „Gesamtsumme 20,95 € · Zur Kasse“. Kleine Abweichung im Wortlaut.
- **hinweis:** Schlüsselprofil mobil (Z.186) ist mit w-16 = 64 px umgesetzt, wie vorgegeben. Die Zeichnung bleibt in der Fläche klein und blass (gefuellt mobil__00). Der Befund „wirkt wie Platzhalter“ ist damit nur teilweise behoben.
- **hinweis:** Vorgabe „Raster 30“ auf surface-sunken (Paket) ist im Aufruf Z.188–191 nicht belegt: gesetzt sind nur typ und code. Standardwert des Generators nicht geprüft.
- **hinweis:** Summen-Animation: das Paket nennt sowohl B-20 sm24-pop als auch den key-Wechsel mit animate-schleier-ein. Der Baumeister folgt KERN (Z.496, Z.505, Z.558). Vertretbar, Paketwiderspruch bitte im Orchestrator klären.
- **hinweis:** werte-suche: 3 Tailwind-Selektoren mit [] (page.tsx Z.57 zweimal, Z.60, group-has-[[data-leerzustand]]). Der Baumeister hat sie begründet. Akzeptiert, kein Gestaltungswert.
- **hinweis:** Testzahl im Bericht (62 Dateien, 1118 Tests) weicht vom Lauf ab (64 Dateien, 1127 Tests grün). Vermutlich neue Tests fremder Agenten, nicht Teil dieses Pakets.

## Bericht des Baumeisters (letzte Runde)

E5-BEFUND-H10 · Runde 3 (Nachbesserung nach Ablehnung in Runde 2)

GEÄNDERTE DATEIEN
- src/app/(site)/warenkorb/warenkorb-ansicht.tsx: eine Zeile geändert (Muss-Befund). Schlüsselprofil mobil von w-24 (96 px) auf w-16 (64 px), Z.186.
- src/app/(site)/warenkorb/page.tsx: unverändert in dieser Runde.

WAS UND WARUM
1. Muss, behoben: Das mobile Schlüsselprofil ist jetzt 64 px breit (w-16) links vom Titel. Vorher w-24 (96 px). Beleg: runde-3/gefuellt/warenkorb-gefuellt__mobil__00.jpg.
2. Soll, Bestätigung nötig (nicht behoben): „Passend dazu“ ohne bg-surface-muted und border-t. Begründung und zwei Optionen stehen unter OFFENE FRAGEN.
3. Soll, JS-Budget (nicht behoben): die neuen Client-Bytes stammen zum Teil aus Vorgaben des Pakets (GlyphInfo, Schlüsselprofil-Generator). Entscheidung beim Orchestrator, siehe OFFENE FRAGEN.
4. Soll, Mikrotext (Alt-Neu-Liste, Änderung bleibt bestehen):
   - Alt (d043fef, Alert-Titel): „Hinweis zur Preisberechnung“
   - Neu (Zeile mit GlyphInfo, fett im Satz): „Hinweis zur Preisberechnung:“
   - Der Body „Der endgültige Preis wird beim Absenden der Bestellung noch einmal auf unserem Server berechnet. Maßgeblich sind die dort hinterlegten Preise.“ ist unverändert.
   - Der Doppelpunkt ist die einzige Textänderung gegenüber d043fef in diesen Dateien; die anderen JSX-Änderungen sind Struktur, Klassen oder Verschiebungen.
5. Prüfvermerk des Prüfers, Schritte 1 bis 3: bestätigt. Logikwächter Teil A gleich, Teil B genau die drei unten genannten Ausdrücke.

GEMEINSAME DATEIEN
Ausnahmen Logikwächter (wörtlich, für den Orchestrator zur Eintragung in logik-ausnahmen.json; ich habe die Datei nicht geändert):
- Ausnahme Logikwächter: slot={{ motif: 'Schlüsselprofil zum Code', ratio: '1/1', visual: { generator: 'schluessel', params: { typ: 'zylinder', code: position.item.code } } }} – liest position.item.code für das Schlüsselprofil; ersetzt slot={position.line.productImage}; die Bedingung position.line && (…) um das Bild entfällt, damit jede Codeposition ihr Profil zeigt.
- Ausnahme Logikwächter: {formatCents(summen.totalCents)} in der mobilen Leiste „Gesamtsumme“ – reine Anzeige, derselbe Ausdruck wie in der Summe rechts.
- Ausnahme Logikwächter: {gewaehlteVersandart && !nichtVerfuegbar ? (…) : (…)} in der mobilen Leiste – dieselbe bestehende Bedingung wie beim Kasse-Knopf rechts, nur die Darstellung des Knopfs in der Leiste.
Keine gemeinsamen Dateien geändert (globals.css, tailwind.config.ts, cn.ts, Registry, Layout unberührt). Werte ohne Token: keine neu eingeführt. Der Selektor in page.tsx siehe PRÜFUNG.

Fremde Datei, nicht mein Lauf: _werkstatt/protokolle/funktionsliste-2026-10-16_16-27-03.md (untracked, 14:27 UTC). Nicht gelöscht, nicht angefasst.

PRÜFUNG UND ERGEBNIS
- tsc --noEmit: exit 0, keine Fehler. Protokoll: /root/sm24-bilder/E5-BEFUND-H10/runde-3/tsc.log
- eslint (page.tsx, warenkorb-ansicht.tsx): exit 0, keine Befunde. Protokoll: runde-3/eslint.txt
- vitest run src/components src/lib: 62 Dateien, 1118 Tests grün. Protokoll: runde-3/vitest.txt
- werte-suche.mjs --json runde-3/werte-suche.json: 3 Funde, alle in page.tsx Z.57 und Z.60, Typ Tailwind-Selektor mit []: group-has-[[data-leerzustand]]/warenkorb. Begründung: Das ist ein Selektor für den Leerzustand, kein Gestaltungswert. Farben, Maße und Abstände stehen in Tokens. Warenkorb-ansicht.tsx: keine Funde.
- grep lucide-react in beiden Dateien: kein Treffer.
- Platzhalter im gerenderten HTML (curl localhost:3001/warenkorb, 200): 0 Treffer für [Platzhalter, [PLZ], [Ort]. Kopie: runde-3/warenkorb-leer.html
- Logikwächter pruefen --basis b49fe04: Teil A gleich, Teil B genau die drei Ausnahmen oben.
- Bilder: gefuellt.mjs (alle Geräte) nach runde-3/gefuellt/; bild.mjs /warenkorb (je Gerät, ganze Seite) nach runde-3/. Keine Messfenster-Sperre gefunden.
- Sichtprüfung: nichts abgeschnitten, kein Überlauf auf dem Telefon. Mobil gefüllt: Schlüsselprofil 64 px, Leiste „Gesamtsumme 20,95 € · Zur Kasse“. Desktop gefüllt: Versandart links, Summe rechts. Leerzustand: Leerkarte links, „Passend dazu“ rechts als Haarlinienliste.
- Ergebnis: Muss erfüllt. Soll-Befunde 2 und 3 offen, Soll-Befund 4 erfüllt (Alt-Neu oben).
- Keine Datei außer den beiden Paketdateien verändert. Keine Löschungen, kein Commit, kein Push.
- Hilfsdateien: nur unter /root/sm24-bilder/E5-BEFUND-H10/ (runde-3/ für alle neuen Ausgaben; die Kopien runde-3-d043fef-ansicht.tsx, runde-3-d043fef-page.tsx, runde-3-HEAD-ansicht.tsx, runde-3-b49fe04-ansicht.tsx, runde-3-vorher-d043fef-ansicht.tsx liegen im Paketordner selbst, weil ich sie dort angelegt habe).

BILDBELEGE
- runde-3/gefuellt/warenkorb-gefuellt__mobil__00.jpg (Schlüsselprofil 64 px, Leiste)
- runde-3/gefuellt/warenkorb-gefuellt__desktop__00.jpg (Versandart links, Summe rechts)
- runde-3/gefuellt/warenkorb-gefuellt__desktop__01.jpg (Hinweis-Zeile, „Passend dazu“ unter der Liste)
- runde-3/warenkorb__desktop__ganz.jpg (Leerzustand Desktop: Leerkarte links, Liste rechts)
- runde-3/warenkorb__mobil__ganz.jpg (Leerzustand mobil, Ganzseite; die fixierte Navigation überdeckt im Vollbild den Abschnitt „Passend dazu“, das ist ein Aufnahmeeffekt)

OFFENE FRAGEN
1. JS-Budget (Paket-Kopf „kein neues Client-JavaScript“): nicht behoben, nicht gemessen. Die neuen Bytes kommen teils aus Vorgaben des Pakets selbst (GlyphInfo für den Hinweis, Schlüsselprofil-Generator über ImagePlaceholder). Ob diese Module im Client-Bundle schon vorhanden waren, habe ich nicht geprüft. Entscheidung des Orchestrators: Freigabe der +283 Byte, oder Messung (messung.mjs, Basis b49fe04 gegen jetzt).
2. Soll „Passend dazu“ (bg-surface-muted und border-t entfernt): nicht wiederhergestellt. Hintergrund und Rahmen wie in d043fef brauchen Vollbreite außerhalb des .shell-Containers, also einen Umbau des Grids in page.tsx. Das ist nicht Teil des Auftrags. Optionen: (a) Entfernung bestätigen, oder (b) Wiederherstellung mit Umbau in page.tsx (Freigabe für diese Datei fehlt).
3. Schlüsselprofil mobil 64 px: visuell klein, aber lesbar. Bewertung durch den Orchestrator.

=== ENDE E5-BEFUND-H10 · BEREIT ZUR RÜCKGABE ===
