import { currentWeekKeys, todayKey, weekdayLabel } from '../lib/dates'

type WeekStripProps = {
  completions: Record<string, number>
  dailySets: number
}

export function WeekStrip({ completions, dailySets }: WeekStripProps) {
  const today = todayKey()
  const goal = Math.max(1, dailySets)
  const days = currentWeekKeys(today)

  return (
    <ol className="week-strip" aria-label="This week's completions">
      {days.map((date) => {
        const count = completions[date] ?? 0
        const done = count >= goal
        const partial = count > 0 && !done
        const isToday = date === today
        const isFuture = date > today
        return (
          <li key={date} className="week-day">
            <span className="week-label">{weekdayLabel(date).slice(0, 1)}</span>
            <span
              className={[
                'week-dot',
                done ? 'is-done' : '',
                partial ? 'is-partial' : '',
                isToday ? 'is-today' : '',
                isFuture ? 'is-future' : '',
              ].join(' ')}
              aria-label={`${weekdayLabel(date)}${done ? ', completed' : partial ? `, ${count} of ${goal} sets` : ''}${isToday ? ', today' : ''}`}
            >
              {done ? '✓' : partial ? count : ''}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
