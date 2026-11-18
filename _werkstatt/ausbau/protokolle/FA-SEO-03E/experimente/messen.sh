#!/usr/bin/env bash
# messen.sh <name> <wurzel> <port> : frisch starten, Gewicht (Skripte im HTML der neun Ansichten), Netz (Browser gesamt), Bilder
set -uo pipefail
NAME="$1"; WURZEL="$2"; PORT="$3"
R=/home/user/schluesselmacher24; P=$R/_werkstatt/ausbau/protokolle/FA-SEO-03E
pkill -f "next start -p $PORT"; fuser -k $PORT/tcp 2>/dev/null; sleep 2
cd "$WURZEL" && SM24_INDEXIERUNG=an SICHER_WURZEL="$WURZEL" SICHER_PORT=$PORT nohup $R/_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx next start -p $PORT > /tmp/sm24-$NAME.log 2>&1 &
for i in $(seq 1 90); do curl -s -o /dev/null -w '%{http_code}' --max-time 3 http://localhost:$PORT/robots.txt 2>/dev/null | grep -q 200 && break; sleep 1; done
cd $R
_werkstatt/ausbau/werkzeuge/sicher.sh --json --als-root -- node _werkstatt/ausbau/protokolle/FA-SEO-03B/experimente/gewicht.mjs http://localhost:$PORT $P/gewicht-$NAME.json
SM24_BASIS_URL=http://localhost:$PORT _werkstatt/ausbau/werkzeuge/sicher.sh --json --als-root -- node $P/experimente/netz.mjs http://localhost:$PORT $P/netz-$NAME.json / /shop /service-und-termin/kontakt /autoschluessel/anfrage /warenkorb '/warenkorb#gefuellt' /artikel
rm -rf /tmp/sm24-proben/FA-SEO-03E/$NAME
SM24_BASIS_URL=http://localhost:$PORT BASIS=http://localhost:$PORT _werkstatt/ausbau/werkzeuge/sicher.sh --json --als-root -- node $P/experimente/bilder.mjs aufnehmen /tmp/sm24-proben/FA-SEO-03E/$NAME > /dev/null && echo "bilder $NAME aufgenommen"
