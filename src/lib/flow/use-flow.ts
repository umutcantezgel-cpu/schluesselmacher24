'use client';

import { useCallback, useMemo, useState } from 'react';

import {
  removeStoredValue,
  useStoredValue,
  writeStoredValue,
} from '@/lib/client-state';

export interface FlowStep {
  /** Stabile Kennung des Schrittes. */
  id: string;
  /** Überschrift im Schritt. */
  title: string;
  /** Kurze Erläuterung unter der Überschrift. */
  hint?: string;
  /** Kurzform für die Fortschrittsanzeige. */
  short: string;
}

export interface UseFlowOptions<T> {
  /** Eindeutige Kennung, unter der zwischengespeichert wird. */
  id: string;
  steps: FlowStep[];
  initial: T;
  /** Erhöhen, sobald sich die Datenstruktur ändert — alte Stände verfallen. */
  version?: number;
  /** Prüft, ob der aktuelle Schritt vollständig ist. */
  validate?: (data: T, stepId: string) => boolean;
  /** Blendet Schritte aus, die im konkreten Fall nicht nötig sind. */
  isStepRelevant?: (data: T, stepId: string) => boolean;
  /**
   * Wird bei „Neu beginnen“ aufgerufen. Zustand, der nicht im Ablauf liegt —
   * etwa ausgewählte Dateien — gehört hier zurückgesetzt.
   */
  onReset?: () => void;
}

export interface FlowState<T> {
  data: T;
  update: (patch: Partial<T>) => void;
  set: <K extends keyof T>(key: K, value: T[K]) => void;
  steps: FlowStep[];
  step: FlowStep;
  stepIndex: number;
  stepCount: number;
  /** Fortschritt von 0 bis 1. */
  progress: number;
  next: () => void;
  back: () => void;
  goTo: (stepId: string) => void;
  isFirst: boolean;
  isLast: boolean;
  canContinue: boolean;
  reset: () => void;
  /** Wurde ein gespeicherter Zwischenstand geladen? */
  restored: boolean;
  dismissRestored: () => void;
  /** Ob der Zwischenstand gespeichert werden konnte. */
  saved: boolean;
}

const STORAGE_PREFIX = 'sm24:flow:';

interface Snapshot<T> {
  version: number;
  data: T;
  stepId: string;
}

/**
 * Zustand für mehrstufige Formulare und Konfiguratoren.
 *
 * Der Zwischenstand wird im Browser gespeichert, damit ein langer
 * Konfigurator nicht verloren geht. Gespeichert werden nur die eingegebenen
 * Angaben, keine Dateien.
 *
 * Gelesen wird über `useSyncExternalStore`: auf dem Server gibt es keinen
 * Zwischenstand, im Browser übernimmt React den gespeicherten Stand beim
 * Hydrieren. Geschrieben wird direkt in den Bedienschritten, nicht in einem
 * Effekt — dadurch gibt es keine Folgerenderdurchläufe.
 */
export function useFlow<T extends object>(options: UseFlowOptions<T>): FlowState<T> {
  const { id, steps, initial, version = 1, validate, isStepRelevant, onReset } = options;
  const storageKey = `${STORAGE_PREFIX}${id}`;

  const raw = useStoredValue(storageKey);
  const [local, setLocal] = useState<Snapshot<T> | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [saved, setSaved] = useState(true);

  // Gespeicherter Stand, sofern er zur aktuellen Datenstruktur passt.
  const stored = useMemo<Snapshot<T> | null>(() => {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as Snapshot<T>;
      if (parsed.version !== version || !parsed.data) return null;
      if (!steps.some((s) => s.id === parsed.stepId)) return null;
      return parsed;
    } catch {
      return null;
    }
  }, [raw, version, steps]);

  // Eigene Eingaben haben Vorrang; sonst gilt der gespeicherte Stand,
  // sonst der Startwert.
  const current = useMemo<Snapshot<T>>(() => {
    if (local) return local;
    if (stored) {
      return { version, data: { ...initial, ...stored.data }, stepId: stored.stepId };
    }
    return { version, data: initial, stepId: steps[0]?.id ?? '' };
  }, [local, stored, initial, steps, version]);

  const persist = useCallback(
    (snapshot: Snapshot<T>) => {
      setLocal(snapshot);
      setSaved(writeStoredValue(storageKey, JSON.stringify(snapshot)));
    },
    [storageKey],
  );

  const update = useCallback(
    (patch: Partial<T>) => {
      persist({ ...current, data: { ...current.data, ...patch } });
    },
    [current, persist],
  );

  const set = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      persist({ ...current, data: { ...current.data, [key]: value } });
    },
    [current, persist],
  );

  const relevantSteps = useMemo(
    () => (isStepRelevant ? steps.filter((s) => isStepRelevant(current.data, s.id)) : steps),
    [steps, current.data, isStepRelevant],
  );

  const stepIndex = Math.max(
    0,
    relevantSteps.findIndex((s) => s.id === current.stepId),
  );
  const step = relevantSteps[stepIndex] ?? relevantSteps[0] ?? steps[0];

  const goTo = useCallback(
    (target: string) => {
      if (!steps.some((s) => s.id === target)) return;
      persist({ ...current, stepId: target });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [steps, current, persist],
  );

  const next = useCallback(() => {
    const at = relevantSteps.findIndex((s) => s.id === step?.id);
    const target = relevantSteps[at + 1];
    if (target) goTo(target.id);
  }, [relevantSteps, step, goTo]);

  const back = useCallback(() => {
    const at = relevantSteps.findIndex((s) => s.id === step?.id);
    const target = relevantSteps[at - 1];
    if (target) goTo(target.id);
  }, [relevantSteps, step, goTo]);

  const reset = useCallback(() => {
    removeStoredValue(storageKey);
    setLocal({ version, data: initial, stepId: steps[0]?.id ?? '' });
    setDismissed(true);
    onReset?.();
  }, [initial, steps, storageKey, version, onReset]);

  return {
    data: current.data,
    update,
    set,
    steps: relevantSteps,
    step,
    stepIndex,
    stepCount: relevantSteps.length,
    progress: relevantSteps.length > 1 ? stepIndex / (relevantSteps.length - 1) : 1,
    next,
    back,
    goTo,
    isFirst: stepIndex === 0,
    isLast: stepIndex === relevantSteps.length - 1,
    canContinue: validate ? validate(current.data, step?.id ?? '') : true,
    reset,
    restored: Boolean(stored) && !dismissed,
    dismissRestored: () => setDismissed(true),
    saved,
  };
}

/** Entfernt einen gespeicherten Zwischenstand, z. B. nach dem Absenden. */
export function clearFlow(id: string) {
  removeStoredValue(`${STORAGE_PREFIX}${id}`);
}
