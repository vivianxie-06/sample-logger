// Shared form primitives styled to match the Preclarus entry screens.
//
// The manual notes: required fields get a RED border; fields that "will result
// in a Query if not provided" get an ORANGE border. We reproduce both.

export function RequirementLegend() {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-end gap-4 text-xs text-gray-500">
      <span className="flex items-center gap-1">
        <span className="inline-block h-3 w-3 rounded-sm border-2 border-ppd-required" />
        Required
      </span>
      <span className="flex items-center gap-1">
        <span className="inline-block h-3 w-3 rounded-sm border-2 border-ppd-query" />
        Will result in Query if not provided
      </span>
    </div>
  )
}

export function Field({
  label,
  required,
  query,
  error,
  children,
  hint,
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-ppd-required">*</span>}
        {query && !required && <span className="ml-0.5 text-ppd-query">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-ppd-required">{error}</p>}
    </div>
  )
}

// Returns the input/select className given its requirement + error state.
export function fieldClass({ required, query, error } = {}) {
  const border = error
    ? 'border-ppd-required bg-red-50'
    : required
      ? 'border-ppd-required'
      : query
        ? 'border-ppd-query'
        : 'border-gray-300'
  return `w-full rounded border ${border} bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ppd-purpleLight/40`
}

// PPD lime-green primary button (Create / Save-Submit / Search).
export function GreenButton({ children, className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded bg-ppd-green px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-ppd-greenDark disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function GhostButton({ children, className = '', ...props }) {
  return (
    <button
      className={`rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// Purple instructional callout matching the manual's speech-bubble notes.
export function Callout({ children }) {
  return (
    <div className="rounded-md bg-ppd-purple px-4 py-2.5 text-xs font-medium leading-relaxed text-white shadow">
      {children}
    </div>
  )
}
