import { Link } from 'react-router-dom'
import { PRIVACY_LINE, SITE_NAME, SITE_TAGLINE } from '../lib/site'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">{SITE_NAME}</p>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{SITE_TAGLINE}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">Site</p>
          <ul className="mt-2 space-y-2 text-sm">
            <li>
              <Link to="/tools" className="text-zinc-600 hover:text-violet-700 dark:text-zinc-400 dark:hover:text-violet-300">
                Tool directory
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-zinc-600 hover:text-violet-700 dark:text-zinc-400 dark:hover:text-violet-300">
                About
              </Link>
            </li>
            <li>
              <Link to="/usage" className="text-zinc-600 hover:text-violet-700 dark:text-zinc-400 dark:hover:text-violet-300">
                Usage
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-zinc-600 hover:text-violet-700 dark:text-zinc-400 dark:hover:text-violet-300">
                Privacy
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">Privacy</p>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{PRIVACY_LINE}</p>
        </div>
      </div>
      <div className="border-t border-zinc-200 py-4 text-center text-xs text-zinc-500 dark:border-zinc-800">
        Free to use. No accounts. No tracking pixels. Static hosting only.
      </div>
    </footer>
  )
}
