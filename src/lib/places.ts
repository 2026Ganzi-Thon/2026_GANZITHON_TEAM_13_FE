import { placeApi, type PlaceDto } from '@/api/endpoints'

export interface Coords {
  latitude: number
  longitude: number
}

export interface NearbyPlace {
  id: string
  name: string
  address: string
  walkMinutes: number
  url?: string
}

export const RADIUS_OPTIONS = [500, 1000, 2000]

const WALK_METERS_PER_MIN = 80

export const requestPosition = () =>
  new Promise<Coords | null>((resolve) => {
    if (!navigator.geolocation) return resolve(null)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ latitude: coords.latitude, longitude: coords.longitude }),
      () => resolve(null),
      { timeout: 8000 },
    )
  })

const toPlace = (p: PlaceDto): NearbyPlace => ({
  id: p.placeId,
  name: p.name,
  address: p.address,
  walkMinutes: Math.max(1, Math.round(p.distanceMeters / WALK_METERS_PER_MIN)),
  url: p.placeUrl,
})

// 서버에 연결되지 않았을 때만 보여 주는 예시 (서버가 빈 목록을 주면 그대로 비워 둔다)
const sample: NearbyPlace[] = [
  { id: 's1', name: '근처 공원', address: '', walkMinutes: 5 },
  { id: 's2', name: '동네 도서관', address: '', walkMinutes: 8 },
  { id: 's3', name: '천변 산책로', address: '', walkMinutes: 12 },
]

export const loadPlaces = (missionId: number, coords: Coords, radius: number) =>
  placeApi
    .recommend(missionId, coords.latitude, coords.longitude, radius)
    .then((list) => list.map(toPlace))
    .catch(() => sample.filter((p) => p.walkMinutes * WALK_METERS_PER_MIN <= radius))
