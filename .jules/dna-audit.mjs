import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper to count words
function countWords(str) {
  return str.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.length > 0).length;
}

function scanDir(dir, ext = ['.tsx', '.ts'], fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath, ext, fileList);
    } else if (ext.some(e => fullPath.endsWith(e))) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const pages = scanDir(path.join(rootDir, 'src/app'), ['.tsx']).filter(f => f.endsWith('page.tsx') || f.endsWith('layout.tsx'));
const components = scanDir(path.join(rootDir, 'src/components'), ['.tsx']);

const dna = {
  scanned_at: new Date().toISOString(),
  runtime_environment: "Next.js 16+ App Router",
  language_standard: "TypeScript 5.5+ Strict",
  ui_engine: "Tailwind CSS v4",
  color_space: "OKLCH Light Mode",
  active_routes_count: pages.filter(p => p.endsWith('page.tsx')).length,
  active_components_count: components.length
};

fs.writeFileSync(path.join(rootDir, '.jules', 'codebase-dna.json'), JSON.stringify(dna, null, 2));
console.log('DNA scan complete:', dna);
