export type RandomOptions = {
  min: number
  max: number
  count: number
  unique: boolean
  decimals: number
}

export function randomNumbers(options: RandomOptions): number[] {
  const decimals = Math.min(10, Math.max(0, Math.floor(options.decimals)))
  const count = Math.min(500, Math.max(1, Math.floor(options.count)))
  const min = options.min
  const max = options.max
  if (!Number.isFinite(min) || !Number.isFinite(max) || min > max) {
    throw new Error('Minimum must be less than or equal to maximum.')
  }

  const factor = 10 ** decimals
  const minInt = Math.round(min * factor)
  const maxInt = Math.round(max * factor)
  const span = maxInt - minInt + 1
  if (span <= 0) throw new Error('Invalid range.')
  if (options.unique && count > span) {
    throw new Error('Not enough unique values in this range.')
  }

  const buffer = new Uint32Array(1)
  const pick = (range: number) => {
    const limit = Math.floor(0x100000000 / range) * range
    let value = 0
    do {
      crypto.getRandomValues(buffer)
      value = buffer[0] ?? 0
    } while (value >= limit)
    return value % range
  }

  if (!options.unique) {
    return Array.from({ length: count }, () => (minInt + pick(span)) / factor)
  }

  const values = new Set<number>()
  while (values.size < count) {
    values.add((minInt + pick(span)) / factor)
  }
  return [...values]
}
