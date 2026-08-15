import { useMemo, useState } from 'react'
import { CopyButton } from '../components/CopyButton'
import { Field, Panel, Stat, TextInput } from '../components/ui'
import { calculateAge, toDateInputValue } from '../lib/age'

function plural(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? '' : 's'}`
}

export function AgeCalculatorTool() {
  const today = toDateInputValue(new Date())
  const [birth, setBirth] = useState('1998-06-15')
  const [asOf, setAsOf] = useState(today)
  const result = useMemo(() => {
    const birthDate = new Date(`${birth}T00:00:00`)
    const asOfDate = new Date(`${asOf}T00:00:00`)
    return calculateAge(birthDate, asOfDate)
  }, [birth, asOf])

  return (
    <Panel>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Date of birth">
          <TextInput type="date" value={birth} max={today} onChange={(event) => setBirth(event.target.value)} />
        </Field>
        <Field label="Age as of">
          <TextInput type="date" value={asOf} onChange={(event) => setAsOf(event.target.value)} />
        </Field>
      </div>
      {result ? (
        <div className="mt-6 space-y-4">
          <p className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            {plural(result.years, 'year')}, {plural(result.months, 'month')}, {plural(result.days, 'day')}
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Total days" value={result.totalDays.toLocaleString()} />
            <Stat label="Total hours" value={result.totalHours.toLocaleString()} />
            <Stat
              label="Next birthday"
              value={result.daysUntilBirthday === 0 ? 'Today' : `${result.daysUntilBirthday} days`}
            />
          </div>
          <CopyButton value={`${plural(result.years, 'year')}, ${plural(result.months, 'month')}, ${plural(result.days, 'day')}`} />
        </div>
      ) : (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">Choose a birth date on or before the as-of date.</p>
      )}
    </Panel>
  )
}
