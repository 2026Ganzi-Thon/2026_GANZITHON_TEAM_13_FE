import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { settingsStore } from '@/lib/settings'

export function Splash() {
  const navigate = useNavigate()
  const { onboarded } = settingsStore.use()

  useEffect(() => {
    const id = setTimeout(() => navigate(onboarded ? '/home' : '/onboarding', { replace: true }), 1200)
    return () => clearTimeout(id)
  }, [navigate, onboarded])

  return (
    <div className="page">
      <main className="page-body center">
        <div className="splash-logo" />
        <h1 className="title">1분 미션</h1>
        <p className="lead">작게 시작해도 괜찮아요</p>
      </main>
    </div>
  )
}
