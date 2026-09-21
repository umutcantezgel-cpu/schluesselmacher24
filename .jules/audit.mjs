import fs from 'fs';
import path from 'path';

// Helper to count words in a string
function countWords(str) {
  if (!str) return 0;
  return str.split(/\s+/).filter(word => word.length > 0).length;
}

// Find files recursively
function findFiles(dir, ext = '') {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findFiles(filePath, ext));
    } else {
      if (ext && !file.endsWith(ext)) continue;
      results.push(filePath);
    }
  }
  return results;
}

const appDir = path.join(process.cwd(), 'src/app');
const componentsDir = path.join(process.cwd(), 'src/components');

const appFiles = findFiles(appDir, '.tsx');
const routeFiles = appFiles.filter(f => f.endsWith('page.tsx'));
const layoutFiles = appFiles.filter(f => f.endsWith('layout.tsx'));
const routeTsFiles = findFiles(appDir, 'route.ts');
const allRoutes = [...routeFiles, ...layoutFiles, ...routeTsFiles];

const componentFiles = findFiles(componentsDir, '.tsx');

const totalExistingRoutes = routeFiles.length; // Actually page.tsx count
const activeComponentsCount = componentFiles.length;

// Generate .jules/codebase-dna.json
const dna = {
  scanned_at: new Date().toISOString(),
  runtime_environment: "Next.js 16+ App Router",
  language_standard: "TypeScript 5.5+ Strict",
  ui_engine: "Tailwind CSS v4",
  color_space: "OKLCH Light Mode",
  active_routes_count: allRoutes.length,
  active_components_count: activeComponentsCount
};

fs.writeFileSync(
  path.join(process.cwd(), '.jules/codebase-dna.json'),
  JSON.stringify(dna, null, 2)
);

// Generate .jules/revolution-plan.json
const transformationQueue = routeFiles.map((filePath, index) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const wordCount = countWords(content);

  // Extract route path relative to app
  let routePath = filePath.replace(appDir, '').replace('/page.tsx', '') || '/';
  if (routePath.endsWith('\\page.tsx')) {
    routePath = routePath.replace('\\page.tsx', '');
  }
  routePath = routePath.replace(/\\/g, '/');
  if (routePath === '') routePath = '/';

  const fileRelPath = filePath.replace(process.cwd() + '/', '').replace(process.cwd() + '\\', '').replace(/\\/g, '/');

  return {
    priority: index + 1,
    route_path: routePath,
    source_file: fileRelPath,
    target_word_count: Math.max(950, wordCount + 800), // Ensure > 800
    content_expansion_topics: [
      "Erweiterte technische Spezifikationen und Hintergrundinformationen",
      "Detaillierte Fach-FAQ mit tiefgreifenden Erläuterungen",
      "Experten-Tipps und praxisnahe Anwendungsszenarien"
    ],
    interactive_module: {
      type: "CALCULATOR_OR_FILTER",
      component_name: "InteractiveFeatureModule",
      target_file: `src/components/feature/interactive-module-${index}.tsx`,
      action_file: `src/lib/actions/interactive-action-${index}.ts`
    },
    signature_interaction: "BENTO_HOVER_GLOW_LIGHT",
    schema_entities: ["WebPage", "FAQPage"],
    status: "PENDING_BUILDER"
  };
});

const revolutionPlan = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  version: "1.0.0",
  generated_at: new Date().toISOString(),
  total_existing_routes: routeFiles.length,
  dna_summary: {
    framework: "Next.js 16+",
    react_version: "19.2+",
    styling: "Tailwind CSS v4 (OKLCH)",
    brand_color_primary: "oklch(0.52 0.24 260)",
    typography: "Swiss Modernist"
  },
  transformation_queue: transformationQueue
};

fs.writeFileSync(
  path.join(process.cwd(), '.jules/revolution-plan.json'),
  JSON.stringify(revolutionPlan, null, 2)
);

// Generate .jules/architecture-matrix.md
let matrixMarkdown = `# Architecture Matrix\n\n`;
matrixMarkdown += `| Route Path | Source File | Status | Schema-Status | CWV-Status | Word Count (Current) | Word Count (Target) |\n`;
matrixMarkdown += `|---|---|---|---|---|---|---|\n`;

transformationQueue.forEach(q => {
  const currentWordCount = countWords(fs.readFileSync(path.join(process.cwd(), q.source_file), 'utf-8'));
  matrixMarkdown += `| \`${q.route_path}\` | \`${q.source_file}\` | ${q.status} | PENDING | PENDING | ${currentWordCount} | ${q.target_word_count} |\n`;
});

fs.writeFileSync(
  path.join(process.cwd(), '.jules/architecture-matrix.md'),
  matrixMarkdown
);

// Update heartbeat
const heartbeat = {
  timestamp: new Date().toISOString(),
  agent: "JC-AUDITOR-ARCHITECT-v1",
  phase: "BLUEPRINT_GENERATED",
  existing_routes_audited: routeFiles.length,
  status: "SUCCESS"
};
fs.writeFileSync(
  path.join(process.cwd(), '.jules/heartbeat.json'),
  JSON.stringify(heartbeat, null, 2)
);

// Update README.md
let readme = fs.readFileSync(path.join(process.cwd(), 'README.md'), 'utf-8');
if (!readme.includes('Architecture Matrix')) {
  readme += `\n\n## Architecture Matrix\n\nSee \`.jules/architecture-matrix.md\` for the full routing architecture.`;
}
fs.writeFileSync(path.join(process.cwd(), 'README.md'), readme);

// Update llms.txt
fs.writeFileSync(
  path.join(process.cwd(), 'llms.txt'),
  `Architecture Blueprint & System Rules for JC-REVOLUTION-BUILDER\n\nFollow .jules/revolution-plan.json for transformation.\n`
);

console.log("Audit complete. Generated files in .jules/ directory.");
