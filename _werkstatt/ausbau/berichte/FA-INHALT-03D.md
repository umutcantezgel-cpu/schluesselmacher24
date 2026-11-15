# Bericht FA-INHALT-03D · Texte menschlicher: Schlüssel nach Code, nach Vorlage, einschicken

Stand 15.11.2026. Kein git, kein Server, kein Build.

## GEÄNDERTE DATEIEN
- content/seo.json (nur headline, subline, intro der Routen schluessel-nach-code, schluessel-nach-vorlage, schluessel-nach-vorlage/anfrage, schluessel-einschicken; seo.title, seo.description, internalLinks unberührt)
- src/lib/data/defaults/content.ts (dieselben Felder gleichlautend für schluessel-nach-code, schluessel-nach-vorlage, schluessel-nach-vorlage/anfrage; für schluessel-einschicken gibt es dort keinen Eintrag)
- src/app/(site)/schluessel-nach-code/page.tsx
- src/app/(site)/schluessel-nach-code/shop-liste.tsx
- src/app/(site)/schluessel-nach-code/[slug]/page.tsx
- src/app/(site)/schluessel-nach-code/[slug]/bestell-formular.tsx (nur Wortlaut von Hilfe- und Fehlertexten)
- src/app/(site)/schluessel-nach-vorlage/page.tsx
- src/app/(site)/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx (nur Wortlaut)
- src/app/(site)/schluessel-einschicken/page.tsx
- src/app/(site)/schluessel-einschicken/anmelden/einsende-formular.tsx (nur Wortlaut)
- Unverändert, weil ohne eigenen Text oder Text aus fremden Dateien: linien-liste.tsx, hersteller/[hersteller]/page.tsx, kategorie/[familie]/page.tsx (Texte kommen aus shop-daten.ts, kein Schreibrecht), anfrage/page.tsx, anmelden/page.tsx.

## WAS UND WARUM
Allgemein: Gedankenstriche raus, Semikolons und Effekt-Doppelpunkte in zwei Sätze geteilt, Fachwörter mit Halbsatz erklärt, interne Wörter („eingepflegt“, „Codeprodukte“, „Fotoanfrage“) durch Kundensprache ersetzt. Keine Logik, Feldnamen, Prüfregeln oder Reihenfolgen geändert.

Schlüssel nach Code
- Kopf ohne Produkte: „Sie nennen uns den Code Ihres Schlosses, wir prüfen ihn und melden uns. Ihr Originalschlüssel bleibt bei Ihnen.“ Hinweis darunter in drei kurzen Sätzen.
- Leerzustand (A-046): „Die Codeprodukte werden gerade eingepflegt.“ wurde „Direkt bestellen können Sie hier noch nicht.“ Kein Sortiment, keine Hersteller, keine Lieferzeit behauptet (R4). Ablauf-Lead entsprechend ohne „eingepflegt“.
- seo.json/content.ts: subline „Code eingeben, bestellen, fertig.“ (Ein-Wort-Satz) wurde „Code eingeben, Stückzahl wählen, bestellen. Ihr Originalschlüssel bleibt bei Ihnen.“; intro ohne Gedankenstrich.
- Shop-Liste: Suchhilfe ohne Gedankenstrich und genauer („deren Codeformat dazu passt“), Infotexte zu Schlüsseltyp und Anwendungsfamilie kürzer, Leertext ohne Doppelpunkt.
- Detailseite: Bildunterschrift ohne Halbgeviertstrich.
- Bestellformular: Formatfehler sagt jetzt, was erwartet wird, bittet um Prüfung und nennt „Code anfragen“ als nächsten Schritt (FA-11). Fehlendes Pflichtfoto heißt jetzt ausdrücklich „Foto Ihrer Sicherungskarte“ und wird in einem Satz begründet (R13). Der Pflichtfall zeigt schon heute das Feld „Foto Ihrer Sicherungskarte“.

Schlüssel nach Vorlage
- seo.json/content.ts: subline klarer („Sie haben einen Schlüssel und brauchen einen weiteren …“); Rückfall in content.ts trug noch einen Gedankenstrich und einen anderen Wortlaut, jetzt gleichlautend.
- „Fotoanfrage“ zweimal ersetzt (Begriff „Schlüssel nach Vorlage“, Foto nur Hilfsmittel, FA-08).
- Querverweis auf Schlüssel nach Code versprach „bestellen Sie direkt“, obwohl es keine Codeprodukte gibt (R4). Jetzt: „Trägt Ihr Schloss einen Code, fertigen wir nach diesem Code. Fotos brauchen Sie dafür nicht.“
- Fachwörter erklärt: Profil (Form im Querschnitt), Rohling (ungefräster Schlüssel), Transponder (Chip im Schlüssel).
- FAQ Sicherungskarte: Nachweis bleibt verlangt und wird begründet (R13).
- Der hervorgehobene Satz des Inhabers („Ihre Fotos dienen nur der Identifikation und Prüfung …“) und der testgebundene Satz zur Ablesbarkeit bleiben wörtlich.

Anfrage nach Vorlage (Formular)
- headline in seo.json/content.ts „Anfrage: Schlüssel nach Vorlage“ wurde „Schlüssel nach Vorlage anfragen“; Formulartitel ebenso statt Gedankenstrich.
- Alle acht Gedankenstriche im Formular aufgelöst.
- Fehlermeldungen nennen jetzt die echten Auswahltexte („Hersteller ist nicht bekannt oder nicht lesbar“, „Auf dem Schlüssel ist nichts erkennbar“); vorher stand dort „nicht bekannt“ bzw. „keine erkennbar“, was es im Formular nicht gibt.
- Sicherungskarte: Begründungssatz ergänzt (R13).
- Zusammenfassung „folgt bei Auftragserteilung“ wurde „erst bei Auftragserteilung nötig“.
- Hinweis „Noch kein Vertrag“ und Datenschutzhinweis wörtlich unverändert (G9).

Schlüssel einschicken
- seo.json: subline in zwei Sätzen, der Bezug „Schlüsseldienst online, ohne Anfahrt“ bleibt (G-26 verlangt ihn ausdrücklich). Intro unverändert im Sinn, nur „Dann“ ergänzt.
- FAQ: Doppelpunkt und Semikolon aufgelöst, Sicherungskarte begründet (R13). Porto-, Haftungs- und Versandaussagen inhaltlich unverändert (FA-SHOP-03, A-050); der Satz zur Versand-Mail wurde nur geteilt.
- Formular: Begleitschein-Hinweis in ganzen Sätzen, Semikolon raus, Sicherungskarte begründet. „Noch kein Vertrag“ wörtlich.

Gegenlesen: Dieses Paket hatte kein Werkzeug, um Unteragenten zu starten. Die zwei Lesungen habe ich deshalb selbst nacheinander gemacht: (1) als älterer Kunde ohne Fachwissen, mit dem Ergebnis Erklärungen für Profil, Rohling, Transponder und klarere Fehlermeldungen; (2) als Prüfung der Tatsachen gegen die alte Fassung, mit dem Ergebnis, dass „die Form des Rohlings“ in der FAQ wieder aufgenommen wurde, „Schlüsseldienst online, ohne Anfahrt“ (G-26) zurückkam und das falsche „bestellen Sie direkt“ entfernt wurde. Eine unabhängige Gegenlesung durch zwei andere Leser steht noch aus (siehe OFFENE FRAGEN).

## ZAHLEN VORHER UND NACHHER
Messung: stil.mjs braucht einen laufenden Server, der hier nicht erlaubt ist. Gemessen wurde deshalb mit den Funktionen `tsxZeilen` und `pruefeZeile` aus stil.mjs auf den Quelltexten der Seitengruppe plus headline/subline/intro aus content/seo.json (Skript im Scratchpad). Das ist eine Heuristik: Texte aus Datenfunktionen (shop-daten, Rubrik-Ablauf, Upload-Bausteine) fehlen, und JSX-Text mit Semikolon wird vom Werkzeug übersprungen. Deshalb steigen die Wortzahlen dort, wo Semikolons entfernt wurden (anmelden), auch ohne viel neuen Text.

| Seite | Wörter vorher → nachher | längster Satz vorher → nachher | Mittel | Gedankenstriche vorher → nachher |
|---|---|---|---|---|
| /schluessel-nach-code (mit Shop-Liste) | 517 → 529 | 20 → 16 | 8,0 → 7,7 | 3 → 1 |
| /schluessel-nach-code/[slug] (mit Bestellformular) | 262 → 282 | 13 → 13 | 6,7 → 6,9 | 0 sichtbar gezählt (1 Halbgeviertstrich in Bildunterschrift entfernt) → 0 |
| /schluessel-nach-code/hersteller/[h] | 10 → 10 | 3 → 3 | – | 0 → 0 |
| /schluessel-nach-code/kategorie/[f] | 32 → 32 | 12 → 12 | 7,3 → 7,3 | 0 → 0 |
| /schluessel-nach-vorlage | 981 → 1077 | 19 → 20 | 8,9 → 9,0 | 0 → 0 |
| /schluessel-nach-vorlage/anfrage | 1136 → 1183 | 23 → 17 | 8,8 → 8,6 | 10 → 1 |
| /schluessel-einschicken | 460 → 504 | 18 → 17 | 9,0 → 8,6 | 0 → 0 |
| /schluessel-einschicken/anmelden | 395 → 445 | 16 → 16 | 7,7 → 7,8 | 0 → 0 |

Kein Satz über 25 Wörter, vorher wie nachher. Die zwei verbliebenen Gedankenstriche stehen in Rückfall-Titeln und -Beschreibungen für Suchmaschinen (`generateMetadata` in schluessel-nach-code/page.tsx und anfrage/page.tsx), die dieses Paket nicht anfassen darf. Die Fragen-Befunde sind fast alle echte Kundenfragen in FAQ, Infotipps und Schrittüberschriften. Wörter kamen dazu, wo Fachwörter jetzt erklärt und Nachweise begründet werden.

Offene Stellen je Seite: Vorlage-FAQ „Wie lange dauert die Prüfung?“ trägt weiter den Platzhalter zur Bearbeitungsdauer und bleibt ausgeblendet. Im Bestellformular steht der Widerrufshinweis mit Gedankenstrich wörtlich (G9).

## SCHLUSSREDAKTION (Liste für den Menschen)
Schlüssel nach Code
1. Leerzustand „Direkt bestellen können Sie hier noch nicht. Bis dahin prüfen wir Ihren Code auf Anfrage.“ Passt das zur geplanten Freischaltung?
2. Bestellformular: Wortlaut des Formatfehlers und der Begründung „Die Karte zeigt, dass Sie diesen Schlüssel bestellen dürfen.“
3. Wörter „Codelinie“ und „Anwendungsfamilie“ (erst mit Produkten sichtbar): verständlich genug für ältere Kunden, oder lieber „Schlüsselreihe“ und „Anwendung“?

Schlüssel nach Vorlage
1. Erklärungen „Profil, also die Form im Querschnitt“ und „Rohling, also der ungefräste Schlüssel“ fachlich prüfen.
2. FAQ Sicherungskarte: „Der Nachweis verhindert, dass Unbefugte Ihren Schlüssel nachmachen lassen.“
3. Der Kopfsatz des Inhabers mit „Identifikation“ und „Schließwerte“ bleibt wörtlich. Bitte entscheiden, ob er einfacher werden darf, etwa „Die Einschnitte (Schließwerte) lesen wir nicht aus Fotos ab“.

Anfrage nach Vorlage
1. Neue Überschrift „Schlüssel nach Vorlage anfragen“ statt „Anfrage: Schlüssel nach Vorlage“.
2. Hinweis „Jede Stelle in eine eigene Zeile, zum Beispiel „Kopf: AB 1234“ und darunter „Bart: 7“.“
3. Begründung der Sicherungskarte im Nachweisschritt.

Schlüssel einschicken (und Anmeldung)
1. subline „Schlüsseldienst online, ohne Anfahrt. Sie schicken uns den Schlüssel mit Begleitschein, Original und Kopien kommen zu Ihnen zurück.“
2. Intro beginnt weiter mit einer Frage („Kein Schlüsseldienst in der Nähe …?“). Sie bleibt wegen G-26 (Menschen auf dem Land ansprechen). Darf sie bleiben?
3. FAQ „Die Anmeldung dauert wenige Minuten“: Diese Zeitangabe stammt aus dem Bestand und ist nicht belegt.

## OFFENE FRAGEN
- Unabhängige Gegenlesung: Die zwei vorgeschriebenen Gegenleser (Haiku als älterer Kunde, Opus für Tatsachen) konnten aus diesem Paket nicht gestartet werden. Bitte durch den Orchestrator nachholen.
- `seo.internalLinks` von schluessel-nach-vorlage, schluessel-nach-vorlage/anfrage und schluessel-einschicken tragen „Code vorhanden? Direkt bestellen“. Ohne Codeprodukte (A-046) stimmt „Direkt bestellen“ nicht (R4). Das Feld liegt außerhalb der Schreibrechte, gehört also in ein SEO- oder Linkpaket.
- Rückfall-Titel mit Gedankenstrich in generateMetadata (schluessel-nach-code/page.tsx „… bestellen — ohne Einsendung …“, anfrage/page.tsx „… anfragen — acht Schritte“) sind SEO-Felder und bleiben bis FA-SEO-01.
- Widerrufshinweis im Bestellformular („… eingeschränkt sein — Einzelheiten …“) ist ein Rechtshinweis und blieb wörtlich (G9). Ob der Gedankenstrich wegfallen darf, entscheidet der Inhaber.
- Texte der Hersteller- und Kategorieseiten und der Detailseiten kommen aus `shop-daten.ts` und `src/lib/codelinie.ts` und lagen außerhalb der Schreibrechte. Sie sind erst mit Codeprodukten sichtbar.
- Die Antworttexte zur Sicherungskarte (KARTEN_ANTWORTEN) liegen in `src/lib/wege/nachweis.ts` und wurden nicht angefasst.
- Gleichstand: Während des Laufs hat der Orchestrator Zwischenstände committet (813c117, b2cc5f1). Ein roter Gleichstands-Test an fremden Routen trat nicht auf.

## PRÜFUNG
- `sicher.sh --json -- npx vitest run`: 187 Testdateien, 2427 Tests bestanden.
- `sicher.sh --json -- npm run typecheck`: ohne Fehler. Ein früherer Lauf zeigte Fehler nur in scripts/fahrzeuge-import-fz2.test.ts. Das ist eine fremde Datei aus einem parallelen Paket, und der Fehler war beim zweiten Lauf weg.
- `sicher.sh --json -- npm run lint`: ohne Fehler (Exit 0).

=== ENDE FA-INHALT-03D · BEREIT ZUR RÜCKGABE ===

## Nachbesserung
Befunde von zwei Gegenprüfern, jeder am Code geprüft. Es wurde nur Wortlaut geändert, keine Logik, keine Feldnamen, keine Prüfregeln.

1. [rot] anfrage-formular.tsx, Kontaktschritt: **behoben.** Ein Feld „Versandland“ gibt es nicht (LIEFERLAND fest), und die Prüfregel lehnt eine nicht fünfstellige Postleitzahl ab. Neu: „Bitte füllen Sie Vorname, Nachname, E-Mail und Telefon aus. Wenn Sie eine Postleitzahl angeben, muss sie fünfstellig sein.“
2. [gelb] schluessel-nach-vorlage/page.tsx, Querverweis Code: **behoben.** Neu: „Trägt Ihr Schloss einen Code, fertigen wir nach diesem Code. Ihren Schlüssel müssen Sie dafür nicht fotografieren. Den Nachweis, dass Sie ihn nachmachen lassen dürfen, brauchen wir trotzdem.“ So bleibt der Satz auch bei Linien mit Kartenfoto richtig (R13).
3. [gelb] schluessel-nach-code/page.tsx, Leerzustand: **behoben.** Ergänzt: „Außerdem bestätigen Sie, dass Sie den Schlüssel nachmachen lassen dürfen. So schützen wir Ihr Schloss vor Unbefugten.“ (entspricht code-anfrage.ts, R13).
4. [gelb] content/rubriken.json:194 und src/lib/data/defaults/rubriken.ts:199 („Während der Fotoanfrage …“), dazu src/lib/mail/vorlagen/zahlung.ts Zeilen 69, 72, 77: **zutreffend, aber außerhalb der Schreibrechte, nicht geändert.** Nachgetragen unter OFFENE FRAGEN (siehe unten), Übergabe an ein Paket mit Rechten an Rubrikdaten und Mailvorlagen.
5. [gelb] und 8. [gelb] bestell-formular.tsx, Formatfehler: **behoben** (beide Befunde betreffen dieselbe Stelle). Das Label steht jetzt abgesetzt: „Dieser Code hat nicht das passende Format. Das passende Format ist: ${codeFormatLabel} (zum Beispiel ${codeExample}). Bitte prüfen Sie Ihre Eingabe. …“ Liest sich bei jedem Label richtig, auch bei „optional 1 Buchstabe, dann …“.
6. [gelb] seo.json subline schluessel-einschicken und Rückfall in schluessel-einschicken/page.tsx: **behoben**, beide gleichlautend: „Schlüsseldienst online, ohne Anfahrt. Sie melden die Einsendung an und schicken den Schlüssel mit Begleitschein. Original und Kopien kommen zu Ihnen zurück.“ In src/lib/data/defaults/content.ts gibt es für diese Route keinen Eintrag, dort war nichts zu ändern.
7. [gelb] schluessel-nach-vorlage/page.tsx, Fototipp: **behoben.** Neu: „Der Schlüssel soll das Bild fast ganz ausfüllen.“

Nachtrag OFFENE FRAGEN:
- „Fotoanfrage“ steht noch im Rubrik-Ablauf von /schluessel-nach-vorlage (content/rubriken.json:194, Rückfall src/lib/data/defaults/rubriken.ts:199: „Während der Fotoanfrage senden Sie bitte nichts unaufgefordert ein.“) und in der Betriebsmail src/lib/mail/vorlagen/zahlung.ts (Zeilen 69, 72, 77). Nach FA-08 ist das Foto nur Hilfsmittel. Vorschlag: „Solange wir Ihre Anfrage prüfen, senden Sie bitte nichts unaufgefordert ein.“ Beide Stellen liegen außerhalb der Schreibrechte und gehören in ein Paket mit Rechten an Rubrikdaten bzw. Mailvorlagen.

Hinweis zum Vorgehen: Die Stelle in content/seo.json wurde als einzelne, eindeutige Textersetzung geändert; der Diff zeigt nur diese Route.

Prüfung nach der Nachbesserung (über sicher.sh --json):
- `npx vitest run`: 187 Testdateien, 2427 Tests bestanden.
- `npm run typecheck`: ohne Fehler.
- `npm run lint`: ohne Fehler (Exit 0).

## ABNAHME (Orchestrator, 15.11.2026)

- **„Fotoanfrage“ aus sichtbaren Texten entfernt** (offene Frage aus der Nachbesserung): Rubrikdaten (`content/rubriken.json`, `src/lib/data/defaults/rubriken.ts`) sagen jetzt „Solange wir Ihre Anfrage prüfen, senden Sie bitte nichts unaufgefordert ein.“ Die Mail an das Team bei Zahlung (`src/lib/mail/vorlagen/zahlung.ts`) und die Kennzahl im Admin (`src/lib/kennzahlen.ts`) nennen die Leistung „Schlüssel nach Vorlage“. Der Test zum Betreff ist angepasst, weil der Inhaber den Begriff geändert hat. Interne Namen im Code (`istFotoanfrage`) bleiben.
- **Verweistext „Code vorhanden? Direkt bestellen“** (`seo.internalLinks` dreier Routen) wird geändert, sobald FA-INHALT-03C die Dateien `content/seo.json` und `content.ts` freigibt; solange es keine Codeprodukte gibt, darf dort kein Direktkauf stehen (R4).
- **Skript statt Bearbeitungswerkzeug an `content/seo.json`**: geprüft, der Unterschied zum Startcommit betrifft nur die Routen dieses Pakets und die des parallel laufenden Pakets 03C; nichts überschrieben.
- Gegenlesen: Die zwei Gegenprüfer des Workflows (Vorgabe und Wahrheit; Technik und Bestand) haben unabhängig gelesen; acht Befunde, sieben behoben, einer hier erledigt.
