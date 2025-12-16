// Helper functions for time formatting
export function formatDuration(decimalMinutes) {
  if (!decimalMinutes || decimalMinutes <= 0) return '00:00'

  const totalSeconds = Math.round(decimalMinutes * 60)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}