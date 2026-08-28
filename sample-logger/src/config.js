// ---------------------------------------------------------------------------
// CONFIGURATION
// ---------------------------------------------------------------------------
// Paste your Google Apps Script Web App URL here after deploying it.
// See the README for step-by-step setup instructions.
//
//   https://script.google.com/macros/s/AKfycb.................../exec
//
// You can also override this at build time with a Vite env var:
//   VITE_GOOGLE_SHEETS_WEBHOOK_URL=... npm run build
// ---------------------------------------------------------------------------

export const GOOGLE_SHEETS_WEBHOOK_URL =
  import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL || ''

// Protocol / Site options for the top-left dropdown ("ITF - Site: 9001").
export const PROTOCOLS = ['ITF - Site: 9001']

// Visit options — taken directly from the "Select Visit" dropdown in the manual.
export const VISITS = [
  '1 Screening (D -60 to -31)',
  '2 Baseline (D -30 to -1)',
  '3 (Wk 1)',
  '4 (Wk 3)',
  '6 (Wk 7)',
]

export const GENDERS = ['Male', 'Female']

// Weight unit options.
export const WEIGHT_UNITS = ['kg', 'lb']

// The sample panel — the "Sample Name" rows from the Sample Collection table.
export const SAMPLE_NAMES = [
  '24Hr Creatinine Clearance',
  '24hr Urine Protein',
  'APO54',
  'Chemistry',
  'CK Isoenzymes',
  'Fibrinogen',
  'Serum Lipids',
  'Troponin I and T',
  'TSH/FT3/FT4/B12',
  'Urinalysis',
]
