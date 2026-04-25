// frontend/src/components/CrisisOverlay.jsx
export default function CrisisOverlay({ data, onClose }) {
  if (!data) return null
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
        <h2 className="text-xl font-bold text-gray-900 mb-3">I need to pause for a moment</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">{data.message}</p>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="font-semibold text-red-800 mb-1">If you are in crisis, reach out now:</p>
          <p className="text-red-700 font-bold text-lg">988 Suicide & Crisis Lifeline</p>
          <p className="text-red-600 text-sm">Call or text 988 -- available 24/7</p>
        </div>
        <button onClick={onClose}
          className="w-full py-3 bg-mirror-500 text-white rounded-xl font-medium hover:bg-mirror-700">
          I am safe -- return to session
        </button>
      </div>
    </div>
  )
}
