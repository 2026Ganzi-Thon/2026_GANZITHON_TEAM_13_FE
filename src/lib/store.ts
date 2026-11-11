import { useSyncExternalStore } from 'react'

export function createStore<T>(key: string, initial: T) {
  const listeners = new Set<() => void>()
  let cache: T | undefined

  const get = (): T => {
    if (cache !== undefined) return cache
    try {
      const raw = localStorage.getItem(key)
      cache = raw ? (JSON.parse(raw) as T) : initial
    } catch {
      cache = initial
    }
    return cache
  }

  const set = (next: T) => {
    cache = next
    try {
      localStorage.setItem(key, JSON.stringify(next))
    } catch {
      // 저장소를 쓸 수 없는 환경이면 메모리 상태만 유지
    }
    listeners.forEach((fn) => fn())
  }

  const subscribe = (fn: () => void) => {
    listeners.add(fn)
    return () => listeners.delete(fn)
  }

  return { get, set, use: () => useSyncExternalStore(subscribe, get) }
}
