# E6-BEFUND2-H10 · Bericht des Baumeisters und Urteil der Prüfstufe A

- Runden: 3 · Urteil letzte Runde: nicht bestanden
- Hinweis: Der Entwicklungsserver (Port 3001) war während des Baus abgestürzt (Turbopack-Panik); Bildbelege fehlten deshalb. Bildprüfung und Abnahme: `_werkstatt/berichte/E6-BEFUND2-welle2-abnahme.md` (D-048).

## Befunde der letzten Prüfrunde
- **muss:** Nachweise fehlen: Port 3001 ist nicht erreichbar (curl liefert 000, zweimal geprüft, keine Sperrdatei). Nicht belegt sind Bilder mobil/tablet/desktop (leer und gefüllt), das Tastaturfokusbild, die Höhenmessung von Lade- und Leerkarte bei 390/640/768/1024/1440 px, messung.mjs (LCP/CLS, 3 Läufe), F-01 und der Platzhalter-curl. Der Server wurde nicht gestartet, wie das Paket verlangt. Die Höhenangaben im Bericht (318/350 px mobil, 193/214–222 px ab sm) sind Schätzungen. Nachprüfung nach dem Start nötig; bis dahin ist der Befund H10 nicht abgenommen.
- **muss:** Metazeile weicht vom Paketwert ab: warenkorb-ansicht.tsx Z.216 hat gap-x-2 statt gap-x-3 (Paket Punkt 7). Die Begründung (259 gegen 260 px, bei gap-x-3 Umbruch) ist geschätzt, nicht gemessen. Entweder gap-x-3 setzen oder die Entscheidung nach Messung dem Orchestrator überlassen.
- **soll:** Logikwächter steht für warenkorb-ansicht.tsx auf ABWEICHEND (Exit 3). Neu sind drei Teil-B-Ausdrücke: params={{ typ: 'zylinder', rohling: true }} (Z.148), {gewaehlteVersandart && (…)} (Z.499) und {gewaehlteVersandart.label} (Z.500). Alle drei sind reine Anzeige ohne Logikänderung. Der Bericht führt sie nicht wörtlich unter GEMEINSAME DATEIEN auf; Z.499 ist nur gekürzt angegeben. Der Orchestrator muss sie benannt in logik-ausnahmen.json eintragen, danach muss der Lauf gleich zeigen.
- **hinweis:** Bericht passt nicht mehr ganz zum Code: Er beschreibt die Leerkarte mit slot={{ motif: 'Schlüsselrohling' … }} über ImagePlaceholder. Der Code nutzt nach der Orchestrator-Anpassung SchluesselGrafik direkt (Z.147–148). Das Badge-shrink-0 ist entfernt (Z.223), das passt.
- **hinweis:** JS-Budget ohne Messwert: Es ist kein neues Modul im Client (SchluesselGrafik ist über registry.tsx bereits gebunden, Import Z.31). Die gzip-Zahl fehlt, Schätzung nicht belegt.
- **hinweis:** Versionsangabe: Der Auftrag nennt KERN 1.14, KERN.md und der Paketkopf nennen 1.15. Geprüft wurde gegen 1.15, das den Stand 1.14 einschließt.
- **hinweis:** Außerhalb des Pakets: kasse-formular.tsx Z.663 hat im Kommentar noch „Gesamtsumme“. tuer-und-schliesstechnik/page.tsx ist fremd geändert und nicht geprüft. gleichschliessende-zylinder/konfigurator/konfigurator.tsx ist im Logikwächter ABWEICHEND (Teil B: summe-Prop, measuringFigure, measuringInfo); das ist ein Fremdbefund, nicht behoben. funktionsliste.mjs Z.68 hat den Fallback auf „Gesamtbetrag“ bereits.
- **hinweis:** Statisch belegt, kein Befund: Punkte 1, 2, 4, 5, 6 und 8 sowie die Orchestrator-Anpassungen. Belege: Versandart als div mit Haarlinie (Z.411–457), metaSpalte Z.443, Leerkarte mit Rohling w-40 sm24-ruhig ohne Rahmen (Z.145–163), Ladekarte min-h-96 (Z.132), page.tsx Z.57–72 (Augenbraue „01 Weiterlesen“, mt-3 h2, ul ohne Grid, Linkzeilen mit text-foreground und Pfeil text-foreground-muted/group-hover/group-focus-visible), Versandzeile Z.493–506, Gesamtbetrag Z.508 und Z.562, sm24-ruhig am Positionsbild Z.191. Die Testdaten (manufacturer „[Hersteller eintragen]“) zeigen mit istPlatzhalter nur „Möbelschlüssel“.
- **hinweis:** Alle Befundnachweise der Schnellprüfung sind grün, außer den Nachweisen mit Server (siehe oben). Teständerungen sind nicht nötig: Vitest und die Seitenstruktur-Prüfung sind grün.

## Bericht des Baumeisters (letzte Fassung)

Status: Die Umsetzung der Punkte 1 bis 8 ist im Code abgeschlossen. Schnellprüfung (tsc, eslint, vitest, werte-suche, Logikwächter Teil A/B, statische Platzhalter-Prüfung) ist grün bzw. erwartungsgemäß. Die Nachweise (Bilder, Höhenmessung, messung.mjs, F-01, Platzhalter-curl, Fokusbild) sind NICHT erbracht, weil Port 3001 nicht läuft. Nicht abnahmefähig, bis der Orchestrator den Server startet und die Nachprüfung läuft.

GEÄNDERTE DATEIEN
- src/app/(site)/warenkorb/warenkorb-ansicht.tsx: In diesem Lauf nur eine Änderung: className="shrink-0" am Badge Z.223 entfernt. Die Klasse stand nicht im Paket, und im Umbruchverhalten einer flex-wrap-Zeile hat sie keine Wirkung.
- src/app/(site)/warenkorb/page.tsx: In diesem Lauf nicht geändert. Der Stand ist bereits in HEAD 6e4981c, geprüft gegen die Punkte 4, 5 und 8.

WAS UND WARUM (je Punkt aus „Umsetzen“)
1. Versandart ohne Karte: erledigt, warenkorb-ansicht.tsx Z.411–456. `<div>` mit Kopfzeile `flex items-center gap-2 pt-4` (h2 und InfoTip unverändert), darunter `mt-6 border-t border-border pt-6` mit der bestehenden Verzweigung. Card, CardHeader und CardBody bleiben importiert, weil Lade-, Leer- und Summenkarte sie nutzen.
2. metaSpalte: erledigt, Z.443 an der Versand-OptionCard. option-card.tsx nicht angefasst.
3. Leerkarte: erledigt, Z.145–163. Rohling direkt über SchluesselGrafik (params typ zylinder, rohling true, title leer), Hülle `aria-hidden w-40 shrink-0 sm24-ruhig`, ohne Rahmen. Links im sm-Layout, Text in `min-w-0 flex-1`, Knopfzeile `sm:flex-wrap`, IconWarenkorb-Import entfernt. Ladekarte Z.132 min-h-96. Höhe nur geschätzt und nicht gemessen, siehe Soll-Punkt unten.
4. Augenbraue, h2, ul: erledigt, page.tsx Z.57–61. Augenbraue `eyebrow` mit „01 Weiterlesen“, h2 `mt-3`, ul ohne Grid, section mit `lg:col-span-8` und `korb-leer:lg:col-span-4`.
5. Linkzeilen: erledigt, page.tsx Z.63–72. Textfarbe, Pfeil `text-foreground-muted`, bei group-hover und group-focus-visible `text-primary`, `zeiger:group-hover:translate-x-1`, `hover:text-primary` auf der Zeile.
6. Versandzeile: erledigt, warenkorb-ansicht.tsx Z.494–506. dt „Versand“ (text-small text-foreground-muted). dd mit unverändertem `key={summen.shippingCents}`, `animate-schleier-ein text-right text-small`. Versandart-Label klein darüber, Betrag `whitespace-nowrap font-mono font-semibold tabular-nums`. Zeile mit items-baseline.
7. Metazeile: erledigt, Z.214–226. Die Hülle um Titel und Plakette entfällt, h3 bleibt wortgleich mit seinem Link. Darunter `mt-1 flex flex-wrap items-center gap-x-2 gap-y-1` mit p „Hersteller · Schlüsselart“ (Anwendung entfällt) und Badge. Abweichung gap-x-2 statt gap-x-3 bleibt, siehe offene Fragen.
8. Gesamtbetrag: erledigt, Z.508 (dt) und Z.562 (mobile Leiste). Kommentare Z.108 und Z.555 sowie page.tsx Z.56 angepasst. Im Ordner warenkorb/ kein „Gesamtsumme“ mehr.

Logikwächter (Teil B, je einzeln): neu sind params={{ typ: 'zylinder', rohling: true }} (Z.148), {gewaehlteVersandart && (…)} (Z.499) und {gewaehlteVersandart.label} (Z.500). Entfallen sind {gewaehlteVersandart ? ` (…)` : ''} im dt, {position.line.application} und {' '} in der Metazeile. Teil A gleich.

Mikrotexte (Alt zu Neu)
- (1) Augenbraue „Passend dazu“: bisher keine, neu „01 Weiterlesen“ (page.tsx Z.58).
- (2) Summe: „Versand (Versand verfolgbar)“ wird „Versand“, die Versandart-Bezeichnung klein darüber, der Betrag bleibt (warenkorb-ansicht.tsx Z.494–506).
- (3) „Gesamtsumme“ wird „Gesamtbetrag“ (Z.508 und mobile Leiste Z.562).
- (4) Metazeile der Codeposition: die Anwendung „Büroschrank und Rollcontainer“ entfällt, die Zeile zeigt Hersteller und Schlüsselart. Der Datensatz bleibt unverändert.

Teständerungen: keine. Textvorschläge mit Inhalt: keine geändert.

PRÜFUNG UND ERGEBNIS
- tsc --noEmit: exit 0, leere Ausgabe (runde3/tsc.txt).
- eslint auf beide Dateien: exit 0, keine Befunde (runde3/eslint.txt).
- vitest run src/components src/lib: 67 Dateien, 1163 Tests grün. seitenstruktur.test.ts: 2 Tests grün (runde3/vitest.txt, runde3/vitest-seitenstruktur.txt).
- werte-suche.mjs: 2 Dateien, 0 Funde (runde3/werte.json).
- logikwaechter.mjs pruefen: exit 3, nur warenkorb-ansicht.tsx ABWEICHEND wegen der oben genannten Teil-B-Ausdrücke. Ausnahmen trägt der Orchestrator ein (runde3/logikwaechter.md).
- Platzhalter statisch: keine Treffer für [Platzhalter, [PLZ] oder [Ort] in den zwei Dateien. Der curl-Nachweis fehlt.
- Nicht ausgeführt, weil Port 3001 nicht läuft: Bilder mobil/tablet/desktop (leer und gefüllt), Tastaturfokusbild, Höhenmessung 390/640/768/1024/1440 px, messung.mjs (3 Läufe, LCP/CLS), F-01, Platzhalter-curl.
- Kein Lock /tmp/sm24-messfenster.lock zu Beginn und am Ende.
- Kein Commit, kein Push, nichts gelöscht.

BILDBELEGE
Keine neuen Bilder. Die Dateien in /root/sm24-bilder/E6-BEFUND2-H10/ (warenkorb-*.jpg, 10:28–10:29) sind älter als dieser Lauf. Sie sind nicht als Abgleich verwendet, und der Abgleich mit e5-b/H10-warenkorb__* steht aus.

OFFENE FRAGEN
1. Orchestrator: Server auf Port 3001 starten, danach Bilder, Höhenmessung, messung.mjs, F-01, Platzhalter-curl und Fokusbild nachholen und die Nachprüfung anstoßen.
2. Leerkarte mobil: Höhe messen. Liegt der Inhalt bei 320 bis 390 px über 384 px, beide Mindesthöhen gemeinsam anheben (Z.132 und Z.145) oder entscheiden. Ohne Messung nicht belegt.
3. Metazeile: gap-x-2 (aktuell) oder gap-x-3 (Paket). Schätzung 259 gegen 260 px, bei gap-x-3 etwa 263 px und damit Umbruch am Desktop. Entscheidung nach Messung.
4. JS-Budget: gzip-Wert messen. Der Code bindet SchluesselGrafik schon über registry.tsx.
5. Testdaten Metazeile: erwartet „Möbelschlüssel“ neben der Plakette. Die Zeile zeigt aber „Hersteller · Möbelschlüssel“, wenn der Hersteller kein Platzhalter ist. Am Bild prüfen.
6. Logikwächter: die drei Ausnahmen in _werkstatt/werkzeuge/logik-ausnahmen.json eintragen.
7. Außerhalb des Pakets: tuer-und-schliesstechnik/page.tsx ist geändert und nicht geprüft. kasse-formular.tsx Z.663 hat im Kommentar noch „Gesamtsumme“.
8. Umsatzsteuerzeile „(19 %)“ ohne geschütztes Leerzeichen ist unverändert (nach Paket dem Orchestrator gemeldet).

=== ENDE E6-BEFUND2-H10 · BEREIT ZUR RÜCKGABE ===
