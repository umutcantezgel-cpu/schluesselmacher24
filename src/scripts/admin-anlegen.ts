/**
 * Legt den ersten Backend-Zugang an (Rolle Inhaber), falls noch keiner existiert.
 *
 *   npx payload run src/scripts/admin-anlegen.ts
 *
 * Zugangsdaten kommen aus SEED_ADMIN_EMAIL und SEED_ADMIN_PASSWORD. Payload
 * bietet sonst auf einer leeren Datenbank jedem Besucher an, das erste Konto
 * anzulegen — das verhindert dieses Skript.
 */
import config from '@payload-config';
import { getPayload } from 'payload';

const email = process.env.SEED_ADMIN_EMAIL?.trim();
const password = process.env.SEED_ADMIN_PASSWORD?.trim();

if (!email || !password || password.length < 12) {
  console.error('SEED_ADMIN_EMAIL und SEED_ADMIN_PASSWORD (mind. 12 Zeichen) müssen gesetzt sein.');
  process.exit(1);
}

const payload = await getPayload({ config });

const vorhanden = await payload.count({ collection: 'benutzer' });
if (vorhanden.totalDocs > 0) {
  console.log(`Es gibt bereits ${vorhanden.totalDocs} Zugang/Zugänge — nichts angelegt.`);
} else {
  await payload.create({
    collection: 'benutzer',
    data: { email, password, name: 'Inhaber', rollen: ['inhaber'] },
    context: { disableRevalidate: true },
  });
  console.log(`Zugang ${email} angelegt.`);
}

process.exit(0);
