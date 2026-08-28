import { GreenButton, GhostButton } from '../components/ui.jsx'

// "Visit Saved" confirmation dialog — matches step 11 of the manual.
export default function VisitSaved({ summary, onNewVisit }) {
  return (
    <div className="mx-auto max-w-lg rounded-xl border border-ppd-green/40 bg-white p-6 text-center shadow-sm">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-ppd-green text-2xl text-white">
        ✓
      </div>
      <h2 className="text-lg font-semibold text-gray-800">Visit Saved</h2>
      <p className="mt-1 text-sm text-gray-500">
        Visit information has been saved successfully and synced to Google
        Sheets.
      </p>

      <dl className="mx-auto mt-5 grid max-w-sm grid-cols-2 gap-x-4 gap-y-2 rounded-lg bg-gray-50 px-4 py-3 text-left text-sm">
        <dt className="text-gray-500">Subject</dt>
        <dd className="font-mono">{summary.subjectId}</dd>
        <dt className="text-gray-500">Visit</dt>
        <dd>{summary.visit}</dd>
        <dt className="text-gray-500">Samples logged</dt>
        <dd className="font-semibold text-ppd-purple">{summary.count}</dd>
      </dl>

      <div className="mt-6 flex justify-center gap-3">
        <GhostButton onClick={onNewVisit}>View Requisition</GhostButton>
        <GreenButton onClick={onNewVisit}>New Visit</GreenButton>
      </div>
    </div>
  )
}
