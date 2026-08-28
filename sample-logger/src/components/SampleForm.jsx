import { useState } from 'react'
import { SAMPLE_TYPES, STATUS_OPTIONS } from '../config.js'
import Spinner from './Spinner.jsx'

// Returns a "YYYY-MM-DDTHH:mm" string for a datetime-local input, defaulted to now.
function nowLocal() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`
}

const EMPTY = () => ({
  sampleId: '',
  timestamp: nowLocal(),
  sampleType: '',
  location: '',
  testedBy: '',
  status: '',
  notes: '',
})

// Fields that must be filled before submitting.
const REQUIRED = {
  sampleId: 'Sample ID',
  timestamp: 'Timestamp',
  sampleType: 'Sample Type',
  location: 'Location / Source',
  testedBy: 'Tested By',
  status: 'Status',
}

export default function SampleForm({ onSubmit, submitting }) {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  function update(field, value) {
    setValues((v) => ({ ...v, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const next = {}
    for (const [field, label] of Object.entries(REQUIRED)) {
      if (!String(values[field]).trim()) next[field] = `${label} is required.`
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    const ok = await onSubmit(values)
    // Reset only on a successful submit; keep entries on failure so nothing is lost.
    if (ok) setValues(EMPTY())
  }

  const fieldClass = (field) =>
    `w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-light ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-300'
    }`

  const labelClass = 'mb-1 block text-sm font-medium text-gray-700'

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Sample ID */}
        <div>
          <label htmlFor="sampleId" className={labelClass}>
            Sample ID <span className="text-red-500">*</span>
          </label>
          <input
            id="sampleId"
            type="text"
            value={values.sampleId}
            onChange={(e) => update('sampleId', e.target.value)}
            placeholder="e.g. M8003850900"
            className={fieldClass('sampleId')}
          />
          {errors.sampleId && (
            <p className="mt-1 text-xs text-red-600">{errors.sampleId}</p>
          )}
        </div>

        {/* Timestamp */}
        <div>
          <label htmlFor="timestamp" className={labelClass}>
            Timestamp <span className="text-red-500">*</span>
          </label>
          <input
            id="timestamp"
            type="datetime-local"
            value={values.timestamp}
            onChange={(e) => update('timestamp', e.target.value)}
            className={fieldClass('timestamp')}
          />
          {errors.timestamp && (
            <p className="mt-1 text-xs text-red-600">{errors.timestamp}</p>
          )}
        </div>

        {/* Sample Type */}
        <div>
          <label htmlFor="sampleType" className={labelClass}>
            Sample Type <span className="text-red-500">*</span>
          </label>
          <select
            id="sampleType"
            value={values.sampleType}
            onChange={(e) => update('sampleType', e.target.value)}
            className={fieldClass('sampleType')}
          >
            <option value="">Select a value…</option>
            {SAMPLE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.sampleType && (
            <p className="mt-1 text-xs text-red-600">{errors.sampleType}</p>
          )}
        </div>

        {/* Location / Source */}
        <div>
          <label htmlFor="location" className={labelClass}>
            Location / Source <span className="text-red-500">*</span>
          </label>
          <input
            id="location"
            type="text"
            value={values.location}
            onChange={(e) => update('location', e.target.value)}
            placeholder="e.g. Site 9001 / Freezer A"
            className={fieldClass('location')}
          />
          {errors.location && (
            <p className="mt-1 text-xs text-red-600">{errors.location}</p>
          )}
        </div>

        {/* Tested By */}
        <div>
          <label htmlFor="testedBy" className={labelClass}>
            Tested By <span className="text-red-500">*</span>
          </label>
          <input
            id="testedBy"
            type="text"
            value={values.testedBy}
            onChange={(e) => update('testedBy', e.target.value)}
            placeholder="e.g. J. Smith"
            className={fieldClass('testedBy')}
          />
          {errors.testedBy && (
            <p className="mt-1 text-xs text-red-600">{errors.testedBy}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className={labelClass}>
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            value={values.status}
            onChange={(e) => update('status', e.target.value)}
            className={fieldClass('status')}
          >
            <option value="">Select a value…</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="mt-1 text-xs text-red-600">{errors.status}</p>
          )}
        </div>
      </div>

      {/* Notes (optional, full width) */}
      <div>
        <label htmlFor="notes" className={labelClass}>
          Notes <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          id="notes"
          rows={2}
          value={values.notes}
          onChange={(e) => update('notes', e.target.value)}
          placeholder="Any additional comments…"
          className={fieldClass('notes')}
        />
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            setValues(EMPTY())
            setErrors({})
          }}
          disabled={submitting}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Clear
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting && <Spinner />}
          {submitting ? 'Logging…' : 'Log Sample'}
        </button>
      </div>
    </form>
  )
}
