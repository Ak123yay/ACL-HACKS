import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import Landing        from './pages/Landing'
import Auth           from './pages/Auth'
import Home           from './pages/Home'
import Session        from './pages/Session'
import Journal        from './pages/Journal'
import Insights       from './pages/Insights'
import Settings       from './pages/Settings'

import OnboardLayout  from './pages/onboarding/OnboardLayout'
import Step1Import    from './pages/onboarding/Step1Import'
import Step2Voice     from './pages/onboarding/Step2Voice'
import Step3Reflect   from './pages/onboarding/Step3Reflect'
import Step4Generating from './pages/onboarding/Step4Generating'

function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div className="loading-spinner" style={{ width: 28, height: 28 }} />
      </div>
    )
  }
  return user ? children : <Navigate to="/auth" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"     element={<Landing />} />
      <Route path="/auth" element={<Auth />} />

      {/* Onboarding */}
      <Route
        path="/onboard"
        element={<Protected><OnboardLayout /></Protected>}
      >
        <Route path="import"     element={<Step1Import />} />
        <Route path="voice"      element={<Step2Voice />} />
        <Route path="reflect"    element={<Step3Reflect />} />
        <Route path="generating" element={<Step4Generating />} />
        <Route index element={<Navigate to="import" replace />} />
      </Route>

      {/* App */}
      <Route path="/home"          element={<Protected><Home /></Protected>} />
      <Route path="/session"       element={<Protected><Session /></Protected>} />
      <Route path="/journal"       element={<Protected><Journal /></Protected>} />
      <Route path="/journal/:id"   element={<Protected><Journal /></Protected>} />
      <Route path="/insights"      element={<Protected><Insights /></Protected>} />
      <Route path="/settings"      element={<Protected><Settings /></Protected>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
