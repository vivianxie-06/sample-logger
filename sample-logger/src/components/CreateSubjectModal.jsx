import { useState } from 'react'
import { GENDERS } from '../config.js'
import {
  Field,
  fieldClass,
  GreenButton,
  GhostButton,
  RequirementLegend,
} from './ui.jsx'

// "Create New Subject: Details" modal — matches steps 3 & 4 of the manual:
// Subject ID (8 characters), Year of Birth (YYYY), Gender (Select a value).
export default function CreateSubjectModal({ onCreate, onDiscard }) {
  const [subjectId, setSubjectId] = useState('')
  const [yearOfBirth, setYearOfBirth] = useState('')
  const [gender, setGender] = useState('')
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!/^.{8}$/.test(subjectId.trim()))
      e.subjectId = 'Subject ID must be 8 characters.'
    if (!/^\d{4}$/.test(yearOfBirth.trim()))
      e.yearOfBirth = 'Enter a 4-digit year (YYYY).'
    if (!gender) e.gender = 'Gender is required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function submit() {
    if (!validate()) return
    onCreate({ subjectId: subjectId.trim(), yearOfBirth: yearOfBirth.trim(), gender })
  }

  return (
    <div className="fixed inset-0 z-20 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h3 className="text-sm font-semibold text-gray-800">
            Create New Subject: Details
          </h3>
          <button
            onClick={onDiscard}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="px-5 py-4">
          <RequirementLegend />
          <div className="space-y-4">
            <Field label="Subject ID" required error={errors.subjectId}>
              <input
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                placeholder="8 characters"
                maxLength={8}
                className={fieldClass({ required: true, error: errors.subjectId })}
              />
            </Field>

            <Field label="Year of Birth" query error={errors.yearOfBirth}>
              <input
                value={yearOfBirth}
                onChange={(e) => setYearOfBirth(e.target.value)}
                placeholder="YYYY"
                maxLength={4}
                inputMode="numeric"
                className={fieldClass({ query: true, error: errors.yearOfBirth })}
              />
            </Field>

            <Field label="Gender" required error={errors.gender}>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={fieldClass({ required: true, error: errors.gender })}
              >
                <option value="">Select a value</option>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t px-5 py-3">
          <GhostButton onClick={onDiscard}>Discard</GhostButton>
          <GreenButton onClick={submit}>Create</GreenButton>
        </div>
      </div>
    </div>
  )
}
