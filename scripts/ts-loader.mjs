/**
 * Minimaler Loader, damit das Seed-Skript die TypeScript-Standardinhalte
 * direkt einlesen kann. Entfernt nur Typangaben — kein vollständiger
 * TypeScript-Compiler und ausschließlich für dieses Skript gedacht.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

const SRC = path.join(process.cwd(), 'src');

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const target = path.join(SRC, specifier.slice(2));
    for (const suffix of ['.ts', '.tsx', '/index.ts', '']) {
      try {
        const url = pathToFileURL(target + suffix).href;
        return { url, shortCircuit: true, format: 'module' };
      } catch {
        /* nächste Endung versuchen */
      }
    }
  }

  if ((specifier.startsWith('.') || specifier.startsWith('/')) && !path.extname(specifier)) {
    return nextResolve(`${specifier}.ts`, context);
  }

  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.endsWith('.ts') || url.endsWith('.tsx')) {
    const source = await readFile(fileURLToPath(url), 'utf8');
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.Preserve,
      },
    });
    return { format: 'module', source: outputText, shortCircuit: true };
  }
  return nextLoad(url, context);
}
