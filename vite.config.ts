import { copyFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const toolSlugs = [
  'qr-code-generator',
  'password-generator',
  'word-counter',
  'case-converter',
  'json-formatter',
  'percentage-calculator',
  'age-calculator',
  'random-number-generator',
  'unit-converter',
  'image-resizer',
]

function staticSitePlugins() {
  return {
    name: 'static-site-plugins',
    closeBundle() {
      const dist = resolve('dist')
      copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))

      const siteUrl = (process.env.VITE_SITE_URL ?? 'https://rigoabell.github.io/locally').replace(
        /\/$/,
        '',
      )
      const paths = ['/', '/tools', '/about', '/privacy', '/usage', ...toolSlugs.map((slug) => `/tools/${slug}`)]
      const lastmod = new Date().toISOString().slice(0, 10)
      const urls = paths
        .map(
          (path) => `  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
  </url>`,
        )
        .join('\n')

      writeFileSync(
        resolve(dist, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
      )

      const distStats = folderSize(dist)
      writeFileSync(
        resolve(dist, 'usage.json'),
        `${JSON.stringify(
          {
            generatedAt: new Date().toISOString(),
            distBytes: distStats.bytes,
            fileCount: distStats.files,
          },
          null,
          2,
        )}\n`,
      )
    },
  }
}

function folderSize(dir: string): { bytes: number; files: number } {
  let bytes = 0
  let files = 0
  for (const name of readdirSync(dir)) {
    const full = resolve(dir, name)
    const info = statSync(full)
    if (info.isDirectory()) {
      const nested = folderSize(full)
      bytes += nested.bytes
      files += nested.files
    } else {
      bytes += info.size
      files += 1
    }
  }
  return { bytes, files }
}

export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss(), staticSitePlugins()],
})
