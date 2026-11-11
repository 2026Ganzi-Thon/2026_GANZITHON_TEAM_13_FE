import { useEffect, useState } from 'react'

export function useCountdown(total: number) {
  const [left, setLeft] = useState(total)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || left === 0) return
    const id = setTimeout(() => setLeft((s) => s - 1), 1000)
    return () => clearTimeout(id)
  }, [paused, left])

  return { left, paused, toggle: () => setPaused((p) => !p) }
}
