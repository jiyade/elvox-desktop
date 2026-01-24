export const formatRemaining = (ms) => {
  const totalSeconds = Math.floor(ms / 1000)

  const s = totalSeconds % 60
  const totalMinutes = Math.floor(totalSeconds / 60)
  const m = totalMinutes % 60
  const totalHours = Math.floor(totalMinutes / 60)
  const h = totalHours % 24
  const d = Math.floor(totalHours / 24)

  const pad = (n) => String(n).padStart(2, '0')

  if (d > 0) {
    return `${d}d:${pad(h)}h:${pad(m)}m:${pad(s)}s`
  }

  return `${pad(totalHours)}:${pad(m)}:${pad(s)}`
}
