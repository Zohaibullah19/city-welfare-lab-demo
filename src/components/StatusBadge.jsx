const COLOR_MAP = {
  // order / workflow statuses
  Pending: 'amber',
  'Results Entered': 'blue',
  Reported: 'green',
  Cancelled: 'red',
  // payment statuses
  Paid: 'green',
  Partial: 'amber',
  Unpaid: 'red',
  // result flags
  Normal: 'green',
  Abnormal: 'red',
  High: 'red',
  Low: 'amber',
  Positive: 'red',
  Negative: 'green',
  'Not specified': 'gray',
  // test catalog status
  Active: 'green',
  Disabled: 'gray'
}

export default function StatusBadge({ status }) {
  const color = COLOR_MAP[status] || 'gray'
  return (
    <span className={`badge badge-${color}`}>
      <span className="badge-dot" />
      {status}
    </span>
  )
}
