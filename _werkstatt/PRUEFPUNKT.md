# Prüfpunkt

- **Etappe:** Abschluss. Prüfstufe C, Abschlussversuch 2, ist ausgewertet (D-051), ABNAHME eingetragen. AUSNAHME 1 betrifft Z-04 (vorsorglich), AUSNAHME 2 betrifft Z-08.
- **Fertig:**
  - E7-L-43, E7-L-44 (3315165, KERN 1.19).
  - E7-P-C (`protokolle/E7-PRUEFER-C-ergebnis-vollstaendig.md`).
  - E7-D-03: Bildsatz `bilder/abschluss/`, Blindvergleich `bilder/blind/`, Galerie.
  - BERICHT-Abschnitt „Abschluss“.
  - Morgenbericht 20.10.; nächste Erinnerung `trig_01D5ohguFrkqDLFuLTXhdg71` (21.10., 07:00 Berlin).
- **Als Nächstes:**
  1. Endprüfung E6-L-13 mit frischem Opus-Agenten (`Agent`, model opus).
     - Teil A blind: nur `_werkstatt/bilder/blind/` mit LIESMICH.
     - Danach per SendMessage den Schlüssel aus dem Schlüsselordner (der Ort steht nur im Scratchpad `e7/schluesselort.txt`, nie im Repository) und das Paket `_werkstatt/pakete/E6-L-13-endpruefung.md`, Teile B–D.
     - Das Urteil wörtlich nach `_werkstatt/berichte/E6-L-13-endpruefung.md` und in BERICHT (Abschnitt „Abschluss“, „Endprüfung“).
  2. Ist jede Zeile „bestätigt“ oder „Ausnahme bestätigt“: ABSCHLUSS. Dazu den CLAUDE.md-Block entfernen, ABNAHME und STATUS auf ABSCHLUSS setzen, committen, pushen, die Erinnerung für den 21.10. löschen.
  3. Sonst HALT mit Grund und Beleg.
- **Bei Abbruch:** Server `server.sh start` (Port 3000, Build `iKl_M5gLZWsTLj9wvJVXf`). Port 3100: `cd /root/sm24-e0 && SM24_DATA=json setsid nohup npx next start -p 3100`. Scheitert ein Build an „next/font/google queries have exactly one entry“, `.next/cache` beiseitelegen (D-051).
- **Hinweis:** AGENTS.md vor jedem Commit zurücknehmen (D-007). Nie Dateien unter /dev anfassen (D-021). Während ein Agent unter `_werkstatt/` schreibt, nur ausdrücklich genannte Pfade committen (D-051).
- **Letzter grüner Stand:** 3315165 (E7-L-44) mit tsc 0, ESLint 0, Vitest 1217/1217, Logikwächter 0, Wertesuche 0, Build 208/208.
