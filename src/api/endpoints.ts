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

// 아직 백엔드가 구현 전이라 응답 형식이 확정되지 않았다 (Kakao Local API 기반)
export const placeApi = {
  recommend: (missionId: number, latitude: number, longitude: number, radius: number) =>
    api.get<unknown>('/places/recommendations', { missionId, latitude, longitude, radius }),
}

export const notificationApi = {
  patch: (enabled: boolean, notificationTime: string) =>
    api.patch('/settings/notifications', { enabled, notificationTime }),
}
