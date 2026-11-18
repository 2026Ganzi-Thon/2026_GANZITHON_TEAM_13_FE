import { placeApi } from '@/api/endpoints'

export interface Coords {
  latitude: number
  longitude: number
}

export interface NearbyPlace {
  id: number
  name: string
  walkMinutes: number
  imageUrl?: string
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

// 백엔드 장소 API가 구현되기 전이라 응답 형식을 넓게 받아들인다
function toPlaces(raw: unknown): NearbyPlace[] {
  const list = Array.isArray(raw) ? raw : ((raw as { places?: unknown[] })?.places ?? [])
  return list.map((p, i) => {
    const item = p as Record<string, unknown>
    const meters = Number(item.distanceMeters ?? item.distance ?? 0)
    return {
      id: i,
      name: String(item.name ?? item.placeName ?? item.place_name ?? '이름 없는 장소'),
      walkMinutes: Math.max(1, Math.round(meters / WALK_METERS_PER_MIN)),
      imageUrl: typeof item.imageUrl === 'string' ? item.imageUrl : undefined,
    }
  })
}

const sample: NearbyPlace[] = [
  { id: 1, name: '근처 공원', walkMinutes: 5 },
  { id: 2, name: '동네 도서관', walkMinutes: 8 },
  { id: 3, name: '천변 산책로', walkMinutes: 12 },
]

export const loadPlaces = (missionId: number, coords: Coords, radius: number) =>
  placeApi
    .recommend(missionId, coords.latitude, coords.longitude, radius)
    .then(toPlaces)
    .catch(() => sample.filter((p) => p.walkMinutes * WALK_METERS_PER_MIN <= radius))
