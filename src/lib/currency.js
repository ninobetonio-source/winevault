const pesoFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 2
})

export function formatPeso(value) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return pesoFormatter.format(0)
  return pesoFormatter.format(amount)
}