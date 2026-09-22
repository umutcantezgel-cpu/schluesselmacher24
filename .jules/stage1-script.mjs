import fs from 'fs';
import path from 'path';

function getDirectories(srcPath) {
    let result = [];
    if (!fs.existsSync(srcPath)) return result;
    const entries = fs.readdirSync(srcPath, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.isDirectory()) {
            const fullPath = path.join(srcPath, entry.name);
            result.push(fullPath);
            result = result.concat(getDirectories(fullPath));
        }
    }
    return result;
}

const appDir = 'src/app';
const allDirs = getDirectories(appDir);
allDirs.unshift(appDir);

let active_routes_count = 0;
const routes = [];

for (const dir of allDirs) {
    const pagePath = path.join(dir, 'page.tsx');
    if (fs.existsSync(pagePath)) {
        active_routes_count++;

        let routePath = dir.replace(appDir, '');
        if (routePath === '') routePath = '/';

        const content = fs.readFileSync(pagePath, 'utf8');
        const wordCount = content.trim().split(/\s+/).length;

        routes.push({
            routePath,
            sourceFile: pagePath,
            wordCount
        });
    }
}

const active_components_count = 31; // Based on previous wc -l

// PHASE 0
const codebaseDna = {
    "scanned_at": new Date().toISOString(),
    "runtime_environment": "Next.js 16+ App Router",
    "language_standard": "TypeScript 5.5+ Strict",
    "ui_engine": "Tailwind CSS v4",
    "color_space": "OKLCH Light Mode",
    "active_routes_count": active_routes_count,
    "active_components_count": active_components_count
};

fs.writeFileSync('.jules/codebase-dna.json', JSON.stringify(codebaseDna, null, 2));

// PHASE 1 & 2 & 3
const transformationQueue = routes.map((r, index) => {
    // Generate context-aware topics
    const routeParts = r.routePath.split('/').filter(Boolean);
    const contextName = routeParts.length > 0 ? routeParts[routeParts.length - 1] : 'Startseite';

    // Convert to PascalCase for component names
    const pascalName = contextName.charAt(0).toUpperCase() + contextName.slice(1).replace(/-([a-z])/g, g => g[1].toUpperCase());

    return {
        "priority": index + 1,
        "route_path": r.routePath,
        "source_file": r.sourceFile,
        "target_word_count": Math.max(r.wordCount + 600, 850),
        "content_expansion_topics": [
            `Umfassende Architekturanalyse für den Bereich ${contextName}`,
            `Detaillierte Sicherheits- und Performance-Aspekte für ${contextName}`,
            `Erweiterte Fach-FAQ für ${contextName} mit sechs tiefgreifenden Erläuterungen`
        ],
        "interactive_module": {
            "type": "CALCULATOR_OR_FILTER",
            "component_name": `${pascalName}InteractiveModule`,
            "target_file": `components/interactive/${contextName}-module.tsx`,
            "action_file": `actions/process-${contextName}.ts`
        },
        "signature_interaction": "BENTO_HOVER_GLOW_LIGHT",
        "schema_entities": ["WebPage", "FAQPage"],
        "status": "PENDING_BUILDER"
    };
});

const revolutionPlan = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "version": "1.0.0",
    "generated_at": new Date().toISOString(),
    "total_existing_routes": active_routes_count,
    "dna_summary": {
        "framework": "Next.js 16+",
        "react_version": "19.2+",
        "styling": "Tailwind CSS v4 (OKLCH)",
        "brand_color_primary": "oklch(0.52 0.24 260)",
        "typography": "Swiss Modernist"
    },
    "transformation_queue": transformationQueue
};

fs.writeFileSync('.jules/revolution-plan.json', JSON.stringify(revolutionPlan, null, 2));

let markdown = `# Architecture Matrix\n\n`;
markdown += `| Route | Source File | Status | Schema-Status | CWV-Status | Current Words | Target Words |\n`;
markdown += `|-------|-------------|--------|---------------|------------|---------------|--------------|\n`;

for (const r of routes) {
    markdown += `| ${r.routePath} | ${r.sourceFile} | PENDING | REQUIRED | NEEDS_LCP_OPT | ${r.wordCount} | ${Math.max(r.wordCount + 600, 850)} |\n`;
}

fs.writeFileSync('.jules/architecture-matrix.md', markdown);

// Update heartbeat
const heartbeat = {
    "timestamp": new Date().toISOString(),
    "agent": "JC-AUDITOR-ARCHITECT-v1",
    "phase": "BLUEPRINT_GENERATED",
    "existing_routes_audited": active_routes_count,
    "status": "SUCCESS"
};
fs.writeFileSync('.jules/heartbeat.json', JSON.stringify(heartbeat, null, 2));

console.log(`Generated matrix for ${active_routes_count} routes`);
