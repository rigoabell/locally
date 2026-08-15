import { Seo } from '../components/Seo'
import { pageTitle, PRIVACY_LINE, SITE_NAME } from '../lib/site'

export function AboutPage() {
  return (
    <>
      <Seo
        title={pageTitle('About')}
        description={`${SITE_NAME} is a free, static website of browser tools. No backend, no database, and no paid APIs.`}
        path="/about"
      />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">About {SITE_NAME}</h1>
        <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          {SITE_NAME} is a free toolkit anyone can use. It is designed so the ongoing operating cost is zero: a static
          build, hosted on GitHub Pages or Cloudflare Pages, with every feature running inside the visitor’s browser.
        </p>
        <h2 className="mt-10 text-xl font-semibold text-zinc-900 dark:text-white">What this site is</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-zinc-600 dark:text-zinc-400">
          <li>A directory of practical utilities with individual URLs</li>
          <li>Fully client-side: React, TypeScript, Vite, and Tailwind CSS</li>
          <li>Open to use without accounts, payments, or usage limits</li>
        </ul>
        <h2 className="mt-10 text-xl font-semibold text-zinc-900 dark:text-white">What this site is not</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-zinc-600 dark:text-zinc-400">
          <li>Not a backend or SaaS with servers to maintain</li>
          <li>Not connected to databases, authentication, or paid APIs</li>
          <li>Not an AI product — there are no external model calls</li>
        </ul>
        <p className="mt-8 rounded-2xl border border-teal-200 bg-teal-50 p-4 text-teal-950 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-100">
          {PRIVACY_LINE}
        </p>
      </article>
    </>
  )
}
