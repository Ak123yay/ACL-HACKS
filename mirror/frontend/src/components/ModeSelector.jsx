// frontend/src/components/ModeSelector.jsx
import { useClone } from '../context/CloneContext'

const MODES = [
  { id: 'vent',    label: 'Vent',    emoji: '🌊', desc: 'Just be heard' },
  { id: 'reframe', label: 'Reframe', emoji: '🔭', desc: 'Shift perspective' },
  { id: 'boost',   label: 'Boost',   emoji: '⚡', desc: 'Energize & go' },
]

export default function ModeSelector({ value, onChange }) {
  return (
    <div className="flex gap-3">
      {MODES.map(m => (
        <button key={m.id} onClick={() => onChange(m.id)}
          className={`flex-1 p-3 rounded-xl border-2 transition-all text-left
            ${value === m.id
              ? 'border-mirror-500 bg-mirror-100 text-mirror-700'
              : 'border-gray-200 hover:border-mirror-300 text-gray-600'}`}>
          <div className="text-2xl mb-1">{m.emoji}</div>
          <div className="font-semibold text-sm">{m.label}</div>
          <div className="text-xs opacity-70">{m.desc}</div>
        </button>
      ))}
    </div>
  )
}
