import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from 'payload';

/**
 * Nach jeder Änderung im Backend baut Next.js die betroffenen Seiten beim
 * nächsten Aufruf neu. Die Seite ist klein genug, um alles zu erneuern — so
 * kann keine Seite mit altem Preis stehen bleiben.
 *
 * Außerhalb von Next.js (Seed, Tests, Migrationen) gibt es nichts zu erneuern;
 * dort wird `context.disableRevalidate` gesetzt.
 */
async function erneuern(req: PayloadRequest) {
  if (req.context?.disableRevalidate) return;
  try {
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/', 'layout');
  } catch (error) {
    req.payload.logger.warn({ msg: 'Seiten konnten nicht erneuert werden', err: error });
  }
}

export const nachAenderung: CollectionAfterChangeHook = async ({ doc, req }) => {
  await erneuern(req);
  return doc;
};

export const nachLoeschen: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await erneuern(req);
  return doc;
};

export const nachGlobalAenderung: GlobalAfterChangeHook = async ({ doc, req }) => {
  await erneuern(req);
  return doc;
};

export const erneuernHooks = {
  afterChange: [nachAenderung],
  afterDelete: [nachLoeschen],
};
