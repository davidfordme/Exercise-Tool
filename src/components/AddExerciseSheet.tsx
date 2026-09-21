import { useState, type FormEvent } from 'react'
import { createId } from '../lib/ids'
import type { ExerciseDefinition, TargetKind } from '../types'
import { ExerciseGraphic } from './ExerciseGraphic'

type AddExerciseSheetProps = {
  open: boolean
  catalog: ExerciseDefinition[]
  onClose: () => void
  onChoose: (exercise: ExerciseDefinition) => void
  onCreate: (exercise: ExerciseDefinition) => void
}

export function AddExerciseSheet({
  open,
  catalog,
  onClose,
  onChoose,
  onCreate,
}: AddExerciseSheetProps) {
  const [mode, setMode] = useState<'pick' | 'create'>('pick')
  const [name, setName] = useState('')
  const [kind, setKind] = useState<TargetKind>('reps')
  const [target, setTarget] = useState(20)
  const [sides, setSides] = useState(false)

  if (!open) return null

  const handleCreate = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onCreate({
      id: `custom-${createId()}`,
      name: trimmed,
      kind,
      defaultTarget: Math.max(1, target),
      sides: kind === 'duration' ? sides : undefined,
    })
    setName('')
    setKind('reps')
    setTarget(20)
    setSides(false)
    setMode('pick')
  }

  return (
    <div className="sheet-backdrop" onClick={onClose} role="presentation">
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-exercise-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sheet-handle" />
        <div className="sheet-header">
          <h2 id="add-exercise-title">Add exercise</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="segmented">
          <button
            type="button"
            className={mode === 'pick' ? 'is-active' : ''}
            onClick={() => setMode('pick')}
          >
            From list
          </button>
          <button
            type="button"
            className={mode === 'create' ? 'is-active' : ''}
            onClick={() => setMode('create')}
          >
            Create new
          </button>
        </div>

        {mode === 'pick' ? (
          <ul className="picker-list">
            {catalog.map((exercise) => (
              <li key={exercise.id}>
                <button type="button" className="picker-row" onClick={() => onChoose(exercise)}>
                  <ExerciseGraphic exerciseId={exercise.id} className="graphic-sm" />
                  <span>
                    <strong>{exercise.name}</strong>
                    <em>
                      {exercise.kind === 'reps'
                        ? `${exercise.defaultTarget} reps`
                        : exercise.sides
                          ? `${exercise.defaultTarget}s each side`
                          : `${exercise.defaultTarget}s`}
                    </em>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <form className="create-form" onSubmit={handleCreate}>
            <label>
              Name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Hollow hold"
                required
              />
            </label>
            <label>
              Type
              <select
                value={kind}
                onChange={(event) => setKind(event.target.value as TargetKind)}
              >
                <option value="reps">Reps</option>
                <option value="duration">Timed</option>
              </select>
            </label>
            <label>
              {kind === 'reps' ? 'Reps' : 'Seconds'}
              <input
                type="number"
                min={1}
                value={target}
                onChange={(event) => setTarget(Number(event.target.value))}
              />
            </label>
            {kind === 'duration' ? (
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={sides}
                  onChange={(event) => setSides(event.target.checked)}
                />
                Each side
              </label>
            ) : null}
            <button type="submit" className="button primary">
              Add custom exercise
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
