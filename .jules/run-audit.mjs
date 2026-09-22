import fs from 'fs';
import path from 'path';

// Helper to get word count
function getWordCount(content) {
  return content.split(/\s+/).filter(word => word.length > 0).length;
}

// Find files
function findFiles(dir, match, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findFiles(fullPath, match, acc);
    } else if (match.test(file)) {
      acc.push(fullPath);
    }
  }
  return acc;
}

const appRoutes = findFiles('src/app', /page\.tsx$|layout\.tsx$|route\.ts$/);
const components = findFiles('src/components', /\.tsx$/);

const routesInfo = [];

for (const route of appRoutes) {
  if (!route.endsWith('page.tsx')) continue;

  const content = fs.readFileSync(route, 'utf-8');
  const wordCount = getWordCount(content);
  let routePath = route.replace('src/app', '').replace('/page.tsx', '');
  if (routePath === '') routePath = '/';
  if (routePath.endsWith('/') && routePath.length > 1) routePath = routePath.slice(0, -1);

  routesInfo.push({
    route_path: routePath,
    source_file: route,
    word_count: wordCount,
    content: content
  });
}

// Write codebase DNA
const dna = {
  scanned_at: new Date().toISOString(),
  runtime_environment: "Next.js 16+ App Router",
  language_standard: "TypeScript 5.5+ Strict",
  ui_engine: "Tailwind CSS v4",
  color_space: "OKLCH Light Mode",
  active_routes_count: appRoutes.filter(r => r.endsWith('page.tsx')).length,
  active_components_count: components.length
};
fs.writeFileSync('.jules/codebase-dna.json', JSON.stringify(dna, null, 2));

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function generateDynamicData(routePath, content) {
  const segments = routePath.split('/').filter(Boolean);
  const mainEntity = segments.length > 0 ? segments[segments.length - 1].replace(/\[|\]/g, '') : 'home';
  const parentEntity = segments.length > 1 ? segments[0] : 'core';

  const capitalizedEntity = capitalize(mainEntity);
  const camelEntity = mainEntity.replace(/-([a-z])/g, g => g[1].toUpperCase());
  const PascalEntity = capitalize(camelEntity);

  let topics = [];
  let componentName = "";
  let targetFile = "";

  if (routePath === '/') {
    topics = [
      "Institutionelle Leistungsübersicht und Systemarchitektur",
      "Methodischer Transformationsprozess in vier auditierbaren Phasen",
      "Detaillierte Fach-FAQ mit sechs tiefgreifenden Erläuterungen"
    ];
    componentName = "EnterpriseRoiCalculator";
    targetFile = "components/calculator/enterprise-roi-calculator.tsx";
  } else if (routePath.includes('autoschluessel')) {
    topics = [
      `Spezifische ${capitalizedEntity}-Diagnose und Fallstricke`,
      `Präzisionsfräsung und Kodierungsprozess für ${capitalizedEntity}`,
      `Sicherheitsaspekte der Wegfahrsperren-Programmierung bei ${parentEntity}`
    ];
    componentName = `${PascalEntity}KeyCompatibilityChecker`;
    targetFile = `components/autoschluessel/${mainEntity}-compatibility-checker.tsx`;
  } else if (routePath.includes('schliessanlagen')) {
     topics = [
      `Planung und Architektur komplexer Systeme für ${capitalizedEntity}`,
      `Sicherheitsstufen und Zylindertechnologien für ${parentEntity}`,
      `Wartung und Erweiterung bestehender ${capitalizedEntity}-Systeme`
    ];
    componentName = `${PascalEntity}SystemConfigurator`;
    targetFile = `components/schliessanlagen/${mainEntity}-system-configurator.tsx`;
  } else if (routePath.includes('admin')) {
    topics = [
      `Administrative Übersicht und Steuerung von ${capitalizedEntity}`,
      `Prozessoptimierung und Audit-Logs für ${capitalizedEntity}`,
      `Sicherheitseinstellungen und Zugriffskontrolle im ${parentEntity}-Bereich`
    ];
    componentName = `Admin${PascalEntity}Dashboard`;
    targetFile = `components/admin/admin-${mainEntity}-dashboard.tsx`;
  } else if (routePath.includes('rechtliches')) {
    topics = [
      `Transparente rechtliche Rahmenbedingungen zu ${capitalizedEntity}`,
      `Nutzerrechte und Pflichten im Rahmen der ${parentEntity}`,
      `Zertifizierungen und Compliance-Nachweise für ${capitalizedEntity}`
    ];
    componentName = `${PascalEntity}LegalViewer`;
    targetFile = `components/rechtliches/${mainEntity}-legal-viewer.tsx`;
  } else {
     topics = [
      `Erweiterte Fachinformationen und Spezifikationen zu ${capitalizedEntity}`,
      `Best Practices, Fallstudien und Anwendungsbeispiele für ${parentEntity}`,
      `Häufig gestellte Fragen (FAQ) zu ${capitalizedEntity} für maximale Transparenz`
    ];
    componentName = `Interactive${PascalEntity}Widget`;
    targetFile = `components/ui/interactive-${mainEntity}-widget.tsx`;
  }

  return { topics, componentName, targetFile };
}

// Generate revolution plan
const revolutionPlan = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  version: "1.0.0",
  generated_at: new Date().toISOString(),
  total_existing_routes: routesInfo.length,
  dna_summary: {
    framework: "Next.js 16+",
    react_version: "19.2+",
    styling: "Tailwind CSS v4 (OKLCH)",
    brand_color_primary: "oklch(0.52 0.24 260)",
    typography: "Swiss Modernist"
  },
  transformation_queue: routesInfo.map((info, idx) => {
    const { topics, componentName, targetFile } = generateDynamicData(info.route_path, info.content);

    return {
      priority: idx + 1,
      route_path: info.route_path,
      source_file: info.source_file,
      target_word_count: Math.max(950, info.word_count + 500),
      content_expansion_topics: topics,
      interactive_module: {
        type: "CALCULATOR_OR_FILTER",
        component_name: componentName,
        target_file: targetFile,
        action_file: `actions/calculate-${componentName.toLowerCase()}.ts`
      },
      signature_interaction: "BENTO_HOVER_GLOW_LIGHT",
      schema_entities: ["Organization", "WebSite", "FAQPage", "Service"],
      status: "PENDING_BUILDER"
    };
  })
};

fs.writeFileSync('.jules/revolution-plan.json', JSON.stringify(revolutionPlan, null, 2));

// Generate architecture matrix
let matrixMd = "# Architecture Matrix\n\n";
matrixMd += "| Route Path | Source File | Current Words | Target Words | Status | Interactive Module |\n";
matrixMd += "| --- | --- | --- | --- | --- | --- |\n";
routesInfo.forEach(info => {
  const { componentName } = generateDynamicData(info.route_path, info.content);
  matrixMd += `| ${info.route_path} | ${info.source_file} | ${info.word_count} | ${Math.max(950, info.word_count + 500)} | PENDING_BUILDER | ${componentName} |\n`;
});

fs.writeFileSync('.jules/architecture-matrix.md', matrixMd);

// Write Heartbeat
const heartbeat = {
  timestamp: new Date().toISOString(),
  agent: "JC-AUDITOR-ARCHITECT-v1",
  phase: "BLUEPRINT_GENERATED",
  existing_routes_audited: routesInfo.length,
  status: "SUCCESS"
};
fs.writeFileSync('.jules/heartbeat.json', JSON.stringify(heartbeat, null, 2));

console.log("Successfully generated auditor artifacts in .jules/ with dynamic context");
