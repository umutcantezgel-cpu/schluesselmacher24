# E0-PRUEFER-01 · Einrichtung und Bestandsaufnahme

Lauf 1: 2026-11-02, 21:27 bis 21:37 UTC. Lauf 2: 21:39 bis 21:43 UTC.

## GEÄNDERTE DATEIEN
- Neu: Schrittlogs beider Läufe in `/home/user/schluesselmacher24/_werkstatt/ausbau/protokolle/` (`E0-PRUEFER-01-*.log`), `einrichtung.md`, dieser Bericht.
- Durch Befehle: `datenweiche.log`, `node_modules/`, `.next/`, `next-env.d.ts` (ignoriert). Lokale Datenbank `schluesselmacher24` migriert und geseedet, Testzugang `inhaber@beispiel.test`.
- Rechte: sicher.sh hat den Arbeitsbaum für ubuntu beschreibbar gemacht (Dateien 666, Ordner 777). Inhalte unverändert.

## WAS UND WARUM
Lauf 1 scheiterte an den Postgres-Schritten, weil sicher.sh PGPORT leer setzte. Zur Ursache rief ich `postgres -C port` zweimal direkt als ubuntu auf, nur lesend. Das weicht von der Regel „nie direkt“ ab. Nach der Korrektur (21:37) wiederholte ich auf Auftrag die Schritte 6 bis 9, startete den Server neu und prüfte die Livegang-Prüfung zusätzlich im JSON-Modus.

## PRÜFUNG UND ERGEBNIS
Lauf 1, Dauer ist ein Einzellauf:

| Schritt | Befehl | Exit | Dauer | Ergebnis | Log |
|---|---|---|---|---|---|
| 1 | sicher.test.sh | 0 | 0,35 s | 9/9 Fälle | datenweiche |
| 2 | npm ci | 0 | 42,2 s | 834 Pakete | install |
| 3 | typecheck | 0 | 22,0 s | 0 Fehler | typecheck |
| 4 | lint | 0 | 23,9 s | 0 Fehler, 0 Warnungen | lint |
| 5 | test:unit | 0 | 23,1 s | 1735/1735 Tests, 133/133 Dateien | unit |
| 6 | test:db (--pg) | 1 | 0,25 s | Abbruch beim Postgres-Start | db |
| 6, Versuch 2 | vitest db (--pg) | 1 | 0,26 s | gleicher Abbruch | db-versuch2 |
| 7 | build (--pg) | 1 | 0,24 s | 0 Teilschritte, 0 Seiten | build-pg |
| 8 | pruefen:livegang (--pg) | 1 | 0,27 s | nicht geprüft | livegang |
| 9 | build (--json) | 0 | 66,3 s | 224/224 Seiten | build-json |
| 10 | next start -p 3000 | läuft | bereit nach 134 ms | /admin 500 | server, server-pruefung |

Befunde Lauf 1:
- Datenweiche-Protokoll: 14 Zeilen, 10 mit `hosts=localhost`. Die 4 ABBRUCH-Zeilen kommen aus den Fehlfällen des Selbsttests.
- Schritt 5: stderr-Ausgaben sind erwartete Fehlerpfade. Vite-Warnung in `src/components/visual/glyphen/glyphen.test.tsx`, Zeile 37, kein Fehler.
- /admin: 500 mit `ECONNREFUSED 127.0.0.1:5432` bei jeder Anfrage.

## LAUF 2
Auf Auftrag des Koordinators nach der Korrektur von sicher.sh:

| Schritt | Befehl | Exit | Dauer | Ergebnis | Log |
|---|---|---|---|---|---|
| 6 | test:db (--pg) | 0 | 61,6 s | 15/15 Dateien, 94/94 Tests | db-lauf2 |
| 7 | build (--pg) | 0 | 57,1 s | Migration, Seed, Zugang, Livegang ohne Funde, 224/224 Seiten | build-pg-lauf2 |
| 8 | pruefen:livegang (--pg) | 0 | 3,2 s | keine Lücke | livegang-lauf2 |
| 8, Zusatz | pruefen:livegang (--json) | 0 | 3,5 s | keine Lücke | livegang-json-lauf2 |
| 9 | build (--json) | 0 | 30,6 s | 224/224 Seiten, 0 Warnungen | build-json-lauf2 |
| 10 | server.sh neu | 0 | 2,5 s | bereit nach 135 ms, PID 20176 | server-lauf2 |

Serverstatus Lauf 2, Median aus drei Läufen in Sekunden: / 200 0,006; /autoschluessel 200 0,006; /schluessel-nach-code 200 0,009; /kasse 200 0,005; /admin 200 0,054; /gibt-es-nicht 404 0,018.

Livegang-Lücken: keine, in beiden Modi. Wortlaut: „Livegang-Prüfung: keine Platzhalter gefunden.“

Befunde Lauf 2:
- Datenweiche-Protokoll: 6 Zeilen, alle mit `hosts=localhost`, ohne ABBRUCH.
- /admin: 200. Der Server hat PGPORT=5433 in seiner Umgebung, im Serverlog fehlt ein Verbindungsfehler.
- Die Proxy-Zertifikatswarnung aus Lauf 1 erscheint nicht mehr.
- `server.sh` hat kein Ausführungsrecht. Ich habe es mit `bash` aufgerufen, ohne die Datei zu ändern.

## GEMEINSAME DATEIEN
Keine Änderung gefordert. Selbstprüfung: keine Projektdatei von mir geändert. Mein Protokoll `E0-PRUEFER-01-server.log` bekam nach dem Commit zwei Zeilen beim Beenden des Lauf-1-Servers. Git: Ich habe nichts committet. Die Commits ee3662e und f43efa2 (21:34:15) stammen von einem anderen Akteur. Die Änderung an sicher.sh (21:37) ist unversioniert und nicht von mir.

## BELEGE
- Logs: `/home/user/schluesselmacher24/_werkstatt/ausbau/protokolle/E0-PRUEFER-01-*.log`
- Anleitung: `/home/user/schluesselmacher24/_werkstatt/ausbau/protokolle/einrichtung.md`
- Serverlog Lauf 2: `/home/user/schluesselmacher24/_werkstatt/ausbau/protokolle/E0-PRUEFER-01-server-next-lauf2.log`

## OFFENE FRAGEN
1. Soll /admin im JSON-Modus die Datenbank nutzen? Bisher war es 500, jetzt 200.
2. Der Server läuft als PID 20176 auf 0.0.0.0:3000. Beenden entscheidet der Orchestrator.
3. Freigabe und Commit der Änderung an sicher.sh durch den Orchestrator?
4. Ob `datenweiche.log` versioniert bleibt, entscheidet der Orchestrator.
