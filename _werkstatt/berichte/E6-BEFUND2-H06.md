# E6-BEFUND2-H06 · Bericht des Baumeisters und Urteil der Prüfstufe A

- Runden: 3 · Urteil letzte Runde: nicht bestanden
- Hinweis: Der Entwicklungsserver (Port 3001) war während des Baus abgestürzt (Turbopack-Panik); Bildbelege fehlten deshalb. Bildprüfung und Abnahme: `_werkstatt/berichte/E6-BEFUND2-welle2-abnahme.md` (D-048).

## Befunde der letzten Prüfrunde
- **muss:** Bildbeleg fehlt, Schritt 5 nicht ausführbar: Port 3001 antwortet nicht. bild.mjs meldet ERR_CONNECTION_REFUSED (/root/sm24-bilder/E6-BEFUND2-H06-pruefung-r3/bild-mobil.log). Über etwa sechs Minuten wiederholt geprüft, kein Listener, /tmp/sm24-messfenster.lock fehlt. Nicht belegt sind: zweizeilige h1, Halm-Ausschnitt ohne Reide, Segmentleiste mit Anschnitt, Plakette 24 px gegen 22 px, Rahmenknopf, Fundstelle 512 px neben dem Live-Schlüssel, Überlauf bei 360, 375 und 390 px, Tastaturfokus. Port 3000 (älterer Build) ist kein Beleg. Paket nach Serverstart mit Schritt 5 wiederholen.
- **soll:** Halm-Beschriftung unter der K-008-Grenze bei 320 px Viewport: 12 Einheiten × 280/334 ≈ 10,1 px (Konstante PROFILSCHNITT_HALM, page.tsx Z. 26–35). Bei 360 bis 390 px Viewport sind es 11,5 bis 12,6 px, also erfüllt. Der Baumeister hat das gemeldet und nicht behoben. Entscheidung des Orchestrators nötig.
- **hinweis:** Badge „Codeformat:“ (page.tsx Z. 132–134): Der Text und der Mono-Span sind Flex-Kinder mit gap-1.5. Der Abstand wird dadurch etwa 6 px statt eines Wortabstands. Am Bild prüfen.
- **hinweis:** Kommentar der Konstanten PROFILSCHNITT_HALM (page.tsx Z. 26) weicht vom Paket-Wortlaut ab („Bei 320 px Breite 11,5 px Schrift (K-008)“). Nur Kommentar. Werte und Nichtexport stimmen mit dem Paket überein.
- **hinweis:** Befund 9 (doppelter Widerrufshinweis) bewusst nicht umgesetzt. Der Grund stimmt: Rechtshinweis, Abstimmung mit dem Menschen. M-27 steht in _werkstatt/MENSCHEN.md Z. 33. Kein Mangel.
- **hinweis:** Logikwächter: photo-upload.tsx und bestell-formular.tsx stehen auf „gleich“, die kamera-Ausnahmen greifen. Abweichend sind nur fremde Dateien (warenkorb-ansicht.tsx und gleichschliessende-zylinder/konfigurator/konfigurator.tsx, Teil B). Die sind nicht Schreibrecht dieses Pakets und hier separat gemeldet.
- **hinweis:** Versionsangabe: Der Auftrag nennt KERN 1.14, KERN.md endet aber mit 1.15 (K-007, B-26). Geprüft gegen 1.15. Die 1.15-Punkte betreffen H06 nicht.
- **hinweis:** Hilfsdatei außerhalb des Paketordners: /root/sm24-bilder/_tmp_h06_page.diff (mein Fehler, Inhalt identisch zu page.diff). Nicht gelöscht, weil Löschen verboten ist. Die übrigen Belege liegen unter /root/sm24-bilder/E6-BEFUND2-H06-pruefung-r3/.

## Bericht des Baumeisters (letzte Fassung)

E6-BEFUND2-H06 · Baumeister · Nachbesserung nach Prüfung Runde 2

ABNAHMESTATUS: NICHT ABNAHMEFÄHIG. Die Umsetzung der Punkte 1 bis 11 ist im Code vorhanden und in diesem Lauf am Diff gegen d4a1d47 geprüft. Die Bildprüfung (Muss) konnte nicht durchgeführt werden, weil der Entwicklungsserver auf Port 3001 nicht läuft. Ohne Bildbeleg ist das Paket nicht bestanden. Die Zeile „BEREIT ZUR RÜCKGABE“ unten kennzeichnet nur das Formular, nicht die Abnahme.

GEÄNDERTE DATEIEN
In diesem Lauf wurde keine Datei neu geändert. Die sechs Schreibrechte-Dateien enthalten die Umsetzung aus dem Vorlauf; ich habe sie gegen d4a1d47 gelesen und den Stand bestätigt:
- src/app/(site)/schluessel-nach-code/[slug]/page.tsx
- src/app/(site)/schluessel-nach-code/[slug]/bestell-formular.tsx
- src/components/forms/photo-upload.tsx
- src/components/forms/photo-upload.test.tsx (neu, nicht versioniert)
- src/components/visual/interaktiv/code-fundstelle-interaktiv.tsx
- src/components/visual/interaktiv/code-fundstelle-interaktiv.test.tsx

WAS UND WARUM (je Punkt aus „Umsetzen“)
1. Titel und Kennung: erledigt. page.tsx Z. 24 (Import codelinienKennung), Z. 94–95 (kennung, titel), Z. 102 (eyebrow „MS-01 · Direkt kaufen“), Z. 103 (title). Titelregel gegen content/code-lines.json geprüft: 52 von 52 Namen tragen die Serienkennung am Ende; wortgleich zu titelOf. Zweizeilige Wirkung nicht am Bild geprüft.
2. Lead entfernt: erledigt. Anwendung steht als Zeile in den Angaben (Z. 70).
3. Codeformat in Mono: erledigt. Z. 132–133.
4. Plakette neutral mit Haken: erledigt. tone="outline", GlyphHaken size 14, Z. 127–130. Am Bild nicht geprüft (items-center, 24 px gegen 22 px).
5. Bildunterschrift: erledigt. Z. 119–122, Span mit whitespace-nowrap um „keine echte Schließung“.
6. Halm-Ausschnitt: erledigt. PROFILSCHNITT_HALM Z. 27–35 (nicht exportiert), Import Z. 24 ohne PROFILSCHNITT_AUSSCHNITT, Klasse sm24-ausschnitt-bemasst Z. 112. Generator und globals.css unberührt. Die Halm-Schrift unterschreitet bei 320 px Viewport die K-008-Grenze (siehe GEMEINSAME DATEIEN): nicht behoben.
7. Reihenfolge: erledigt. 01 Codefundstelle (Z. 149), 02 Angaben mit Absatz Lieferumfang (Z. 185–186), Alert unverändert (Z. 210), 03 Weiter im Bereich (Z. 232).
8. Fundstelle ohne Rahmen: erledigt. code-fundstelle-interaktiv.tsx Z. 19 FLAECHE = 'rounded-lg bg-area-soft/40 p-4 sm:p-6 lg:max-w-lg', Panel Z. 89 mit sm24-ruhig bedingt. Die Breite 512 px ist eine Klassenangabe (lg:max-w-lg), gemessen ist sie nicht.
9. Segmentleiste: erledigt. Hülle mit overflow-x-auto und Leistenmuster (Z. 52–55), tablist flex w-max (Z. 57), Knöpfe mit min-h-touch, whitespace-nowrap, ring-inset. Handler, ids, aria-selected, aria-controls, tabIndex und Tasten unverändert. Gemessen ist die Breite nicht (504 px laut Paket).
10. Foto aufnehmen als Rahmenknopf: erledigt. photo-upload.tsx: Prop kamera?: 'betont' | 'ruhig' mit JSDoc Z. 156–159, Destrukturierung kamera = 'betont' Z. 181, Ternär Z. 325 mit den beiden Originalzeichenketten. bestell-formular.tsx Z. 287: kamera="ruhig" als Zeichenketten-Attribut. Alle übrigen Aufrufer unverändert, Standard betont.
11. Tests: erledigt. photo-upload.test.tsx (2 Fälle: Standard ist die Originalklasse; ruhig ist die Klasse von „Aus Galerie wählen“ ohne bg-primary). code-fundstelle-interaktiv.test.tsx (2 Fälle, neue Prüfungen auf rounded-full und auf den alten Kartenrahmen).
12. Alt-Neu-Liste: siehe unten.

ALT-NEU-LISTE (Mikrotexte und Teständerungen)
- Augenbraue Kopf: „Direkt kaufen“ → „MS-01 · Direkt kaufen“ (Anzeige in Großbuchstaben über .eyebrow).
- h1: „Büroschrank und Rollcontainer — Serie MS-01“ → „Büroschrank und Rollcontainer“. Breadcrumb, Seitentitel, JSON-LD und bestell-formular unverändert.
- Lead „Möbel- und Büroschloss: Büroschrank und Rollcontainer“ entfällt. Ersatz: Zeile „Anwendung“ in den Angaben, gleicher Wortlaut.
- Augenbraue „01 Lieferumfang“ und Überschrift „Was Sie erhalten“ entfallen. Der Absatz steht unverändert unter „02 Technische Angaben“.
- Nummern: „02 Codefundstelle“ → „01“, „03 Angaben“ → „02“, „04 Weiter im Bereich“ → „03“.
- Plakette „Ohne Einsendung des Originalschlüssels“: Wortlaut gleich, Ton Primärblau → outline, Haken davor.
- Plakette „Codeformat:“ Etikett gleich, Wert in Mono.
- Bildunterschrift: Wortlaut gleich, nur Umbruch nach dem Gedankenstrich.
- Teständerungen code-fundstelle-interaktiv.test.tsx: Testname „zeigt drei Registerkarten, die erste ist gewählt“ → „zeigt drei Registerkarten als Segmentleiste, die erste ist gewählt“; Konstante KARTE → FLAECHE; Testname „setzt die Zeichenfläche als Karte auf Papier“ → „setzt die Zeichenfläche ohne Kartenrahmen auf den Bereichston“. Anzahl der Tests bleibt 2, Prüfungen steigen um zwei.

NICHT UMGESETZT (wie vorgegeben, bestätigt)
- Widerrufshinweis: unverändert in bestell-formular.tsx und page.tsx (Alert Z. 210 und Abschnitt Widerruf).
- profilschnitt.tsx, profilschnitt.test.tsx, globals.css, image-placeholder.tsx, page-header.tsx: ohne Diff.
- Keine neuen Abhängigkeiten, kein lucide-react, keine neuen Tokens außer den vorhandenen; werte-suche ohne Funde.

GEMEINSAME DATEIEN
- SOLL, Halm-Bemaßung unter 11,5 px (nicht behoben): Die Bemaßung hat im Generator 12 Einheiten, der Ausschnitt ist 334 Einheiten breit. Bei 280 px Zeichnungsbreite (320 px Viewport) ergibt sich 12 × 280/334 = etwa 10,1 px, unter K-008 (11,5 px). Eine Behebung ohne Risiko gibt es nicht: ein schmalerer Ausschnitt schneidet Spitze (x 456) oder Nummern ab, nicht am Bild geprüft; eine Ausdehnung auf 320 px Zeichnungsbreite (-mx-5) bricht die 20-px-Seitenränder und ist eine Layout-Entscheidung; die Schrift im Generator anzuheben ist verboten. Ich schlage eine Entscheidung des Orchestrators vor.
- Fremde Dateien, Logikwächter Teil B ABWEICHEND, nicht behoben und nicht meine Schreibrechte: src/app/(site)/warenkorb/warenkorb-ansicht.tsx und src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx.
- Keine neuen Ausnahmen für den Logikwächter nötig. Die Ausnahmen für kamera in photo-upload.tsx sind vorab eingetragen und greifen; der Ternär steht in className (erlaubt).

PRÜFUNG UND ERGEBNIS
- npx tsc --noEmit: ohne Fehler (gesamtes Repository, Log leer).
- npx vitest run src/components src/lib: 68 Dateien, 1177 Tests, alle grün.
- npx eslint für die sechs Dateien: ohne Befund.
- werte-suche.mjs: keine Funde. Eine Ausnahme: photo-upload.tsx Z. 102 `#fff` (Weißgrund im Canvas-Code), seit d4a1d47 unverändert.
- logikwaechter.mjs pruefen: die sechs eigenen Dateien gleich; Abweichungen nur in den fremden Dateien oben.
- Sichtbare Platzhalter per curl: nicht möglich (Server). Statisch: page.tsx blendet den Platzhalter „[Hersteller eintragen]“ über istPlatzhalter aus (Z. 77). In src/app/(site)/schluessel-nach-code/[slug]/ kein „[Platzhalter“.
- Bildprüfung Schritt 5 (MUSS): NICHT DURCHGEFÜHRT. Port 3001 nimmt keine Verbindung an (curl localhost und 127.0.0.1: Exit 7, kein Listener). Die Lock-Datei /tmp/sm24-messfenster.lock existiert nicht. Port 3000 antwortet, ist aber der ältere Build und war nicht als Beleg zulässig. Ich habe den Server nicht selbst gestartet, weil das Paket Melden verlangt.
- Die Sichtwirkungen bleiben unbelegt: zweizeilige h1, Halm ohne Reide, Segmentleiste mit Anschnitt, Plakette, Rahmenknopf, Fundstelle 512 px neben dem Live-Schlüssel, Überlauf, Kopfhöhe (mobil plus 54 bis 57 px laut Paket), Tastaturfokus.

BILDBELEGE
Keine. Prüfprotokolle liegen in /root/sm24-bilder/E6-BEFUND2-H06/ (tsc.log, vitest-komponenten-lib.log, eslint.log, werte.json, werte-suche.log, logikwaechter.log).

OFFENE FRAGEN
1. Entwicklungsserver Port 3001 starten (oder Freigabe erteilen), dann Schritt 5 für /schluessel-nach-code/ms-01 (360, 375, 390 px, Tablet, Desktop), zy-02, fa-02 und /schluessel-nach-vorlage/anfrage Schritt 1 ausführen.
2. Halm-Bemaßung unter 11,5 px auf 320-px-Telefonen: Entscheidung zwischen Ausschnitt verschmälern (mit Bildprüfung), Ausdehnung auf Bildschirmbreite (Layout-Entscheidung) oder Befund als Ausnahme zu K-008.
3. Die Plakette-Höhe (24 px gegen 22 px) und der Tastaturfokus der Segmentknöpfe sind nur am Bild zu beurteilen.

=== ENDE E6-BEFUND2-H06 · BEREIT ZUR RÜCKGABE ===
