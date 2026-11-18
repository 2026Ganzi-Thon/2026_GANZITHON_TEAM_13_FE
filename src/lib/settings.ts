import { notificationApi } from '@/api/endpoints'
import { createStore } from './store'

export interface Settings {
  onboarded: boolean
  notify: boolean
  notifyTime: string
  useLocation: boolean
}

export const settingsStore = createStore<Settings>('settings', {
  onboarded: false,
  notify: true,
  notifyTime: '10:00',
  useLocation: false,
})

export function updateSettings(patch: Partial<Settings>) {
  const next = { ...settingsStore.get(), ...patch }
  settingsStore.set(next)
  if ('notify' in patch || 'notifyTime' in patch) {
    // 알림 API가 구현되면 서버에도 반영된다. 실패해도 기기 설정은 유지한다.
    notificationApi.patch(next.notify, next.notifyTime).catch(() => undefined)
  }
}
