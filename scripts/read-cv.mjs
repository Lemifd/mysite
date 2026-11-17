import fs from 'node:fs';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
for (const file of ['files/CV.pdf', 'files/cv_civil.pdf']) {
  console.log(`\nFILE: ${file}`);
  const doc = await getDocument({ data: new Uint8Array(fs.readFileSync(file)), useSystemFonts: true }).promise;
  for (let n = 1; n <= doc.numPages; n++) {
    const page = await doc.getPage(n); const text = await page.getTextContent();
    console.log(text.items.map(i => i.str).join(' '));
  }
}
