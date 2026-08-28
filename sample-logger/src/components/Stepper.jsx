// Numbered progress rail echoing the yellow numbered circles in the manual.
// Completed = green check, current = amber, upcoming = gray.
const STEPS = [
  'Register Subject',
  'Select Visit',
  'Demographics',
  'Sample Collection',
]

export default function Stepper({ current }) {
  return (
    <ol className="mb-6 flex items-center">
      {STEPS.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-sm ${
                  done
                    ? 'bg-ppd-green text-white'
                    : active
                      ? 'bg-ppd-amber text-white ring-4 ring-ppd-amber/20'
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {done ? '✓' : i + 1}
              </span>
              <span
                className={`hidden text-sm sm:inline ${
                  active
                    ? 'font-semibold text-ppd-purple'
                    : done
                      ? 'text-gray-600'
                      : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-3 h-0.5 flex-1 ${
                  done ? 'bg-ppd-green' : 'bg-gray-200'
                }`}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
