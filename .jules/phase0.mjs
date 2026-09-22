import fs from 'fs';
import path from 'path';

const basePath = process.cwd();

// Gather info for Phase 0
const packageJson = JSON.parse(fs.readFileSync(path.join(basePath, 'package.json'), 'utf-8'));
const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

// Function to recursively find files
function findFiles(dir, ext) {
    let results = [];
    if (!fs.existsSync(dir)) return results;

    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(findFiles(fullPath, ext));
        } else if (fullPath.endsWith(ext)) {
            results.push(fullPath);
        }
    });
    return results;
}

const routes = findFiles(path.join(basePath, 'src', 'app'), '.tsx')
               .filter(f => f.endsWith('page.tsx') || f.endsWith('layout.tsx'));
const components = findFiles(path.join(basePath, 'src', 'components'), '.tsx');

const dna = {
    scanned_at: new Date().toISOString(),
    runtime_environment: "Next.js 16+ App Router",
    language_standard: "TypeScript 5.5+ Strict",
    ui_engine: "Tailwind CSS v4",
    color_space: "OKLCH Light Mode",
    active_routes_count: routes.length,
    active_components_count: components.length
};

fs.mkdirSync(path.join(basePath, '.jules'), { recursive: true });
fs.writeFileSync(path.join(basePath, '.jules', 'codebase-dna.json'), JSON.stringify(dna, null, 2));

console.log('Phase 0 Complete. Generated codebase-dna.json.');
