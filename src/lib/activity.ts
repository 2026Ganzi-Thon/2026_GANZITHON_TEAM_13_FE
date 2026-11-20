import { restApi, sessionApi, type RestType, type SessionRecordDto } from '@/api/endpoints'
import { findLocalMission, loadAllMissions, type Mission } from './missions'
import { createStore } from './store'
import { dayDiff, startOfDay, startOfWeek, weekdayIndex } from './time'

export type ActivityKind = 'done' | 'cancel' | 'rest' | 'skip'

export interface Activity {
  id: string
  kind: ActivityKind
  title: string
  at: string
}

const LOCAL = 'local-'
const isLocal = (id: string) => id.startsWith(LOCAL)

// 서버에 저장하지 못한 활동과 쉬기·건너뛴 날(조회 API 없음)을 담는다
const store = createStore<Activity[]>('activity', [])

function addLocal(kind: ActivityKind, title: string) {
  const list = store.get()
  const sameDay = (a: Activity) => a.kind === kind && dayDiff(new Date(a.at)) === 0
  // 쉬는 날은 하루에 한 번만 남긴다
  if ((kind === 'rest' || kind === 'skip') && list.some(sameDay)) return
  store.set([{ id: `${LOCAL}${Date.now()}`, kind, title, at: new Date().toISOString() }, ...list])
}

const doneTodayLocal = () =>
  store.get().filter((a) => a.kind === 'done' && dayDiff(new Date(a.at)) === 0).length

export const startSession = (mission: Mission) =>
  sessionApi
    .start(mission.id)
    .then((r) => String(r.sessionId))
    .catch(() => `${LOCAL}${Date.now()}`)

export async function completeSession(id: string, mission: Mission) {
  if (!isLocal(id)) {
    try {
      return (await sessionApi.complete(id)).todayCompletedCount
    } catch {
      // 서버가 응답하지 않으면 기기에 남긴다
    }
  }
  addLocal('done', mission.title)
  return doneTodayLocal()
}

export async function cancelSession(id: string, mission: Mission) {
  if (!isLocal(id)) {
    try {
      await sessionApi.cancel(id)
      return
    } catch {
      // 아래에서 기기에 남긴다
    }
  }
  addLocal('cancel', mission.title)
}

export function recordRest(type: RestType, breathingCompleted?: boolean) {
  addLocal(type === 'REST' ? 'rest' : 'skip', type === 'REST' ? '쉬어간 날' : '건너뛴 날')
  return restApi.record(type, breathingCompleted).catch(() => undefined)
}

export async function clearActivity() {
  await sessionApi.clear().catch(() => undefined)
  store.set([])
}

function fromSession(r: SessionRecordDto, titles: Map<number, string>): Activity | null {
  if (r.status === 'IN_PROGRESS') return null
  const done = r.status === 'COMPLETED'
  return {
    id: String(r.id),
    kind: done ? 'done' : 'cancel',
    title: titles.get(r.missionId) ?? findLocalMission(r.missionId)?.title ?? '작은 미션',
    at: (done ? r.completedAt : r.cancelledAt) ?? r.startedAt,
  }
}

/** 지난 활동 전체를 최신순으로 */
export async function loadActivity() {
  const local = store.get()
  let remote: Activity[] = []
  try {
    const [records, missions] = await Promise.all([sessionApi.list('all'), loadAllMissions()])
    const titles = new Map(missions.map((m) => [m.id, m.title]))
    remote = records.flatMap((r) => fromSession(r, titles) ?? [])
  } catch {
    // 서버를 쓸 수 없으면 기기에 남은 기록만 보여준다
  }
  // 서버는 +09:00, 기기 기록은 UTC(Z) 표기라 문자열이 아니라 시각으로 비교한다
  return [...remote, ...local].sort((a, b) => Date.parse(b.at) - Date.parse(a.at))
}

/** 이번 주 월~일, 미션을 해낸 날이면 true */
export function weekDone(list: Activity[]) {
  const monday = startOfWeek(new Date()).getTime()
  const days = Array<boolean>(7).fill(false)
  for (const a of list) {
    const t = new Date(a.at)
    if (a.kind === 'done' && t.getTime() >= monday) days[weekdayIndex(t)] = true
  }
  return days
}

export const isSameMonth = (a: Date, b = new Date()) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()

export const isThisWeek = (d: Date) => d >= startOfWeek(new Date()) && startOfDay(d) <= new Date()
