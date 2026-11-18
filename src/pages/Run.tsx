import { useNavigate, useLocation, Navigate, useParams } from 'react-router-dom'
import { Button } from '@/components/Button'
import { Page } from '@/components/Page'
import { useCountdown } from '@/hooks/useCountdown'
import { cancelSession, completeSession } from '@/lib/activity'
import type { Mission } from '@/lib/missions'
import { formatClock } from '@/lib/time'

interface RunState {
  mission: Mission
  placeName?: string
}

export function Run() {
  const { sessionId } = useParams()
  const state = useLocation().state as RunState | null
  if (!sessionId || !state?.mission) return <Navigate to="/home" replace />
  return <Timer key={sessionId} sessionId={sessionId} {...state} />
}

function Timer({ sessionId, mission, placeName }: RunState & { sessionId: string }) {
  const navigate = useNavigate()
  const { left, paused, toggle } = useCountdown(mission.seconds)

  const complete = async () => {
    const count = await completeSession(sessionId, mission)
    navigate('/done', { replace: true, state: { count } })
  }

  const quit = async () => {
    await cancelSession(sessionId, mission)
    navigate('/home', { replace: true })
  }

  return (
    <Page
      left={
        <button type="button" onClick={quit}>
          ← 그만두기
        </button>
      }
      footer={
        <>
          <Button onClick={complete}>했어요</Button>
          <Button variant="text" onClick={toggle}>
            {paused ? '다시 시작할게요' : '잠깐 멈출게요'}
          </Button>
        </>
      }
    >
      <h1 className="title">{mission.title}</h1>
      {placeName && <p className="lead muted">{placeName}</p>}
      <div className="page-body center" style={{ gap: 24 }}>
        <div className="ring">{formatClock(left)}</div>
        <p className="lead">{left === 0 ? '수고했어요. 끝났다면 눌러주세요.' : '천천히, 편한 속도로 해요.'}</p>
      </div>
    </Page>
  )
}
