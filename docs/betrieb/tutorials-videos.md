# Tutorials: Videos ergänzen und freischalten

Diese Anleitung ist für das Team im Adminbereich unter `/admin`. Ein Video ergänzen oder austauschen Sie ohne Entwickler. Ob Videos auf der Seite erscheinen, entscheidet ein Schalter, den der Betrieb einmal setzt (Abschnitt 4).

## 1. Video hinterlegen

1. Links unter **Inhalte** auf **Tutorials** klicken und das Tutorial öffnen.
2. Im Kasten **YouTube-Video (optional)** bei **YouTube-Link oder Kennung** den Link einfügen, etwa aus „Teilen“ bei YouTube. Beim Speichern bleibt nur die elfstellige Kennung stehen. Links von anderen Seiten lehnt die Seite ab.
3. **Titel des Videos**, **Dauer** (etwa 4:32) und **Veröffentlicht bei YouTube am** ausfüllen.
4. Oben rechts auf **Speichern** und dann auf **Veröffentlichen** klicken.

Zum Austauschen fügen Sie einfach einen anderen Link ein und speichern. Zum Entfernen leeren Sie das Feld.

## 2. Vorschaubild

Vor dem Klick des Kunden zeigt die Seite kein Bild von YouTube, sondern eine eigene Vorschau.

- Mit **Eigenes Vorschaubild (optional)** wählen Sie ein Foto aus der Medienablage. Laden Sie dafür ein eigenes Foto hoch, nie ein Bild von YouTube.
- Ohne eigenes Bild zeigt die Seite eine helle Fläche mit Titel und Dauer.
- Für den Videoeintrag in den Strukturdaten der Tutorial-Seite braucht es das eigene Vorschaubild, den Titel und das Datum. Fehlt eines davon, erscheint das Video trotzdem auf der Seite, nur ohne diesen Eintrag.
- Im Eintrag stehen Titel, Beschreibung (die Kurzantwort des Tutorials), das eigene Vorschaubild, das Datum und, wenn gepflegt, die Dauer. Darin stehen alle Angaben, die Google für einen Videoeintrag verlangt (Titel, Vorschaubild, Datum). Die Adresse des Players von YouTube steht bewusst nicht darin: Google empfiehlt sie nur, und vor dem Klick des Kunden soll in der Seite keine Adresse von YouTube stehen. Ob und wie die Suche den Eintrag zeigt, entscheidet Google.
- Auf den Leistungsseiten steht kein eigener Videoeintrag; er gehört zur Tutorial-Seite.

## 3. Transkript

Im Feld **Transkript oder Zusammenfassung** steht in Sätzen, was im Video gesagt und gezeigt wird. Es erscheint unter dem Video zum Aufklappen („Was im Video gezeigt wird“). Das hilft allen, die das Video nicht ansehen können oder wollen. Die Schritte des Tutorials müssen auch ohne Video verständlich bleiben.

## 4. Der Schalter: wann Videos erscheinen

Solange der Schalter nicht gesetzt ist, steht auf der Tutorial-Seite an der Stelle des Videos nur der Satz „Zu diesem Thema gibt es ein Video. Es erscheint hier, sobald die Einbettung freigeschaltet ist.“ Es wird nichts von YouTube geladen.

Mit dem Schalter gilt:

- Die Seite zeigt die Vorschau mit dem Knopf **Video laden**. Darunter steht, dass mit dem Klick Daten an YouTube gehen, mit Verweis auf die Datenschutzerklärung.
- Erst der Klick des Kunden lädt das Video im erweiterten Datenschutzmodus (`youtube-nocookie.com`). Die Seite speichert dazu nichts; beim nächsten Video entscheidet der Kunde neu.
- Die Sicherheitsrichtlinie erlaubt dann genau den Rahmen von `https://www.youtube-nocookie.com`, sonst nichts von YouTube oder Google.
- Die Datenschutzerklärung zeigt den Absatz zu YouTube, und die Übersicht der Verarbeitungen nennt den Dienst.
- Auf den Leistungsseiten steht das Video dann direkt im Hinweis, mit derselben Vorschau und demselben Knopf wie auf der Tutorial-Seite; darunter bleibt der Verweis auf die Anleitung. In Anfrageformularen bleibt es beim Verweis in neuem Fenster, mit dem Kennzeichen „mit Video“.
- Die Seite Cookie-Einstellungen zeigt eine eigene Einleitung: Videos von YouTube laden erst nach dem Klick, und YouTube kann dabei Cookies setzen.

**Wer setzt ihn:** der Betrieb (wer die Umgebungsvariablen bei Vercel pflegt), und erst, wenn der Anwalt die Texte hinter dem Schalter geprüft und der Inhaber sie freigegeben hat: den Absatz zu YouTube in der Datenschutzerklärung, den Eintrag in der Übersicht der Verarbeitungen, die Einleitung der Seite Cookie-Einstellungen und den Satz unter der Vorschau. Die Entwürfe stehen wörtlich in den Berichten `_werkstatt/ausbau/berichte/FA-INHALT-01B.md` und `FA-INHALT-01C.md`.

**Außerdem vorher prüfen:**

- **Eigene Datenschutzerklärung im Admin**: Ist unter den Einstellungen eine eigene Datenschutzerklärung hinterlegt, ersetzt sie den eingebauten Text vollständig. Dann fehlen der Absatz zu YouTube und die Stelle, auf die der Satz unter dem Video verweist. Die hinterlegte Fassung muss deshalb den geprüften Absatz zu YouTube enthalten, bevor der Schalter gesetzt wird.

**So:** In den Umgebungsvariablen des Projekts `SM24_VIDEOS` mit dem Wert `an` anlegen und die Seite neu bauen lassen (neues Deployment). Andere Werte oder ein leerer Wert lassen die Einbettung aus. Zum Abschalten die Variable löschen und neu bauen lassen.

## 5. Hinweise auf Leistungsseiten und in Formularen

Unabhängig vom Schalter erscheinen veröffentlichte Tutorials an den Orten, die unter **Erscheint auf** gewählt sind: auf den Leistungsseiten als kurzer Hinweis, in den Anfrageformularen beim Kasten mit der Hilfe. In Formularen öffnet der Verweis ein neues Fenster, damit die Angaben im Formular stehen bleiben. Ein Ort ohne veröffentlichtes Tutorial zeigt nichts. Mit dem Schalter zeigt der Hinweis auf Leistungsseiten bei einem Tutorial mit Video zusätzlich das Video selbst (siehe Abschnitt 4).
