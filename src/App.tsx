import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppStateProvider } from './context/AppState'
import { Dashboard } from './pages/Dashboard'
import { Routine } from './pages/Routine'
import { Workout } from './pages/Workout'

export default function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/routine" element={<Routine />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppStateProvider>
  )
}
