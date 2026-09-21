import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AddExerciseSheet } from '../components/AddExerciseSheet'
import { ExerciseGraphic } from '../components/ExerciseGraphic'
import { useAppState } from '../context/AppState'
import { formatDuration, formatTarget } from '../lib/dates'
import type { ExerciseDefinition } from '../types'

function DurationTimer({ target }: { target: number }) {
  const [remaining, setRemaining] = useState(target)
  const [running, setRunning] = useState(false)
  const ticking = running && remaining > 0

  useEffect(() => {
    if (!ticking) return
    const timer = window.setInterval(() => {
      setRemaining((value) => Math.max(0, value - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [ticking])

  return (
    <div className="timer">
      <p className={`timer-value ${remaining === 0 ? 'is-done' : ''}`}>{formatDuration(remaining)}</p>
      <button
        type="button"
        className="button secondary"
        onClick={() => {
          if (remaining === 0) {
            setRemaining(target)
            setRunning(true)
            return
          }
          setRunning((value) => !value)
        }}
      >
        {remaining === 0 ? 'Restart' : running ? 'Pause' : 'Start timer'}
      </button>
    </div>
  )
}

export function Workout() {
  const navigate = useNavigate()
  const {
    catalog,
    routine,
    activeWorkout,
    getExercise,
    startWorkout,
    setActiveWorkout,
    completeWorkout,
    addWorkoutStep,
    addExerciseToCatalog,
  } = useAppState()
  const [sheetOpen, setSheetOpen] = useState(false)

  const current = activeWorkout?.items[activeWorkout.currentIndex]
  const exercise = current ? getExercise(current.exerciseId) : undefined
  const finished = Boolean(activeWorkout && activeWorkout.currentIndex >= activeWorkout.items.length)
  const total = activeWorkout?.items.length ?? 0
  const position = Math.min((activeWorkout?.currentIndex ?? 0) + 1, total)
  const progress = !activeWorkout || total === 0 ? 0 : finished ? 1 : (activeWorkout.currentIndex + 1) / total

  if (!activeWorkout) {
    return (
      <div className="page">
        <header className="topbar">
          <Link to="/" className="text-link">
            ← Dashboard
          </Link>
          <h1>Workout</h1>
        </header>
        {routine.length === 0 ? (
          <>
            <p className="empty-state">Add exercises to your routine before starting a workout.</p>
            <Link to="/routine" className="button primary">
              Edit routine
            </Link>
          </>
        ) : (
          <>
            <p className="muted">{routine.length} exercises ready in your default routine.</p>
            <button type="button" className="button primary" onClick={startWorkout}>
              Start workout
            </button>
          </>
        )}
      </div>
    )
  }

  const goNext = () => {
    setActiveWorkout({
      ...activeWorkout,
      currentIndex: activeWorkout.currentIndex + 1,
    })
  }

  const handleChoose = (chosen: ExerciseDefinition) => {
    addExerciseToCatalog(chosen)
    addWorkoutStep(chosen.id, chosen.defaultTarget)
    setSheetOpen(false)
  }

  const handleComplete = () => {
    completeWorkout()
    navigate('/')
  }

  return (
    <div className="page workout">
      <header className="topbar">
        <Link to="/" className="text-link">
          ← Dashboard
        </Link>
        <div className="progress-track" aria-hidden="true">
          <span style={{ width: `${progress * 100}%` }} />
        </div>
        <p className="muted">{finished ? 'Finished' : `Exercise ${position} of ${total}`}</p>
      </header>

      {finished || !current || !exercise ? (
        <section className="finish-card">
          <p className="eyebrow">Nice work</p>
          <h1>Circuit complete</h1>
          <p className="muted">Log the session to keep your streak, or add another exercise first.</p>
          <ol className="preview-list">
            {activeWorkout.items.map((item, index) => {
              const step = getExercise(item.exerciseId)
              return (
                <li key={item.id}>
                  <span className="index">{index + 1}</span>
                  <span>{step?.name ?? 'Exercise'}</span>
                  <em>{step ? formatTarget(step.kind, item.target, step.sides) : ''}</em>
                </li>
              )
            })}
          </ol>
          <div className="button-stack">
            <button type="button" className="button primary" onClick={handleComplete}>
              Complete workout
            </button>
            <button type="button" className="button secondary" onClick={() => setSheetOpen(true)}>
              Add another exercise
            </button>
          </div>
        </section>
      ) : (
        <section className="exercise-stage">
          <ExerciseGraphic exerciseId={exercise.id} className="graphic-lg" />
          <p className="eyebrow">{exercise.kind === 'duration' ? 'Hold' : 'Perform'}</p>
          <h1>{exercise.name}</h1>
          <p className="target-display">{formatTarget(exercise.kind, current.target, exercise.sides)}</p>
          {exercise.kind === 'duration' ? <DurationTimer key={current.id} target={current.target} /> : null}
          <button type="button" className="button primary next-button" onClick={goNext}>
            {activeWorkout.currentIndex === total - 1 ? 'Finish' : 'Next'}
          </button>
        </section>
      )}

      <AddExerciseSheet
        open={sheetOpen}
        catalog={catalog}
        onClose={() => setSheetOpen(false)}
        onChoose={handleChoose}
        onCreate={handleChoose}
      />
    </div>
  )
}
