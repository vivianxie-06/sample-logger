// A dismissible success/error banner.
export default function Alert({ type = 'success', message, onClose }) {
  if (!message) return null

  const styles = {
    success: 'bg-green-50 text-green-800 border-green-300',
    error: 'bg-red-50 text-red-800 border-red-300',
    info: 'bg-blue-50 text-blue-800 border-blue-300',
  }

  const icon = {
    success: '✓',
    error: '⚠',
    info: 'ℹ',
  }

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${styles[type]}`}
    >
      <span className="font-bold leading-5">{icon[type]}</span>
      <p className="flex-1">{message}</p>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="font-bold leading-5 opacity-60 hover:opacity-100"
        >
          ×
        </button>
      )}
    </div>
  )
}
