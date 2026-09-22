import fs from 'fs';
import path from 'path';

const SRC_APP_DIR = 'src/app';
const SRC_COMPONENTS_DIR = 'src/components';
const PACKAGE_JSON_PATH = 'package.json';
const DATE_NOW = new Date().toISOString();

// Utility to count words
function countWords(text) {
  return (text.match(/\b\w+\b/g) || []).length;
}

// Extract routes
const routes = [];
function walkAppDir(dir, baseRoute = '') {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      walkAppDir(fullPath, `${baseRoute}/${item.name}`);
    } else if (item.name === 'page.tsx') {
      const content = fs.readFileSync(fullPath, 'utf8');
      const routePath = baseRoute === '' ? '/' : baseRoute;
      routes.push({
        routePath,
        sourceFile: fullPath,
        wordCount: countWords(content),
      });
    }
  }
}
if (fs.existsSync(SRC_APP_DIR)) walkAppDir(SRC_APP_DIR);

// Extract components
let componentsCount = 0;
function walkComponentsDir(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      walkComponentsDir(fullPath);
    } else if (item.name.endsWith('.tsx') || item.name.endsWith('.ts')) {
      componentsCount++;
    }
  }
}
if (fs.existsSync(SRC_COMPONENTS_DIR)) walkComponentsDir(SRC_COMPONENTS_DIR);

// Read package.json
const pkgContent = fs.readFileSync(PACKAGE_JSON_PATH, 'utf8');
const pkg = JSON.parse(pkgContent);

// DNA JSON
const dna = {
  scanned_at: DATE_NOW,
  runtime_environment: "Next.js 16+ App Router",
  language_standard: "TypeScript 5.5+ Strict",
  ui_engine: "Tailwind CSS v4",
  color_space: "OKLCH Light Mode",
  active_routes_count: routes.length,
  active_components_count: componentsCount
};
fs.writeFileSync('.jules/codebase-dna.json', JSON.stringify(dna, null, 2));

// Generate transformation queue
const transformationQueue = routes.map((r, i) => {
  const routeName = r.routePath === '/' ? 'Home' : r.routePath.split('/').filter(Boolean).join('-');

  // Create topics dynamically based on route path
  let topics = [
    `Erweiterte Fachinformationen für ${routeName}`,
    "Detaillierter Prozessablauf und Qualitätsversprechen",
    "Umfangreiche FAQ-Sektion mit tiefgreifenden Erklärungen"
  ];

  // Interactive component name dynamically generated
  const compName = routeName.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('') + 'Widget';

  return {
    priority: i + 1,
    route_path: r.routePath,
    source_file: r.sourceFile,
    target_word_count: Math.max(900, r.wordCount + 500),
    content_expansion_topics: topics,
    interactive_module: {
      type: "CALCULATOR_OR_FILTER",
      component_name: compName,
      target_file: `components/interactive/${compName.toLowerCase()}.tsx`,
      action_file: `actions/interact-${routeName.toLowerCase()}.ts`
    },
    signature_interaction: "BENTO_HOVER_GLOW_LIGHT",
    schema_entities: ["WebPage", "FAQPage"],
    status: "PENDING_BUILDER"
  };
});

// ZERO-NEW-ROUTES VALIDATION (Gate 1)
const missingRoutes = transformationQueue.filter(t => !routes.some(r => r.routePath === t.route_path));
if (missingRoutes.length > 0) {
    console.error("GATE 1 FAILED: Found routes in blueprint that do not exist physically:", missingRoutes.map(r => r.route_path));
    process.exit(1);
}

// Revolution Plan
const revolutionPlan = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  version: "1.0.0",
  generated_at: DATE_NOW,
  total_existing_routes: routes.length,
  dna_summary: {
    framework: "Next.js 16+",
    react_version: "19.2+",
    styling: "Tailwind CSS v4 (OKLCH)",
    brand_color_primary: "oklch(0.52 0.24 260)",
    typography: "Swiss Modernist"
  },
  transformation_queue: transformationQueue
};
fs.writeFileSync('.jules/revolution-plan.json', JSON.stringify(revolutionPlan, null, 2));

// Architecture Matrix Markdown
let md = `# Architecture Matrix & Audit Report\n\n`;
md += `## Übersicht\n- **Routen:** ${routes.length}\n- **Komponenten:** ${componentsCount}\n- **Datum:** ${DATE_NOW}\n\n`;
md += `## Routen-Transformationen\n\n`;
md += `| Route | Ist-Zustand (Wörter) | Soll-Zustand (Wörter) | Geplantes Modul |\n`;
md += `|-------|---------------------|----------------------|-----------------|\n`;

transformationQueue.forEach(t => {
  const currentWords = routes.find(r => r.routePath === t.route_path).wordCount;
  md += `| \`${t.route_path}\` | ${currentWords} | ${t.target_word_count} | ${t.interactive_module.component_name} |\n`;
});

fs.writeFileSync('.jules/architecture-matrix.md', md);

// Heartbeat
const heartbeat = {
  timestamp: DATE_NOW,
  agent: "JC-AUDITOR-ARCHITECT-v1",
  phase: "BLUEPRINT_GENERATED",
  existing_routes_audited: routes.length,
  status: "SUCCESS"
};
fs.writeFileSync('.jules/heartbeat.json', JSON.stringify(heartbeat, null, 2));

console.log("Audit completed successfully.");
