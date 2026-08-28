// Displays samples logged during the current session.
const COLUMNS = [
  { key: 'sampleId', label: 'Sample ID' },
  { key: 'timestamp', label: 'Timestamp' },
  { key: 'sampleType', label: 'Type' },
  { key: 'location', label: 'Location / Source' },
  { key: 'testedBy', label: 'Tested By' },
  { key: 'status', label: 'Status' },
  { key: 'notes', label: 'Notes' },
]

const STATUS_STYLES = {
  Collected: 'bg-blue-100 text-blue-800',
  Scanned: 'bg-indigo-100 text-indigo-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Received: 'bg-green-100 text-green-800',
  'On Hold': 'bg-amber-100 text-amber-800',
}

function formatTimestamp(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return ts
  return d.toLocaleString()
}

export default function SampleTable({ samples }) {
  if (samples.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center text-sm text-gray-500">
        No samples logged yet this session. Submit the form above to get started.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {COLUMNS.map((c) => (
              <th
                key={c.key}
                scope="col"
                className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-600"
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {samples.map((s) => (
            <tr key={s._id} className="hover:bg-gray-50">
              {COLUMNS.map((c) => (
                <td key={c.key} className="px-4 py-3 align-top text-gray-700">
                  {c.key === 'timestamp' ? (
                    formatTimestamp(s[c.key])
                  ) : c.key === 'status' ? (
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        STATUS_STYLES[s.status] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {s.status}
                    </span>
                  ) : c.key === 'sampleId' ? (
                    <span className="font-mono text-gray-900">{s[c.key]}</span>
                  ) : (
                    s[c.key] || <span className="text-gray-300">—</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
