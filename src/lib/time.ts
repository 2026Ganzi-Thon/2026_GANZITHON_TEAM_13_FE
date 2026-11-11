const DAY = 86_400_000

export const formatDuration = (sec: number) => (sec < 60 ? `${sec}초` : `${Math.round(sec / 60)}분`)

export const formatClock = (sec: number) =>
  `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

/** 월요일 = 0 */
export const weekdayIndex = (d: Date) => (d.getDay() + 6) % 7

export const dayDiff = (from: Date, to = new Date()) =>
  Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / DAY)

export function formatWhen(date: Date) {
  const diff = dayDiff(date)
  if (diff === 0) return '오늘'
  if (diff === 1) return '어제'
  return date.toLocaleDateString('ko-KR', { weekday: 'long' })
}
