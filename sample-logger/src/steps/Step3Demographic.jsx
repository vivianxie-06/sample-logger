import { WEIGHT_UNITS } from '../config.js'
import {
  Field,
  fieldClass,
  GreenButton,
  GhostButton,
  Callout,
  RequirementLegend,
} from '../components/ui.jsx'

// Step 3 — Demographic and Clinical Information.
export default function Step3Demographic({ data, update, onNext, onBack }) {
  const d = data.demographic

  return (
    <div className="space-y-5">
      <Callout>Enter the demographic and clinical details for the registered subject.</Callout>

      {/* Read-only subject banner */}
      <div className="grid grid-cols-1 gap-2 rounded-lg bg-gray-50 px-4 py-3 text-sm sm:grid-cols-3">
        <div>
          <span className="text-gray-500">Subject ID: </span>
          <span className="font-mono font-medium">{data.subject.subjectId}</span>
        </div>
        <div>
          <span className="text-gray-500">Year of Birth: </span>
          <span className="font-medium">{data.subject.yearOfBirth}</span>
        </div>
        <div>
          <span className="text-gray-500">Gender: </span>
          <span className="font-medium">{data.subject.gender}</span>
        </div>
      </div>

      <RequirementLegend />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Is Pregnancy Test Required?" query>
          <select
            value={d.pregnancyTestRequired}
            onChange={(e) =>
              update({
                demographic: { ...d, pregnancyTestRequired: e.target.value },
              })
            }
            className={fieldClass({ query: true })}
          >
            <option value="">Select a value</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </Field>

        <Field label="Weight" query>
          <input
            value={d.weight}
            onChange={(e) => update({ demographic: { ...d, weight: e.target.value } })}
            placeholder="Weight"
            inputMode="decimal"
            className={fieldClass({ query: true })}
          />
        </Field>

        <Field label="Unit">
          <select
            value={d.weightUnit}
            onChange={(e) =>
              update({ demographic: { ...d, weightUnit: e.target.value } })
            }
            className={fieldClass()}
          >
            <option value="">Select…</option>
            {WEIGHT_UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="flex justify-between border-t pt-4">
        <GhostButton onClick={onBack}>← Back</GhostButton>
        <GreenButton onClick={onNext}>Next: Sample Collection →</GreenButton>
      </div>
    </div>
  )
}
