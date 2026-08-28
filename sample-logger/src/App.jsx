import { useState } from 'react'
import SampleForm from './components/SampleForm.jsx'
import SampleTable from './components/SampleTable.jsx'
import Alert from './components/Alert.jsx'
import { GOOGLE_SHEETS_WEBHOOK_URL } from './config.js'

export default function App() {
  const [samples, setSamples] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [alert, setAlert] = useState(null) // { type, message }

  async function handleSubmit(values) {
    setAlert(null)

    if (!GOOGLE_SHEETS_WEBHOOK_URL) {
      setAlert({
        type: 'error',
        message:
          'No Google Sheets webhook configured. Set GOOGLE_SHEETS_WEBHOOK_URL in src/config.js (see README).',
      })
      return false
    }

    setSubmitting(true)
    try {
      // NOTE: We send the body as text/plain on purpose. Google Apps Script
      // web apps do not respond to CORS preflight (OPTIONS) requests, and a
      // JSON content-type would trigger one. text/plain is a "simple request"
      // that skips preflight while still delivering a JSON string the server
      // parses with JSON.parse(e.postData.contents).
      const response = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`)
      }

      // Apps Script returns { result: 'success' } on success.
      const data = await response.json().catch(() => ({}))
      if (data.result && data.result !== 'success') {
        throw new Error(data.message || 'Unknown error from Google Sheets.')
      }

      // Add to the session table with a stable local id.
      setSamples((prev) => [
        { ...values, _id: `${values.sampleId}-${prev.length}-${values.timestamp}` },
        ...prev,
      ])
      setAlert({
        type: 'success',
        message: `Sample "${values.sampleId}" logged and synced to Google Sheets.`,
      })
      return true
    } catch (err) {
      setAlert({
        type: 'error',
        message: `Failed to log sample: ${err.message}. It was not saved — please try again.`,
      })
      return false
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header */}
      <header className="bg-brand text-white shadow">
        <div className="mx-auto max-w-5xl px-4 py-5">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            Sample Logger
          </h1>
          <p className="mt-1 text-sm text-purple-100">
            Log laboratory samples and sync each entry to Google Sheets.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-4 py-8">
        {/* Config warning */}
        {!GOOGLE_SHEETS_WEBHOOK_URL && (
          <Alert
            type="info"
            message="Setup needed: paste your Google Apps Script Web App URL into src/config.js (GOOGLE_SHEETS_WEBHOOK_URL) to enable syncing. See the README."
          />
        )}

        {/* Form card */}
        <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Log a new sample
          </h2>
          {alert && (
            <div className="mb-4">
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(null)}
              />
            </div>
          )}
          <SampleForm onSubmit={handleSubmit} submitting={submitting} />
        </section>

        {/* Table card */}
        <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              This session
            </h2>
            <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
              {samples.length} logged
            </span>
          </div>
          <SampleTable samples={samples} />
        </section>
      </main>

      <footer className="mx-auto max-w-5xl px-4 pb-8 text-center text-xs text-gray-400">
        Session-only table · data persists in your Google Sheet · deployed on
        GitHub Pages
      </footer>
    </div>
  )
}
