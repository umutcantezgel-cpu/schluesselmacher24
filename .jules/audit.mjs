import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

// Helpers
function walk(dir, ext = '.tsx') {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(filePath, ext));
        } else if (file.endsWith(ext) || file.endsWith('.ts')) {
            results.push(filePath);
        }
    });
    return results;
}

function wordCount(content) {
    return (content.match(/[a-zA-Z0-9_äöüÄÖÜß]+/g) || []).length;
}

// Phase 0
const packageJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const dependencies = packageJson.dependencies || {};

const appDir = path.join(ROOT, 'src', 'app');
const componentsDir = path.join(ROOT, 'src', 'components');

const appFiles = walk(appDir);
const componentFiles = walk(componentsDir);

const routes = [];
appFiles.forEach(file => {
    if (file.endsWith('page.tsx')) {
        let routePath = path.relative(appDir, file).replace(/\\/g, '/').replace(/\/page\.tsx$/, '');
        if (routePath === 'page.tsx') routePath = '';
        routePath = '/' + routePath;
        routes.push({ file, routePath });
    }
});

const dna = {
    scanned_at: new Date().toISOString(),
    runtime_environment: "Next.js 16+ App Router",
    language_standard: "TypeScript 5.5+ Strict",
    ui_engine: "Tailwind CSS v4",
    color_space: "OKLCH Light Mode",
    active_routes_count: routes.length,
    active_components_count: componentFiles.length
};

fs.writeFileSync(path.join(__dirname, 'codebase-dna.json'), JSON.stringify(dna, null, 2));

// Phase 1, 2 & 3
const transformation_queue = [];
let matrixMd = `# Architecture Matrix\n\n| URL | Source File | Status | Schema-Status | CWV-Status | Words | Target Words |\n|---|---|---|---|---|---|---|\n`;

routes.forEach((route, index) => {
    const content = fs.readFileSync(route.file, 'utf8');
    const words = wordCount(content);
    const hasH1 = /<h1/i.test(content);
    const hasPriority = /priority/i.test(content);
    const hasSchema = /schema|JsonLd/i.test(content);

    const schemaStatus = hasSchema ? 'OK' : 'MISSING';
    const cwvStatus = hasPriority ? 'OK' : 'LCP-WARNING';
    const status = 'PENDING_BUILDER';

    const item = {
        priority: index + 1,
        route_path: route.routePath,
        source_file: path.relative(ROOT, route.file).replace(/\\/g, '/'),
        target_word_count: Math.max(850, words + 500),
        content_expansion_topics: [
            "Institutionelle Leistungsübersicht und Systemarchitektur",
            "Methodischer Transformationsprozess in vier auditierbaren Phasen",
            "Detaillierte Fach-FAQ mit sechs tiefgreifenden Erläuterungen"
        ],
        interactive_module: {
            type: "CALCULATOR_OR_FILTER",
            component_name: "EnterpriseRoiCalculator",
            target_file: "src/components/calculator/enterprise-roi-calculator.tsx",
            action_file: "src/lib/actions/calculate-roi.ts"
        },
        signature_interaction: "BENTO_HOVER_GLOW_LIGHT",
        schema_entities: ["Organization", "WebSite", "FAQPage"],
        status: status
    };
    transformation_queue.push(item);

    matrixMd += `| ${route.routePath} | ${item.source_file} | ${status} | ${schemaStatus} | ${cwvStatus} | ${words} | ${item.target_word_count} |\n`;
});

const plan = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    version: "1.0.0",
    generated_at: new Date().toISOString(),
    total_existing_routes: routes.length,
    dna_summary: {
        framework: "Next.js 16+",
        react_version: "19.2+",
        styling: "Tailwind CSS v4 (OKLCH)",
        brand_color_primary: "oklch(0.52 0.24 260)",
        typography: "Swiss Modernist"
    },
    transformation_queue
};

fs.writeFileSync(path.join(__dirname, 'revolution-plan.json'), JSON.stringify(plan, null, 2));
fs.writeFileSync(path.join(__dirname, 'architecture-matrix.md'), matrixMd);

const heartbeat = {
    timestamp: new Date().toISOString(),
    agent: "JC-AUDITOR-ARCHITECT-v1",
    phase: "BLUEPRINT_GENERATED",
    existing_routes_audited: routes.length,
    status: "SUCCESS"
};
fs.writeFileSync(path.join(__dirname, 'heartbeat.json'), JSON.stringify(heartbeat, null, 2));

console.log("Audit complete. Generated .jules/codebase-dna.json, .jules/revolution-plan.json, .jules/architecture-matrix.md, .jules/heartbeat.json");
