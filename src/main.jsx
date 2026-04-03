import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ParticleBackground from './components/ParticleBackground.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ParticleBackground />
    <App />
  </StrictMode>,
)
