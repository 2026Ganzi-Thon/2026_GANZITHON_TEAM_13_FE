import { type Category, type MissionDto, missionApi } from '@/api/endpoints'
import { formatDuration } from './time'

export type Place = 'indoor' | 'outdoor'

export interface Mission {
  id: number
  title: string
  description: string
  seconds: number
  place: Place
}

const toMission = (m: MissionDto): Mission => ({
  id: m.missionId,
  title: m.title,
  description: m.description,
  seconds: m.durationSeconds,
  place: m.category === 'INDOOR' ? 'indoor' : 'outdoor',
})

const category = (place: Place): Category => (place === 'indoor' ? 'INDOOR' : 'OUTDOOR')

// 서버를 쓸 수 없을 때 쓰는 기본 목록 (Notion 미션 정리와 동일)
const fallback: Omit<Mission, 'id' | 'place'>[] = [
  { title: '쓰레기 치우기', seconds: 60, description: '주변을 가볍게 정리해 봐요' },
  { title: '물 한 잔 마시기', seconds: 60, description: '몸에 수분을 채워주세요' },
  { title: '분리 수거 하기', seconds: 300, description: '재활용할 것들을 구분해 봐요' },
  { title: '집 안 환기하기', seconds: 60, description: '창문을 열고 신선한 공기를 들여요' },
  { title: '옷 개기', seconds: 300, description: '쌓인 옷을 차곡차곡 정리해 봐요' },
  { title: '웹툰 한 편 보기', seconds: 60, description: '짧은 이야기로 기분을 전환해요' },
  { title: '좋아하는 음악 듣기', seconds: 180, description: '좋아하는 멜로디에 잠시 귀 기울여요' },
  { title: '책상 정리하기', seconds: 60, description: '책상 위 작은 공간부터 정리해 봐요' },
  { title: '스트레칭 하기', seconds: 60, description: '굳어 있는 몸을 천천히 풀어줘요' },
  { title: '스쿼트 5개 하기', seconds: 60, description: '가볍게 움직이며 몸을 깨워봐요' },
  { title: '주변 산책하기', seconds: 600, description: '가벼운 걸음으로 주변 풍경을 둘러봐요' },
  { title: '근처 편의점에서 신상 제품 하나 사기', seconds: 600, description: '새로운 간식이나 음료를 골라봐요' },
  { title: '도서관에서 책 빌리기', seconds: 900, description: '관심 가는 책 한 권을 찾아봐요' },
  { title: '동물 사진 찍기', seconds: 600, description: '귀여운 동물의 순간을 사진으로 남겨봐요' },
  { title: '하늘 사진 찍기', seconds: 600, description: '오늘의 하늘을 사진에 담아봐요' },
  { title: '길거리 쓰레기 줍기', seconds: 600, description: '지나치는 거리를 깨끗하게 만들어봐요' },
  { title: '들꽃 사진 찍기', seconds: 600, description: '길에 핀 작은 꽃을 발견해 봐요' },
  { title: '근처 공원 한 바퀴 돌기', seconds: 900, description: '공원을 천천히 걸으며 바람을 느껴봐요' },
]

const local: Mission[] = fallback.map((m, i) => ({
  ...m,
  id: i + 1,
  place: i < 10 ? 'indoor' : 'outdoor',
}))

const localByPlace = (place: Place) => local.filter((m) => m.place === place)

export const findLocalMission = (id: number) => local.find((m) => m.id === id)

export const loadMissions = (place: Place) =>
  missionApi
    .list(category(place))
    .then((list) => list.map(toMission))
    .catch(() => localByPlace(place))

export const loadRandomMission = (place: Place) =>
  missionApi
    .random(category(place))
    .then(toMission)
    .catch(() => {
      const list = localByPlace(place)
      return list[Math.floor(Math.random() * list.length)]
    })

export const loadAllMissions = () =>
  Promise.all([loadMissions('indoor'), loadMissions('outdoor')]).then((r) => r.flat())

export const pickRandom = <T>(list: T[], count: number) =>
  [...list].sort(() => Math.random() - 0.5).slice(0, count)

export const durationLabel = (m: Mission) => formatDuration(m.seconds)
