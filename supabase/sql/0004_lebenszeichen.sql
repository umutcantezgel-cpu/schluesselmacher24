-- 0004 Lebenszeichen
--
-- Wer regelmäßig läuft, hinterlässt hier ein Lebenszeichen: der tägliche Cron
-- (cron-taeglich), die nächtliche Sicherung (sicherung-db, sicherung-dateien)
-- und die wöchentliche Aufsicht (wache). Der tägliche Cron und die Sicherung
-- prüfen gegenseitig, ob die anderen Einträge frisch sind – so meldet jeder
-- Ausfallweg sich irgendwo. Geschrieben wird nur über die Funktion; die
-- erlaubten Quellen legt die Prüfbedingung fest.
--
-- Idempotent; angewendet als `sm24_0004_lebenszeichen`.

create schema if not exists intern;

create table if not exists intern.lebenszeichen (
  quelle text primary key
    constraint lebenszeichen_quelle_bekannt
      check (quelle in ('cron-taeglich', 'sicherung-db', 'sicherung-dateien', 'wache')),
  zuletzt timestamptz not null default now(),
  anzahl bigint not null default 1,
  details jsonb not null default '{}'::jsonb
    constraint lebenszeichen_details_klein check (pg_column_size(details) < 2048)
);

alter table intern.lebenszeichen enable row level security;
revoke all on intern.lebenszeichen from public;

create or replace function intern.lebenszeichen_setzen(p_quelle text, p_details jsonb default '{}'::jsonb)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into intern.lebenszeichen as l (quelle, details)
  values (p_quelle, coalesce(p_details, '{}'::jsonb))
  on conflict (quelle) do update
    set zuletzt = now(), anzahl = l.anzahl + 1, details = excluded.details;
$$;

revoke all on function intern.lebenszeichen_setzen(text, jsonb) from public;

grant usage on schema intern to sm24_app, sm24_sicherung;
grant execute on function intern.lebenszeichen_setzen(text, jsonb) to sm24_app, sm24_sicherung;
grant select on intern.lebenszeichen to sm24_app, sm24_sicherung;
