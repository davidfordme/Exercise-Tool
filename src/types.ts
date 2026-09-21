export type TargetKind = 'reps' | 'duration'

export type ExerciseDefinition = {
  id: string
  name: string
  kind: TargetKind
  defaultTarget: number
  sides?: boolean
}

export type RoutineItem = {
  id: string
  exerciseId: string
  target: number
}

export type WorkoutStep = {
  id: string
  exerciseId: string
  target: number
}

export type ActiveWorkout = {
  items: WorkoutStep[]
  currentIndex: number
  startedAt: string
}

export type PersistedState = {
  catalog: ExerciseDefinition[]
  routine: RoutineItem[]
  completedDates: string[]
  activeWorkout: ActiveWorkout | null
}
