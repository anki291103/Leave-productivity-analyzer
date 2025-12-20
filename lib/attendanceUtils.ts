export function getExpectedHours(date: Date): number {
  const day = date.getDay()

  if (day === 0) {
    // Sunday
    return 0
  }

  if (day === 6) {
    // Saturday
    return 4
  }

  // Monday to Friday
  return 8.5
}

export function calculateWorkedHours(
  inTime?: string,
  outTime?: string
): number {
  if (!inTime || !outTime) {
    return 0
  }

  const start = new Date(`1970-01-01T${inTime}:00`)
  const end = new Date(`1970-01-01T${outTime}:00`)

  const diffMs = end.getTime() - start.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)

  return diffHours > 0 ? diffHours : 0
}

export function isLeaveDay(
  date: Date,
  inTime?: string,
  outTime?: string
): boolean {
  const day = date.getDay()

  // Sunday is always off
  if (day === 0) {
    return false
  }

  // Missing attendance on working day = leave
  if (!inTime || !outTime) {
    return true
  }

  return false
}
