import { useState } from 'react'
import PortalChrome from './components/PortalChrome.jsx'
import Stepper from './components/Stepper.jsx'
import Alert from './components/Alert.jsx'
import Step1Registration from './steps/Step1Registration.jsx'
import Step2Visit from './steps/Step2Visit.jsx'
import Step3Demographic from './steps/Step3Demographic.jsx'
import Step4Samples from './steps/Step4Samples.jsx'
import VisitSaved from './steps/VisitSaved.jsx'
import {
  GOOGLE_SHEETS_WEBHOOK_URL,
  PROTOCOLS,
  SAMPLE_NAMES,
} from './config.js'

const USER_EMAIL = 'sabrina.wood@ppd.com'

// A fresh, empty requisition.
function emptyReq() {
  return {
    protocol: PROTOCOLS[0],
    subject: null, // { subjectId, yearOfBirth, gender }
    visit: '',
    demographic: { pregnancyTestRequired: '', weight: '', weightUnit: '' },
    collectionDateTime: '',
    samples: SAMPLE_NAMES.map((name) => ({
      name,
      barcode: '',
      collectionDate: '',
      status: 'Unscanned',
    })),
  }
}

const STEP_TITLES = [
  'How to Register a New Subject',
  'Select Protocol, Subject, and Visit',
  'Demographic and Clinical Information',
  'Enter Sample Collection Details',
]

export default function App() {
  const [step, setStep] = useState(0) // 0..3 wizard, 4 = saved
  const [data, setData] = useState(emptyReq)
  const [submitting, setSubmitting] = useState(false)
  const [alert, setAlert] = useState(null)
  const [savedSummary, setSavedSummary] = useState(null)

  const update = (patch) => setData((d) => ({ ...d, ...patch }))

  async function handleSubmit() {
    setAlert(null)

    if (!GOOGLE_SHEETS_WEBHOOK_URL) {
      setAlert({
        type: 'error',
        message:
          'No Google Sheets webhook configured. Set GOOGLE_SHEETS_WEBHOOK_URL in src/config.js (see README).',
      })
      return
    }

    const scanned = data.samples.filter((s) => s.status === 'Scanned')
    const payload = {
      protocol: data.protocol,
      subjectId: data.subject.subjectId,
      yearOfBirth: data.subject.yearOfBirth,
      gender: data.subject.gender,
      visit: data.visit,
      pregnancyTestRequired: data.demographic.pregnancyTestRequired,
      weight: data.demographic.weight,
      weightUnit: data.demographic.weightUnit,
      collectionDateTime: data.collectionDateTime,
      samples: scanned.map((s) => ({
        name: s.name,
        barcode: s.barcode,
        collectionDate: s.collectionDate,
        status: s.status,
      })),
    }

    setSubmitting(true)
    try {
      // text/plain avoids a CORS preflight that Apps Script can't answer.
      const res = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`Server responded with ${res.status}`)
      const result = await res.json().catch(() => ({}))
      if (result.result && result.result !== 'success') {
        throw new Error(result.message || 'Unknown error from Google Sheets.')
      }

      setSavedSummary({
        subjectId: payload.subjectId,
        visit: payload.visit,
        count: scanned.length,
      })
      setStep(4)
    } catch (err) {
      setAlert({
        type: 'error',
        message: `Failed to save visit: ${err.message}. Nothing was submitted — please try again.`,
      })
    } finally {
      setSubmitting(false)
    }
  }

  function newVisit() {
    setData(emptyReq())
    setSavedSummary(null)
    setAlert(null)
    setStep(0)
  }

  return (
    <PortalChrome userEmail={USER_EMAIL}>
      {step === 4 ? (
        <VisitSaved summary={savedSummary} onNewVisit={newVisit} />
      ) : (
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h1 className="mb-1 text-lg font-bold text-ppd-purple">
            {STEP_TITLES[step]}
          </h1>
          <p className="mb-5 text-xs text-gray-400">
            Electronic Requisition · Step {step + 1} of 4
          </p>

          <Stepper current={step} />

          {!GOOGLE_SHEETS_WEBHOOK_URL && (
            <div className="mb-4">
              <Alert
                type="info"
                message="Setup needed: paste your Google Apps Script Web App URL into src/config.js (GOOGLE_SHEETS_WEBHOOK_URL) to enable syncing. See the README."
              />
            </div>
          )}

          {alert && (
            <div className="mb-4">
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(null)}
              />
            </div>
          )}

          {step === 0 && (
            <Step1Registration
              data={data}
              update={update}
              onNext={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <Step2Visit
              data={data}
              update={update}
              onNext={() => setStep(2)}
              onBack={() => setStep(0)}
            />
          )}
          {step === 2 && (
            <Step3Demographic
              data={data}
              update={update}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <Step4Samples
              data={data}
              update={update}
              onSubmit={handleSubmit}
              onBack={() => setStep(2)}
              submitting={submitting}
            />
          )}
        </div>
      )}
    </PortalChrome>
  )
}
