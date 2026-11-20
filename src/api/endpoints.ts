import { api } from './client'

// 필드명은 백엔드 views.py 기준 (camelCase)
export type Category = 'INDOOR' | 'OUTDOOR'

export interface MissionDto {
  missionId: number
  title: string
  description: string
  category: Category
  durationSeconds: number
  imageUrl?: string | null
}

export interface SessionRecordDto {
  id: number
  missionId: number
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  startedAt: string
  completedAt: string | null
  cancelledAt: string | null
}

export type RestType = 'REST' | 'SKIP'

export const missionApi = {
  list: (category: Category) =>
    api.get<{ missions: MissionDto[] }>('/missions', { category }).then((r) => r.missions),
  random: (category: Category) => api.get<MissionDto>('/missions/random', { category }),
}

export const sessionApi = {
  start: (missionId: number) => api.post<{ sessionId: number }>('/mission-sessions', { missionId }),
  complete: (id: string) =>
    api.post<{ todayCompletedCount: number }>(`/mission-sessions/${id}/complete`),
  cancel: (id: string) => api.post(`/mission-sessions/${id}/cancel`),
  list: (period: 'week' | 'month' | 'all') =>
    api.get<{ records: SessionRecordDto[] }>('/mission-sessions', { period }).then((r) => r.records),
  clear: () => api.del('/mission-sessions'),
}

export const restApi = {
  guidance: (type: RestType) => api.get<{ message: string }>('/rest/guidance', { type }),
  breathing: () =>
    api.get<{ inhaleSeconds: number; exhaleSeconds: number; repeatCount: number }>('/rest/breathing'),
  record: (type: RestType, breathingCompleted?: boolean) =>
    api.post('/rest/records', { type, breathingCompleted }),
}

export interface PlaceDto {
  placeId: string
  name: string
  address: string
  latitude: number
  longitude: number
  distanceMeters: number
  placeUrl: string
}

// 카카오 장소 검색 기반이라 장소가 없으면 빈 배열이 오고, 키 설정 등 서버 문제는 5xx로 온다
export const placeApi = {
  recommend: (missionId: number, latitude: number, longitude: number, radius: number) =>
    api
      .get<{ places: PlaceDto[] }>('/places/recommendations', { missionId, latitude, longitude, radius })
      .then((r) => r.places),
}

export const notificationApi = {
  patch: (enabled: boolean, notificationTime: string) =>
    api.patch('/settings/notifications', { enabled, notificationTime }),
}
