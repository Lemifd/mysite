# Lemi Fedasa — Portfolio

React portfolio with a lazy-loaded Three.js pavilion, a filterable project collection, recorded project demos, and a two-page printable CV.

## Development

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

## Build and checks

```sh
npm run check
npm run build
npm run preview
```

`dist/` is the production build. This project is local/repository-only; no external publishing workflow is configured.

## Content

- `src/projects.js`: project collection, categories, links, descriptions, and assets.
- `src/main.jsx`: page sections and interactions.
- `src/Structure.jsx`: Three.js scene, rotation, cleanup, reduced motion, and fallback.
- `src/style.css`: responsive design and visual system.
- `public/cv.html`: editable, print-ready CV source.
- `public/files/Lemi-Fedasa-CV.pdf`: generated, downloadable two-page CV.
- `public/files/CV.pdf` and `public/files/cv_civil.pdf`: original CVs, preserved.

Pipsqueak’s scanner links to the supplied companion web portal. Nova and Pipsqueak descriptions and technology stacks were reconciled with their local project READMEs. Mizan remains listed with a brief description because its technical details and URL have not been supplied. Graphic covers are presentation artwork, not application screenshots. Do not invent capabilities, technologies, dates, or results when completing entries.

Freelancing starts in 2024, as confirmed by Lemi. The other career and education facts come from the original portfolio and CVs. ALX’s completion year is omitted because the source documents disagree.

## Browser validation and PDF generation

`node scripts/browser-qa.mjs` uses a local Chrome installation to check desktop and mobile layouts, WebGL initialization, filters, project dialogs, reduced motion, and CV pagination. It regenerates the PDF from `public/cv.html`. Adjust the Chrome executable path for a different machine. The script writes review images into ignored `.review/`.

Contact uses direct email links and a copy action, requiring no backend or exposed email-service credentials. Project videos load only inside their dialogs. Legacy `/Civil.html` and `/software.html` paths redirect to the relevant project category.

## Local demo recordings

Demo recordings load from `public/video/` on the local server, only when a project dialog opens. Original recordings remain in `video/`. With the dev server running, use `node scripts/check-demo-links.mjs` to verify all recordings. `VITE_DEMO_ORIGIN` is empty by default; an alternate origin can be explicitly configured if needed.

The default dev URL is http://127.0.0.1:5173/. The printable CV is at http://127.0.0.1:5173/cv.html.
