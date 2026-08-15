import { useEffect, useMemo, useState } from 'react'
import { Activity, AlertTriangle, RefreshCw } from 'lucide-react'
import { Seo } from '../components/Seo'
import { Button, Field, Panel, TextInput } from '../components/ui'
import {
  githubErrorMessage,
  loadLiveUsage,
  loadManifest,
  measuredTransferBytes,
  readStoredToken,
  readStoredVisits,
  writeStoredToken,
  writeStoredVisits,
} from '../lib/githubUsage'
import { pageTitle } from '../lib/site'
import {
  estimatedBandwidth,
  GITHUB_REPO_SLUG,
  LIMITS,
  meterLevel,
  monthlyFrom14DayViews,
  ratio,
  type LiveUsage,
  type MeterLevel,
  type UsageManifest,
  visitsUntil,
} from '../lib/usage'
import { cn, formatBytes } from '../lib/utils'

const levelStyles: Record<MeterLevel, string> = {
  ok: 'bg-emerald-500',
  warn: 'bg-amber-500',
  critical: 'bg-red-500',
}

const levelLabels: Record<MeterLevel, string> = {
  ok: 'Healthy',
  warn: 'Approaching limit',
  critical: 'Near / over limit',
}

function Meter({
  label,
  usedLabel,
  maxLabel,
  used,
  max,
  hint,
}: {
  label: string
  usedLabel: string
  maxLabel: string
  used: number
  max: number
  hint?: string
}) {
  const level = meterLevel(used, max)
  const percent = Math.round(ratio(used, max) * 1000) / 10
  return (
    <Panel>
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-white">{label}</h2>
        <span
          className={cn(
            'rounded-full px-2.5 py-0.5 text-xs font-semibold',
            level === 'ok' && 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
            level === 'warn' && 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
            level === 'critical' && 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300',
          )}
        >
          {levelLabels[level]}
        </span>
      </div>
      <p className="mt-3 font-mono text-2xl font-semibold text-zinc-900 dark:text-white">
        {usedLabel}
        <span className="text-base font-medium text-zinc-500"> / {maxLabel}</span>
      </p>
      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div className={cn('h-full rounded-full', levelStyles[level])} style={{ width: `${Math.min(100, percent)}%` }} />
      </div>
      <p className="mt-2 text-xs text-zinc-500">{percent}% of GitHub’s published soft limit</p>
      {hint ? <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{hint}</p> : null}
    </Panel>
  )
}

export function UsagePage() {
  const [manifest, setManifest] = useState<UsageManifest | null>(null)
  const [live, setLive] = useState<LiveUsage | null>(null)
  const [token, setToken] = useState(readStoredToken)
  const [visits, setVisits] = useState(readStoredVisits)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [checkedAt, setCheckedAt] = useState<string>('')
  const [transferBytes, setTransferBytes] = useState(0)

  useEffect(() => {
    void loadManifest().then(setManifest)
    setTransferBytes(measuredTransferBytes())
  }, [])

  const bytesPerVisit = transferBytes || manifest?.distBytes || 400_000
  const visitCount = Number(visits)
  const bandwidthUsed = estimatedBandwidth(Number.isFinite(visitCount) ? visitCount : 0, bytesPerVisit)
  const bandwidthLevel = meterLevel(bandwidthUsed, LIMITS.bandwidthBytes)
  const buildsUsed = live?.buildsLastHour ?? 0
  const siteUsed = manifest?.distBytes ?? 0

  const headroomVisits = useMemo(
    () => visitsUntil(bytesPerVisit, bandwidthUsed, LIMITS.bandwidthBytes),
    [bandwidthUsed, bytesPerVisit],
  )

  async function refresh() {
    setBusy(true)
    setError('')
    writeStoredToken(token.trim())
    writeStoredVisits(visits.trim())
    try {
      const next = await loadLiveUsage(token.trim() || undefined)
      setLive(next)
      setCheckedAt(new Date().toLocaleString())
      if (next.views14d !== null && !visits.trim()) {
        const estimate = String(monthlyFrom14DayViews(next.views14d))
        setVisits(estimate)
        writeStoredVisits(estimate)
      }
    } catch (err) {
      setError(githubErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Seo
        title={pageTitle('Usage')}
        description="Track Locally against GitHub Pages free-tier limits: bandwidth, build rate, and published site size."
        path="/usage"
      />
      <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-violet-700 uppercase dark:text-violet-300">
          <Activity className="h-4 w-4" />
          Operator meters
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          Usage vs limits
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          GitHub Pages is free for this public site, with soft caps. This page does not track visitors. It estimates
          headroom from published GitHub limits, this build’s size, and (optionally) live GitHub data requested from{' '}
          <em>your</em> browser.
        </p>

        {bandwidthLevel !== 'ok' || meterLevel(buildsUsed, LIMITS.buildsPerHour) !== 'ok' ? (
          <p className="mt-5 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            A meter is at or above 70% of its cap. Slow down deploys or expect GitHub to throttle Pages if bandwidth
            stays this high.
          </p>
        ) : null}

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <Meter
            label="Estimated monthly bandwidth"
            usedLabel={formatBytes(bandwidthUsed)}
            maxLabel="100 GB"
            used={bandwidthUsed}
            max={LIMITS.bandwidthBytes}
            hint={
              visitCount > 0
                ? `About ${headroomVisits.toLocaleString()} more visits this month before the 70% warning.`
                : 'Enter monthly visits below, then refresh. GitHub does not publish a live Pages bandwidth counter.'
            }
          />
          <Meter
            label="Pages builds this hour"
            usedLabel={String(buildsUsed)}
            maxLabel="10"
            used={buildsUsed}
            max={LIMITS.buildsPerHour}
            hint="GitHub’s soft limit is 10 Pages builds per hour. Click Refresh live data to count recent workflow runs."
          />
          <Meter
            label="Published site size"
            usedLabel={siteUsed ? formatBytes(siteUsed) : '—'}
            maxLabel="1 GB"
            used={siteUsed}
            max={LIMITS.siteBytes}
            hint={
              manifest
                ? `${manifest.fileCount} files in the last production build (${new Date(manifest.generatedAt).toLocaleString()}).`
                : 'Load a production build to see exact dist size.'
            }
          />
        </div>

        <Panel className="mt-6">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Inputs</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field
              label="Estimated visits this month"
              hint="Type a number, or refresh with a GitHub token to prefill from 14-day repo traffic (repo views, not a perfect Pages count)."
            >
              <TextInput
                inputMode="numeric"
                value={visits}
                onChange={(event) => setVisits(event.target.value)}
                placeholder="e.g. 50000"
              />
            </Field>
            <Field
              label="GitHub token (optional, stays in this browser)"
              hint="classic token with public_repo. Used only from this device to call api.github.com. Never uploaded to Locally."
            >
              <TextInput
                type="password"
                autoComplete="off"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                placeholder="ghp_…"
              />
            </Field>
          </div>
          <p className="mt-3 text-sm text-zinc-500">
            Bytes counted for this page load: {transferBytes ? formatBytes(transferBytes) : 'measuring…'}. Bandwidth
            math uses {formatBytes(bytesPerVisit)} per visit (this load, or the build size if measurement is empty).
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button type="button" onClick={() => void refresh()} disabled={busy}>
              <RefreshCw className={cn('h-4 w-4', busy && 'animate-spin')} />
              {busy ? 'Checking GitHub…' : 'Refresh live data'}
            </Button>
            {checkedAt ? <span className="text-xs text-zinc-500">Last check {checkedAt}</span> : null}
          </div>
          {error ? <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
        </Panel>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Panel>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Live GitHub status</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Pages</dt>
                <dd className="font-medium text-zinc-900 dark:text-white">{live?.pages?.status ?? 'Refresh to load'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Latest deploy</dt>
                <dd className="font-medium text-zinc-900 dark:text-white">
                  {live?.latestRun ? live.latestRun.conclusion ?? live.latestRun.status : 'Refresh to load'}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Repo traffic (14 days)</dt>
                <dd className="font-medium text-zinc-900 dark:text-white">
                  {live?.views14d === null
                    ? 'Token required'
                    : live?.views14d !== undefined
                      ? `${live.views14d.toLocaleString()} views`
                      : 'Refresh to load'}
                </dd>
              </div>
            </dl>
            {live?.latestRun?.html_url ? (
              <a
                className="mt-4 inline-block text-sm font-semibold text-violet-700 dark:text-violet-300"
                href={live.latestRun.html_url}
                target="_blank"
                rel="noreferrer"
              >
                Open latest workflow run
              </a>
            ) : null}
          </Panel>
          <Panel>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">What GitHub actually caps</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              <li>100 GB of Pages bandwidth per month (soft). GitHub may also email you if you get close.</li>
              <li>10 Pages builds per hour (soft).</li>
              <li>About 1 GB published site size (this site is far under).</li>
              <li>Public-repo GitHub Actions minutes are free, so they are not metered here.</li>
            </ul>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              Account billing overview:{' '}
              <a
                className="font-semibold text-violet-700 dark:text-violet-300"
                href="https://github.com/settings/billing"
                target="_blank"
                rel="noreferrer"
              >
                github.com/settings/billing
              </a>
              . Repo:{' '}
              <a
                className="font-semibold text-violet-700 dark:text-violet-300"
                href={`https://github.com/${GITHUB_REPO_SLUG}`}
                target="_blank"
                rel="noreferrer"
              >
                {GITHUB_REPO_SLUG}
              </a>
              .
            </p>
          </Panel>
        </div>
      </article>
    </>
  )
}
