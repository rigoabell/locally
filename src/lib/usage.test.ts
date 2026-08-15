import { describe, expect, it } from 'vitest'
import {
  countBuildsSince,
  estimatedBandwidth,
  LIMITS,
  meterLevel,
  monthlyFrom14DayViews,
  ratio,
  remainingUntil,
  visitsUntil,
} from './usage'

describe('usage meters', () => {
  it('flags warn and critical thresholds', () => {
    expect(meterLevel(0, LIMITS.bandwidthBytes)).toBe('ok')
    expect(meterLevel(LIMITS.bandwidthBytes * 0.7, LIMITS.bandwidthBytes)).toBe('warn')
    expect(meterLevel(LIMITS.bandwidthBytes * 0.95, LIMITS.bandwidthBytes)).toBe('critical')
  })

  it('estimates bandwidth and remaining visits before the 70% warning', () => {
    const bytesPerVisit = 400_000
    const used = estimatedBandwidth(10_000, bytesPerVisit)
    expect(used).toBe(4_000_000_000)
    expect(ratio(used, LIMITS.bandwidthBytes)).toBeLessThan(0.1)
    expect(visitsUntil(bytesPerVisit, used, LIMITS.bandwidthBytes)).toBeGreaterThan(100_000)
    expect(remainingUntil(9, 10, 1)).toBe(1)
  })

  it('counts recent builds and extrapolates monthly views', () => {
    const now = Date.parse('2026-08-15T12:00:00Z')
    const runs = [
      { created_at: '2026-08-15T11:30:00Z', conclusion: 'success', status: 'completed', html_url: '' },
      { created_at: '2026-08-15T11:10:00Z', conclusion: 'success', status: 'completed', html_url: '' },
      { created_at: '2026-08-15T09:00:00Z', conclusion: 'success', status: 'completed', html_url: '' },
    ]
    expect(countBuildsSince(runs, now - 60 * 60 * 1000)).toBe(2)
    expect(monthlyFrom14DayViews(140)).toBe(300)
  })
})
