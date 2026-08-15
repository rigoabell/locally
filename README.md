# Locally

Free, fully client-side browser tools. No backend, no database, no accounts, no paid APIs, and no file uploads. The production build is static files you can host on GitHub Pages or Cloudflare Pages at **$0 ongoing cost**.

Your data stays on your device. Nothing is uploaded.

## Tools

- QR code generator
- Password generator
- Word/character counter
- Case converter
- JSON formatter/validator
- Percentage calculator
- Age calculator
- Random number generator
- Unit converter
- Image resizer/compressor

## Local development

Requires Node.js 22+.

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

### Other commands

```bash
npm test          # unit tests for tool logic
npm run lint      # oxlint
npm run typecheck # TypeScript
npm run build     # production static build in dist/
npm run preview   # serve the production build locally
```

## Deployment

`npm run build` emits a static `dist/` folder (`index.html`, hashed assets, `sitemap.xml`, `robots.txt`, `404.html`, and Cloudflare `_redirects`).

### GitHub Pages

1. In the GitHub repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Push to `main`. The workflow in `.github/workflows/pages.yml` builds with `VITE_BASE=/locally/` and deploys.
3. Site URL: `https://rigoabell.github.io/locally/`

If you rename the repository, update `VITE_BASE` and `VITE_SITE_URL` in the workflow, plus the Open Graph URLs in `index.html` and `public/robots.txt`.

### Cloudflare Pages

1. Create a project from this repository.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Leave `VITE_BASE` unset (defaults to `/`) unless the site is on a subpath.
5. Optional: set `VITE_SITE_URL` to your custom domain (no trailing slash).

SPA routes are covered by `public/_redirects` (`/* /index.html 200`). GitHub Pages uses a copy of `index.html` as `404.html`.

## Adding a tool

1. Implement the UI in `src/tools/`.
2. Put reusable logic in `src/lib/` and add tests.
3. Register the tool in `src/registry/tools.ts` (`name`, `slug`, `description`, `category`, `keywords`, `icon`).
4. Add the slug to the list in `vite.config.ts` so `sitemap.xml` stays complete.

## Stack

React, TypeScript, Vite, Tailwind CSS, React Router. Persistence is limited to `localStorage` for light/dark mode.
