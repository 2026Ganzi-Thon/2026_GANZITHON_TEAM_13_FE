import { createStore } from './store'
import { dayDiff, startOfDay, weekdayIndex } from './time'

export interface Entry {
  id: string
  kind: 'done' | 'rest'
  title: string
  at: string
}

const store = createStore<Entry[]>('entries', [])

export const useEntries = store.use

export function addEntry(kind: Entry['kind'], title: string) {
  const list = store.get()
  const today = new Date()
  // 쉬는 날은 하루에 한 번만 남긴다
  if (kind === 'rest' && list.some((e) => e.kind === 'rest' && dayDiff(new Date(e.at)) === 0)) return
  store.set([{ id: String(Date.now()), kind, title, at: today.toISOString() }, ...list])
}

export const clearEntries = () => store.set([])

export const doneToday = (list: Entry[]) =>
  list.filter((e) => e.kind === 'done' && dayDiff(new Date(e.at)) === 0).length

/** 이번 주 월~일, 미션을 해낸 날이면 true */
export function weekProgress(list: Entry[]) {
  const now = new Date()
  const monday = startOfDay(now).getTime() - weekdayIndex(now) * 86_400_000
  const days = Array<boolean>(7).fill(false)
  for (const e of list) {
    const t = new Date(e.at)
    if (e.kind === 'done' && t.getTime() >= monday) days[weekdayIndex(t)] = true
  }
  return days
}
