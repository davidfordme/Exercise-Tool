import type { ExerciseDefinition, RoutineItem } from '../types'

export const DEFAULT_CATALOG: ExerciseDefinition[] = [
  { id: 'sit-ups', name: 'Sit ups', kind: 'reps', defaultTarget: 20 },
  { id: 'reverse-crunches', name: 'Reverse crunches', kind: 'reps', defaultTarget: 20 },
  { id: 'sitting-twists', name: 'Sitting twists', kind: 'reps', defaultTarget: 20 },
  { id: 'high-crunches', name: 'High crunches', kind: 'reps', defaultTarget: 20 },
  { id: 'knee-crunches', name: 'Knee crunches', kind: 'reps', defaultTarget: 20 },
  { id: 'knee-to-elbow', name: 'Knee to elbow crunches', kind: 'reps', defaultTarget: 20 },
  { id: 'plank', name: 'Plank', kind: 'duration', defaultTarget: 60 },
  {
    id: 'elbow-plank',
    name: 'Elbow plank',
    kind: 'duration',
    defaultTarget: 20,
    sides: true,
  },
]

export const DEFAULT_ROUTINE: RoutineItem[] = DEFAULT_CATALOG.map((exercise) => ({
  id: `row-${exercise.id}`,
  exerciseId: exercise.id,
  target: exercise.defaultTarget,
}))

export function mergeCatalog(catalog: ExerciseDefinition[]): ExerciseDefinition[] {
  const byId = new Map(catalog.map((exercise) => [exercise.id, exercise]))
  for (const exercise of DEFAULT_CATALOG) {
    if (!byId.has(exercise.id)) {
      byId.set(exercise.id, exercise)
    }
  }
  return [...byId.values()]
}
