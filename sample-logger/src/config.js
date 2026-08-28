// ---------------------------------------------------------------------------
// CONFIGURATION
// ---------------------------------------------------------------------------
// Paste your Google Apps Script Web App URL here after deploying it.
// See the README for step-by-step setup instructions.
//
// It should look like:
//   https://script.google.com/macros/s/AKfycb.................../exec
//
// You can also override this at build time with a Vite env var:
//   VITE_GOOGLE_SHEETS_WEBHOOK_URL=... npm run build
// ---------------------------------------------------------------------------

export const GOOGLE_SHEETS_WEBHOOK_URL =
  import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL || ''

// Dropdown options for the "Sample Type" field. Tweak to match your study.
export const SAMPLE_TYPES = [
  'Chemistry',
  'Hematology',
  'Urinalysis',
  'Serum Lipids',
  'Coagulation',
  'Serology',
  'Other',
]

// Dropdown options for the "Status" field.
export const STATUS_OPTIONS = [
  'Collected',
  'Scanned',
  'Shipped',
  'Received',
  'On Hold',
]
