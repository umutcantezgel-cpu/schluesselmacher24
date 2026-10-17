# E6-BEFUND2-U-SERVICE · Bericht des Baumeisters und Urteil der Prüfstufe A

- Runden: 3 · Urteil letzte Runde: nicht bestanden
- Hinweis: Der Entwicklungsserver (Port 3001) war während des Baus abgestürzt (Turbopack-Panik); Bildbelege fehlten deshalb. Bildprüfung und Abnahme: `_werkstatt/berichte/E6-BEFUND2-welle2-abnahme.md` (D-048).

## Befunde der letzten Prüfrunde
- **muss:** Bildbelege fehlen. Port 3001 antwortet nicht (curl 000, über rund 25 Minuten Warten kein Listener). Ohne Bilder sind U1 (Kopfzeichnung), U7 (Leiste mobil, Haarlinien ab md), U2 (mitlaufender Kopf bei 1440 x 900), Überlauf, Schriftfeld gegen Zeichnungstitel und die Sichtung aller drei Geräte nicht belegt. Nicht selbst gestartet, weil das Paket es verbietet.
- **muss:** Platzhalter-Live-Prüfung (curl | grep -c "[Platzhalter") und a11y.mjs für die Überschriften in summary nicht ausgeführt, da kein Server läuft. Statisch: werte-suche 0 Funde, 0 Platzhalter im Diff.
- **soll:** Barrierefreiheit der h3 in summary ist nicht belegt (axe, Überschriftenliste, Firefox mit Screenreader). Das Paket verlangt das Ergebnis im Bericht. Statisch ist die Struktur nach HTML-Norm zulässig (page.tsx Z. 285-288, 312, 331, 350).
- **hinweis:** Nummern 03.1–03.4 (Z. 286, 313, 332, 351), 01–05 in der Phasenliste (Z. 301) und die Kennzeichnung in summary stehen in text-foreground-muted. KERN 1.14 nennt für nicht klickbare laufende Nummern text-foreground. Das Paket verlangt muted; die Abweichung ist gering und ist beim Orchestrator zu entscheiden.
- **hinweis:** Schriftgröße der breiten Kopfzeichnung bei 1024 px rechnerisch etwa 11,2 px (Paket: hinnehmbar, im Bericht nennen). KERN 1.8 verlangt 11,5 px nur für Telefone. Bild offen.
- **hinweis:** Eigene Fehlaktion: Prüfer hat /root/sm24-bilder/.dummy angelegt (Kopfstück des Diffs als Umleitungsziel). Die Datei liegt außerhalb des Paketordners und darf nach den Regeln nicht gelöscht werden. Bitte der Orchestrator entscheiden lassen. Die übrigen Hilfsdateien liegen unter /root/sm24-bilder/E6-BEFUND2-U-SERVICE-pruefung-r3/.

## Bericht des Baumeisters (letzte Fassung)

E6-BEFUND2-U-SERVICE · Baumeister · Runde 3 (Nachlauf der Prüfung r2) · Ergebnis: TEILWEISE. Code unverändert, Schnellprüfung grün, Bildbelege und Live-Prüfung offen, weil Port 3001 nicht antwortet.

GEÄNDERTE DATEIEN: keine in dieser Runde. Die Änderungen des Pakets liegen bereits im Arbeitsbaum von src/app/(site)/service-und-termin/page.tsx (gegen d4a1d47: 161 Zeilen ergänzt, 85 entfernt) und sind hier nur geprüft, nicht neu geschrieben.

WAS UND WARUM (Punkte aus Umsetzen):
1. Vorarbeit PHASEN, PHASEN_SCHRITTE, PHASEN_TITEL: erledigt, page.tsx Z. 62–91. Texte wortgleich bis auf den entfallenen Doppelpunkt.
2. U1 Kopfzeichnung: erledigt im Code, Z. 152–157 (schmale und breite AblaufGrafik, bg-area-soft/40). Bildbeleg offen (Server).
3. U2 5/7 mit mitlaufendem Kopf: erledigt, Z. 265–275.
4. U3 vier details, 03.1 offen, summary mit GlyphWinkelUnten: erledigt, Z. 282–367.
5. U4 Nummer als span im h3, Titel wortgleich: erledigt, Z. 285–288 u. a.
6. U5 Phasen als dl: erledigt, Z. 297–307.
7. U6 Augenbraue „Vorgehen“: erledigt, Z. 269.
8. U7 Leiste mobil, Haarlinien ab md: erledigt im Code, Z. 219 und 225–229. Bildbeleg offen (Server).
9. U8 Zeilenpfeil und aria-current: erledigt, Z. 237–251.
10. Alt-Neu-Liste der Mikrotexte: Augenbraue „Architektonische Methodik“ → „Vorgehen“. Unternummern „01“ → „03.1“, „02“ → „03.2“, „03“ → „03.3“, „04“ → „03.4“. Phaseneinläufe ohne Doppelpunkt: „Initiierung und Bedarfsanalyse:“ → „Initiierung und Bedarfsanalyse“, „Projektierung und Lösungsdesign:“ → „Projektierung und Lösungsdesign“, „Präzise Fertigung und Vorkonfiguration:“ → „Präzise Fertigung und Vorkonfiguration“, „Fachgerechte Montage und Integration:“ → „Fachgerechte Montage und Integration“, „Dokumentation und Systemübergabe:“ → „Dokumentation und Systemübergabe“. Neu: Phasennummern 01–05 in der Liste, Zeichnungsbeschriftungen und Zeichnungstitel „Phasen eines Auftrags: …“. „Service und Termin“ in Abschnitt 02 ist kein Link mehr.
Teständerungen: keine.

Anpassung des Orchestrators geprüft: MAX_SCHRITTE = 5 in ablauf.tsx Z. 23 bestätigt. Logikwächter-Liste enthält page.tsx nicht.

Muss-Befunde der Runde 2:
- Bildbelege fehlen: NICHT behoben. Port 3001 antwortet nicht (curl 000). Gemäß Paket nicht selbst gestartet. Ein Monitor (Task br0a2qc3p) wartet noch bis zu 15 Minuten auf den Listener. Offen bleiben: U1, U2, U7, Schriftfeld gegen Zeichnungstitel, Überlauf, Sichtung aller Geräte.
- Platzhalter-Live-Prüfung: NICHT behoben (Server). Statisch sauber: 0 Treffer in page.tsx, content/seo.json, content/service-pages.json.

Soll-Befunde:
- Barrierefreiheit der h3 in summary: nicht geprüft mit axe, Überschriftenliste oder Firefox mit Screenreader (Server und Hilfstechnik fehlen). Statisch zulässig nach HTML-Norm (summary darf Überschriftsinhalt haben).
- Schriftgröße breite Kopfzeichnung: rechnerisch bei 1024 px 11,2 px (Inhalt 960 px, Gutter 28 px, Spalte 5/12 ≈ 383,7 px, minus p-6 48 px ≈ 335,7 px Zeichnungsbreite, Beschriftung 16 × 335,7/480). Bei 1440 px ≈ 14,1 px. KERN 1.8 verlangt 11,5 px nur auf Telefonen; Hinweis, keine Codeänderung. Bild offen.

PRÜFUNG UND ERGEBNIS:
- npx tsc --noEmit: ohne Fehler (exit 0).
- npx eslint "src/app/(site)/service-und-termin/page.tsx": ohne Befund (exit 0).
- npx vitest run src/components src/lib: 68 Dateien, 1177 Tests grün.
- vitest src/app/(site)/seitenstruktur.test.ts: 2 Tests grün.
- werte-suche page.tsx: 0 Funde, 0 Ausnahmen.
- Platzhalter statisch: 0 Treffer.
- Lock /tmp/sm24-messfenster.lock: während aller Läufe nicht vorhanden.
- Protokolle: /root/sm24-bilder/E6-BEFUND2-U-SERVICE-runde3/ (tsc.txt, eslint.txt, vitest-komponenten.txt, vitest-komponenten.json, vitest-seitenstruktur.txt, werte.json, werte-konsole.txt).
- Keine Datei gelöscht, nichts im Repository angelegt, kein Commit, kein Push, kein Deploy.

BILDBELEGE: keine. Erforderlich nach Start von Port 3001 (Orchestrator), Nachlauf des Pakets:
cd _werkstatt/werkzeuge && SM24_BASIS_URL=http://localhost:3001 node bild.mjs /service-und-termin --geraet mobil --ganz --ziel /root/sm24-bilder/E6-BEFUND2-U-SERVICE-runde3 --json /root/sm24-bilder/E6-BEFUND2-U-SERVICE-runde3/bild-mobil.json (analog tablet, desktop), dazu curl -s http://localhost:3001/service-und-termin | grep -c "\[Platzhalter" (erwartet 0), dazu node a11y.mjs --routen /service-und-termin für die Überschriften-Prüfung in summary.

OFFENE FRAGEN:
1. Port 3001 starten (Orchestrator), dann Nachlauf: Bilder mobil, tablet, desktop, Live-Platzhalter, a11y.
2. Hilfstechnik-Prüfung der h3 in summary (Firefox mit Screenreader) ist außerhalb der Automatik; bitte vom Prüfer oder Orchestrator bestätigen lassen.
3. Bildprüfung 1024 px für die Schriftgröße von 11,2 px.

=== ENDE E6-BEFUND2-U-SERVICE · BEREIT ZUR RÜCKGABE ===
