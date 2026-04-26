import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { generatePersona } from '../../api/client'
import { supabase } from '../../lib/supabase'

const ANIMATION_STEPS = [
  { label: 'Analyzing your language patterns…',       delay: 0 },
  { label: 'Building your personality fingerprint…', delay: 3200 },
  { label: 'Calibrating emotional tone and humor…',  delay: 6400 },
  { label: 'Integrating your values and beliefs…',   delay: 9800 },
  { label: 'Finalizing your Mirror persona…',        delay: 13000 },
]

export default function Step4Generating() {
  const { user, refreshProfile } = useAuth()
  const nav = useNavigate()

  const [currentStep, setCurrentStep] = useState(0)
  const [done,        setDone]        = useState(false)
  const [error,       setError]       = useState('')
  const timerRefs = useRef([])

  const runGeneration = () => {
    setError('')
    setDone(false)
    setCurrentStep(0)

    // Clear any previous timers
    timerRefs.current.forEach(clearTimeout)
    timerRefs.current = []

    // Schedule step animations
    ANIMATION_STEPS.forEach((s, i) => {
      timerRefs.current.push(setTimeout(() => setCurrentStep(i), s.delay))
    })

    // Start actual generation
    generatePersona(user.id)
      .then(async () => {
        await supabase.from('profiles').update({ onboarding_step: 4 }).eq('id', user.id)
        await refreshProfile()
        setDone(true)
      })
      .catch(() => {
        setError('Persona generation failed. Please try again.')
        timerRefs.current.forEach(clearTimeout)
      })
  }

  useEffect(() => {
    runGeneration()
    return () => timerRefs.current.forEach(clearTimeout)
  }, [])

  // Navigate to home after a brief pause on completion
  useEffect(() => {
    if (!done) return
    const t = setTimeout(() => nav('/home'), 1800)
    return () => clearTimeout(t)
  }, [done])

  return (
    <div className="fade-in" style={{ textAlign: 'center', padding: '20px 0 40px' }}>

      {/* Breathing orb */}
      <div style={{
        width: 130, height: 130, borderRadius: '50%',
        margin: '0 auto 44px',
        background: done
          ? 'radial-gradient(ellipse at 40% 35%, rgba(122,173,154,0.6) 0%, rgba(122,173,154,0.1) 60%, transparent 100%)'
          : 'radial-gradient(ellipse at 40% 35%, rgba(196,160,160,0.55) 0%, rgba(140,110,110,0.15) 60%, transparent 100%)',
        animation: done ? 'none' : 'breathe 3s ease-in-out infinite',
        boxShadow: done
          ? '0 0 60px rgba(122,173,154,0.18)'
          : '0 0 60px rgba(196,160,160,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.8s, box-shadow 0.8s',
      }}>
        {done && (
          <span style={{ fontSize: 36, animation: 'fadeIn 0.4s ease' }}>✦</span>
        )}
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, marginBottom: 8 }}>
        {done ? 'Your Mirror is ready' : 'Building your Mirror'}
      </h2>

      {!done && !error && (
        <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 360, margin: '36px auto 0' }}>
          {ANIMATION_STEPS.map((s, i) => {
            const visible  = i <= currentStep
            const complete = i < currentStep
            const active   = i === currentStep

            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                opacity: visible ? 1 : 0.2,
                transition: 'opacity 0.5s',
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: complete ? 'var(--success)' : active ? 'var(--rose)' : 'var(--border)',
                  fontSize: 10, color: '#fff', fontWeight: 600,
                  animation: active ? 'breathe 1.5s ease-in-out infinite' : 'none',
                  transition: 'background 0.4s',
                }}>
                  {complete ? '✓' : ''}
                </div>
                <p style={{ fontSize: '0.84rem', color: active ? 'var(--text-primary)' : 'var(--text-muted)', textAlign: 'left', transition: 'color 0.3s' }}>
                  {s.label}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {done && (
        <div style={{ marginTop: 20 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', marginBottom: 20 }}>
            Taking you to your Mirror…
          </p>
          <div className="loading-spinner" style={{ margin: '0 auto' }} />
        </div>
      )}

      {error && (
        <div style={{ marginTop: 24 }}>
          <p style={{ color: 'var(--danger)', fontSize: '0.83rem', marginBottom: 16 }}>{error}</p>
          <button className="btn-ghost" onClick={runGeneration}>
            Try again
          </button>
        </div>
      )}
    </div>
  )
}
