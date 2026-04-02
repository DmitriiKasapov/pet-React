import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { seedService } from './services/seedService'
import { App } from './App'
import './styles.css'

// Initialize seed data before first render
seedService.initialize()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
