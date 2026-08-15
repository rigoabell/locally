import { Seo } from '../components/Seo'
import { pageTitle, PRIVACY_LINE, SITE_NAME } from '../lib/site'

export function PrivacyPage() {
  return (
    <>
      <Seo
        title={pageTitle('Privacy')}
        description={`${PRIVACY_LINE} ${SITE_NAME} processes QR codes, passwords, JSON, and images locally in your browser.`}
        path="/privacy"
      />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">Privacy</h1>
        <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">{PRIVACY_LINE}</p>
        <h2 className="mt-10 text-xl font-semibold text-zinc-900 dark:text-white">Local processing</h2>
        <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
          Tools such as the QR generator, password generator, JSON formatter, and image resizer run entirely in your
          browser. Files you select are read with browser APIs and are not uploaded to a server. There is no backend
          that could receive them.
        </p>
        <h2 className="mt-10 text-xl font-semibold text-zinc-900 dark:text-white">Storage</h2>
        <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
          Theme preference (light or dark) is saved in <code>localStorage</code> on your device. Clearing site data
          removes it. We do not use cookies for advertising or analytics.
        </p>
        <h2 className="mt-10 text-xl font-semibold text-zinc-900 dark:text-white">Hosting</h2>
        <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
          This site is static files. Your host (for example GitHub Pages or Cloudflare Pages) will see standard web
          request logs such as IP address and user agent, which is outside this project’s control. The application
          itself does not collect accounts, emails, or uploaded files.
        </p>
        <h2 className="mt-10 text-xl font-semibold text-zinc-900 dark:text-white">No third-party APIs</h2>
        <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
          There are no paid APIs, no authentication providers, and no external AI services. Fonts are self-hosted with
          the build.
        </p>
      </article>
    </>
  )
}
