import fs from 'fs';
import path from 'path';

const basePath = process.cwd();

// Update llms.txt
let llmsTxt = fs.existsSync(path.join(basePath, 'llms.txt')) ? fs.readFileSync(path.join(basePath, 'llms.txt'), 'utf-8') : '';
llmsTxt += '\n\n## JC-AUDITOR-ARCHITECT-v1 Audit\n';
llmsTxt += 'Blueprint and Architecture Matrix have been generated under .jules directory.\n';
fs.writeFileSync(path.join(basePath, 'llms.txt'), llmsTxt);

// Update README.md
let readme = fs.existsSync(path.join(basePath, 'README.md')) ? fs.readFileSync(path.join(basePath, 'README.md'), 'utf-8') : '';
readme += '\n\n## JC-AUDITOR-ARCHITECT-v1 Audit\n';
readme += 'Blueprint and Architecture Matrix have been generated under .jules directory. Ready for Stage 2 (Builder).\n';
fs.writeFileSync(path.join(basePath, 'README.md'), readme);

console.log('Phase 4 Docs sync Complete.');
