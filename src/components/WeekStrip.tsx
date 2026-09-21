import { currentWeekKeys, todayKey, weekdayLabel } from '../lib/dates'

type WeekStripProps = {
  completedDates: string[]
}

export function WeekStrip({ completedDates }: WeekStripProps) {
  const today = todayKey()
  const completed = new Set(completedDates)
  const days = currentWeekKeys(today)

  return (
    <ol className="week-strip" aria-label="This week's completions">
      {days.map((date) => {
        const done = completed.has(date)
        const isToday = date === today
        const isFuture = date > today
        return (
          <li key={date} className="week-day">
            <span className="week-label">{weekdayLabel(date).slice(0, 1)}</span>
            <span
              className={[
                'week-dot',
                done ? 'is-done' : '',
                isToday ? 'is-today' : '',
                isFuture ? 'is-future' : '',
              ].join(' ')}
              aria-label={`${weekdayLabel(date)}${done ? ', completed' : ''}${isToday ? ', today' : ''}`}
            >
              {done ? '✓' : ''}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
