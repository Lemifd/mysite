import assert from 'node:assert/strict';
import fs from 'node:fs';
import { projects, categories } from '../src/projects.js';
assert.equal(new Set(projects.map(p => p.id)).size, projects.length, 'Unique project IDs');
for (const p of projects) {
  assert.ok(categories.includes(p.category)); assert.ok(p.title && p.description && p.details);
  for (const asset of [p.image, p.video].filter(Boolean)) assert.ok(fs.existsSync(`public${asset}`), `Missing asset ${asset}`);
  if (p.href) assert.equal(new URL(p.href).protocol, 'https:');
}
for (const asset of ['public/cv.html','public/files/Lemi-Fedasa-CV.pdf','public/images/team/me1.png']) assert.ok(fs.existsSync(asset), `Missing ${asset}`);
console.log(`Content checks passed: ${projects.length} projects, project assets, live URLs, portrait, and CV.`);
