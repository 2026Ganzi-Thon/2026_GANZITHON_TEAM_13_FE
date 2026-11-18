const DAY = 86_400_000

export const formatDuration = (sec: number) => (sec < 60 ? `${sec}초` : `${Math.round(sec / 60)}분`)

export const formatClock = (sec: number) =>
  `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

/** 월요일 = 0 */
export const weekdayIndex = (d: Date) => (d.getDay() + 6) % 7

export const startOfWeek = (d: Date) => new Date(startOfDay(d).getTime() - weekdayIndex(d) * DAY)

export const dayDiff = (from: Date, to = new Date()) =>
  Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / DAY)

export function formatDay(date: Date) {
  const diff = dayDiff(date)
  if (diff === 0) return '오늘'
  if (diff === 1) return '어제'
  const label = date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })
  return label
}

export const formatTime = (date: Date) =>
  date.toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' })
