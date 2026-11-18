import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mascot } from '@/components/Mascot'
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
        <Mascot size={88} />
        <h1 className="title">쉼표</h1>
      </main>
    </div>
  )
}
