/**
 * Legt den ersten Backend-Zugang an (Rolle Inhaber), falls noch keiner existiert.
 *
 *   npx payload run src/scripts/admin-anlegen.ts
 *
 * Zugangsdaten kommen aus SEED_ADMIN_EMAIL und SEED_ADMIN_PASSWORD (mindestens
 * 12 Zeichen). Gibt es schon einen Zugang, braucht es die Variablen nicht —
 * der Inhaber kann das Passwort danach aus Vercel löschen.
 *
 * Mit SM24_ADMIN_PFLICHT=1 (Produktions-Build, scripts/build.mjs) bricht das
 * Skript ab, wenn es keinen Zugang gibt und keiner angelegt werden kann. So
 * geht keine Produktion ohne Inhaber-Konto online. /admin/create-first-user
 * ist ohnehin gesperrt (src/payload/hooks/benutzer-schutz.ts).
 */
import config from '@payload-config';
import { getPayload } from 'payload';

const pflicht = process.env.SM24_ADMIN_PFLICHT === '1';
const email = process.env.SEED_ADMIN_EMAIL?.trim();
const password = process.env.SEED_ADMIN_PASSWORD?.trim();

try {
  const payload = await getPayload({ config });
  const vorhanden = await payload.count({ collection: 'benutzer', overrideAccess: true });

  if (vorhanden.totalDocs > 0) {
    console.log(`Es gibt bereits ${vorhanden.totalDocs} Zugang/Zugänge — nichts angelegt.`);
    process.exit(0);
  }

  if (!email || !password || password.length < 12) {
    const meldung = 'Kein Backend-Zugang vorhanden: SEED_ADMIN_EMAIL und SEED_ADMIN_PASSWORD (mind. 12 Zeichen) setzen.';
    if (pflicht) {
      console.error(meldung);
      process.exit(1);
    }
    console.warn(`${meldung} Ohne sie bleibt das Backend ohne Zugang.`);
    process.exit(0);
  }

  await payload.create({
    collection: 'benutzer',
    data: { email, password, name: 'Inhaber', rollen: ['inhaber'] },
    overrideAccess: true,
    context: { disableRevalidate: true, adminAnlage: true },
  });
  console.log(`Zugang ${email} angelegt.`);
  process.exit(0);
} catch (error) {
  console.error('Backend-Zugang konnte nicht angelegt werden.', error);
  process.exit(1);
}
