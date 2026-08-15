export const SITE_NAME = 'Locally'
export const SITE_TAGLINE = 'Free browser tools. Your data stays on your device.'
export const PRIVACY_LINE = 'Your data stays on your device. Nothing is uploaded.'
export const SITE_DESCRIPTION =
  'A free, fully client-side toolkit that runs entirely in your browser. No accounts, no uploads, no operating costs.'

export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? 'https://rigoabell.github.io/locally').replace(
  /\/$/,
  '',
)

export function canonicalUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (normalized === '/') return SITE_URL
  return `${SITE_URL}${normalized}`
}

export function pageTitle(name: string): string {
  return `${name} — ${SITE_NAME}`
}
