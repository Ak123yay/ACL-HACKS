// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CloneProvider } from './context/CloneContext'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Home from './pages/Home'
import Session from './pages/Session'
import Journal from './pages/Journal'
import Insights from './pages/Insights'
import OnboardLayout from './pages/onboarding/OnboardLayout'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to='/auth' replace />
}

export default function App() {
  return (
    <BrowserRouter><AuthProvider><CloneProvider>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/onboard/*' element={<PrivateRoute><OnboardLayout /></PrivateRoute>} />
        <Route path='/home' element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path='/session' element={<PrivateRoute><Session /></PrivateRoute>} />
        <Route path='/journal' element={<PrivateRoute><Journal /></PrivateRoute>} />
        <Route path='/insights' element={<PrivateRoute><Insights /></PrivateRoute>} />
      </Routes>
    </CloneProvider></AuthProvider></BrowserRouter>
  )
}
