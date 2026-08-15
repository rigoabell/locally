import { useMemo, useState } from 'react'
import { CopyButton } from '../components/CopyButton'
import { Field, Panel, TextInput } from '../components/ui'
import { isWhatPercent, percentOf, percentageChange } from '../lib/percentage'
import { formatNumber } from '../lib/utils'

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <Field label={label}>
      <TextInput inputMode="decimal" value={value} onChange={(event) => onChange(event.target.value)} />
    </Field>
  )
}

export function PercentageCalculatorTool() {
  const [percent, setPercent] = useState('15')
  const [ofValue, setOfValue] = useState('80')
  const [part, setPart] = useState('25')
  const [whole, setWhole] = useState('200')
  const [from, setFrom] = useState('80')
  const [to, setTo] = useState('100')

  const ofResult = useMemo(() => percentOf(Number(percent), Number(ofValue)), [percent, ofValue])
  const whatResult = useMemo(() => isWhatPercent(Number(part), Number(whole)), [part, whole])
  const changeResult = useMemo(() => percentageChange(Number(from), Number(to)), [from, to])

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Panel>
        <h2 className="text-base font-semibold text-zinc-900 dark:text-white">What is X% of Y?</h2>
        <div className="mt-4 space-y-3">
          <NumberField label="Percent (X)" value={percent} onChange={setPercent} />
          <NumberField label="Value (Y)" value={ofValue} onChange={setOfValue} />
          <p className="text-2xl font-semibold text-zinc-900 dark:text-white">{formatNumber(ofResult)}</p>
          <CopyButton value={String(ofResult)} disabled={!Number.isFinite(ofResult)} />
        </div>
      </Panel>
      <Panel>
        <h2 className="text-base font-semibold text-zinc-900 dark:text-white">X is what percent of Y?</h2>
        <div className="mt-4 space-y-3">
          <NumberField label="Part (X)" value={part} onChange={setPart} />
          <NumberField label="Whole (Y)" value={whole} onChange={setWhole} />
          <p className="text-2xl font-semibold text-zinc-900 dark:text-white">
            {Number.isFinite(whatResult) ? `${formatNumber(whatResult)}%` : '—'}
          </p>
          <CopyButton value={`${whatResult}`} disabled={!Number.isFinite(whatResult)} />
        </div>
      </Panel>
      <Panel>
        <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Percentage change</h2>
        <div className="mt-4 space-y-3">
          <NumberField label="From" value={from} onChange={setFrom} />
          <NumberField label="To" value={to} onChange={setTo} />
          <p className="text-2xl font-semibold text-zinc-900 dark:text-white">
            {Number.isFinite(changeResult) ? `${formatNumber(changeResult)}%` : '—'}
          </p>
          <CopyButton value={`${changeResult}`} disabled={!Number.isFinite(changeResult)} />
        </div>
      </Panel>
    </div>
  )
}
