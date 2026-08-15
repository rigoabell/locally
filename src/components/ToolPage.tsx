import { Link } from 'react-router-dom'
import { relatedTools, type ToolDefinition } from '../registry/tools'
import { PrivacyBanner } from './PrivacyBanner'
import { Seo } from './Seo'
import { ToolCard } from './ToolCard'
import { pageTitle } from '../lib/site'

export function ToolPage({ tool }: { tool: ToolDefinition }) {
  const related = relatedTools(tool.slug)
  const Icon = tool.icon
  const ToolComponent = tool.component

  return (
    <>
      <Seo title={pageTitle(tool.name)} description={tool.longDescription} path={`/tools/${tool.slug}`} />
      <article className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-zinc-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="hover:text-violet-700 dark:hover:text-violet-300">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/tools" className="hover:text-violet-700 dark:hover:text-violet-300">
                Tools
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-zinc-800 dark:text-zinc-200">{tool.name}</li>
          </ol>
        </nav>

        <header className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                <Icon className="h-6 w-6" />
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700 dark:text-violet-300">
                {tool.category}
              </p>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              {tool.name}
            </h1>
            <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-400">{tool.longDescription}</p>
          </div>
          <PrivacyBanner />
        </header>

        <div className="mt-8">
          <ToolComponent />
        </div>

        <section className="mt-14">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Related tools</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {related.map((item) => (
              <ToolCard key={item.slug} tool={item} />
            ))}
          </div>
        </section>
      </article>
    </>
  )
}
