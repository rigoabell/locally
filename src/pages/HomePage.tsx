import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Lock, Search, Sparkles, WifiOff } from 'lucide-react'
import { Seo } from '../components/Seo'
import { ToolCard } from '../components/ToolCard'
import { Button } from '../components/ui'
import { pageTitle, PRIVACY_LINE, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from '../lib/site'
import { tools } from '../registry/tools'
import { useState } from 'react'

export function HomePage() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  return (
    <>
      <Seo title={pageTitle('Free browser tools')} description={SITE_DESCRIPTION} path="/" />
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.18),transparent_40%),radial-gradient(circle_at_top_right,rgba(20,184,166,0.16),transparent_35%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-3 py-1 text-xs font-semibold tracking-wide text-violet-700 uppercase dark:border-violet-900 dark:bg-zinc-900/80 dark:text-violet-300">
            <Sparkles className="h-3.5 w-3.5" />
            Free forever · $0 hosting extras
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
            {SITE_TAGLINE}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {SITE_NAME} is a static toolkit that runs in your browser. No backend, no accounts, no paid APIs, and no
            files uploaded anywhere.
          </p>
          <form
            className="relative mt-8 max-w-xl"
            onSubmit={(event) => {
              event.preventDefault()
              navigate(query.trim() ? `/tools?q=${encodeURIComponent(query.trim())}` : '/tools')
            }}
          >
            <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-zinc-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search QR codes, passwords, JSON, images…"
              aria-label="Search tools"
              className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 pr-4 pl-12 text-base shadow-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </form>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/tools">
              <Button>
                Browse all tools
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/privacy">
              <Button variant="secondary">Read the privacy promise</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: WifiOff, title: 'Works offline after load', body: 'Every tool is client-side JavaScript. Once the page is loaded, processing stays on your device.' },
            { icon: Lock, title: PRIVACY_LINE, body: 'Images, passwords, and JSON never hit a server. localStorage is used only for theme preference.' },
            { icon: Sparkles, title: 'Built for $0 operating cost', body: 'Static files only. Deploy on GitHub Pages or Cloudflare Pages for free.' },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <item.icon className="h-5 w-5 text-violet-600 dark:text-violet-300" />
              <h2 className="mt-3 text-base font-semibold text-zinc-900 dark:text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">All {tools.length} tools</h2>
            <p className="mt-1 text-sm text-zinc-500">Each one has its own URL and runs locally.</p>
          </div>
          <Link to="/tools" className="hidden text-sm font-semibold text-violet-700 sm:inline dark:text-violet-300">
            Search directory
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} featured />
          ))}
        </div>
      </section>
    </>
  )
}
