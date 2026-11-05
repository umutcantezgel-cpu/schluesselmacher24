# Einrichtung der Prüfwege (Lauf E0-PRUEFER-01, Stand 2026-11-02)

Voraussetzungen: Node 22.x (package.json: engines node 22.x), Nutzer root, Nutzer ubuntu vorhanden (sicher.sh führt Projektbefehle als ubuntu aus), Ports 3000, 5433 und 5434 frei.
Jeder Projektbefehl läuft über die Datenweiche, nie direkt. Keine .env-Dateien lesen oder ändern.

## 1. Selbsttest der Datenweiche
```
/home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/sicher.test.sh
```
Erwartet: letzte Zeile „DATENWEICHE: alle Fälle bestanden“, Exit 0.

## 2. Installation nach Lockfile
```
cd /home/user/schluesselmacher24 && /home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npm ci --no-audit --no-fund
```
Erwartet: „added 834 packages“, Exit 0. Dauer in diesem Lauf: 42 Sekunden. Im Hintergrund starten und das Log beobachten.

## 9. Build ohne Datenbank
```
cd /home/user/schluesselmacher24 && /home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npm run build
```
Erwartet: „Generating static pages (224/224)“, Exit 0. Dauer in diesem Lauf: 66 Sekunden. Danach ist `.next` der JSON-Build.

## 10. Produktionsserver
```
cd /home/user/schluesselmacher24 && /home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx next start -p 3000
```
Im Hintergrund starten und laufen lassen. Neustart: `bash /home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/server.sh neu` (ohne Ausführungsrecht, daher mit bash). Prüfung je Pfad:
```
curl -s -o /dev/null -w '%{http_code} %{time_total}\n' http://localhost:3000/
```
Pfade: /, /autoschluessel, /schluessel-nach-code, /kasse, /admin, /gibt-es-nicht. Erwartet: 200, 200, 200, 200, 200 (/admin, Lauf 2; in Lauf 1 war es 500), 404. Je Pfad drei Läufe, Median der Zeit.

## Bei einem Fehlschlag
- Schritt 1 rot: keine weiteren Schritte. Zeilen mit ABBRUCH in `protokolle/datenweiche.log` nennen die Ursache.
- Schritt 2 rot: `node -v` muss 22.x zeigen. Erste Zeile mit „npm error“ oder „ERR!“ ist der Befund. Die Warnung „Ignoring extra certs“ blieb in diesem Lauf folgenlos. Proxy-Probleme: /root/.ccr/README.md lesen.
- Schritt 9 rot: `.next` ist dann unvollständig. Build wiederholen und den Server nicht starten.
- Schritt 10 rot: Vielleicht läuft auf Port 3000 schon ein Server. Im Container fehlt `ss`; `/proc/net/tcp` zeigt die belegten Ports (3000 entspricht 0BB8).
- Fehlerzeile `invalid value for parameter "port": ""` bei `sicher.sh --pg`: PGPORT war leer. Seit 21:37 setzt sicher.sh PGPORT auf 5433. Kehrt die Zeile zurück, die Fassung von sicher.sh prüfen.
- Bis 21:37 protokollierte die Datenweiche `--pg`-Läufe erst nach dem Start von Postgres. Seitdem steht die Protokollzeile davor.

## 11. Werkzeug-Abhängigkeiten (ergänzt 2026-11-04 durch 886a8f6e)
In einer neuen Umgebung fehlt `/root/sm24-werkzeuge`, und a11y.mjs und lighthouse.mjs brechen dann mit ENOENT ab.
```
mkdir -p /root/sm24-werkzeuge && cp /home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/package.json /root/sm24-werkzeuge/ && cd /root/sm24-werkzeuge && npm install --no-audit --no-fund --ignore-scripts && ln -sfn /root/sm24-werkzeuge/node_modules /home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/node_modules
```
Erwartet: „added 163 packages“. Aufrufe danach mit `sicher.sh --json --als-root -- node …`.
