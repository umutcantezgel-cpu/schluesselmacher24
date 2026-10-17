# E6-BEFUND2-U-ARTIKEL · Bericht des Baumeisters und Urteil der Prüfstufe A

- Runden: 3 · Urteil letzte Runde: nicht bestanden
- Hinweis: Der Entwicklungsserver (Port 3001) war während des Baus abgestürzt (Turbopack-Panik); Bildbelege fehlten deshalb. Bildprüfung und Abnahme: `_werkstatt/berichte/E6-BEFUND2-welle2-abnahme.md` (D-048).

## Befunde der letzten Prüfrunde
- **muss:** Bildbeleg fehlt, Umgebung: Port 3001 antwortet nicht (HTTP 000 um 13:01, 13:04 und 13:06 Uhr). Der Server wurde nicht gestartet, weil das Paket „melden, nicht selbst starten“ vorschreibt. Nicht belegt sind Bilder mobil, tablet und desktop, der gefilterte Zustand und der curl-Platzhalter-Grep. Der Code-Befund ist davon getrennt zu lesen.
- **soll:** Grafik 1 nicht vollständig behoben: Pflegespray (standard-articles.ts Z. 86, motif „Produktfoto Pflegespray …“) und abschließbarer Fenstergriff (Z. 112) fallen über motiv.ts Z. 89 auf versand-paket. Das sind 2 von 8 Artikeln mit Paketsymbol. Im Paket ist das als Orchestrator-Entscheidung ausgewiesen.
- **soll:** Desktop 1440 px nicht geprüft: Die Beschreibung ist max-w-measure (≈590 px) in einer flex-1-Spalte, die Preisspalte steht rechts. Rechnerisch entsteht eine große Lücke zwischen Text und Preis. Das lässt sich nur am Bild beurteilen.
- **hinweis:** Logikwächter nicht offiziell gelaufen: artikel/page.tsx und artikel-liste.tsx stehen nicht auf der GESCHUETZTE-Liste. `pruefen` ohne Protokoll ergibt „KEIN EINTRAG“. `sichern` würde nach _werkstatt/protokolle schreiben und wurde deshalb nicht ausgeführt. Eigener Vergleich gegen d4a1d47 über die Funktionen zerlegen/hashAus: nur Darstellung geändert (Alert-Entfall, Konstante beispielHinweis, key, aktiv > 0, disabled-Entfall, nbsp, Staffel-Bedingung).
- **hinweis:** Versionsangabe: Der Prüfauftrag nennt KERN 1.14. KERN.md trägt Kopf und Änderungsliste 1.15 mit dem B-20-Eintrag für den Trefferzähler. Geprüft gegen 1.15; die Kleinregeln 1.14 sind ebenfalls vorhanden.
- **hinweis:** Gefilterter Zustand (Rücksetzknopf erscheint, Zähler-Pop) ist im Code korrekt verdrahtet (artikel-liste.tsx Z. 156 und 161–166), aber nicht im Browser gesehen. Der Fokus fällt nach „Filter zurücksetzen“ auf den Dokumentanfang. Das ist laut Paket ein akzeptiertes Risiko und kein Rückschritt.

## Bericht des Baumeisters (letzte Fassung)

E6-BEFUND2-U-ARTIKEL · Baumeister · Bericht nach Ablehnung der Runde 2 (Stand 13:00 Uhr)

STATUS: NICHT ABGESCHLOSSEN. Die Umsetzung der Punkte 1 bis 11 ist im Code vorhanden und geprüft. Die Bildprüfung und der curl-Platzhalter-Grep fehlen, weil Port 3001 nicht antwortet. Den Server habe ich nicht gestartet, wie das Paket vorschreibt. In diesem Lauf habe ich nichts an den Dateien geändert; die Änderungen stammen aus dem vorherigen Lauf und sind hier nur geprüft.

GEÄNDERTE DATEIEN (gegen d4a1d47, nur diese zwei; fremde Änderungen im Arbeitsbaum ausgeklammert)
- src/app/(site)/artikel/page.tsx
- src/app/(site)/artikel/artikel-liste.tsx

WAS UND WARUM (je Punkt aus Umsetzen)
1. Erledigt. page.tsx: Alert-Kasten aus PageHeader entfernt, PageHeader ohne children (Z. 131 bis 137). Konstante beispielHinweis Z. 107 bis 120 (role="note", GlyphInfo size 18, text-info). Z. 157 übergibt hinweis. artikel-liste.tsx: Prop hinweis Z. 39 bis 40, Destrukturierung Z. 51, {hinweis} Z. 171 zwischen Suchformular und Liste. Hinweis steht über der Liste, auch ohne Filterformular.
2. Erledigt. Kopf ohne Kasten (page.tsx Z. 131 bis 137), die Suche folgt direkt auf die Einleitung.
3. Erledigt. artikel-liste.tsx Z. 174 ul mit border-t border-border (keine Spalten mehr), Link Z. 211 ohne h-full, sm:gap-6, Beschreibung Z. 223 mit max-w-measure md:line-clamp-3.
4. Erledigt. Konstante einheit entfernt. Staffelzeile Z. 226 bis 230 nur bei preis.ab. Preisspalte Z. 233 bis 239 mit je Stück unter dem Preis. Badge Beispiel bleibt. Kommentare angepasst.
5. Erledigt. ImagePlaceholder Z. 213 mit frei, Icon 32 px ohne Kachel (image-placeholder.tsx Z. 56 und 115).
6. Erledigt. Zeile Z. 154 min-h-touch, Z. 161 {aktiv > 0 && ...}, disabled entfernt.
7. Erledigt. Z. 156 strong mit key={treffer.length}, inline-block sm24-pop [--sm24-duration:var(--dauer-quick)]. KERN 1.15 B-20 deckt den Zähler.
8. Erledigt. page.tsx Z. 148 eyebrow="Auswahl".
9. Erledigt. page.tsx Z. 18 und 58 IconZahlung, Import IconVersandPaket entfernt, kein ungenutzter Import.
10. Erledigt. Pfeil artikel-liste.tsx Z. 244, page.tsx Z. 219 mit group-focus-visible:text-primary. Geschützte Leerzeichen Z. 157 (Artikel von) und Z. 229 (Stück) als {' '}.
11. Erledigt. Alt-Neu-Liste unten. Hinweistext gegen den alten Alert verglichen: Titel und Satz wortgleich.

Nicht umgesetzt, Gründe nachvollzogen und stimmen: Typografie-Vorschläge (Preis unter Beschreibung, text-balance, line-clamp), Grafik 1 Zuordnung je Artikel (siehe offene Fragen), Iconmaß 40 px (Baustein gemeinsam), Alternative animate-schleier-ein, Kürzung des Hinweistexts (Textvorschlag), Doppelhaarlinie, Artikelseite /artikel/[slug] (nicht im Schreibrecht).

ALT-NEU-LISTE DER MIKROTEXTE
- Augenbraue Abschnitt 01: "<N> Artikel" wird "Auswahl" (page.tsx Z. 148).
- Preis-Unterzeile: "Beispielpreis je Stück" bzw. "je Stück" wird "je Stück" unter dem Preis, für alle Artikel (artikel-liste.tsx Z. 239).
- Staffelzeile: "<Einheit> ab <n> Stück · einzeln <Preis>" wird "ab <n> Stück · einzeln <Preis>" mit geschütztem Leerzeichen (Z. 229); nur bei Mengenpreisen.
- Zähler (Z. 156 bis 157): "<N> Artikel von <M>", Wortlaut gleich, nur geschütztes Leerzeichen.
- Hinweis (page.tsx Z. 107 bis 120): Titel und Satz wortgleich, nur Ort und Darstellung neu.
- Knopf: "Filter zurücksetzen" unverändert, erscheint nur bei aktivem Filter.

GEMEINSAME DATEIEN: keine Änderung in diesem Lauf. Keine Werte ohne Token (werte-suche 0 Funde). Die Zuordnung in src/lib/visual/motiv.ts Z. 89 ist unverändert und gehört dem Orchestrator.

PRÜFUNG UND ERGEBNIS
- tsc --noEmit: Exit 0. eslint beide Dateien: Exit 0.
- vitest run src/components src/lib: 69 Dateien, 1190 Tests grün. vitest run "src/app/(site)": 2 Dateien, 14 Tests grün.
- werte-suche: 0 Funde, 0 Ausnahmen.
- Sperrdatei: nicht vorhanden.
- Port 3001: HTTP 000 bei 8 Abfragen (12:57 bis 13:00 Uhr); zuvor laut Prüfer rund 12 Minuten ohne Antwort. Kein Server auf 3001.
- Bildprüfung: NICHT ausgeführt. Keine Bilder.
- curl-Platzhalter-Grep /artikel: NICHT ausgeführt. Nur statisch belegt: Quellen von /artikel ohne "[Platzhalter"; Footer-Redaktionshinweis ohne "["; Anschrift bei Platzhalter-Firma ausgeblendet; JSON-LD bei Platzhalter-Firma ohne Firmendaten.
- Logikwächter: nicht aufgerufen. Teständerungen: keine.
- Logs: /root/sm24-bilder/E6-BEFUND2-U-ARTIKEL/pruefung-r3/ (tsc.log, eslint.log, vitest.log, vitest-site.log, werte.json). Die alten Ausgaben unter /root/sm24-bilder/E6-BEFUND2-U-ARTIKEL-pruefung-r2 sind unverändert geblieben.

BILDBELEGE: keine. Die Bildprüfung ist nicht ausgeführt. Zu prüfen sind mobil, tablet und desktop für /artikel, Hinweis-Platzierung, mobiler Kopf, Stückliste, Icons ohne Kachel, Zähler, Überlauf und Abschneiden, Desktop 1440 px (Abstand Beschreibung zu Preisspalte) und der gefilterte Zustand von Hand.

OFFENE FRAGEN
1. Port 3001 muss laufen. Dann mache ich bild.mjs (mobil, tablet, desktop, --ganz, Ziel /root/sm24-bilder/E6-BEFUND2-U-ARTIKEL/pruefung-r3/) und den curl-Grep. Ohne Server bleibt das Paket offen.
2. Desktop 1440 px: Abstand zwischen Beschreibung und Preisspalte, nur am Bild.
3. Hinweis unter Suche und Zähler auf dem Desktop, mobile Verschiebung um etwa 5 Zeilen, nur am Bild.
4. Grafik 1: Pflegespray (standard-articles.ts Z. 86) und abschließbarer Fenstergriff (Z. 112) fallen über motiv.ts Z. 89 weiter auf versand-paket. Entscheidung beim Orchestrator, nicht im Paket.
5. Gefilterter Zustand im Browser von Hand.

=== ENDE E6-BEFUND2-U-ARTIKEL · NICHT ABGESCHLOSSEN: BILDPRUEFUNG UND CURL-GREP OFFEN ===
