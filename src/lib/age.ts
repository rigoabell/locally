export type AgeResult = {
  years: number
  months: number
  days: number
  totalDays: number
  totalHours: number
  nextBirthday: Date
  daysUntilBirthday: number
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function calculateAge(birth: Date, asOf: Date): AgeResult | null {
  const from = startOfDay(birth)
  const to = startOfDay(asOf)
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || to < from) {
    return null
  }

  let years = to.getFullYear() - from.getFullYear()
  let months = to.getMonth() - from.getMonth()
  let days = to.getDate() - from.getDate()

  if (days < 0) {
    months -= 1
    const previousMonth = new Date(to.getFullYear(), to.getMonth(), 0)
    days += previousMonth.getDate()
  }
  if (months < 0) {
    years -= 1
    months += 12
  }

  const totalDays = Math.round((to.getTime() - from.getTime()) / 86_400_000)
  let nextBirthday = new Date(to.getFullYear(), from.getMonth(), from.getDate())
  if (nextBirthday < to || isSameDay(nextBirthday, to)) {
    if (isSameDay(nextBirthday, to)) {
      // birthday is today
    } else {
      nextBirthday = new Date(to.getFullYear() + 1, from.getMonth(), from.getDate())
    }
  }
  if (from.getMonth() === 1 && from.getDate() === 29 && nextBirthday.getDate() !== 29) {
    nextBirthday = new Date(nextBirthday.getFullYear(), 1, 28)
  }

  const daysUntilBirthday = isSameDay(nextBirthday, to)
    ? 0
    : Math.round((startOfDay(nextBirthday).getTime() - to.getTime()) / 86_400_000)

  return {
    years,
    months,
    days,
    totalDays,
    totalHours: totalDays * 24,
    nextBirthday,
    daysUntilBirthday,
  }
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function toDateInputValue(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
