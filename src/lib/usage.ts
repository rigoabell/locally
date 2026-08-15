export const GITHUB_OWNER = 'rigoabell'
export const GITHUB_REPO = 'locally'
export const GITHUB_REPO_SLUG = `${GITHUB_OWNER}/${GITHUB_REPO}`

export const LIMITS = {
  bandwidthBytes: 100 * 1024 * 1024 * 1024,
  buildsPerHour: 10,
  siteBytes: 1024 * 1024 * 1024,
  warnAt: 0.7,
  criticalAt: 0.9,
} as const

export type MeterLevel = 'ok' | 'warn' | 'critical'

export type UsageManifest = {
  generatedAt: string
  distBytes: number
  fileCount: number
}

export type GitHubPagesInfo = {
  status: string
  htmlUrl: string | null
}

export type GitHubWorkflowRun = {
  created_at: string
  conclusion: string | null
  status: string
  html_url: string
  display_title?: string
}

export type LiveUsage = {
  pages: GitHubPagesInfo | null
  latestRun: GitHubWorkflowRun | null
  buildsLastHour: number
  views14d: number | null
  uniqueViews14d: number | null
}

export function ratio(used: number, max: number): number {
  if (max <= 0) return 0
  return Math.min(1, Math.max(0, used / max))
}

export function meterLevel(used: number, max: number): MeterLevel {
  const value = ratio(used, max)
  if (value >= LIMITS.criticalAt) return 'critical'
  if (value >= LIMITS.warnAt) return 'warn'
  return 'ok'
}

export function remainingUntil(used: number, max: number, at: number = LIMITS.warnAt): number {
  return Math.max(0, max * at - used)
}

export function estimatedBandwidth(visits: number, bytesPerVisit: number): number {
  if (!Number.isFinite(visits) || visits < 0 || !Number.isFinite(bytesPerVisit) || bytesPerVisit < 0) {
    return 0
  }
  return visits * bytesPerVisit
}

export function visitsUntil(bytesPerVisit: number, usedBytes: number, maxBytes: number, at: number = LIMITS.warnAt): number {
  if (bytesPerVisit <= 0) return 0
  return Math.floor(remainingUntil(usedBytes, maxBytes, at) / bytesPerVisit)
}

export function countBuildsSince(runs: GitHubWorkflowRun[], sinceMs: number): number {
  return runs.filter((run) => Date.parse(run.created_at) >= sinceMs).length
}

export function monthlyFrom14DayViews(views14d: number): number {
  return Math.round((views14d / 14) * 30)
}
