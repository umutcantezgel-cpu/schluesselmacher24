'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, KeyRound, ShieldCheck, ShieldAlert, FileKey2 } from 'lucide-react';

export function SpatialBentoGrid() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll('.bento-card');

    const handleMouseMove = (e: MouseEvent) => {
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
        (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="mt-8 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 group/bento relative"
    >
      {/* 1. Hauptkarte - Groß (2 Spalten auf Desktop) */}
      <div className="bento-card relative flex flex-col md:col-span-2 rounded-2xl bg-[oklch(0.968_0.004_260)] border border-[oklch(0.89_0.008_260/0.55)] overflow-hidden transition-all duration-300 hover:border-[oklch(0.52_0.24_260/0.4)]">
        <div className="absolute inset-0 z-0 transition-opacity duration-300 opacity-0 group-hover/bento:opacity-100 motion-reduce:hidden"
             style={{
               background: 'radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), oklch(0.52 0.24 260 / 0.08), transparent 40%)'
             }} />
        <div className="p-8 md:p-10 z-10 flex flex-col h-full">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.52_0.24_260/0.1)] text-[oklch(0.52_0.24_260)] mb-6">
            <KeyRound size={24} />
          </div>
          <h3 className="text-2xl font-bold text-[oklch(0.16_0.02_260)] mb-3 tracking-tight">Autoschlüssel Programmierung</h3>
          <p className="text-[oklch(0.32_0.02_260)] leading-relaxed flex-1 max-w-lg mb-8">
            Komplette Neuerstellung bei Totalverlust, präzise Duplikate und Reparatur von Wegfahrsperren. Hochmoderne Diagnose-Infrastruktur für über 40 Fahrzeugmarken direkt bei uns in der Werkstatt.
          </p>
          <Link href="/autoschluessel/anfrage" className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[oklch(0.52_0.24_260)] px-6 py-3 rounded-xl w-fit hover:bg-[oklch(0.48_0.24_260)] transition-colors active:scale-95">
            Diagnose starten <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* 2. Normale Karte */}
      <div className="bento-card relative flex flex-col rounded-2xl bg-[oklch(0.968_0.004_260)] border border-[oklch(0.89_0.008_260/0.55)] overflow-hidden transition-all duration-300 hover:border-[oklch(0.52_0.24_260/0.4)]">
         <div className="absolute inset-0 z-0 transition-opacity duration-300 opacity-0 group-hover/bento:opacity-100 motion-reduce:hidden"
             style={{
               background: 'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), oklch(0.52 0.24 260 / 0.08), transparent 40%)'
             }} />
        <div className="p-8 z-10 flex flex-col h-full">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[oklch(0.52_0.24_260/0.1)] text-[oklch(0.52_0.24_260)] mb-5">
            <ShieldCheck size={20} />
          </div>
          <h3 className="text-lg font-bold text-[oklch(0.16_0.02_260)] mb-2">Schließanlagen</h3>
          <p className="text-[oklch(0.32_0.02_260)] text-sm leading-relaxed flex-1 mb-6">
            Gleichschließende Zylinder und komplexe Hierarchien. Maßgeschneiderte Planung für Ihr Objekt.
          </p>
          <Link href="/schliessanlagen" className="inline-flex items-center gap-2 text-sm font-semibold text-[oklch(0.52_0.24_260)] group/link">
            System konfigurieren <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* 3. Normale Karte */}
      <div className="bento-card relative flex flex-col rounded-2xl bg-[oklch(0.968_0.004_260)] border border-[oklch(0.89_0.008_260/0.55)] overflow-hidden transition-all duration-300 hover:border-[oklch(0.52_0.24_260/0.4)]">
        <div className="absolute inset-0 z-0 transition-opacity duration-300 opacity-0 group-hover/bento:opacity-100 motion-reduce:hidden"
             style={{
               background: 'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), oklch(0.52 0.24 260 / 0.08), transparent 40%)'
             }} />
        <div className="p-8 z-10 flex flex-col h-full">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[oklch(0.52_0.24_260/0.1)] text-[oklch(0.52_0.24_260)] mb-5">
            <ShieldAlert size={20} />
          </div>
          <h3 className="text-lg font-bold text-[oklch(0.16_0.02_260)] mb-2">Sicherheitstechnik</h3>
          <p className="text-[oklch(0.32_0.02_260)] text-sm leading-relaxed flex-1 mb-6">
            Mechanischer Einbruchschutz (RC2/RC3) und elektronische Gefahrenmeldesysteme.
          </p>
          <Link href="/sicherheitstechnik/sicherheitscheck" className="inline-flex items-center gap-2 text-sm font-semibold text-[oklch(0.52_0.24_260)] group/link">
            Sicherheitscheck starten <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* 4. Karte quer über 2 Spalten unten */}
      <div className="bento-card relative flex flex-col md:col-span-2 rounded-2xl bg-[oklch(0.968_0.004_260)] border border-[oklch(0.89_0.008_260/0.55)] overflow-hidden transition-all duration-300 hover:border-[oklch(0.52_0.24_260/0.4)]">
        <div className="absolute inset-0 z-0 transition-opacity duration-300 opacity-0 group-hover/bento:opacity-100 motion-reduce:hidden"
             style={{
               background: 'radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), oklch(0.52 0.24 260 / 0.08), transparent 40%)'
             }} />
        <div className="p-8 z-10 flex flex-col sm:flex-row sm:items-center justify-between h-full gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[oklch(0.52_0.24_260/0.1)] text-[oklch(0.52_0.24_260)]">
                <FileKey2 size={16} />
              </div>
              <h3 className="text-xl font-bold text-[oklch(0.16_0.02_260)]">Schlüssel nach Code</h3>
            </div>
            <p className="text-[oklch(0.32_0.02_260)] text-sm leading-relaxed max-w-md">
              Bestellen Sie Originalschlüssel anhand der eingravierten Code-Nummer. Direkter Versand zu Ihnen nach Hause.
            </p>
          </div>
          <Link href="/schluessel-nach-code" className="inline-flex items-center gap-2 text-sm font-semibold text-[oklch(0.16_0.02_260)] border border-[oklch(0.89_0.008_260)] bg-white px-5 py-2.5 rounded-lg whitespace-nowrap hover:border-[oklch(0.52_0.24_260)] hover:text-[oklch(0.52_0.24_260)] transition-colors">
            Im Shop bestellen <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}