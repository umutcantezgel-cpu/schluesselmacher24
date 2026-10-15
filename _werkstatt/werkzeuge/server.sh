#!/usr/bin/env bash
# Produktionsserver für alle Prüfungen: `next start` im JSON-Modus auf Port 3000.
#   server.sh start | stop | status | neu
# Idempotent und mit Sperre, damit gleichzeitige Pakete keinen zweiten Server starten.
# Voraussetzung: ein aktueller Build (`SM24_DATA=json npx next build`).
set -euo pipefail
REPO="$(cd "$(dirname "$0")/../.." && pwd)"
PIDDATEI=/tmp/sm24-next.pid
LOG=/tmp/sm24-next.log
SPERRE=/tmp/sm24-next.lock
PORT="${SM24_PORT:-3000}"

laeuft() {
  curl -s -o /dev/null -w '%{http_code}' --max-time 5 "http://localhost:${PORT}/" 2>/dev/null | grep -q '^[23]'
}

start() {
  exec 9>"$SPERRE"
  flock 9
  if laeuft; then echo "läuft bereits (Port ${PORT})"; return 0; fi
  cd "$REPO"
  SM24_DATA=json nohup npx next start -p "$PORT" >"$LOG" 2>&1 &
  echo $! >"$PIDDATEI"
  for _ in $(seq 1 90); do
    if laeuft; then echo "gestartet (PID $(cat "$PIDDATEI"), Port ${PORT})"; return 0; fi
    sleep 1
  done
  echo "Start fehlgeschlagen, siehe $LOG" >&2
  return 1
}

stop() {
  if [ -f "$PIDDATEI" ]; then kill "$(cat "$PIDDATEI")" 2>/dev/null || true; rm -f "$PIDDATEI"; fi
  pkill -f "next start -p ${PORT}" 2>/dev/null || true
  pkill -f "next-server" 2>/dev/null || true
  echo "gestoppt"
}

case "${1:-status}" in
  start) start ;;
  stop) stop ;;
  neu) stop; sleep 1; start ;;
  status) if laeuft; then echo "läuft (Port ${PORT})"; else echo "läuft nicht"; exit 1; fi ;;
  *) echo "Aufruf: server.sh start|stop|status|neu" >&2; exit 2 ;;
esac
