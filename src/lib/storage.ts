import { DEFAULT_CATALOG, DEFAULT_ROUTINE, mergeCatalog } from './catalog'
import type { ActiveWorkout, ExerciseDefinition, PersistedState, RoutineItem } from '../types'

const STORAGE_KEY = 'core-routine:v1'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isExercise(value: unknown): value is ExerciseDefinition {
  if (!isRecord(value)) return false
  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    (value.kind === 'reps' || value.kind === 'duration') &&
    typeof value.defaultTarget === 'number'
  )
}

function isRoutineItem(value: unknown): value is RoutineItem {
  if (!isRecord(value)) return false
  return (
    typeof value.id === 'string' &&
    typeof value.exerciseId === 'string' &&
    typeof value.target === 'number'
  )
}

function isActiveWorkout(value: unknown): value is ActiveWorkout {
  if (!isRecord(value) || !Array.isArray(value.items)) return false
  return (
    typeof value.currentIndex === 'number' &&
    typeof value.startedAt === 'string' &&
    value.items.every(isRoutineItem)
  )
}

export function defaultState(): PersistedState {
  return {
    catalog: DEFAULT_CATALOG,
    routine: DEFAULT_ROUTINE,
    completedDates: [],
    activeWorkout: null,
  }
}

export function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed)) return defaultState()

    const catalog = Array.isArray(parsed.catalog)
      ? mergeCatalog(parsed.catalog.filter(isExercise))
      : DEFAULT_CATALOG
    const routine = Array.isArray(parsed.routine)
      ? parsed.routine.filter(isRoutineItem)
      : DEFAULT_ROUTINE
    const completedDates = Array.isArray(parsed.completedDates)
      ? parsed.completedDates.filter((value): value is string => typeof value === 'string')
      : []
    const activeWorkout = isActiveWorkout(parsed.activeWorkout) ? parsed.activeWorkout : null

    return {
      catalog,
      routine: routine.length > 0 ? routine : DEFAULT_ROUTINE,
      completedDates: [...new Set(completedDates)].sort(),
      activeWorkout,
    }
  } catch {
    return defaultState()
  }
}

export function saveState(state: PersistedState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
