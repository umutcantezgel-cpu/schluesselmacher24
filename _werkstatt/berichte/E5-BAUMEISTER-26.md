# E5-BAUMEISTER-26 · Bericht und Abnahme (Service-Anfrage und Terminstatus)

3 Prüfrunden; letztes Prüfurteil: nicht bestanden (1 Muss: ungenutzter Kartenimport, ESLint-Warnungen). Nach L3 Nacharbeit und Abnahme durch den Orchestrator:

- **Muss ungenutzter Import:** Der Import der Kartenbausteine in `status-formular.tsx` entfällt; benannte Ausnahme im Logikwächter (der neue Stand wird vor dem Fingerabdruck um den alten Import ergänzt, die Basis bleibt unberührt). Logikwächter 0 abweichend, ESLint ohne Befund.
- **Soll Ergebnis- und Erfolgsansicht ohne Bild:** bestätigt als Lücke der Prüfmittel – ein Ergebnis braucht einen echten Vorgang, die Attrappen beantworten nur Schreibvorgänge (G5). Geprüft am Code; Funktionsliste F-07 und F-08 bestanden.
- **Soll Verlauf als bemaßte Zeitleiste:** bestätigt in der umgesetzten Form (Achse mit Maßpunkten, Maßhilfslinie und Mono-Zeitstempeln); eine Teilung ohne echte Zeitdaten wäre erfunden.
- **Soll Erfolgsfläche:** `surface` mit Rahmen bleibt (ruhige Fläche nach D-041).
- **Bilder:** eigene Bilder Terminstatus desktop und mobil (`/root/sm24-bilder/L-B26-27/`).

## Prüfurteil (letzte Runde)

- **muss:** ESLint meldet 3 Warnungen in status-formular.tsx Z. 12 (Card, CardBody, CardHeader ungenutzt). Die Schnellprüfung verlangt ESLint ohne Befund. Der Import liegt außerhalb der erlaubten Importe (nur @/components/visual/); seine Entfernung braucht eine Ausnahme des Orchestrators im Logikwächter. Der Baumeister hat sie korrekt nicht selbst eingetragen. Behebung: Ausnahme durch den Orchestrator, danach Entfernung.
- **soll:** Verlauf (Terminstatus) ist keine bemaßte Zeitleiste: Haarlinie und Punkte je Eintrag sind da, eine echte Teilung fehlt (Paket-Aufgabe). Nur per Code geprüft, nicht im Bild.
- **soll:** Zustände Terminstatus-Ergebnis (Schriftfeld, Badge, Verlauf) und Anfrage-Erfolg (CheckDraw, role=status) sind nicht im Bild belegt. Das Protokoll F-08 bestätigt nur den Text „Nichts gefunden“, und schritte-f08 ist leer. Diese Zustände sind nur per Code belegt.
- **soll:** anfrage-formular.tsx, Erfolgsblock: Fläche ist `rounded-lg border border-border bg-surface p-6`. Das Paket verlangt `border-t border-border` oder einen vorhandenen Ton ohne Alpha. Abweichung vom Wortlaut, optisch unauffällig.
- **hinweis:** Widerspruch im Paket: Die Aufgabe nennt „Arbeitskopf mit Fach-Icon“, die Vorgabe D-041 verlangt Arbeitsköpfe ohne Fach-Icon. PageHeader zeigt das Icon bei art="arbeit" nicht (page-header.tsx, Bedingung bereich && erzaehl). Der Baumeister hat der Vorgabe gefolgt, das ist richtig. Versionsangaben widersprechen sich: Paket 1.11, Auftrag 1.12, KERN.md-Kopf 1.13. Orchestrator sollte das klären.
- **hinweis:** Vitest src/components src/lib: 2 Fehler in schluesselarten-reihe.test.tsx. Die Datei gehört nicht zum Paket und wurde nicht geprüft.
- **hinweis:** Entwicklungsmodus: Das Dev-Overlay (N-Symbol) und der Redaktionshinweis im Fuß erscheinen nur im Dev-Server. Auf dem mobilen Terminstatus überdeckt das Overlay das Label „Autoschlüssel“ der Tableiste. Das betrifft nur die Entwicklung.

## Bericht des Ausführenden (letzte Runde)

E5-BAUMEISTER-26, Korrekturlauf nach Runde 2 (Service-Anfrage und Terminstatus).

Muss-Befund behoben: Der Import `{ Card, CardBody, CardHeader } from '@/components/ui/card'` steht in status-formular.tsx wieder an seiner Basisstelle (Z. 12). Der Logikwächter meldet beide Formulare als gleich (abweichend 0). Der Import ist aber ungenutzt. ESLint meldet dazu 3 Warnungen. Die Entfernung braucht eine Ausnahme, die ich nicht selbst eintrage (siehe offene Fragen).

Soll-Befund teilweise behoben: Der Verlauf hat jetzt Maßpunkte auf der Achse, eine Maßhilfslinie je Eintrag und Mono-Zeitstempel. Eine echte bemaßte Teilung fehlt noch, siehe offene Fragen.

Soll-Befund nicht behoben: Terminstatus-Ergebnis und Anfrage-Erfolg sind weiterhin nicht im Bild belegt. Die Gründe stehen unter offene_fragen 2 und 3 (kein erreichbarer Vorgang bzw. Attrappe liefert null). Beide Zustände sind nur per Code geprüft.

Schnellprüfung: tsc fehlerfrei. ESLint ohne Fehler, aber 3 Warnungen. Vitest 1134 bestanden, 2 fremde Fehler (schluesselarten-reihe.test.tsx). werte-suche 0 Funde. Kein lucide-Import. Keine Platzhalter im HTML.

Keine Dateien gelöscht, nichts committet oder gepusht. Neue Ausgaben liegen in /root/sm24-bilder/E5-BAUMEISTER-26/r3/ (Seitenbilder und Schrittbilder). Die alten Ordner wurden nicht angerührt.
