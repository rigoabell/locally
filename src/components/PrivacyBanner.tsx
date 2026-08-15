import { ShieldCheck } from 'lucide-react'
import { PRIVACY_LINE } from '../lib/site'

export function PrivacyBanner({ compact = false }: { compact?: boolean }) {
  return (
    <p
      className={
        compact
          ? 'inline-flex items-center gap-2 text-xs text-teal-800 dark:text-teal-300'
          : 'inline-flex items-start gap-2 rounded-2xl border border-teal-200 bg-teal-50 px-3.5 py-2.5 text-sm text-teal-900 dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-200'
      }
    >
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{PRIVACY_LINE}</span>
    </p>
  )
}
