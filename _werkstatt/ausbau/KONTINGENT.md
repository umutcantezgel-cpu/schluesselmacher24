# KONTINGENT
Quelle: Messwert aus den rate_limit_event der Sitzung (list_events): five_hour und seven_day mit utilization und resetsAt. ~/.claude/kontingent.json fehlt. Sicherheitsziel 99 %, volle HAIKU-PLÄTZE (4).
Fenster bis 2026-11-03 03:10 MEZ · Woche bis 2026-11-07 02:00 MEZ.

| Uhrzeit | Fenster Verbrauch/Soll/Ziel | Woche Verbrauch/Spielraum | Plätze | Tempomat | Quelle |
|---|---|---|---|---|---|
| 2026-11-02 22:21 | ?/?/99 | ?/? | 0 von 2 | Halten | keine |
| 2026-11-02 22:23 | 2/4/99 | 0/≈5 je Fenster | 0 von 4 | Halten | rate_limit_event 22:23 |
| 2026-11-02 22:35 | 2+/≈8/99 | 0/≈5 je Fenster | 4 von 4 | Gas | rate_limit_event 22:23 (Welle E0-1 gestartet) |
| 2026-11-02 23:46 | 28,9/31,7/99 | 0 (21:23)/≈5 je Fenster | 4 von 4 | Halten | kontingent.mjs, 1 Kalibrierpunkt (2 % um 22:23) |
