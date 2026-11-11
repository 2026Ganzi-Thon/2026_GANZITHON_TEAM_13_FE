import { formatDuration } from './time'

export type Place = 'indoor' | 'outdoor'

export interface Mission {
  id: number
  title: string
  seconds: number
  place: Place
}

// 기획 문서(11/07 미션 정리)와 동일. 미션 API가 열리면 이 목록만 fetch로 교체한다.
const indoor: [string, number][] = [
  ['쓰레기 치우기', 60],
  ['물 한 잔 마시기', 60],
  ['분리 수거 하기', 300],
  ['집 안 환기하기', 60],
  ['옷 개기', 300],
  ['웹툰 한 편 보기', 60],
  ['좋아하는 음악 듣기', 180],
  ['책상 정리하기', 60],
  ['스트레칭 하기', 60],
  ['스쿼트 5개 하기', 60],
]

const outdoor: [string, number][] = [
  ['주변 산책하기', 600],
  ['근처 편의점에서 신상 제품 하나 사기', 600],
  ['도서관에서 책 빌리기', 900],
  ['동물 사진찍기', 600],
  ['하늘 사진 찍기', 600],
  ['길거리 쓰레기 줍기', 600],
  ['들꽃 사진 찍기', 600],
  ['근처 공원 한 바퀴 돌기', 900],
]

export const missions: Mission[] = [
  ...indoor.map(([title, seconds], i): Mission => ({ id: i + 1, title, seconds, place: 'indoor' })),
  ...outdoor.map(([title, seconds], i): Mission => ({
    id: indoor.length + i + 1,
    title,
    seconds,
    place: 'outdoor',
  })),
]

export const placeLabel: Record<Place, string> = { indoor: '집 안', outdoor: '집 밖' }

export const findMission = (id: number) => missions.find((m) => m.id === id)

export const isPlace = (v: string | undefined): v is Place => v === 'indoor' || v === 'outdoor'

function shuffle<T>(list: T[]) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const randomMission = (place: Place) =>
  shuffle(missions.filter((m) => m.place === place))[0]

export const randomMissions = (count: number) => shuffle(missions).slice(0, count)

export const missionMeta = (m: Mission) => `${placeLabel[m.place]} 미션 · ${formatDuration(m.seconds)}`
