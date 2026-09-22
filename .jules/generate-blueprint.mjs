import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
    });
}

const routes = [];
walkDir('src/app', (filepath) => {
    if (filepath.endsWith('page.tsx')) {
        let routePath = filepath.replace('src/app', '').replace('/page.tsx', '');
        if (routePath === '') routePath = '/';
        const content = fs.readFileSync(filepath, 'utf8');
        const wordCount = content.split(/\s+/).length;
        routes.push({ filepath, routePath, wordCount });
    }
});

const transformationQueue = routes.map((r, i) => {
    // Generate context-aware topics
    const topics = [
        `Tiefgründige technische Erläuterung der Funktionalität und Architektur für ${r.routePath === '/' ? 'die Startseite' : r.routePath}`,
        `Sicherheitsaspekte, Zertifizierungen und Schweizer Light Mode Design-Integration für ${r.routePath === '/' ? 'Startseite' : r.routePath}`,
        `Häufig gestellte Fragen (FAQ) zur Implementierung und Nutzung von ${r.routePath === '/' ? 'Startseite' : r.routePath}`
    ];

    // Generate context-aware module name
    let moduleName = 'InteractiveModule';
    if (r.routePath.includes('schluessel')) moduleName = 'KeyConfiguratorModule';
    else if (r.routePath.includes('termin')) moduleName = 'BookingCalendarModule';
    else if (r.routePath.includes('admin')) moduleName = 'AdminDashboardModule';
    else if (r.routePath.includes('sicherheit')) moduleName = 'SecurityCheckModule';
    else if (r.routePath === '/') moduleName = 'EnterpriseRoiCalculator';

    const cleanPath = r.routePath.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'home';

    return {
        priority: i + 1,
        route_path: r.routePath,
        source_file: r.filepath,
        target_word_count: Math.max(950, r.wordCount + 600),
        content_expansion_topics: topics,
        interactive_module: {
            type: "CALCULATOR_OR_FILTER",
            component_name: moduleName,
            target_file: `src/components/calculator/${cleanPath}-module.tsx`,
            action_file: `src/lib/actions/${cleanPath}-action.ts`
        },
        signature_interaction: "BENTO_HOVER_GLOW_LIGHT",
        schema_entities: ["Organization", "WebSite", "FAQPage"],
        status: "PENDING_BUILDER"
    };
});

const blueprint = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "version": "1.0.0",
  "generated_at": new Date().toISOString(),
  "total_existing_routes": routes.length,
  "dna_summary": {
    "framework": "Next.js 16+",
    "react_version": "19.2+",
    "styling": "Tailwind CSS v4 (OKLCH)",
    "brand_color_primary": "oklch(0.52 0.24 260)",
    "typography": "Swiss Modernist"
  },
  "transformation_queue": transformationQueue
};

fs.writeFileSync('.jules/revolution-plan.json', JSON.stringify(blueprint, null, 2));

let markdown = `# Architecture Matrix\n\n`;
markdown += `| Route | Status | Schema-Status | CWV-Status | Word Count (Ist) | Word Count (Soll) | Interactive Module |\n`;
markdown += `|---|---|---|---|---|---|---|\n`;
for (const r of transformationQueue) {
    const istWordCount = routes.find(ro => ro.filepath === r.source_file).wordCount;
    markdown += `| ${r.route_path} | PENDING_BUILDER | MISSING | NEEDS_AUDIT | ${istWordCount} | ${r.target_word_count} | ${r.interactive_module.component_name} |\n`;
}

fs.writeFileSync('.jules/architecture-matrix.md', markdown);

console.log("Blueprint generated");
