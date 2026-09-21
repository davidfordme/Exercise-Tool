import { Link, useNavigate } from 'react-router-dom'
import { WeekStrip } from '../components/WeekStrip'
import { useAppState } from '../context/AppState'
import { formatTarget } from '../lib/dates'

export function Dashboard() {
  const navigate = useNavigate()
  const {
    routine,
    completedDates,
    activeWorkout,
    todayCompleted,
    streak,
    longest,
    getExercise,
    startWorkout,
  } = useAppState()

  const handleStart = () => {
    if (!activeWorkout) startWorkout()
    navigate('/workout')
  }

  return (
    <div className="page dashboard">
      <header className="topbar">
        <p className="eyebrow">Core routine</p>
        <h1>Daily core</h1>
      </header>

      <section className="streak-card">
        <div className="streak-copy">
          <p className="eyebrow">{todayCompleted ? 'Streak is alive' : 'Keep it going'}</p>
          <p className="streak-value">
            {streak}
            <span>day streak</span>
          </p>
          <p className="muted">Best: {longest} {longest === 1 ? 'day' : 'days'}</p>
        </div>
        <div className={`streak-flame ${streak > 0 ? 'is-lit' : ''}`} aria-hidden="true">
          {todayCompleted ? '✓' : '🔥'}
        </div>
      </section>

      <WeekStrip completedDates={completedDates} />

      <section className="today-card">
        <div>
          <p className="eyebrow">{todayCompleted ? 'Today' : 'Up next'}</p>
          <h2>{activeWorkout ? 'Workout in progress' : todayCompleted ? 'Workout complete' : 'Core circuit'}</h2>
          <p className="muted">
            {routine.length} {routine.length === 1 ? 'exercise' : 'exercises'}
            {routine[0] ? ` · starts with ${getExercise(routine[0].exerciseId)?.name ?? 'your first move'}` : ''}
          </p>
        </div>
        <button type="button" className="button primary" onClick={handleStart} disabled={routine.length === 0 && !activeWorkout}>
          {activeWorkout ? 'Resume' : todayCompleted ? 'Go again' : 'Start workout'}
        </button>
        {todayCompleted ? (
          <p className="done-note">Logged for today. Extra sessions will not change the streak.</p>
        ) : null}
      </section>

      <section className="preview-card">
        <div className="section-heading">
          <h2>Default routine</h2>
          <Link to="/routine" className="text-link">
            Edit
          </Link>
        </div>
        {routine.length === 0 ? (
          <p className="muted">No exercises yet. Add a few to start tracking.</p>
        ) : (
          <ol className="preview-list">
            {routine.map((item, index) => {
              const exercise = getExercise(item.exerciseId)
              return (
                <li key={item.id}>
                  <span className="index">{index + 1}</span>
                  <span>{exercise?.name ?? 'Unknown exercise'}</span>
                  <em>{exercise ? formatTarget(exercise.kind, item.target, exercise.sides) : ''}</em>
                </li>
              )
            })}
          </ol>
        )}
      </section>
    </div>
  )
}
