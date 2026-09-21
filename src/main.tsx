import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

function markStandaloneApp() {
  const nav = window.navigator as Navigator & { standalone?: boolean }
  const standalone =
    nav.standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches

  document.documentElement.classList.toggle('is-standalone', standalone)
}

function preventPinchZoom() {
  const block = (event: Event) => event.preventDefault()
  document.addEventListener('gesturestart', block)
  document.addEventListener('gesturechange', block)
  document.addEventListener('gestureend', block)
  document.addEventListener(
    'touchmove',
    (event) => {
      if (event.touches.length > 1) event.preventDefault()
    },
    { passive: false },
  )
}

markStandaloneApp()
preventPinchZoom()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

