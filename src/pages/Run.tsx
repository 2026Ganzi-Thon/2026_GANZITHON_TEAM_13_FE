import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/Button'
import { Page } from '@/components/Page'
import { useCountdown } from '@/hooks/useCountdown'
import { findMission } from '@/lib/missions'
import { addEntry } from '@/lib/records'
import { formatClock } from '@/lib/time'

export function Run() {
  const { id } = useParams()
  const mission = findMission(Number(id))
  if (!mission) return <Navigate to="/home" replace />
  return <Timer key={mission.id} title={mission.title} seconds={mission.seconds} />
}

function Timer({ title, seconds }: { title: string; seconds: number }) {
  const navigate = useNavigate()
  const place = (useLocation().state as { place?: string } | null)?.place
  const { left, paused, toggle } = useCountdown(seconds)

  const complete = () => {
    addEntry('done', title)
    navigate('/done', { replace: true })
  }

  return (
    <Page
      left={<Link to="/home">← 그만두기</Link>}
      right="진행 중"
      footer={
        <>
          <Button variant="primary" onClick={complete}>
            했어요
          </Button>
          <Button variant="text" onClick={toggle}>
            {paused ? '다시 시작할게요' : '잠깐 멈출게요'}
          </Button>
        </>
      }
    >
      <h1 className="title">{title}</h1>
      {place && <p className="lead">{place}</p>}
      <div className="page-body center" style={{ gap: 20 }}>
        <div className="ring">{formatClock(left)}</div>
        <p className="lead">{left === 0 ? '수고했어요. 끝나면 눌러주세요.' : '천천히, 편한 속도로 해요.'}</p>
      </div>
    </Page>
  )
}
