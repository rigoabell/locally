import { useState } from 'react'
import { CopyButton } from '../components/CopyButton'
import { Button, Field, Panel, TextInput, Toggle } from '../components/ui'
import { randomNumbers } from '../lib/random'

export function RandomNumberTool() {
  const [min, setMin] = useState('1')
  const [max, setMax] = useState('100')
  const [count, setCount] = useState('1')
  const [decimals, setDecimals] = useState('0')
  const [unique, setUnique] = useState(false)
  const [values, setValues] = useState<number[]>([])
  const [error, setError] = useState('')

  function generate() {
    try {
      const next = randomNumbers({
        min: Number(min),
        max: Number(max),
        count: Number(count),
        decimals: Number(decimals),
        unique,
      })
      setValues(next)
      setError('')
    } catch (err) {
      setValues([])
      setError(err instanceof Error ? err.message : 'Could not generate numbers.')
    }
  }

  const output = values.join('\n')

  return (
    <Panel>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Minimum">
          <TextInput inputMode="decimal" value={min} onChange={(event) => setMin(event.target.value)} />
        </Field>
        <Field label="Maximum">
          <TextInput inputMode="decimal" value={max} onChange={(event) => setMax(event.target.value)} />
        </Field>
        <Field label="How many">
          <TextInput type="number" min={1} max={500} value={count} onChange={(event) => setCount(event.target.value)} />
        </Field>
        <Field label="Decimal places">
          <TextInput type="number" min={0} max={10} value={decimals} onChange={(event) => setDecimals(event.target.value)} />
        </Field>
      </div>
      <div className="mt-4 max-w-sm">
        <Toggle checked={unique} onChange={setUnique} label="Unique numbers only" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" onClick={generate}>
          Generate
        </Button>
        <CopyButton value={output} disabled={values.length === 0} />
      </div>
      {error ? <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      {values.length > 0 ? (
        <pre className="mt-4 overflow-auto rounded-2xl bg-zinc-50 p-4 font-mono text-sm dark:bg-zinc-950">{output}</pre>
      ) : null}
    </Panel>
  )
}
