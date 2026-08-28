import { useState } from 'react'
import { VISITS } from '../config.js'
import {
  Field,
  fieldClass,
  GreenButton,
  GhostButton,
  Callout,
} from '../components/ui.jsx'

// Step 2 — Select Protocol, Subject, and Visit.
export default function Step2Visit({ data, update, onNext, onBack }) {
  const [error, setError] = useState('')

  function next() {
    if (!data.visit) {
      setError('Please select a visit.')
      return
    }
    onNext()
  }

  return (
    <div className="space-y-5">
      <Callout>Select Protocol, Subject, and Visit.</Callout>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Protocol">
          <input
            value={data.protocol}
            readOnly
            className={`${fieldClass()} cursor-not-allowed bg-gray-50 text-gray-500`}
          />
        </Field>

        <Field label="Subject">
          <input
            value={`${data.subject.subjectId}(s)`}
            readOnly
            className={`${fieldClass()} cursor-not-allowed bg-gray-50 text-gray-500`}
          />
        </Field>

        <Field label="Visit" required error={error}>
          <select
            value={data.visit}
            onChange={(e) => {
              update({ visit: e.target.value })
              setError('')
            }}
            className={fieldClass({ required: true, error })}
          >
            <option value="">Select Visit</option>
            {VISITS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="flex justify-between border-t pt-4">
        <GhostButton onClick={onBack}>← Back</GhostButton>
        <GreenButton onClick={next}>Next: Demographics →</GreenButton>
      </div>
    </div>
  )
}
