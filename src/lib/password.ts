const AMBIGUOUS = new Set(['I', 'l', '1', 'O', '0', 'o'])

const SETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>?',
} as const

export type PasswordOptions = {
  length: number
  lowercase: boolean
  uppercase: boolean
  numbers: boolean
  symbols: boolean
  excludeAmbiguous: boolean
}

function randomIndex(max: number): number {
  if (max <= 0) return 0
  const limit = Math.floor(0x100000000 / max) * max
  const buffer = new Uint32Array(1)
  let value = 0
  do {
    crypto.getRandomValues(buffer)
    value = buffer[0] ?? 0
  } while (value >= limit)
  return value % max
}

function shuffle(chars: string[]): string[] {
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = randomIndex(i + 1)
    const current = chars[i]
    const swap = chars[j]
    if (current === undefined || swap === undefined) continue
    chars[i] = swap
    chars[j] = current
  }
  return chars
}

export function buildCharset(options: PasswordOptions): string {
  let charset = ''
  if (options.lowercase) charset += SETS.lowercase
  if (options.uppercase) charset += SETS.uppercase
  if (options.numbers) charset += SETS.numbers
  if (options.symbols) charset += SETS.symbols
  if (options.excludeAmbiguous) {
    charset = [...charset].filter((char) => !AMBIGUOUS.has(char)).join('')
  }
  return charset
}

export function generatePassword(options: PasswordOptions): string {
  const length = Math.min(128, Math.max(4, Math.floor(options.length)))
  const pools: string[] = []
  if (options.lowercase) pools.push(filterSet(SETS.lowercase, options.excludeAmbiguous))
  if (options.uppercase) pools.push(filterSet(SETS.uppercase, options.excludeAmbiguous))
  if (options.numbers) pools.push(filterSet(SETS.numbers, options.excludeAmbiguous))
  if (options.symbols) pools.push(filterSet(SETS.symbols, options.excludeAmbiguous))

  const charset = pools.join('')
  if (!charset) {
    throw new Error('Select at least one character type.')
  }

  const chars: string[] = []
  for (const pool of pools) {
    if (pool.length > 0 && chars.length < length) {
      chars.push(pool[randomIndex(pool.length)] ?? '')
    }
  }
  while (chars.length < length) {
    chars.push(charset[randomIndex(charset.length)] ?? '')
  }
  return shuffle(chars).join('')
}

function filterSet(set: string, excludeAmbiguous: boolean): string {
  if (!excludeAmbiguous) return set
  return [...set].filter((char) => !AMBIGUOUS.has(char)).join('')
}

export function passwordStrength(password: string): {
  score: number
  label: string
} {
  let score = 0
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (password.length >= 16) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  const capped = Math.min(4, Math.floor((score / 6) * 4))
  const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Excellent']
  return { score: capped, label: labels[capped] ?? 'Weak' }
}
