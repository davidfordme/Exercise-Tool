import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { AddExerciseSheet } from '../components/AddExerciseSheet'
import { ExerciseGraphic } from '../components/ExerciseGraphic'
import { useAppState } from '../context/AppState'
import { createId } from '../lib/ids'
import type { ExerciseDefinition, RoutineItem } from '../types'

function SortableRow({
  item,
  name,
  kind,
  sides,
  onRemove,
  onTargetChange,
}: {
  item: RoutineItem
  name: string
  kind: 'reps' | 'duration'
  sides?: boolean
  onRemove: () => void
  onTargetChange: (target: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`routine-row ${isDragging ? 'is-dragging' : ''}`}
    >
      <button type="button" className="drag-handle" aria-label={`Reorder ${name}`} {...attributes} {...listeners}>
        <span />
        <span />
        <span />
      </button>
      <ExerciseGraphic exerciseId={item.exerciseId} className="graphic-sm" />
      <div className="routine-copy">
        <strong>{name}</strong>
        <label className="target-field">
          <span>{kind === 'reps' ? 'Reps' : sides ? 'Seconds each side' : 'Seconds'}</span>
          <input
            type="number"
            min={1}
            value={item.target}
            onChange={(event) => onTargetChange(Math.max(1, Number(event.target.value) || 1))}
          />
        </label>
      </div>
      <button type="button" className="icon-button danger" onClick={onRemove} aria-label={`Remove ${name}`}>
        ×
      </button>
    </li>
  )
}

export function Routine() {
  const { catalog, routine, setRoutine, addExerciseToCatalog, getExercise } = useAppState()
  const [sheetOpen, setSheetOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = routine.findIndex((item) => item.id === active.id)
    const newIndex = routine.findIndex((item) => item.id === over.id)
    if (oldIndex < 0 || newIndex < 0) return
    setRoutine(arrayMove(routine, oldIndex, newIndex))
  }

  const addItem = (exercise: ExerciseDefinition) => {
    addExerciseToCatalog(exercise)
    setRoutine([
      ...routine,
      {
        id: createId(),
        exerciseId: exercise.id,
        target: exercise.defaultTarget,
      },
    ])
    setSheetOpen(false)
  }

  return (
    <div className="page">
      <header className="topbar">
        <Link to="/" className="text-link">
          ← Dashboard
        </Link>
        <h1>Edit routine</h1>
        <p className="muted">Drag to reorder. Change reps or seconds on each row.</p>
      </header>

      {routine.length === 0 ? (
        <p className="empty-state">Your default routine is empty. Add an exercise to get started.</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={routine.map((item) => item.id)} strategy={verticalListSortingStrategy}>
            <ol className="routine-list">
              {routine.map((item) => {
                const exercise = getExercise(item.exerciseId)
                return (
                  <SortableRow
                    key={item.id}
                    item={item}
                    name={exercise?.name ?? 'Unknown exercise'}
                    kind={exercise?.kind ?? 'reps'}
                    sides={exercise?.sides}
                    onRemove={() => setRoutine(routine.filter((row) => row.id !== item.id))}
                    onTargetChange={(target) =>
                      setRoutine(routine.map((row) => (row.id === item.id ? { ...row, target } : row)))
                    }
                  />
                )
              })}
            </ol>
          </SortableContext>
        </DndContext>
      )}

      <button type="button" className="button secondary add-button" onClick={() => setSheetOpen(true)}>
        Add exercise
      </button>

      <AddExerciseSheet
        open={sheetOpen}
        catalog={catalog}
        onClose={() => setSheetOpen(false)}
        onChoose={addItem}
        onCreate={addItem}
      />
    </div>
  )
}
