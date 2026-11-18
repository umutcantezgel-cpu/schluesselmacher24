#!/usr/bin/env bash
# messen.sh <name> <wurzel> <port> : frisch starten, Gewicht, Netz, Bilder
set -uo pipefail
NAME="$1"; WURZEL="$2"; PORT="$3"
R=/home/user/schluesselmacher24; P=$R/_werkstatt/ausbau/protokolle/FA-SEO-03D
pkill -f "next start -p $PORT"; fuser -k $PORT/tcp 2>/dev/null; sleep 2
cd "$WURZEL" && SM24_INDEXIERUNG=an SICHER_WURZEL="$WURZEL" SICHER_PORT=$PORT nohup $R/_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx next start -p $PORT > /tmp/sm24-$NAME.log 2>&1 &
for i in $(seq 1 90); do curl -s -o /dev/null -w '%{http_code}' --max-time 3 http://localhost:$PORT/robots.txt 2>/dev/null | grep -q 200 && break; sleep 1; done
cd $R
_werkstatt/ausbau/werkzeuge/sicher.sh --json --als-root -- node _werkstatt/ausbau/protokolle/FA-SEO-03B/experimente/gewicht.mjs http://localhost:$PORT $P/gewicht-$NAME.json
PF="/autoschluessel/anfrage /service-und-termin/kontakt /gleichschliessende-zylinder/konfigurator /schluessel-nach-vorlage/anfrage /beratung /sicherheitstechnik/sicherheitscheck"
SM24_BASIS_URL=http://localhost:$PORT _werkstatt/ausbau/werkzeuge/sicher.sh --json --als-root -- node $P/experimente/netz.mjs http://localhost:$PORT $P/netz-$NAME.json $PF
BASIS=http://localhost:$PORT _werkstatt/ausbau/werkzeuge/sicher.sh --json --als-root -- node $P/experimente/upload-bilder.mjs aufnehmen $P/bilder/$NAME $P/bilder/schritte.json | tail -1
