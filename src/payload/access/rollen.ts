import type { Access, FieldAccess } from 'payload';

/** Rollen im Backend. Kundinnen und Kunden melden sich nicht an. */
export const ROLLEN = [
  { label: 'Inhaber', value: 'inhaber' },
  { label: 'Mitarbeiter', value: 'mitarbeiter' },
] as const;

export type Rolle = (typeof ROLLEN)[number]['value'];

type MitRollen = { rollen?: string[] | null } | null | undefined;

export function hatRolle(user: unknown, ...rollen: Rolle[]): boolean {
  const vorhandene = (user as MitRollen)?.rollen ?? [];
  return rollen.some((rolle) => vorhandene.includes(rolle));
}

/** Angemeldet mit einer Backend-Rolle. */
export const istTeam: Access = ({ req: { user } }) => hatRolle(user, 'inhaber', 'mitarbeiter');

/** Nur Inhaberin oder Inhaber. */
export const istInhaber: Access = ({ req: { user } }) => hatRolle(user, 'inhaber');

export const feldNurInhaber: FieldAccess = ({ req: { user } }) => hatRolle(user, 'inhaber');

/** Öffentlich lesbar. */
export const oeffentlich: Access = () => true;

/**
 * Löschen in Sammlungen mit Papierkorb: In den Papierkorb legen darf das
 * ganze Team (Payload prüft dabei `data.deletedAt`), endgültig löschen nur
 * die Inhaberin oder der Inhaber.
 */
export const papierkorbTeamLoeschenInhaber: Access = ({ req: { user }, data }) => {
  const inDenPapierkorb = Boolean((data as { deletedAt?: unknown } | undefined)?.deletedAt);
  return inDenPapierkorb ? hatRolle(user, 'inhaber', 'mitarbeiter') : hatRolle(user, 'inhaber');
};
