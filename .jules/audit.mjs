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
let active_components_count = 0;

walkDir('src/app', (filepath) => {
    if (filepath.endsWith('page.tsx') || filepath.endsWith('layout.tsx') || filepath.endsWith('route.ts')) {
        routes.push(filepath);
    }
});

walkDir('src/components', (filepath) => {
    if (filepath.endsWith('.tsx') || filepath.endsWith('.ts')) {
        active_components_count++;
    }
});

console.log("Routes count:", routes.length);
console.log("Components count:", active_components_count);
