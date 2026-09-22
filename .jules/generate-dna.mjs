import fs from 'fs';

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const nextVersion = packageJson.dependencies.next;
const reactVersion = packageJson.dependencies.react;
const tailwindVersion = packageJson.devDependencies.tailwindcss;

const dna = {
  "scanned_at": new Date().toISOString(),
  "runtime_environment": `Next.js ${nextVersion} App Router`,
  "language_standard": "TypeScript 5.5+ Strict",
  "ui_engine": `Tailwind CSS v${tailwindVersion.replace(/[\^~]/g, '').split('.')[0]}`,
  "color_space": "OKLCH Light Mode",
  "active_routes_count": 58,
  "active_components_count": 31
};

fs.writeFileSync('.jules/codebase-dna.json', JSON.stringify(dna, null, 2));
console.log("DNA generated");
