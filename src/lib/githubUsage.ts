import {
  countBuildsSince,
  GITHUB_REPO_SLUG,
  type GitHubPagesInfo,
  type GitHubWorkflowRun,
  type LiveUsage,
  type UsageManifest,
} from './usage'

const TOKEN_KEY = 'locally.githubToken'
const VISITS_KEY = 'locally.monthlyVisits'

type WorkflowRunsResponse = { workflow_runs?: GitHubWorkflowRun[] }
type PagesResponse = { status?: string; html_url?: string }
type TrafficResponse = { count?: number; uniques?: number }

async function githubJson<T>(path: string, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`https://api.github.com${path}`, { headers })
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} (${path})`)
  }
  return (await response.json()) as T
}

export async function loadManifest(): Promise<UsageManifest | null> {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}usage.json`, { cache: 'no-store' })
    if (!response.ok) return null
    return (await response.json()) as UsageManifest
  } catch {
    return null
  }
}

export async function loadLiveUsage(token?: string): Promise<LiveUsage> {
  const hourAgo = Date.now() - 60 * 60 * 1000
  const [pagesResult, runsResult, trafficResult] = await Promise.allSettled([
    githubJson<PagesResponse>(`/repos/${GITHUB_REPO_SLUG}/pages`, token),
    githubJson<WorkflowRunsResponse>(
      `/repos/${GITHUB_REPO_SLUG}/actions/workflows/pages.yml/runs?per_page=30`,
      token,
    ),
    token
      ? githubJson<TrafficResponse>(`/repos/${GITHUB_REPO_SLUG}/traffic/views`, token)
      : Promise.resolve(null),
  ])

  const pages: GitHubPagesInfo | null =
    pagesResult.status === 'fulfilled'
      ? { status: pagesResult.value.status ?? 'unknown', htmlUrl: pagesResult.value.html_url ?? null }
      : null

  const runs = runsResult.status === 'fulfilled' ? (runsResult.value.workflow_runs ?? []) : []
  const traffic = trafficResult.status === 'fulfilled' ? trafficResult.value : null

  return {
    pages,
    latestRun: runs[0] ?? null,
    buildsLastHour: countBuildsSince(runs, hourAgo),
    views14d: traffic && typeof traffic.count === 'number' ? traffic.count : null,
    uniqueViews14d: traffic && typeof traffic.uniques === 'number' ? traffic.uniques : null,
  }
}

export function measuredTransferBytes(): number {
  if (typeof performance === 'undefined' || typeof performance.getEntriesByType !== 'function') return 0
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  const navigation = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
  const resourceTotal = resources.reduce((sum, entry) => sum + (entry.transferSize || 0), 0)
  const navigationTotal = navigation[0]?.transferSize ?? 0
  return resourceTotal + navigationTotal
}

export function readStoredToken(): string {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? ''
  } catch {
    return ''
  }
}

export function writeStoredToken(token: string): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // ignore
  }
}

export function readStoredVisits(): string {
  try {
    return localStorage.getItem(VISITS_KEY) ?? ''
  } catch {
    return ''
  }
}

export function writeStoredVisits(value: string): void {
  try {
    if (value) localStorage.setItem(VISITS_KEY, value)
    else localStorage.removeItem(VISITS_KEY)
  } catch {
    // ignore
  }
}

export function githubErrorMessage(error: unknown): string {
  const text = error instanceof Error ? error.message : 'GitHub request failed'
  if (text.startsWith('403') || text.startsWith('401')) {
    return 'GitHub blocked that request. Repo traffic needs a personal access token with public_repo access.'
  }
  if (text.startsWith('404')) {
    return 'GitHub Pages or the workflow was not found. Confirm Pages is enabled for this repository.'
  }
  return text
}
