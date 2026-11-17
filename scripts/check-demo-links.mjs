import assert from 'node:assert/strict';
import { projects } from '../src/projects.js';
for (const video of new Set(projects.map(p => p.video).filter(Boolean))) {
  const url = new URL(video, process.env.PORTFOLIO_DEV_URL || 'http://127.0.0.1:5173');
  const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(60000) });
  assert.equal(response.status, 200, `Demo unavailable: ${video}`);
  assert.ok(response.headers.get('content-type')?.includes('video/'), `Invalid demo media: ${video}`);
  console.log(`Verified full demo: ${video}`);
}
