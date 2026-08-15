import { useMemo, useState } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { CopyButton } from '../components/CopyButton'
import { Button, Field, Panel, Select, TextInput } from '../components/ui'
import { convertUnit, UNIT_CATEGORIES } from '../lib/units'
import { formatNumber } from '../lib/utils'

export function UnitConverterTool() {
  const [categoryId, setCategoryId] = useState(UNIT_CATEGORIES[0]?.id ?? 'length')
  const category = UNIT_CATEGORIES.find((item) => item.id === categoryId) ?? UNIT_CATEGORIES[0]
  const [from, setFrom] = useState(category?.defaultFrom ?? 'm')
  const [to, setTo] = useState(category?.defaultTo ?? 'ft')
  const [value, setValue] = useState('1')

  const units = category?.units ?? []

  const result = useMemo(() => {
    const numeric = Number(value)
    if (!Number.isFinite(numeric) || !category) return Number.NaN
    try {
      return convertUnit(category.id, numeric, from, to)
    } catch {
      return Number.NaN
    }
  }, [category, from, to, value])

  function changeCategory(nextId: string) {
    const next = UNIT_CATEGORIES.find((item) => item.id === nextId)
    setCategoryId(nextId)
    setFrom(next?.defaultFrom ?? next?.units[0]?.id ?? '')
    setTo(next?.defaultTo ?? next?.units[1]?.id ?? next?.units[0]?.id ?? '')
  }

  function swap() {
    setFrom(to)
    setTo(from)
  }

  return (
    <Panel>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Category">
          <Select value={categoryId} onChange={(event) => changeCategory(event.target.value)}>
            {UNIT_CATEGORIES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Value">
          <TextInput inputMode="decimal" value={value} onChange={(event) => setValue(event.target.value)} />
        </Field>
        <Field label="From">
          <Select value={from} onChange={(event) => setFrom(event.target.value)}>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="To">
          <Select value={to} onChange={(event) => setTo(event.target.value)}>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <p className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">{formatNumber(result)}</p>
        <Button type="button" variant="secondary" onClick={swap}>
          <ArrowLeftRight className="h-4 w-4" />
          Swap
        </Button>
        <CopyButton value={Number.isFinite(result) ? String(result) : ''} disabled={!Number.isFinite(result)} />
      </div>
    </Panel>
  )
}
