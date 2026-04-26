import { Outlet, useLocation } from 'react-router-dom'

const STEPS = [
  { path: '/onboard/import',     label: 'Import data' },
  { path: '/onboard/voice',      label: 'Clone voice' },
  { path: '/onboard/reflect',    label: 'Reflect'     },
  { path: '/onboard/generating', label: 'Generating'  },
]

export default function OnboardLayout() {
  const { pathname }  = useLocation()
  const currentIdx    = STEPS.findIndex((s) => pathname.includes(s.path.split('/').pop()))

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{ width: '100%', maxWidth: 560 }}>

        {/* Logo */}
        <p style={{
          fontFamily: 'var(--font-display)', fontSize: '1.4rem',
          letterSpacing: '.08em', textAlign: 'center',
          marginBottom: 40, color: 'var(--text-primary)',
        }}>
          Mirror
        </p>

        {/* Progress steps */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 44 }}>
          {STEPS.map((step, i) => {
            const done   = i < currentIdx
            const active = i === currentIdx
            return (
              <div key={step.path} style={{ flex: 1 }}>
                <div style={{
                  height: 3, borderRadius: 99,
                  background: done || active ? 'var(--rose)' : 'var(--border)',
                  opacity: active ? 1 : done ? 0.7 : 1,
                  transition: 'all 0.4s',
                }} />
                <p style={{
                  fontSize: '0.68rem', marginTop: 6, textAlign: 'center',
                  color: done || active ? 'var(--text-muted)' : 'var(--border)',
                  transition: 'color 0.4s',
                }}>
                  {step.label}
                </p>
              </div>
            )
          })}
        </div>

        {/* Step content */}
        <Outlet />
      </div>
    </div>
  )
}
