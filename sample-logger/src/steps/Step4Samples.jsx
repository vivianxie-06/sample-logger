import { useRef, useState } from 'react'
import { Field, fieldClass, GreenButton, GhostButton, Callout } from '../components/ui.jsx'
import Spinner from '../components/Spinner.jsx'

// Format a datetime-local value ("2019-04-03T09:30") as "03-Apr-2019".
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function fmtDate(dtLocal) {
  if (!dtLocal) return ''
  const d = new Date(dtLocal)
  if (Number.isNaN(d.getTime())) return ''
  return `${String(d.getDate()).padStart(2, '0')}-${MONTHS[d.getMonth()]}-${d.getFullYear()}`
}

// Step 4 — Enter collection details, scan barcodes into the sample table, submit.
export default function Step4Samples({
  data,
  update,
  onSubmit,
  onBack,
  submitting,
}) {
  const [scanValue, setScanValue] = useState('')
  const scanRef = useRef(null)
  const samples = data.samples
  const scannedCount = samples.filter((s) => s.status === 'Scanned').length
  const collectionLabel = fmtDate(data.collectionDateTime)

  function setSamples(next) {
    update({ samples: next })
  }

  // Assign a barcode to a specific row (marks it Scanned).
  function scanRow(index, barcode) {
    const next = samples.map((s, i) =>
      i === index
        ? {
            ...s,
            barcode,
            status: barcode.trim() ? 'Scanned' : 'Unscanned',
            collectionDate: barcode.trim() ? collectionLabel : '',
          }
        : s,
    )
    setSamples(next)
  }

  function unscan(index) {
    scanRow(index, '')
  }

  // Global "Enter/Scan Barcode": fill the first unscanned row.
  function handleScanSubmit(e) {
    e.preventDefault()
    const code = scanValue.trim()
    if (!code) return
    const idx = samples.findIndex((s) => s.status !== 'Scanned')
    if (idx === -1) return
    scanRow(idx, code)
    setScanValue('')
    scanRef.current?.focus()
  }

  return (
    <div className="space-y-5">
      <Callout>
        Enter the collection date &amp; time, then scan (or type) each sample
        barcode. Based on the barcode entered, the data is populated against the
        relevant sample.
      </Callout>

      {/* Collection date/time + scan box */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Collection Date & Time" required hint={collectionLabel}>
          <input
            type="datetime-local"
            value={data.collectionDateTime}
            onChange={(e) => update({ collectionDateTime: e.target.value })}
            className={fieldClass({ required: true })}
          />
        </Field>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Enter / Scan Barcode
          </label>
          <form onSubmit={handleScanSubmit} className="flex gap-2">
            <input
              ref={scanRef}
              value={scanValue}
              onChange={(e) => setScanValue(e.target.value)}
              placeholder="▮▮▮ Scan or type a barcode, press Enter"
              className={fieldClass()}
            />
            <GhostButton type="submit">Enter</GhostButton>
          </form>
          <p className="mt-1 text-xs text-gray-500">
            <span className="font-semibold text-ppd-purple">
              {scannedCount}
            </span>{' '}
            of {samples.length} samples scanned
          </p>
        </div>
      </div>

      {/* Sample collection table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Sample Name', 'Barcode', 'Collection Date', 'Status'].map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap px-4 py-2.5 text-left font-semibold text-gray-600"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {samples.map((s, i) => {
              const scanned = s.status === 'Scanned'
              return (
                <tr key={s.name} className={scanned ? 'bg-green-50/50' : ''}>
                  <td className="px-4 py-2 font-medium text-gray-700">{s.name}</td>
                  <td className="px-4 py-2">
                    <input
                      value={s.barcode}
                      onChange={(e) => scanRow(i, e.target.value)}
                      placeholder="—"
                      className="w-40 rounded border border-gray-200 px-2 py-1 font-mono text-xs focus:border-ppd-purpleLight focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {s.collectionDate || <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-2">
                    {scanned ? (
                      <button
                        onClick={() => unscan(i)}
                        className="text-xs font-semibold text-ppd-purple hover:underline"
                        title="Clear this scan"
                      >
                        Unscan
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">Unscanned</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <GhostButton onClick={onBack} disabled={submitting}>
          ← Back
        </GhostButton>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            {scannedCount === 0
              ? 'Scan at least one sample to submit.'
              : `${scannedCount} sample(s) ready.`}
          </span>
          <GreenButton
            onClick={onSubmit}
            disabled={submitting || scannedCount === 0 || !data.collectionDateTime}
          >
            {submitting && <Spinner />}
            {submitting ? 'Saving…' : 'Save / Submit'}
          </GreenButton>
        </div>
      </div>
    </div>
  )
}
