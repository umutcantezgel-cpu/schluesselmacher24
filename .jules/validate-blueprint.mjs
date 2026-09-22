import fs from 'fs';

const blueprint = JSON.parse(fs.readFileSync('.jules/revolution-plan.json', 'utf8'));
const queue = blueprint.transformation_queue;

for (const item of queue) {
    if (!fs.existsSync(item.source_file)) {
        console.error(`File does not exist: ${item.source_file}`);
        process.exit(1);
    }
}
console.log("Validation passed: All routes exist.");
