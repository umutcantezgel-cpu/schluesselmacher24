import { katalogIndex } from '@/components/autoschluessel/fahrzeug-ziel';
import { getFahrzeugkatalog } from '@/lib/data';

/**
 * Pkw-Katalog für die Fahrzeugsuche im Autoschlüssel-Assistenten (A-047), als JSON nachgeladen statt im
 * ersten Seitenaufruf. Statisch erzeugt; nach Änderungen im Backend erneuert ihn revalidatePath.
 */
export const dynamic = 'force-static';

export async function GET() {
  const index = katalogIndex(await getFahrzeugkatalog(), 'pkw');
  return Response.json(index, { headers: { 'X-Robots-Tag': 'noindex' } });
}
