1. **Apply Vector 1 (JSON-LD SEO) to `src/app/tuer-und-schliesstechnik/page.tsx`**:
   - Create a script `update_page.js` to modify `src/app/tuer-und-schliesstechnik/page.tsx`:
     ```bash
     cat << 'EOF' > update_page.js
     const fs = require('fs');

     const filePath = 'src/app/tuer-und-schliesstechnik/page.tsx';
     let content = fs.readFileSync(filePath, 'utf8');

     // Inject imports
     content = content.replace(
       "import { JsonLd, faqSchema } from '@/components/seo/json-ld';",
       "import { JsonLd } from '@/components/seo/json-ld';\nimport type { Graph } from 'schema-dts';\nimport { getSiteUrl } from '@/lib/site-url';"
     );

     // Inject structuredData and pageUrl AFTER page is initialized
     content = content.replace(
       "const process = PROCESS_LABELS['gefuehrte-anfrage'];",
       `const siteUrl = getSiteUrl();
  const pageUrl = \`\${siteUrl}/\${ROUTE}\`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": \`\${siteUrl}/#organization\`,
        "name": "SCHLÜSSELMACHER24",
        "url": siteUrl,
        "logo": \`\${siteUrl}/logo.png\`
      },
      {
        "@type": "WebSite",
        "@id": \`\${siteUrl}/#website\`,
        "url": siteUrl,
        "name": "SCHLÜSSELMACHER24",
        "publisher": { "@id": \`\${siteUrl}/#organization\` }
      },
      {
        "@type": "WebPage",
        "@id": \`\${pageUrl}/#webpage\`,
        "url": pageUrl,
        "name": page?.seo.title ?? 'Tür- und Schließtechnik: Sicherheit vom Zylinder bis zum Mehrfachschloss',
        "isPartOf": { "@id": \`\${siteUrl}/#website\` },
        "about": { "@id": \`\${siteUrl}/#organization\` }
      },
      {
        "@type": "FAQPage",
        "@id": \`\${pageUrl}/#faq\`,
        "mainEntity": EXPERT_FAQ.map((item) => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": { "@type": "Answer", "text": item.answer }
        }))
      }
    ]
  } satisfies Graph;

  const process = PROCESS_LABELS['gefuehrte-anfrage'];`
     );

     // Replace the JsonLd usage
     content = content.replace(
       "<JsonLd data={faqSchema(EXPERT_FAQ.map((g) => ({ question: g.question, answer: g.answer })))} />",
       "<JsonLd data={structuredData} />"
     );

     // Update link text
     content = content.replace(
       /Leistungsdetails/g,
       "{service.title} Details ansehen"
     );

     fs.writeFileSync(filePath, content);
     EOF
     node update_page.js
     rm update_page.js
     ```

2. **Verify File Modifications**:
   - Run `grep -n "structuredData" src/app/tuer-und-schliesstechnik/page.tsx` and `grep -n "{service.title} Details ansehen" src/app/tuer-und-schliesstechnik/page.tsx` to verify changes.

3. **Handle Polisher state**:
   - Create a script `update_state.js` to handle all state and lockfiles:
     ```bash
     cat << 'EOF' > update_state.js
     const fs = require('fs');
     const crypto = require('crypto');

     // 1. Lockfile update
     const targetFile = 'src/app/tuer-und-schliesstechnik/page.tsx';
     const fileContent = fs.readFileSync(targetFile, 'utf8');
     const hash = crypto.createHash('sha256').update(fileContent).digest('hex');

     let lockfile = {};
     if (fs.existsSync('.jules/lockfile.json')) {
       lockfile = JSON.parse(fs.readFileSync('.jules/lockfile.json', 'utf8'));
     }
     lockfile[targetFile] = { status: 'VERIFIZIERT_FROZEN', hash: hash };
     fs.writeFileSync('.jules/lockfile.json', JSON.stringify(lockfile, null, 2));

     // 2. State update (increment epoch/iteration)
     let state = {};
     if (fs.existsSync('.jules/state.json')) {
       state = JSON.parse(fs.readFileSync('.jules/state.json', 'utf8'));
     }
     if (state.epoch !== undefined) {
       state.epoch += 1;
     } else if (state.iteration !== undefined) {
       state.iteration += 1;
     } else {
       state.epoch = 1;
     }
     fs.writeFileSync('.jules/state.json', JSON.stringify(state, null, 2));

     // 3. Heartbeat update
     const domainVector = state.epoch !== undefined ? state.epoch % 4 : 1;
     const heartbeat = {
       timestamp: new Date().toISOString(),
       agent: "JC-ULTRAMARATHON-POLISHER-v1",
       vector: domainVector,
       status: "HEALTHY_OPTIMAL",
       mutations_applied: 1
     };
     fs.writeFileSync('.jules/heartbeat.json', JSON.stringify(heartbeat, null, 2));

     // 4. Remove handoff file
     if (fs.existsSync('.jules/builder-handoff.json')) {
       fs.unlinkSync('.jules/builder-handoff.json');
     }
     EOF
     node update_state.js
     rm update_state.js
     ```

4. **Verify State Modifications**:
   - Run `cat .jules/state.json` and `cat .jules/heartbeat.json` to verify the updates.

5. **Run tests & validations**:
   - Run the exact bash commands to verify code quality:
     `npm run test`
     `npx tsc --noEmit`
     `npm run lint`
     `npx next build`

6. **Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.**

7. **Commit and Push**:
   - Stage changes:
     `git add src/app/tuer-und-schliesstechnik/page.tsx .jules/lockfile.json .jules/heartbeat.json .jules/state.json`
     `git rm -f .jules/builder-handoff.json` (ignore if it doesn't exist).
   - Commit changes:
     `git commit -m "perf(polish): vector 1 harden app/tuer-und-schliesstechnik/page.tsx into production"`
   - Note: I won't run `git push origin sentinel/auto` in bash as it's blocked, I will leave it to the final submit tool.
