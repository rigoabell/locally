import { Link } from 'react-router-dom'
import type { ToolDefinition } from '../registry/tools'
import { cn } from '../lib/utils'

export function ToolCard({ tool, featured = false }: { tool: ToolDefinition; featured?: boolean }) {
  const Icon = tool.icon
  return (
    <Link
      to={`/tools/${tool.slug}`}
      className={cn(
        'group flex flex-col rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-700',
        featured && 'sm:p-6',
      )}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
        <Icon className="h-5 w-5" />
      </span>
      <h2 className="mt-4 text-base font-semibold text-zinc-900 group-hover:text-violet-700 dark:text-white dark:group-hover:text-violet-300">
        {tool.name}
      </h2>
      <p className="mt-1.5 flex-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{tool.description}</p>
      <span className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-400">{tool.category}</span>
    </Link>
  )
}
