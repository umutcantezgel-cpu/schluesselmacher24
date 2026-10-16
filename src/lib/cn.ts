import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge kennt die eigenen Skalen aus `tailwind.config.ts` nicht von
 * selbst: Eine unbekannte `text-<wort>`-Klasse hielte es für eine Textfarbe und
 * würde sie neben `text-foreground-muted` stillschweigend verwerfen. Deshalb
 * sind hier alle eigenen Werte eingetragen (KERN K-005, K-007). Nur `extend`,
 * damit die Standardwerte erhalten bleiben.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["caption", "small", "body", "eingabe", "lead", "title-sm", "title", "headline", "display"],
      tracking: ["label", "label-eng"],
      shadow: ["raised", "overlay"],
      spacing: ["section", "section-tight", "gutter", "header"],
      container: ["shell", "measure"],
      ease: ["standard", "enter", "exit", "draw"],
      animate: ["menue-ein", "schublade-ein", "schleier-ein"],
    },
    classGroups: {
      z: [{ z: ["raised", "sticky", "header", "overlay", "drawer", "skip"] }],
      duration: [{ duration: ["instant", "quick", "base", "slow", "enter", "scene"] }],
      "min-h": [{ "min-h": ["touch-sm", "touch", "touch-lg"] }],
      "min-w": [{ "min-w": ["touch", "zeichnung"] }],
      "grid-rows": [{ "grid-rows": ["kopf"] }],
      "grid-cols": [{ "grid-cols": ["kacheln"] }],
      scale: [{ scale: ["druck"] }],
      "border-w": [{ border: ["strich"] }],
      "border-w-x": [{ "border-x": ["strich"] }],
      "border-w-y": [{ "border-y": ["strich"] }],
      "border-w-t": [{ "border-t": ["strich"] }],
      "border-w-b": [{ "border-b": ["strich"] }],
      "border-w-l": [{ "border-l": ["strich"] }],
      "border-w-r": [{ "border-r": ["strich"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
