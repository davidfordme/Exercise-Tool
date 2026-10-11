const MAX_CREDIT_WINDOW_MS = 24 * 60 * 60 * 1000

export function todayKey(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function addDays(key: string, amount: number): string {
  const date = parseKey(key)
  date.setDate(date.getDate() + amount)
  return todayKey(date)
}

export function weekdayLabel(key: string): string {
  return parseKey(key).toLocaleDateString(undefined, { weekday: 'short' })
}

export function currentWeekKeys(today = todayKey()): string[] {
  const date = parseKey(today)
  const weekday = date.getDay()
  const mondayOffset = weekday === 0 ? -6 : 1 - weekday
  const monday = new Date(date)
  monday.setDate(date.getDate() + mondayOffset)
  return Array.from({ length: 7 }, (_, index) =>
    todayKey(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index)),
  )
}

export function creditDateKey(startedAt: string, completedAt = new Date()): string {
  const start = new Date(startedAt)
  if (Number.isNaN(start.getTime())) return todayKey(completedAt)

  const elapsed = completedAt.getTime() - start.getTime()
  if (elapsed >= 0 && elapsed <= MAX_CREDIT_WINDOW_MS) {
    return todayKey(start)
  }
  return todayKey(completedAt)
}

export function datesMeetingGoal(
  completions: Record<string, number>,
  dailySets: number,
): string[] {
  const goal = Math.max(1, dailySets)
  return Object.keys(completions)
    .filter((date) => (completions[date] ?? 0) >= goal)
    .sort()
}

export function computeStreak(dates: string[], today = todayKey()): number {
  const completed = new Set(dates)
  let cursor = completed.has(today) ? today : addDays(today, -1)
  if (!completed.has(cursor)) return 0

  let streak = 0
  while (completed.has(cursor)) {
    streak += 1
    cursor = addDays(cursor, -1)
  }
  return streak
}

export function longestStreak(dates: string[]): number {
  const sorted = [...new Set(dates)].sort()
  if (sorted.length === 0) return 0

  let best = 1
  let current = 1
  for (let index = 1; index < sorted.length; index += 1) {
    if (sorted[index] === addDays(sorted[index - 1], 1)) {
      current += 1
      best = Math.max(best, current)
    } else {
      current = 1
    }
  }
  return best
}

export function formatTarget(
  kind: 'reps' | 'duration',
  target: number,
  sides?: boolean,
): string {
  if (kind === 'reps') {
    return `${target} ${target === 1 ? 'rep' : 'reps'}`
  }
  const label = formatDuration(target)
  return sides ? `${label} each side` : label
}

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  if (minutes === 0) return `${seconds}s`
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}
