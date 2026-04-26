import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CloneProvider } from './context/CloneContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CloneProvider>
          <App />
        </CloneProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
