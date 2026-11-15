# FA-SOFORT-03 · Leistung „Schlüssel nach Foto“ entfernen; die Rubrik heißt „Schlüssel nach Vorlage“

Kopf: Etappe FA Priorität 1 · Rolle Autor und Baumeister · Modell Opus · Stufe 3 (Inhalte der Schlüsselseiten) · Kostenklasse L · Anforderungen FA-03 (Kachel entfernen), FA-12 (Schlüssel nach Vorlage und Einsendeservice) · Entscheidung A-046.

## Aufgabe in einem Satz
Entferne die Leistung „Schlüssel nach Foto“ aus allen sichtbaren Texten, Namen und Metadaten und stelle den Weg als „Schlüssel nach Vorlage“ dar: Fotos dienen nur der Identifikation und Prüfung, gefertigt wird nie nach einem Foto.

## Vorgabe des Inhabers (wörtlich, Arbeitsanweisung vom 11.11.2026)
- Abschnitt 03: „Die Kachel ‚Schlüssel nach Foto‘ vollständig entfernen. Diese Leistung wird nicht angeboten. Fotos dienen nur zur Identifikation und Prüfung, nicht zur automatischen Ermittlung von Schließwerten.“ Gewünschter Hauptzugang: „Schlüssel einschicken beziehungsweise Schlüssel nach Vorlage“.
- Abschnitt 12, Anfrage nach Vorlage: „Drei Fotos: Vorderseite, Rückseite, Spitze beziehungsweise Profil von vorne. Beschriftungen und Prägungen müssen auf den Fotos lesbar sein. Kurze Beschreibung und gewünschte Stückzahl. Video und Bildtutorial integrieren, wie ein Schlüssel richtig fotografiert wird. Nach Prüfung Preis und Machbarkeit mitteilen.“
- Abschnitt 12, Originalschlüssel einsenden: „Wenn eine sichere Fertigung nur am Original möglich ist, soll der Kunde den Schlüssel einfach einsenden können. Auch mechanische Autoschlüssel beziehungsweise reine Schlüsselbärte können je nach Fall eingesendet werden.“
- Abschnitt 02: kurze, klare, natürliche Sätze; keine Gedankenstriche, keine Floskeln, nichts erfinden (keine Zeiten, Preise, Zusagen).

## Bereits erledigt (nicht noch einmal anfassen)
- Kennung der Rubrik: `schluessel-nach-foto` heißt jetzt `schluessel-nach-vorlage` (content/rubriken.json, src/lib/data/defaults/rubriken.ts, Seite, Tests, Seed mit `umbenannt`, Datenmigration `20261115_120000_rubrik_nach_vorlage`).

## Schreibrechte (exakt diese Dateien, sonst keine)
- content/rubriken.json und src/lib/data/defaults/rubriken.ts (beide müssen denselben Stand tragen; nur die Rubriken `schluessel-nach-vorlage` und `schluessel-einschicken`)
- content/seo.json (nur der Eintrag der Route `schluessel-nach-vorlage` und Verweise mit dem Wort „Foto“ im Label)
- src/lib/navigation.ts (nur der Bereich `schluessel-nach-vorlage`)
- src/app/(site)/schluessel-nach-vorlage/page.tsx, src/app/(site)/schluessel-nach-vorlage/opengraph-image.tsx
- src/app/(site)/schluessel-einschicken/page.tsx, src/app/(site)/schluessel-einschicken/layout.tsx
- src/app/(site)/bestellung/[id]/foto-ergebnis.tsx, src/lib/mail/vorlagen/freigabe.ts
- die Testdateien, die zu diesen Dateien gehören und deren Erwartungen sich dadurch ändern
- _werkstatt/ausbau/berichte/FA-SOFORT-03.md (dein Bericht)

## Schritte
1. Suche jede Stelle: `grep -rniE "nach[- ]foto|Foto prüfen lassen|nach Ihren (Fotos|Bildern)" content src --include=*.json --include=*.ts --include=*.tsx` (ohne migrations, payload-types). Interne Namen wie `istFotoanfrage`, `fotoanfrage`, `SCHRITTE_FOTOANFRAGE` und das Ereignis `fotoanfrage` bleiben (Code, nicht sichtbar).
2. Rubrik `schluessel-nach-vorlage`: name und laienname „Schlüssel nach Vorlage“; erklaerung in einem Satz ohne „nach Foto“; im Ablauf darf kein Schritt eine „Nachfertigung nach Ihren Bildern“ versprechen. Icons und Reihenfolge der Schritte bleiben (A-034). Der Sinn: Fotos hochladen → wir bestimmen Schlüsselart, Profil und Beschriftung und prüfen die Machbarkeit → Sie erhalten Preis und den Weg (Fertigung nach den Angaben auf dem Schlüssel oder Einsendung des Originals) → Zahlung über den persönlichen Link → Fertigung und Versand.
3. Rubrik `schluessel-einschicken`: `imHub` auf false (ein Hauptzugang statt zwei); erklaerung ohne „nur nach Freigabe der Fotoanfrage“, im Einklang mit dem, was die Seite /schluessel-einschicken und /schluessel-einschicken/anmelden wirklich tun (lies beide). Der Rubrik `schluessel-nach-vorlage` gibst du den Zusatz (`zusatz`) „per Foto anfragen oder einschicken“, falls das Feld bei anderen Rubriken so genutzt wird (siehe `sperrschliessung`).
4. Navigation: label „Schlüssel nach Vorlage“, navLabel „Nach Vorlage“, summary und highlight ohne „Foto prüfen lassen“ als Leistungsname. Der Knopf zur Anfrage heißt überall gleich: „Schlüssel prüfen lassen“ (A-031: ein Knopftext je Ziel).
5. Seite /schluessel-nach-vorlage: Titel, Brotkrumen, Metadaten-Rückfall, Kopf, Hinweiskasten, FAQ und der Abschnitt zu den drei Aufnahmen. Füge an gut sichtbarer Stelle den Satz des Inhabers sinngemäß ein: Fotos dienen der Identifikation und Prüfung; Schließwerte lesen wir nicht aus Fotos ab; braucht die Fertigung das Original, senden Sie es ein. Die FAQ-Antwort mit dem Platzhalter zur Bearbeitungsdauer bleibt ausgeblendet (keine Zeiten erfinden). Die Felder im Kopf: „Original: Bleibt zunächst bei Ihnen“ und „Einsendung: Wenn die Fertigung das Original braucht“.
6. Seite /schluessel-einschicken: Verweise und Texte ohne „Schlüssel nach Foto“; der Weg „einfach einsenden“ steht gleichberechtigt neben der Anfrage mit Fotos.
7. Ergebnisanzeige und Freigabe-Mail: Die Zeile „nicht nötig, wir fertigen nach Ihren Fotos“ wird zu „nicht nötig“ (keine Aussage, dass nach Fotos gefertigt wird).
8. content/seo.json, Route `schluessel-nach-vorlage`: headline „Schlüssel nach Vorlage“, subline, Titel (höchstens 60 Zeichen), Beschreibung (120 bis 160 Zeichen), Motivtext, Verweis-Label. Ohne Gedankenstriche.
9. Tests anpassen, die den alten Wortlaut erwarten, und einen Test ergänzen, der sichert: In den Rubriken, in der Navigation und in content/seo.json kommt „nach Foto“ nicht mehr vor, und im Hub steht genau eine Kachel für diesen Weg.
10. Prüfen: `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run` (alles grün), `… -- npm run typecheck`, `… -- npm run lint`. Kein Build, kein Server, kein git.

## Grenzen
G4 (keine .env), G5, G8 (keine Prüfung lockern: Erwartungen nur dort ändern, wo sich der verlangte Wortlaut geändert hat), G9 (Preise, Rechtstexte in ihrem Inhalt und Fristen bleiben), R4 (nichts erfinden), R13 (der Nachweis bleibt: Sicherungskarte bei geschützten Profilen, drei Fotos als Pflicht). Prettier nicht auf Bestand anwenden.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · PRÜFUNG UND ERGEBNIS (Zahlen der Tests) · BELEGE · OFFENE FRAGEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-SOFORT-03 · BEREIT ZUR RÜCKGABE ===
