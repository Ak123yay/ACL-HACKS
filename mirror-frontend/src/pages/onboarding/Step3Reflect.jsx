import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { saveReflections } from '../../api/client'
import { supabase } from '../../lib/supabase'

const QUESTIONS = [
  {
    id: 1,
    q: 'How would your closest friend describe the way you handle hard times?',
    ph: 'They\'d probably say I…',
  },
  {
    id: 2,
    q: 'What do you believe about asking for help?',
    ph: 'I think asking for help is…',
  },
  {
    id: 3,
    q: 'Describe a time you gave someone advice that really helped them.',
    ph: 'I remember telling them…',
  },
  {
    id: 4,
    q: 'What phrases or expressions do you use when you\'re being real with someone?',
    ph: 'I tend to say things like…',
  },
  {
    id: 5,
    q: 'When you\'re overwhelmed, what actually helps?',
    ph: 'What genuinely helps me is…',
  },
  {
    id: 6,
    q: 'What do you believe about failure and setbacks?',
    ph: 'I see failure as…',
  },
  {
    id: 7,
    q: 'What\'s something you wish someone would say to you when you\'re struggling?',
    ph: 'I wish someone would say…',
  },
]

export default function Step3Reflect() {
  const { user } = useAuth()
  const nav      = useNavigate()
  const [answers, setAnswers] = useState({})
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')

  const allAnswered = QUESTIONS.every((q) => (answers[q.id] || '').trim().length > 10)
  const answeredCount = QUESTIONS.filter((q) => (answers[q.id] || '').trim().length > 10).length

  const handleSubmit = async () => {
    if (!allAnswered) { setError('Please answer all questions (at least a sentence each).'); return }
    setSaving(true)
    setError('')
    try {
      const payload = QUESTIONS.map((q) => ({ question_id: q.id, answer: answers[q.id] }))
      await saveReflections(user.id, payload)
      await supabase.from('profiles').update({ onboarding_step: 3 }).eq('id', user.id)
      nav('/onboard/generating')
    } catch {
      setError('Could not save your answers. Please try again.')
    }
    setSaving(false)
  }

  return (
    <div className="fade-in">
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, marginBottom: 8 }}>
        Seven reflections
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.75, marginBottom: 8 }}>
        These answers become the heart of your Mirror — how it sounds, what it believes, and how it
        talks to you. Write honestly. There are no right answers.
      </p>
      <p style={{ fontSize: '0.78rem', color: 'var(--rose-dim)', marginBottom: 28 }}>
        {answeredCount} / {QUESTIONS.length} answered
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginBottom: 28 }}>
        {QUESTIONS.map((q, i) => {
          const answered = (answers[q.id] || '').trim().length > 10
          return (
            <div key={q.id}>
              <label style={{
                display: 'flex', gap: 10, alignItems: 'flex-start',
                marginBottom: 8, cursor: 'default',
              }}>
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.1rem',
                  color: answered ? 'var(--rose)' : 'var(--text-muted)',
                  flexShrink: 0, lineHeight: 1.2, transition: 'color 0.2s',
                }}>
                  {i + 1}.
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  {q.q}
                </span>
              </label>
              <textarea
                className="input-field"
                placeholder={q.ph}
                rows={3}
                style={{ resize: 'none', lineHeight: 1.65, marginLeft: 24 }}
                value={answers[q.id] || ''}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
              />
            </div>
          )
        })}
      </div>

      {error && (
        <p style={{ color: 'var(--danger)', fontSize: '0.82rem', marginBottom: 16 }}>{error}</p>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn-ghost" onClick={() => nav('/onboard/voice')} style={{ flex: 1, padding: '13px' }}>
          ← Back
        </button>
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={saving || !allAnswered}
          style={{ flex: 2, padding: '13px' }}
        >
          {saving
            ? <span className="loading-spinner" style={{ width: 16, height: 16 }} />
            : 'Build my Mirror →'}
        </button>
      </div>
    </div>
  )
}
