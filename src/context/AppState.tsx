import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { computeStreak, longestStreak, todayKey } from '../lib/dates'
import { createId } from '../lib/ids'
import { loadState, saveState } from '../lib/storage'
import type {
  ActiveWorkout,
  ExerciseDefinition,
  PersistedState,
  RoutineItem,
  WorkoutStep,
} from '../types'

type AppContextValue = {
  catalog: ExerciseDefinition[]
  routine: RoutineItem[]
  completedDates: string[]
  activeWorkout: ActiveWorkout | null
  today: string
  todayCompleted: boolean
  streak: number
  longest: number
  getExercise: (id: string) => ExerciseDefinition | undefined
  setRoutine: (routine: RoutineItem[]) => void
  addExerciseToCatalog: (exercise: ExerciseDefinition) => void
  startWorkout: () => void
  setActiveWorkout: (workout: ActiveWorkout | null) => void
  completeWorkout: () => void
  markTodayComplete: (done: boolean) => void
  addWorkoutStep: (exerciseId: string, target: number) => void
}

const AppContext = createContext<AppContextValue | null>(null)

function persist(next: PersistedState): PersistedState {
  saveState(next)
  return next
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(() => loadState())
  const today = todayKey()

  const value = useMemo<AppContextValue>(() => {
    const getExercise = (id: string) => state.catalog.find((exercise) => exercise.id === id)

    const update = (recipe: (current: PersistedState) => PersistedState) => {
      setState((current) => persist(recipe(current)))
    }

    return {
      catalog: state.catalog,
      routine: state.routine,
      completedDates: state.completedDates,
      activeWorkout: state.activeWorkout,
      today,
      todayCompleted: state.completedDates.includes(today),
      streak: computeStreak(state.completedDates, today),
      longest: longestStreak(state.completedDates),
      getExercise,
      setRoutine: (routine) => update((current) => ({ ...current, routine })),
      addExerciseToCatalog: (exercise) =>
        update((current) => ({
          ...current,
          catalog: current.catalog.some((item) => item.id === exercise.id)
            ? current.catalog
            : [...current.catalog, exercise],
        })),
      startWorkout: () =>
        update((current) => {
          if (current.activeWorkout || current.routine.length === 0) return current
          return {
            ...current,
            activeWorkout: {
              items: current.routine.map((item) => ({
                id: createId(),
                exerciseId: item.exerciseId,
                target: item.target,
              })),
              currentIndex: 0,
              startedAt: new Date().toISOString(),
            },
          }
        }),
      setActiveWorkout: (activeWorkout) => update((current) => ({ ...current, activeWorkout })),
      completeWorkout: () =>
        update((current) => ({
          ...current,
          activeWorkout: null,
          completedDates: current.completedDates.includes(today)
            ? current.completedDates
            : [...current.completedDates, today].sort(),
        })),
      markTodayComplete: (done) =>
        update((current) => ({
          ...current,
          completedDates: done
            ? [...new Set([...current.completedDates, today])].sort()
            : current.completedDates.filter((date) => date !== today),
        })),
      addWorkoutStep: (exerciseId, target) =>
        update((current) => {
          if (!current.activeWorkout) return current
          const step: WorkoutStep = { id: createId(), exerciseId, target }
          return {
            ...current,
            activeWorkout: {
              ...current.activeWorkout,
              items: [...current.activeWorkout.items, step],
              currentIndex: current.activeWorkout.items.length,
            },
          }
        }),
    }
  }, [state, today])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppState(): AppContextValue {
  const value = useContext(AppContext)
  if (!value) {
    throw new Error('useAppState must be used within AppStateProvider')
  }
  return value
}
