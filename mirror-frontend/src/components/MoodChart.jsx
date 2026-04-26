import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '8px 14px',
      fontSize: '0.8rem',
    }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === 'before' ? 'Before' : 'After'}: {p.value}/5
        </p>
      ))}
    </div>
  )
}

export default function MoodChart({ data }) {
  if (!data?.length) {
    return (
      <div style={{
        height: 180,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-muted)', fontSize: '0.85rem',
      }}>
        No mood data yet. Finish a session to see your trends.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -22 }}>
        <defs>
          <linearGradient id="roseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#c4a0a0" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#c4a0a0" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#c4a55a" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#c4a55a" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          domain={[1, 5]} ticks={[1, 2, 3, 4, 5]}
          tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          axisLine={false} tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone" dataKey="before" name="before"
          stroke="#c4a0a0" fill="url(#roseGrad)"
          strokeWidth={2} dot={{ fill: '#c4a0a0', r: 3 }}
        />
        <Area
          type="monotone" dataKey="after" name="after"
          stroke="#c4a55a" fill="url(#goldGrad)"
          strokeWidth={2} dot={{ fill: '#c4a55a', r: 3 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
