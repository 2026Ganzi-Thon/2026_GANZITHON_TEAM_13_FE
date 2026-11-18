import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { BackLink } from '@/components/BackLink'
import { Button } from '@/components/Button'
import { Page } from '@/components/Page'
import { startSession } from '@/lib/activity'
import { findLocalMission, durationLabel, type Mission } from '@/lib/missions'

const walk = findLocalMission(11)!

export function LocationNone() {
  const navigate = useNavigate()
  const picked = (useLocation().state as { mission?: Mission } | null)?.mission
  const mission = picked ?? walk
  const [starting, setStarting] = useState(false)

  const start = async () => {
    setStarting(true)
    const sessionId = await startSession(mission)
    navigate(`/run/${sessionId}`, { state: { mission } })
  }

  return (
    <Page
      left={<BackLink />}
      footer={
        <>
          <Button disabled={starting} onClick={start}>
            미션 시작
          </Button>
          <Button variant="dark" to="/settings">
            설정에서 위치 켜기
          </Button>
        </>
      }
    >
      <h1 className="title">위치 없이도 괜찮아요</h1>
      <p className="lead">가까운 곳을 10분 정도 산책하는 미션으로 안내할게요.</p>
      <section className="card">
        <p className="lead muted">집 밖 미션</p>
        <h2 className="card-title">{mission.title}</h2>
        <span className="badge">{durationLabel(mission)}</span>
      </section>
    </Page>
  )
}
