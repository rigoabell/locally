import { useMemo, useState } from 'react'
import { CopyButton } from '../components/CopyButton'
import { Button, Panel, TextArea } from '../components/ui'
import { CASE_MODES } from '../lib/caseConvert'

export function CaseConverterTool() {
  const [text, setText] = useState('')
  const [mode, setMode] = useState<(typeof CASE_MODES)[number]['id']>('title')
  const output = useMemo(() => {
    const selected = CASE_MODES.find((item) => item.id === mode) ?? CASE_MODES[0]
    return selected.convert(text)
  }, [mode, text])

  return (
    <Panel>
      <div className="grid gap-4 lg:grid-cols-2">
        <TextArea value={text} onChange={(event) => setText(event.target.value)} placeholder="Type text to convert" rows={10} />
        <TextArea value={output} readOnly rows={10} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {CASE_MODES.map((item) => (
          <Button
            key={item.id}
            type="button"
            variant={mode === item.id ? 'primary' : 'secondary'}
            onClick={() => setMode(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <CopyButton value={output} disabled={!output} />
        <Button type="button" variant="ghost" onClick={() => setText('')}>
          Clear
        </Button>
      </div>
    </Panel>
  )
}
