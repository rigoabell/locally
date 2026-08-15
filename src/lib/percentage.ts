export function percentOf(percent: number, value: number): number {
  return (percent / 100) * value
}

export function isWhatPercent(part: number, whole: number): number {
  if (whole === 0) return Number.NaN
  return (part / whole) * 100
}

export function percentageChange(from: number, to: number): number {
  if (from === 0) return Number.NaN
  return ((to - from) / Math.abs(from)) * 100
}
