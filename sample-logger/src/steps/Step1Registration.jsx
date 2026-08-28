import { useState } from 'react'
import { PROTOCOLS } from '../config.js'
import CreateSubjectModal from '../components/CreateSubjectModal.jsx'
import { Field, fieldClass, GreenButton, Callout } from '../components/ui.jsx'

// Step 1 — pick the Protocol ID, then register a new subject.
export default function Step1Registration({ data, update, onNext }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="space-y-5">
      <Callout>
        Use the drop-down to select the Protocol ID, then click{' '}
        <strong>New Subject</strong> to register a subject.
      </Callout>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Protocol ID">
          <select
            value={data.protocol}
            onChange={(e) => update({ protocol: e.target.value })}
            className={fieldClass()}
          >
            {PROTOCOLS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {data.subject ? (
        <div className="flex items-center justify-between rounded-lg border border-ppd-green/40 bg-green-50 px-4 py-3">
          <div className="text-sm">
            <span className="font-semibold text-gray-800">Subject registered:</span>{' '}
            <span className="font-mono">{data.subject.subjectId}</span>
            <span className="text-gray-500">
              {' '}
              · YOB {data.subject.yearOfBirth} · {data.subject.gender}
            </span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs font-medium text-ppd-purple hover:underline"
          >
            Edit
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded border border-ppd-purple/30 bg-white px-4 py-2 text-sm font-medium text-ppd-purple shadow-sm hover:bg-ppd-purple/5"
        >
          <span className="text-lg leading-none">＋</span> New Subject
        </button>
      )}

      <div className="flex justify-end border-t pt-4">
        <GreenButton disabled={!data.subject} onClick={onNext}>
          Next: Select Visit →
        </GreenButton>
      </div>

      {showModal && (
        <CreateSubjectModal
          onDiscard={() => setShowModal(false)}
          onCreate={(subject) => {
            update({ subject })
            setShowModal(false)
          }}
        />
      )}
    </div>
  )
}
