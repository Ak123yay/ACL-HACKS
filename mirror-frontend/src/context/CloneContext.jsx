import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

const CloneContext = createContext(null)

export function CloneProvider({ children }) {
  const { profile } = useAuth()
  const [personaPrompt,  setPersonaPrompt]  = useState(null)
  const [voiceId,        setVoiceId]        = useState(null)
  const [modePreference, setModePreference] = useState('vent')
  const [onboardingStep, setOnboardingStep] = useState(0)

  useEffect(() => {
    if (!profile) return
    setPersonaPrompt(profile.persona_prompt   || null)
    setVoiceId(profile.voice_id               || null)
    setModePreference(profile.mode_preference || 'vent')
    setOnboardingStep(profile.onboarding_step || 0)
  }, [profile])

  const isOnboardingComplete = onboardingStep >= 4

  return (
    <CloneContext.Provider value={{
      personaPrompt, setPersonaPrompt,
      voiceId, setVoiceId,
      modePreference, setModePreference,
      onboardingStep, setOnboardingStep,
      isOnboardingComplete,
    }}>
      {children}
    </CloneContext.Provider>
  )
}

export const useClone = () => {
  const ctx = useContext(CloneContext)
  if (!ctx) throw new Error('useClone must be used inside CloneProvider')
  return ctx
}
