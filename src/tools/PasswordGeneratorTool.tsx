import { useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { CopyButton } from '../components/CopyButton'
import { Button, Field, Panel, TextInput, Toggle } from '../components/ui'
import { generatePassword, passwordStrength, type PasswordOptions } from '../lib/password'
import { cn } from '../lib/utils'

const initial: PasswordOptions = {
  length: 20,
  lowercase: true,
  uppercase: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: true,
}

export function PasswordGeneratorTool() {
  const [options, setOptions] = useState<PasswordOptions>(initial)
  const [password, setPassword] = useState(() => generatePassword(initial))
  const [error, setError] = useState('')
  const strength = useMemo(() => passwordStrength(password), [password])

  function regenerate(next = options) {
    try {
      setPassword(generatePassword(next))
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate a password.')
    }
  }

  function update<K extends keyof PasswordOptions>(key: K, value: PasswordOptions[K]) {
    const next = { ...options, [key]: value }
    setOptions(next)
    if (key === 'length') regenerate(next)
  }

  return (
    <Panel>
      <div className="space-y-5">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="font-mono text-lg break-all text-zinc-900 dark:text-white">{password}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="h-2 w-40 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div
                className={cn(
                  'h-full rounded-full',
                  strength.score <= 1 && 'bg-red-500',
                  strength.score === 2 && 'bg-amber-500',
                  strength.score === 3 && 'bg-lime-500',
                  strength.score >= 4 && 'bg-emerald-500',
                )}
                style={{ width: `${(strength.score + 1) * 20}%` }}
              />
            </div>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">{strength.label}</span>
          </div>
        </div>
        <Field label={`Length: ${options.length}`}>
          <input
            type="range"
            min={8}
            max={64}
            value={options.length}
            onChange={(event) => update('length', Number(event.target.value))}
            className="w-full accent-violet-600"
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle checked={options.lowercase} onChange={(value) => update('lowercase', value)} label="Lowercase" />
          <Toggle checked={options.uppercase} onChange={(value) => update('uppercase', value)} label="Uppercase" />
          <Toggle checked={options.numbers} onChange={(value) => update('numbers', value)} label="Numbers" />
          <Toggle checked={options.symbols} onChange={(value) => update('symbols', value)} label="Symbols" />
          <Toggle
            checked={options.excludeAmbiguous}
            onChange={(value) => update('excludeAmbiguous', value)}
            label="Exclude look-alikes (0, O, l, 1)"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => regenerate()}>
            <RefreshCw className="h-4 w-4" />
            Generate
          </Button>
          <CopyButton value={password} />
        </div>
        {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
        <Field label="Custom length">
          <TextInput
            type="number"
            min={4}
            max={128}
            value={options.length}
            onChange={(event) => update('length', Number(event.target.value))}
          />
        </Field>
      </div>
    </Panel>
  )
}
