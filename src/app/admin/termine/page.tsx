import type { Metadata } from 'next';

import { getCollection } from '@/lib/data';
import {
  addDays,
  availableSlots,
  bookableDays,
  earliestBookableDate,
  groupSlotsByDate,
  toIsoDate,
  weekdayOf,
} from '@/lib/scheduling';
import { Alert } from '@/components/ui/alert';
import { TerminVerwaltung } from './termin-verwaltung';
import type { AnstehenderTermin, TagesAuslastung } from './termin-verwaltung';

export const metadata: Metadata = {
  title: 'Termine und Sperrtage — Backend',
  robots: { index: false, follow: false },
};

/** Wie viele Tage die Auslastung zeigt, begrenzt durch den Buchungshorizont. */
const VORSCHAU_TAGE = 28;

export default async function AdminTerminePage() {
  const [settings, blockedDays, records] = await Promise.all([
    getCollection('settings'),
    getCollection('blockedDays'),
    getCollection('records'),
  ]);

  const heute = toIsoDate(new Date());
  const tage = Math.max(1, Math.min(VORSCHAU_TAGE, settings.booking.bookingHorizonDays));

  // Auslastung serverseitig rechnen — die Oberfläche bekommt nur das Ergebnis.
  const slots = availableSlots({
    today: heute,
    durationMinutes: settings.booking.slotMinutes,
    leadTimeDays: 0,
    booking: settings.booking,
    openingHours: settings.openingHours,
    blockedDays,
    existing: records,
    daysToScan: tage,
  });

  const nachDatum = new Map(groupSlotsByDate(slots).map((tag) => [tag.date, tag.slots]));
  const fruehestensBuchbar = earliestBookableDate(heute, settings.booking.leadTimeDays);
  const naechsterFreierTag =
    bookableDays(slots).find((tag) => tag.date >= fruehestensBuchbar)?.date ?? null;

  const auslastung: TagesAuslastung[] = [];
  for (let versatz = 0; versatz < tage; versatz += 1) {
    const datum = addDays(heute, versatz);
    const wochentag = weekdayOf(datum);
    const oeffnung = settings.openingHours.find((eintrag) => eintrag.day === wochentag);
    const ganztagsSperre = blockedDays.find((tag) => tag.date === datum && !tag.spans?.length);
    const teilSperre = blockedDays.filter((tag) => tag.date === datum && tag.spans?.length);
    const tagesSlots = nachDatum.get(datum) ?? [];

    auslastung.push({
      date: datum,
      weekday: wochentag,
      geoeffnet: Boolean(oeffnung && oeffnung.spans.length > 0),
      gesperrt: Boolean(ganztagsSperre),
      sperrgrund: ganztagsSperre?.reason ?? teilSperre[0]?.reason,
      teilweiseGesperrt: teilSperre.length > 0,
      imVorlauf: datum < fruehestensBuchbar,
      freieFenster: tagesSlots.filter((slot) => slot.available).length,
      belegteFenster: tagesSlots.filter((slot) => slot.blockedReason === 'Bereits vergeben').length,
      gesperrteFenster: tagesSlots.filter((slot) => slot.blockedReason === 'Interne Sperrzeit')
        .length,
      termine: records.filter(
        (vorgang) => vorgang.appointment?.date === datum && vorgang.status !== 'storniert',
      ).length,
    });
  }

  const anstehend: AnstehenderTermin[] = records
    .filter((vorgang) => vorgang.appointment && vorgang.appointment.date >= heute)
    .filter((vorgang) => vorgang.status !== 'storniert')
    .map((vorgang) => ({
      id: vorgang.id,
      reference: vorgang.reference,
      date: vorgang.appointment?.date ?? '',
      time: vorgang.appointment?.time ?? '',
      durationMinutes: vorgang.appointment?.durationMinutes ?? settings.booking.slotMinutes,
      location: vorgang.appointment?.location ?? 'werkstatt',
      status: vorgang.status,
      kunde: [vorgang.contact.company, `${vorgang.contact.firstName} ${vorgang.contact.lastName}`]
        .filter(Boolean)
        .join(' · '),
    }))
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));

  return (
    <div className="shell py-8 md:py-10">
      <header className="max-w-3xl">
        <p className="eyebrow">
          <span className="h-px w-6 bg-current" aria-hidden />
          Backend
        </p>
        <h1 className="mt-2 text-2xl font-bold md:text-3xl">Termine, Öffnungszeiten und Sperrtage</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
          Hier wird festgelegt, wann Termine angeboten werden. Buchungsfenster und Öffnungszeiten
          bestimmen gemeinsam, welche Zeitfenster buchbar sind; Sperrtage nehmen einzelne Tage oder
          Zeitspannen wieder heraus. Die Auslastung zeigt das Ergebnis für die nächsten Tage.
        </p>
      </header>

      <Alert tone="warning" title="Zugang noch nicht beschränkt" className="mt-6">
        Das Backend ist offen erreichbar. Vor dem Livegang muss der gesamte Bereich
        <span className="font-mono"> /admin </span>
        durch eine Zugangsbeschränkung geschützt werden. Diese Anbindung ist offen und
        bewusst noch nicht gebaut.
      </Alert>

      <TerminVerwaltung
        settings={settings}
        blockedDays={blockedDays}
        auslastung={auslastung}
        anstehend={anstehend}
        heute={heute}
        fruehestensBuchbar={fruehestensBuchbar}
        naechsterFreierTag={naechsterFreierTag}
      />
    </div>
  );
}
