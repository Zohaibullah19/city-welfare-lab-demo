export function formatCurrency(amount) {
  const n = Number(amount) || 0
  return `Rs. ${n.toLocaleString('en-PK')}`
}

export function formatDate(dateString, opts = {}) {
  const d = dateString ? new Date(dateString) : new Date()
  if (Number.isNaN(d.getTime())) return dateString || ''
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...opts
  })
}

export function formatDateTime(dateString) {
  const d = dateString ? new Date(dateString) : new Date()
  if (Number.isNaN(d.getTime())) return dateString || ''
  return `${formatDate(dateString)} · ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
}
