import { useEffect, useState } from 'react'
import { getMoodInsights, getUsageInsights } from '../api/client'
import Sidebar from '../components/Sidebar'
import MoodChart from '../components/MoodChart'

const BAR_COLORS = { vent: 'var(--rose)', reframe: 'var(--gold)', boost: 'var(--success)' }

export default function Insights() {
  const [moodData,  setMoodData]  = useState([])
  const [usageData, setUsageData] = useState(null)
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([getMoodInsights(), getUsageInsights()])
      .then(([mood, usage]) => {
        setMoodData(mood.data.points || [])
        setUsageData(usage.data || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const totalSessions   = usageData?.total_sessions  || 0
  const avgMoodShift    = usageData?.avg_mood_shift   ?? null
  const topMode         = usageData?.top_mode         || '—'
  const modeBreakdown   = usageData?.mode_breakdown   || {}
  const maxModeCount    = Math.max(...Object.values(modeBreakdown), 1)

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main className="main-with-sidebar fade-in">
        <h1 className="page-title">Insights</h1>
        <p className="page-sub">Your emotional patterns over time</p>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
            <div className="loading-spinner" style={{ width: 26, height: 26 }} />
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div className="grid-3" style={{ marginBottom: 28 }}>
              {[
                {
                  label: 'Total sessions',
                  value: totalSessions,
                  sub: 'all time',
                  color: 'var(--rose-bright)',
                },
                {
                  label: 'Avg mood shift',
                  value: avgMoodShift !== null
                    ? `${avgMoodShift > 0 ? '+' : ''}${Number(avgMoodShift).toFixed(1)}`
                    : '—',
                  sub: 'before → after',
                  color: avgMoodShift >= 0 ? 'var(--success)' : 'var(--danger)',
                },
                {
                  label: 'Top mode',
                  value: topMode,
                  sub: 'most used',
                  color: BAR_COLORS[topMode] || 'var(--text-secondary)',
                },
              ].map((stat) => (
                <div key={stat.label} className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.4rem', fontWeight: 300,
                    color: stat.color, marginBottom: 6,
                    textTransform: 'capitalize',
                  }}>
                    {stat.value}
                  </p>
                  <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: 2 }}>
                    {stat.label}
                  </p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Mood chart */}
            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 400 }}>
                  Mood over time
                </h3>
                <div style={{ display: 'flex', gap: 16 }}>
                  {[
                    { label: 'Before', color: 'var(--rose)' },
                    { label: 'After',  color: 'var(--gold)' },
                  ].map(({ label, color }) => (
                    <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span style={{ width: 14, height: 2, background: color, display: 'inline-block', borderRadius: 99 }} />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <MoodChart data={moodData} />
            </div>

            {/* Mode breakdown */}
            {Object.keys(modeBreakdown).length > 0 && (
              <div className="card">
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 400, marginBottom: 20 }}>
                  Session modes
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {Object.entries(modeBreakdown).map(([m, count]) => (
                    <div key={m}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                          {m}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {count} session{count !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div style={{ height: 6, background: 'var(--border-soft)', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${(count / maxModeCount) * 100}%`,
                          background: BAR_COLORS[m] || 'var(--rose)',
                          borderRadius: 99,
                          transition: 'width 0.6s ease',
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
