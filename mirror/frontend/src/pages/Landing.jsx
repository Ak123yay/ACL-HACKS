import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Landing() {
  const nav      = useNavigate()
  const { user, loading, signOut } = useAuth()

  const scrollToHow = () => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px',
        borderBottom: '1px solid var(--border-soft)',
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(8,9,16,0.9)',
        backdropFilter: 'blur(20px)',
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '.08em' }}>
          Mirror
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          {loading ? (
            <button className="btn-ghost" disabled style={{ padding: '9px 20px', opacity: 0.7 }}>
              Checking session...
            </button>
          ) : user ? (
            <>
              <button className="btn-ghost" onClick={() => nav('/home')} style={{ padding: '9px 20px' }}>
                Go to Home
              </button>
              <button className="btn-primary" onClick={signOut} style={{ padding: '9px 20px' }}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <button className="btn-ghost" onClick={() => nav('/auth?mode=login')} style={{ padding: '9px 20px' }}>
                Sign in
              </button>
              <button className="btn-primary" onClick={() => nav('/auth?mode=signup')} style={{ padding: '9px 20px' }}>
                Get started
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '90px 24px 60px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '40%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700, height: 500,
          background: 'radial-gradient(ellipse, rgba(196,160,160,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div className="tag tag-rose" style={{ marginBottom: 28 }}>
          AI Mental Wellness
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3rem, 8vw, 5.5rem)',
          fontWeight: 300, lineHeight: 1.1,
          maxWidth: 700, marginBottom: 24,
          letterSpacing: '-0.01em',
        }}>
          Talk to yourself.<br />
          <em style={{ color: 'var(--rose-bright)' }}>Heal yourself.</em>
        </h1>

        <p style={{
          fontSize: '1.05rem', color: 'var(--text-secondary)',
          maxWidth: 500, lineHeight: 1.85, marginBottom: 44,
        }}>
          Mirror builds an AI version of you from your own words and voice —
          then makes it available whenever you need your wisest self.
        </p>

        {!loading && user && (
          <p style={{ marginBottom: 26, fontSize: '0.85rem', color: 'var(--success)' }}>
            Logged in as {user.email}
          </p>
        )}

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            className="btn-primary"
            onClick={() => nav(user ? '/home' : '/auth?mode=signup')}
            style={{ padding: '14px 40px', fontSize: '1rem' }}
          >
            {user ? 'Continue to Home' : 'Build your Mirror'}
          </button>
          <button
            className="btn-ghost"
            onClick={scrollToHow}
            style={{ padding: '14px 40px', fontSize: '1rem' }}
          >
            How it works
          </button>
        </div>

        <p style={{ marginTop: 22, fontSize: '0.76rem', color: 'var(--text-muted)' }}>
          15 min setup · Under $2 for a full demo · No credit card required
        </p>
      </section>

      {/* How it works */}
      <section id="how" style={{
        padding: '80px 48px',
        borderTop: '1px solid var(--border-soft)',
      }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.6rem', fontWeight: 300,
            textAlign: 'center', marginBottom: 52,
          }}>
            Four steps to your Mirror
          </h2>
          <div className="grid-2" style={{ gap: 20 }}>
            {[
              {
                num: '01', title: 'Import your data',
                desc: 'Bring your WhatsApp exports, ChatGPT history, and Claude conversations. Mirror reads them to understand how you think.',
              },
              {
                num: '02', title: 'Clone your voice',
                desc: 'Record 60 seconds of natural speech. ElevenLabs clones it — every Mirror response will sound like you.',
              },
              {
                num: '03', title: 'Reflect',
                desc: 'Answer 7 guided questions about your values, coping style, and how you talk to friends in distress.',
              },
              {
                num: '04', title: 'Talk to yourself',
                desc: 'Choose Vent, Reframe, or Boost. Speak or type. Hear the wisest version of yourself respond — in your voice.',
              },
            ].map((step) => (
              <div key={step.num} className="card" style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: '2rem',
                  color: 'var(--rose-dim)', opacity: 0.5, flexShrink: 0, lineHeight: 1,
                }}>
                  {step.num}
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontFamily: 'var(--font-display)', marginBottom: 8, fontWeight: 400 }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research callout */}
      <section style={{
        padding: '64px 48px',
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-soft)',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.65rem', fontWeight: 300,
            lineHeight: 1.7, color: 'var(--text-secondary)',
            fontStyle: 'italic',
          }}>
            "Distanced self-talk reduces emotional reactivity, improves performance under stress,
            and increases self-compassion."
          </p>
          <p style={{
            marginTop: 18, fontSize: '0.76rem',
            color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            Dr. Ethan Kross · University of Michigan
          </p>
        </div>
      </section>

      {/* Three modes */}
      <section style={{ padding: '80px 48px', borderTop: '1px solid var(--border-soft)' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '2.4rem',
            fontWeight: 300, textAlign: 'center', marginBottom: 48,
          }}>
            Three ways to talk
          </h2>
          <div className="grid-3" style={{ gap: 16 }}>
            {[
              { label: 'Vent', icon: '◎', color: 'var(--rose)',
                desc: 'No advice. Mirror reflects your feelings and asks gentle questions. For when you just need to be heard.' },
              { label: 'Reframe', icon: '◈', color: 'var(--gold)',
                desc: 'Mirror gently challenges distorted thinking using your own stated values — not generic CBT scripts.' },
              { label: 'Boost', icon: '◆', color: 'var(--success)',
                desc: 'Short, energizing responses. Ends with a grounding statement you can say aloud. Before something hard.' },
            ].map((mode) => (
              <div key={mode.label} className="card" style={{ textAlign: 'center', padding: '28px 20px' }}>
                <div style={{ fontSize: 26, color: mode.color, marginBottom: 12 }}>{mode.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, marginBottom: 10 }}>
                  {mode.label}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                  {mode.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 48px',
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-soft)',
        textAlign: 'center',
      }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', fontWeight: 300, marginBottom: 16 }}>
          Your wisest self is waiting.
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 32 }}>
          Build your Mirror in 15 minutes.
        </p>
        <button
          className="btn-primary"
          onClick={() => nav(user ? '/home' : '/auth?mode=signup')}
          style={{ padding: '15px 48px', fontSize: '1rem' }}
        >
          {user ? 'Continue →' : 'Get started →'}
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '24px 48px',
        borderTop: '1px solid var(--border-soft)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: 'var(--text-muted)', fontSize: '0.78rem',
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}>Mirror</span>
        <span>© 2026 · Powered by Claude API, ElevenLabs &amp; Supabase</span>
      </footer>
    </div>
  )
}
