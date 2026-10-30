-- 0005 Dateiablage
--
-- Privater Bucket für Payload (src/payload.config.ts): Medien, Kundendateien
-- und interne Dateien. Payload liefert jede Datei selbst aus und prüft dabei
-- die Leserechte der Sammlung – der Bucket ist nie öffentlich und hat keine
-- Storage-Policies (die S3-Schlüssel des Servers umgehen sie ohnehin).
--
-- Grenzen: 5 MB je Datei (die App nimmt höchstens 4 MB an, Vercel höchstens
-- 4,5 MB je Anfrage); erlaubt sind genau die Dateitypen der drei
-- Upload-Sammlungen (Medien, Kundendateien, interne Dateien).
--
-- Nur bei Supabase (Schema `storage`); lokal und in CI passiert nichts.
-- Idempotent; angewendet als `sm24_0005_ablage`.

do $$
begin
  if to_regclass('storage.buckets') is null then
    return;
  end if;

  insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values (
    'sm24-dateien',
    'sm24-dateien',
    false,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/heic', 'image/heif', 'application/pdf']
  )
  on conflict (id) do update
    set public = false,
        file_size_limit = excluded.file_size_limit,
        allowed_mime_types = excluded.allowed_mime_types;
end
$$;
