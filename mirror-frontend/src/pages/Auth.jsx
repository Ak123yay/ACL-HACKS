import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Auth() {
  const [searchParams] = useSearchParams()
  const [isLogin,   setIsLogin]   = useState(searchParams.get('mode') !== 'signup')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [name,      setName]      = useState('')
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const { signIn, signUp, user } = useAuth()
  const nav = useNavigate()

  useEffect(() => { if (user) nav('/home') }, [user])

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) throw error
      } else {
        if (!name.trim()) throw new Error('Please enter your name.')
        if (password.length < 8) throw new Error('Password must be at least 8 characters.')
        const { error } = await signUp(email, password, name)
        if (error) throw error
        setConfirmed(true)
      }
    } catch (e) {
      setError(e.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSubmit() }

  if (confirmed) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>✉️</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 300, marginBottom: 12 }}>
          Check your email
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem' }}>
          We sent a confirmation link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>.
          Click it to activate your account, then come back to sign in.
        </p>
        <button
          className="btn-ghost"
          onClick={() => { setConfirmed(false); setIsLogin(true) }}
          style={{ marginTop: 24 }}
        >
          Back to sign in
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <button
        onClick={() => nav('/')}
        style={{
          fontFamily: 'var(--font-display)', fontSize: '1.5rem',
          letterSpacing: '.08em', color: 'var(--text-primary)',
          marginBottom: 44, cursor: 'pointer',
          background: 'none', border: 'none',
        }}
      >
        Mirror
      </button>

      <div className="card glass" style={{ width: '100%', maxWidth: 400, padding: '36px 32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', fontWeight: 300, marginBottom: 6 }}>
          {isLogin ? 'Welcome back' : 'Create your Mirror'}
        </h1>
        <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: 28 }}>
          {isLogin
            ? 'Sign in to continue your practice.'
            : 'Setup takes about 15 minutes.'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          {!isLogin && (
            <input
              className="input-field"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="name"
            />
          )}
          <input
            className="input-field"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="email"
          />
          <input
            className="input-field"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
          />

          {error && (
            <div style={{
              padding: '10px 14px',
              background: 'rgba(196,112,110,0.1)',
              border: '1px solid rgba(196,112,110,0.2)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem', color: 'var(--danger)',
            }}>
              {error}
            </div>
          )}

          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{ marginTop: 6, padding: '13px' }}
          >
            {loading
              ? <span className="loading-spinner" style={{ width: 17, height: 17 }} />
              : isLogin ? 'Sign in' : 'Create account'}
          </button>
        </div>

        <div className="divider" />

        <p style={{ textAlign: 'center', fontSize: '0.83rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => { setIsLogin(!isLogin); setError('') }}
            style={{
              color: 'var(--rose)', cursor: 'pointer',
              background: 'none', border: 'none', fontSize: '0.83rem',
            }}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
