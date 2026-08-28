// The persistent Preclarus "Investigator Site Portal" chrome:
// purple brand bar + primary navigation + entry sub-tabs.
// Mirrors the header seen throughout the eReq manual screenshots.

const NAV = [
  'Electronic Requisition',
  'Reports',
  'Views',
  'Query Center',
  'Supplies',
  'Documents',
  'Shipment',
  'User Management',
]

export default function PortalChrome({ userEmail, children }) {
  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      {/* Brand bar */}
      <div className="bg-gradient-to-r from-ppd-purpleDark to-ppd-purpleLight text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-3">
            <span className="rounded bg-white px-2 py-0.5 text-sm font-extrabold italic tracking-tight text-ppd-purple">
              PPD
            </span>
            <span className="text-lg font-light">
              Preclarus<sup className="text-[0.6rem]">®</sup>
            </span>
            <span className="hidden text-white/40 sm:inline">|</span>
            <span className="hidden text-sm font-semibold tracking-[0.2em] text-white/80 sm:inline">
              INVESTIGATOR SITE PORTAL
            </span>
          </div>
          <div className="hidden items-center gap-4 text-xs text-white/80 md:flex">
            <span>⌂</span>
            <span>ⓘ Help</span>
            <span>
              Welcome, <span className="font-semibold">{userEmail}</span> ▾
            </span>
          </div>
        </div>
      </div>

      {/* Primary navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-x-5 gap-y-1 overflow-x-auto px-4">
          {NAV.map((item, i) => (
            <span
              key={item}
              className={`whitespace-nowrap border-b-2 py-2.5 text-[0.8rem] ${
                i === 0
                  ? 'border-ppd-purple font-semibold text-ppd-purple'
                  : 'border-transparent text-gray-500'
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </nav>

      {/* Entry sub-tabs */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto flex max-w-6xl gap-6 px-4">
          <span className="border-b-2 border-ppd-purple py-2 text-xs font-semibold tracking-wide text-ppd-purple">
            REGISTRATION &amp; REQUISITION ENTRY
          </span>
          <span className="border-b-2 border-transparent py-2 text-xs font-medium tracking-wide text-gray-400">
            REQUISITION FORMS
          </span>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>

      <footer className="mx-auto max-w-6xl px-4 pb-8 text-center text-[0.7rem] text-gray-400">
        eReq demo · session data syncs to your Google Sheet · deployed on GitHub
        Pages · inspired by PPD Preclarus (FORM-05150)
      </footer>
    </div>
  )
}
