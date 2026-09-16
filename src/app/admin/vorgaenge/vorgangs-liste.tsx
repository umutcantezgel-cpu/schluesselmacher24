'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import type { AreaKey, RecordKind, RecordStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Field } from '@/components/forms/field';
import { Select, TextInput } from '@/components/forms/controls';

/* ==========================================================================
   Vorgangsliste mit Filter, Suche und Sortierung
   Die Zeilen werden auf dem Server aufbereitet, damit hier nur noch
   angezeigt und gefiltert wird.
   ========================================================================== */

export interface VorgangsZeile {
  id: string;
  reference: string;
  kind: RecordKind;
  area: AreaKey;
  bereich: string;
  status: RecordStatus;
  createdAt: string;
  datum: string;
  name: string;
  email: string;
  betrag: string;
  termin: string;
}

type Tonfall = 'neutral' | 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'outline';

const ART_LABELS: Record<RecordKind, string> = {
  bestellung: 'Bestellung',
  anfrage: 'Anfrage',
  termin: 'Termin',
  projekt: 'Projekt',
};

const STATUS_LABELS: Record<RecordStatus, string> = {
  neu: 'Eingegangen',
  'in-pruefung': 'In Prüfung',
  geprueft: 'Geprüft',
  'wartet-auf-kunde': 'Wartet auf Kundin oder Kunde',
  'in-fertigung': 'In Fertigung',
  terminiert: 'Termin vereinbart',
  versendet: 'Versendet',
  abgeschlossen: 'Abgeschlossen',
  storniert: 'Storniert',
};

const STATUS_TON: Record<RecordStatus, Tonfall> = {
  neu: 'primary',
  'in-pruefung': 'primary',
  geprueft: 'accent',
  'wartet-auf-kunde': 'warning',
  'in-fertigung': 'accent',
  terminiert: 'accent',
  versendet: 'success',
  abgeschlossen: 'success',
  storniert: 'danger',
};

const ARTEN: RecordKind[] = ['bestellung', 'anfrage', 'termin', 'projekt'];

const STATUS_REIHENFOLGE: RecordStatus[] = [
  'neu',
  'in-pruefung',
  'geprueft',
  'wartet-auf-kunde',
  'in-fertigung',
  'terminiert',
  'versendet',
  'abgeschlossen',
  'storniert',
];

export function VorgangsListe({ zeilen }: { zeilen: VorgangsZeile[] }) {
  const [art, setArt] = useState<'alle' | RecordKind>('alle');
  const [status, setStatus] = useState<'alle' | RecordStatus>('alle');
  const [bereich, setBereich] = useState<'alle' | AreaKey>('alle');
  const [suche, setSuche] = useState('');
  const [sortierung, setSortierung] = useState<'neueste' | 'aelteste'>('neueste');

  const bereiche = useMemo(() => {
    const gesammelt = new Map<AreaKey, string>();
    for (const zeile of zeilen) gesammelt.set(zeile.area, zeile.bereich);
    return [...gesammelt.entries()]
      .map(([key, label]) => ({ key, label }))
      .sort((a, b) => a.label.localeCompare(b.label, 'de'));
  }, [zeilen]);

  const gefiltert = useMemo(() => {
    const begriff = suche.trim().toLowerCase();

    const treffer = zeilen.filter((zeile) => {
      if (art !== 'alle' && zeile.kind !== art) return false;
      if (status !== 'alle' && zeile.status !== status) return false;
      if (bereich !== 'alle' && zeile.area !== bereich) return false;
      if (begriff.length === 0) return true;

      return (
        zeile.reference.toLowerCase().includes(begriff)
        || zeile.name.toLowerCase().includes(begriff)
        || zeile.email.toLowerCase().includes(begriff)
      );
    });

    return [...treffer].sort((a, b) =>
      sortierung === 'neueste'
        ? b.createdAt.localeCompare(a.createdAt)
        : a.createdAt.localeCompare(b.createdAt),
    );
  }, [zeilen, art, status, bereich, suche, sortierung]);

  const filterAktiv = art !== 'alle' || status !== 'alle' || bereich !== 'alle' || suche.trim() !== '';

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-border bg-surface p-4 md:p-5">
        <h2 className="font-display text-base font-bold text-foreground">Filter und Suche</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Field label="Vorgangsart">
            {({ id }) => (
              <Select
                id={id}
                value={art}
                onChange={(event) => setArt(event.target.value as 'alle' | RecordKind)}
              >
                <option value="alle">Alle Arten</option>
                {ARTEN.map((wert) => (
                  <option key={wert} value={wert}>
                    {ART_LABELS[wert]}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field label="Status">
            {({ id }) => (
              <Select
                id={id}
                value={status}
                onChange={(event) => setStatus(event.target.value as 'alle' | RecordStatus)}
              >
                <option value="alle">Alle Status</option>
                {STATUS_REIHENFOLGE.map((wert) => (
                  <option key={wert} value={wert}>
                    {STATUS_LABELS[wert]}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field label="Bereich">
            {({ id }) => (
              <Select
                id={id}
                value={bereich}
                onChange={(event) => setBereich(event.target.value as 'alle' | AreaKey)}
              >
                <option value="alle">Alle Bereiche</option>
                {bereiche.map((eintrag) => (
                  <option key={eintrag.key} value={eintrag.key}>
                    {eintrag.label}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field
            label="Suche"
            hint="Durchsucht Vorgangsnummer, Name und E-Mail-Adresse."
            className="xl:col-span-2"
          >
            {({ id, describedBy }) => (
              <div className="relative">
                <Search
                  size={16}
                  aria-hidden
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-subtle"
                />
                <TextInput
                  id={id}
                  type="search"
                  value={suche}
                  aria-describedby={describedBy}
                  onChange={(event) => setSuche(event.target.value)}
                  placeholder="Nummer, Name oder E-Mail-Adresse"
                  className="pl-10"
                />
              </div>
            )}
          </Field>
        </div>

        <div className="mt-4 grid gap-4 md:max-w-xs">
          <Field label="Sortierung nach Datum">
            {({ id }) => (
              <Select
                id={id}
                value={sortierung}
                onChange={(event) => setSortierung(event.target.value as 'neueste' | 'aelteste')}
              >
                <option value="neueste">Neueste zuerst</option>
                <option value="aelteste">Älteste zuerst</option>
              </Select>
            )}
          </Field>
        </div>
      </div>

      <p aria-live="polite" className="text-[15px] font-semibold text-foreground">
        {gefiltert.length === 1 ? '1 Vorgang' : `${gefiltert.length} Vorgänge`}
        <span className="font-normal text-foreground-muted">
          {' '}
          von insgesamt {zeilen.length}
          {filterAktiv ? ' (Filter aktiv)' : ''}
        </span>
      </p>

      {gefiltert.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface p-6 text-center">
          <p className="text-[15px] font-semibold text-foreground">Kein Vorgang passt zu dieser Auswahl</p>
          <p className="mt-2 text-[15px] text-foreground-muted">
            Setze die Filter zurück oder ändere den Suchbegriff.
          </p>
          <button
            type="button"
            onClick={() => {
              setArt('alle');
              setStatus('alle');
              setBereich('alle');
              setSuche('');
            }}
            className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-lg border border-border-strong bg-surface px-5 text-[15px] font-semibold text-foreground transition-colors hover:bg-surface-muted"
          >
            Filter zurücksetzen
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="table-scroll">
            <table className="w-full min-w-[62rem] border-collapse text-left">
              <caption className="sr-only">
                Vorgänge mit Nummer, Art, Bereich, Status, Name, Datum, Betrag und Termin
              </caption>
              <thead>
                <tr className="border-b border-border bg-surface-muted">
                  <th scope="col" className="px-4 py-3 text-[12px] font-bold uppercase tracking-wider text-foreground-subtle">
                    Nummer
                  </th>
                  <th scope="col" className="px-4 py-3 text-[12px] font-bold uppercase tracking-wider text-foreground-subtle">
                    Art
                  </th>
                  <th scope="col" className="px-4 py-3 text-[12px] font-bold uppercase tracking-wider text-foreground-subtle">
                    Bereich
                  </th>
                  <th scope="col" className="px-4 py-3 text-[12px] font-bold uppercase tracking-wider text-foreground-subtle">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-[12px] font-bold uppercase tracking-wider text-foreground-subtle">
                    Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-[12px] font-bold uppercase tracking-wider text-foreground-subtle">
                    Datum
                  </th>
                  <th scope="col" className="px-4 py-3 text-[12px] font-bold uppercase tracking-wider text-foreground-subtle">
                    Betrag
                  </th>
                  <th scope="col" className="px-4 py-3 text-[12px] font-bold uppercase tracking-wider text-foreground-subtle">
                    Termin
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {gefiltert.map((zeile) => (
                  <tr key={zeile.id} className="align-top">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/vorgaenge/${zeile.id}`}
                        className="inline-flex min-h-[44px] items-center font-mono text-sm font-semibold text-primary"
                      >
                        {zeile.reference}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[14px] text-foreground">{ART_LABELS[zeile.kind]}</td>
                    <td className="px-4 py-3 text-[14px] text-foreground-muted">{zeile.bereich}</td>
                    <td className="px-4 py-3">
                      <Badge tone={STATUS_TON[zeile.status]}>{STATUS_LABELS[zeile.status]}</Badge>
                    </td>
                    <td className="px-4 py-3 text-[14px] text-foreground">
                      <span className="block font-semibold">{zeile.name}</span>
                      <span className="block text-[13px] text-foreground-subtle">{zeile.email}</span>
                    </td>
                    <td className="px-4 py-3 text-[14px] text-foreground-muted">{zeile.datum}</td>
                    <td className="px-4 py-3 text-[14px] text-foreground">{zeile.betrag}</td>
                    <td className="px-4 py-3 text-[14px] text-foreground-muted">{zeile.termin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
