export interface NearbyPlace {
  id: number
  name: string
  walkMinutes: number
  free: boolean
  sit: boolean
}

// TODO: 위치 API 연동 전까지 쓰는 임시 데이터
export const nearbyPlaces: NearbyPlace[] = [
  { id: 1, name: '근처 공원', walkMinutes: 5, free: true, sit: true },
  { id: 2, name: '동네 도서관', walkMinutes: 8, free: true, sit: true },
  { id: 3, name: '천변 산책로', walkMinutes: 10, free: true, sit: false },
  { id: 4, name: '카페 거리', walkMinutes: 15, free: false, sit: true },
]

export const filters = [
  { key: 'near', label: '도보 10분 이내', test: (p: NearbyPlace) => p.walkMinutes <= 10 },
  { key: 'free', label: '무료', test: (p: NearbyPlace) => p.free },
  { key: 'walk', label: '걷기', test: (p: NearbyPlace) => !p.sit },
  { key: 'sit', label: '앉아서 쉬기', test: (p: NearbyPlace) => p.sit },
] as const

export const requestPosition = () =>
  new Promise<boolean>((resolve) => {
    if (!navigator.geolocation) return resolve(false)
    // 좌표는 위치 API가 준비되면 요청에 실어 보낸다
    navigator.geolocation.getCurrentPosition(
      () => resolve(true),
      () => resolve(false),
      { timeout: 8000 },
    )
  })
