import { useMemo, useState } from 'react'
import { CopyButton } from '../components/CopyButton'
import { Button, Field, Panel, Select, TextArea } from '../components/ui'
import { processJson } from '../lib/json'

export function JsonFormatterTool() {
  const [input, setInput] = useState('{\n  "hello": "world"\n}')
  const [indent, setIndent] = useState(2)
  const [mode, setMode] = useState<'formatted' | 'minified'>('formatted')
  const result = useMemo(() => processJson(input, indent), [input, indent])
  const output = result.ok ? (mode === 'formatted' ? result.formatted : result.minified) : ''

  return (
    <Panel>
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Input">
          <TextArea value={input} onChange={(event) => setInput(event.target.value)} rows={16} />
        </Field>
        <Field label="Output">
          <TextArea value={result.ok ? output : result.error} readOnly rows={16} />
        </Field>
      </div>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <Field label="Indent">
          <Select value={indent} onChange={(event) => setIndent(Number(event.target.value))}>
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
          </Select>
        </Field>
        <Button type="button" variant={mode === 'formatted' ? 'primary' : 'secondary'} onClick={() => setMode('formatted')}>
          Pretty print
        </Button>
        <Button type="button" variant={mode === 'minified' ? 'primary' : 'secondary'} onClick={() => setMode('minified')}>
          Minify
        </Button>
        <CopyButton value={output} disabled={!result.ok} />
      </div>
      <p className={`mt-3 text-sm ${result.ok ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
        {result.ok ? 'Valid JSON.' : result.error}
      </p>
    </Panel>
  )
}
