import { useState, type FormEvent } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Menu, Moon, Search, Sun, X } from 'lucide-react'
import { SITE_NAME } from '../lib/site'
import { searchTools } from '../registry/tools'
import { useTheme } from '../hooks/useTheme'
import { cn } from '../lib/utils'

const links = [
  { to: '/tools', label: 'Tools' },
  { to: '/about', label: 'About' },
  { to: '/usage', label: 'Usage' },
  { to: '/privacy', label: 'Privacy' },
]

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const results = query.trim() ? searchTools(query).slice(0, 6) : []

  function onSearch(event: FormEvent) {
    event.preventDefault()
    const next = query.trim()
    setOpen(false)
    if (next) navigate(`/tools?q=${encodeURIComponent(next)}`)
    else navigate('/tools')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-teal-500 text-sm font-bold text-white">
            L
          </span>
          <span className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white">{SITE_NAME}</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'rounded-xl px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white',
                  isActive && location.pathname === link.to && 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={onSearch} className="relative ml-auto hidden min-w-0 flex-1 max-w-md md:block">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tools"
            aria-label="Search tools"
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 py-2 pr-3 pl-9 text-sm outline-none focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
          {results.length > 0 ? (
            <ul className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
              {results.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    to={`/tools/${tool.slug}`}
                    onClick={() => setQuery('')}
                    className="block px-3 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    <span className="font-medium text-zinc-900 dark:text-white">{tool.name}</span>
                    <span className="ml-2 text-zinc-500">{tool.category}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </form>

        <button
          type="button"
          onClick={toggleTheme}
          className="ml-auto rounded-xl p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 md:ml-2"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <button
          type="button"
          className="rounded-xl p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-zinc-200 px-4 py-4 md:hidden dark:border-zinc-800">
          <form onSubmit={onSearch} className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tools"
              aria-label="Search tools"
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 py-2.5 pr-3 pl-9 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900"
            />
          </form>
          <nav className="mt-3 grid gap-1" aria-label="Mobile">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
