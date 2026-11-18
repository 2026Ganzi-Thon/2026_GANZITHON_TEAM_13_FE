import { useEffect, useState } from 'react'

export function useLoad<T>(load: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<{ data?: T; loading: boolean }>({ loading: true })

  useEffect(() => {
    let alive = true
    setState((s) => ({ ...s, loading: true }))
    load()
      .then((data) => alive && setState({ data, loading: false }))
      .catch(() => alive && setState({ loading: false }))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
