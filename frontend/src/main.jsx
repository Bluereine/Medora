import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AccessibilityProvider } from './context/AccessibilityContext'
import { AuthProvider } from './context/AuthContext'
import { MedicationProvider } from './context/MedicationContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AccessibilityProvider>
      <AuthProvider>
        <MedicationProvider>
          <App />
        </MedicationProvider>
      </AuthProvider>
    </AccessibilityProvider>
  </StrictMode>,
)
