import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

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

const appDir = path.join(rootDir, 'src/app');
const pages = scanDir(appDir, ['.tsx']).filter(f => f.endsWith('page.tsx'));

const blueprint = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  version: "1.0.0",
  generated_at: new Date().toISOString(),
  total_existing_routes: pages.length,
  dna_summary: {
    framework: "Next.js 16+",
    react_version: "19.2+",
    styling: "Tailwind CSS v4 (OKLCH)",
    brand_color_primary: "oklch(0.52 0.24 260)",
    typography: "Swiss Modernist"
  },
  transformation_queue: []
};

let priority = 1;

for (const page of pages) {
  // Convert full path to route
  let routePath = page.replace(appDir, '');
  // Clean up route: remove /(site), /(payload), /page.tsx
  routePath = routePath.replace(/\/\(site\)/g, '').replace(/\/\(payload\)/g, '').replace(/\/page\.tsx$/, '') || '/';

  const sourceFile = page.replace(rootDir + '/', '');

  const content = fs.readFileSync(page, 'utf8');
  const wordCount = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.length > 0).length;

  blueprint.transformation_queue.push({
    priority: priority++,
    route_path: routePath,
    source_file: sourceFile,
    target_word_count: Math.max(900, wordCount + 500), // > 800 requirement
    content_expansion_topics: [
      "Institutionelle Leistungsübersicht und Systemarchitektur",
      "Methodischer Transformationsprozess in vier auditierbaren Phasen",
      "Detaillierte Fach-FAQ mit sechs tiefgreifenden Erläuterungen"
    ],
    interactive_module: {
      type: "CALCULATOR_OR_FILTER",
      component_name: "DynamicInteractionModule" + priority,
      target_file: "src/components/calculator/dynamic-module-" + priority + ".tsx",
      action_file: "src/actions/dynamic-action-" + priority + ".ts"
    },
    signature_interaction: "BENTO_HOVER_GLOW_LIGHT",
    schema_entities: ["Organization", "WebSite", "FAQPage"],
    status: "PENDING_BUILDER"
  });
}

fs.writeFileSync(path.join(rootDir, '.jules', 'revolution-plan.json'), JSON.stringify(blueprint, null, 2));

// Generate Matrix
let matrix = "# Architecture Transformation Matrix\n\n";
matrix += "| Route | Source File | Status | CWV Status | Schema Status |\n";
matrix += "|---|---|---|---|---|\n";

for (const q of blueprint.transformation_queue) {
  matrix += `| \`${q.route_path}\` | \`${q.source_file}\` | PENDING | NEEDS_AUDIT | NEEDS_SCHEMA |\n`;
}

fs.writeFileSync(path.join(rootDir, '.jules', 'architecture-matrix.md'), matrix);

console.log(`Generated blueprint with ${blueprint.transformation_queue.length} routes.`);
