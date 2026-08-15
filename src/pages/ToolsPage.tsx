import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { ToolCard } from '../components/ToolCard'
import { TextInput } from '../components/ui'
import { pageTitle } from '../lib/site'
import { categories, searchTools } from '../registry/tools'

export function ToolsPage() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const matches = useMemo(() => searchTools(query), [query])

  return (
    <>
      <Seo
        title={pageTitle('All tools')}
        description="Search the Locally directory of free, fully client-side tools. QR codes, passwords, JSON, image compression, and more."
        path="/tools"
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">Tool directory</h1>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Search by name, category, or keyword. Every tool has a clean URL and runs in your browser.
        </p>
        <div className="mt-6 max-w-xl">
          <TextInput
            value={query}
            onChange={(event) => {
              const next = event.target.value
              setParams(next ? { q: next } : {}, { replace: true })
            }}
            placeholder="Search tools"
            aria-label="Search tools"
          />
        </div>
        <p className="mt-3 text-sm text-zinc-500">
          {matches.length} tool{matches.length === 1 ? '' : 's'}
        </p>
        {categories.map((category) => {
          const items = matches.filter((tool) => tool.category === category)
          if (items.length === 0) return null
          return (
            <section key={category} className="mt-10">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{category}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          )
        })}
        {matches.length === 0 ? (
          <p className="mt-10 text-sm text-zinc-500">No tools match that search. Try “json”, “image”, or “password”.</p>
        ) : null}
      </div>
    </>
  )
}
