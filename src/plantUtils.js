// Dates are stored as local "YYYY-MM-DD" strings so time zones never shift a watering day.

export function toISODate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function todayISO() {
  return toISODate(new Date())
}

function parseISODate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function nextWateringDate(plant) {
  const next = parseISODate(plant.lastWatered)
  next.setDate(next.getDate() + plant.waterEveryDays)
  return next
}

// Positive: days left. 0: due today. Negative: days overdue.
export function daysUntilWatering(plant, today = todayISO()) {
  const ms = nextWateringDate(plant) - parseISODate(today)
  return Math.round(ms / 86_400_000)
}

export function getMood(plant) {
  const days = daysUntilWatering(plant)
  if (days > 0) {
    return {
      status: 'happy',
      emoji: '😊',
      label: days === 1 ? 'Water tomorrow' : `Water in ${days} days`,
    }
  }
  if (days === 0) {
    return { status: 'due', emoji: '😐', label: 'Water today' }
  }
  const overdue = -days
  return {
    status: 'overdue',
    emoji: '😢',
    label: overdue === 1 ? '1 day overdue' : `${overdue} days overdue`,
  }
}

export function formatDate(iso) {
  return parseISODate(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
