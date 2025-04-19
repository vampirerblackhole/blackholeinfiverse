import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Removed SimpleBar integration to restore original scroll behavior
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)