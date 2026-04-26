// frontend/src/pages/onboarding/Step2Voice.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { cloneVoice } from '../../api/client'

export default function Step2Voice() {
  const { user, profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  async function handleContinue() {
    setLoading(true)
    try {
      await cloneVoice(user.id, profile?.display_name || 'Mirror User', new Blob())
      await refreshProfile()
      navigate('/onboard/reflect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Your voice</h2>
      <p className="text-gray-500 mb-6 text-sm">
        Mirror will speak back to you using a warm, calm AI voice. 
        Voice cloning will be available in a future update.
      </p>

      <div className="bg-mirror-50 border border-mirror-200 rounded-2xl p-6 text-center mb-8">
        <div className="text-4xl mb-3">🎙️</div>
        <p className="text-mirror-700 font-medium">AI voice enabled</p>
        <p className="text-sm text-gray-400 mt-1">Mirror will respond in a natural, expressive voice</p>
      </div>

      <button
        onClick={handleContinue}
        disabled={loading}
        className="w-full py-3 bg-mirror-500 text-white rounded-xl font-semibold disabled:opacity-40 hover:bg-mirror-700 transition"
      >
        {loading ? 'Setting up...' : 'Continue →'}
      </button>
    </div>
  )
}
