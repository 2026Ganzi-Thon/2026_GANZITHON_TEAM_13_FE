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
  notifyTime: '12:00',
  useLocation: false,
})

export const updateSettings = (patch: Partial<Settings>) =>
  settingsStore.set({ ...settingsStore.get(), ...patch })
