import fs from 'fs';

let readme = fs.readFileSync('README.md', 'utf-8');
let llms = fs.readFileSync('llms.txt', 'utf-8');

readme += "\n\n## JC-AUDITOR-ARCHITECT-v1 Audit\n\n- Completed codebase DNA profiling.\n- Architecture Matrix generated with all existing routes and their target word counts.\n- Revolution Plan synthesized.\n";
llms += "\n- [x] JC-AUDITOR-ARCHITECT-v1 Audit complete: .jules/revolution-plan.json and .jules/architecture-matrix.md generated.\n";

fs.writeFileSync('README.md', readme);
fs.writeFileSync('llms.txt', llms);

console.log("Updated docs");
