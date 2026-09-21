import fs from 'fs';
import path from 'path';

const SRC_APP_DIR = path.join(process.cwd(), 'src', 'app');
const SRC_COMPONENTS_DIR = path.join(process.cwd(), 'src', 'components');
const JULES_DIR = path.join(process.cwd(), '.jules');

if (!fs.existsSync(JULES_DIR)) {
  fs.mkdirSync(JULES_DIR, { recursive: true });
}

function countWords(text) {
  const withoutTags = text.replace(/<[^>]+>/g, ' ');
  const words = withoutTags.split(/\s+/).filter(word => word.length > 0);
  return words.length;
}

function walkDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function getUrlPath(filePath) {
  let relativePath = path.relative(SRC_APP_DIR, filePath);
  relativePath = relativePath.split(path.sep).join('/');

  const dirname = path.dirname(relativePath);
  if (dirname === '.') return '/';

  return '/' + dirname;
}

const allAppFiles = walkDir(SRC_APP_DIR);
const routeFiles = allAppFiles.filter(file => {
  const name = path.basename(file);
  return name === 'page.tsx' || name === 'layout.tsx' || name === 'route.ts';
});

const allComponentFiles = walkDir(SRC_COMPONENTS_DIR);
const activeComponentsCount = allComponentFiles.length;
const activeRoutesCount = routeFiles.length;

const now = new Date().toISOString();

const dna = {
  scanned_at: now,
  runtime_environment: "Next.js 16+ App Router",
  language_standard: "TypeScript 5.5+ Strict",
  ui_engine: "Tailwind CSS v4",
  color_space: "OKLCH Light Mode",
  active_routes_count: activeRoutesCount,
  active_components_count: activeComponentsCount
};

fs.writeFileSync(
  path.join(JULES_DIR, 'codebase-dna.json'),
  JSON.stringify(dna, null, 2)
);

const transformationQueue = routeFiles.map((file, index) => {
  const content = fs.readFileSync(file, 'utf-8');
  const wordCount = countWords(content);
  let urlPath = getUrlPath(file);

  const folderName = path.dirname(file).split(path.sep).pop();
  const themeTopic = folderName !== 'app' ? folderName : 'Institutionelle';

  return {
    priority: index + 1,
    route_path: urlPath,
    source_file: path.relative(process.cwd(), file).split(path.sep).join('/'),
    target_word_count: Math.max(850, wordCount + 500),
    content_expansion_topics: [
      `${themeTopic} Leistungsübersicht und Systemarchitektur`,
      "Methodischer Transformationsprozess in vier auditierbaren Phasen",
      "Detaillierte Fach-FAQ mit sechs tiefgreifenden Erläuterungen"
    ],
    interactive_module: {
      type: "CALCULATOR_OR_FILTER",
      component_name: "EnterpriseRoiCalculator",
      target_file: "components/calculator/enterprise-roi-calculator.tsx",
      action_file: "actions/calculate-roi.ts"
    },
    signature_interaction: "BENTO_HOVER_GLOW_LIGHT",
    schema_entities: ["Organization", "WebSite", "FAQPage"],
    status: "PENDING_BUILDER"
  };
});

const revolutionPlan = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  version: "1.0.0",
  generated_at: now,
  total_existing_routes: activeRoutesCount,
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
  path.join(JULES_DIR, 'revolution-plan.json'),
  JSON.stringify(revolutionPlan, null, 2)
);

let matrixMd = `# Architecture Matrix\n\n`;
matrixMd += `| Route / File | URL Path | Status | Schema-Status | CWV-Status | Word Count (Current) | Target Word Count |\n`;
matrixMd += `|---|---|---|---|---|---|---|\n`;

transformationQueue.forEach(item => {
  const actualWordCount = countWords(fs.readFileSync(path.join(process.cwd(), item.source_file), 'utf-8'));
  matrixMd += `| \`${item.source_file}\` | \`${item.route_path}\` | ${item.status} | PENDING | PENDING | ${actualWordCount} | ${item.target_word_count} |\n`;
});

fs.writeFileSync(
  path.join(JULES_DIR, 'architecture-matrix.md'),
  matrixMd
);

const heartbeat = {
  timestamp: now,
  agent: "JC-AUDITOR-ARCHITECT-v1",
  phase: "BLUEPRINT_GENERATED",
  existing_routes_audited: activeRoutesCount,
  status: "SUCCESS"
};

fs.writeFileSync(
  path.join(JULES_DIR, 'heartbeat.json'),
  JSON.stringify(heartbeat, null, 2)
);
