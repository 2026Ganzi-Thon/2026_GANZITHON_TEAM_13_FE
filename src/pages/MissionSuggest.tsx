import { useEffect, useState } from 'react'
import { Navigate, NavLink, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/Button'
import { MissionItem } from '@/components/MissionItem'
import { Page } from '@/components/Page'
import { useLoad } from '@/hooks/useLoad'
import { recordRest, startSession } from '@/lib/activity'
import { loadMissions, loadRandomMission, type Place } from '@/lib/missions'

export function MissionSuggest() {
  const { place } = useParams()
  if (place !== 'indoor' && place !== 'outdoor') return <Navigate to="/home" replace />
  return <Suggest key={place} place={place} />
}

function Suggest({ place }: { place: Place }) {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<number>()
  const [starting, setStarting] = useState(false)
  const { data, loading } = useLoad(
    () => Promise.all([loadMissions(place), loadRandomMission(place)]),
    [place],
  )
  const [missions, random] = data ?? [[], undefined]

  // 랜덤으로 추천된 미션을 처음 선택 상태로 둔다
  useEffect(() => {
    if (random) setSelected(random.id)
  }, [random])

  const mission = missions.find((m) => m.id === selected)
  const outdoor = place === 'outdoor'

  const start = async () => {
    if (!mission) return
    setStarting(true)
    const sessionId = await startSession(mission)
    navigate(`/run/${sessionId}`, { state: { mission } })
  }

  const skip = () => {
    recordRest('SKIP')
    navigate('/rest')
  }

  return (
    <Page
      footer={
        <>
          <Button disabled={!mission || starting} onClick={start}>
            {outdoor ? '밖으로 나가 보기' : '시작하기'}
          </Button>
          {outdoor && mission && (
            <Button variant="text" to="/location" state={{ mission }}>
              근처 가볼 만한 곳 보기
            </Button>
          )}
          <Button variant="dark" to={outdoor ? '/mission/indoor' : '/mission/pick'}>
            {outdoor ? '집 안 미션으로 바꾸기' : '다른 미션으로 바꾸기'}
          </Button>
          <Button variant="text" onClick={skip}>
            오늘은 건너뛸게요
          </Button>
        </>
      }
    >
      <nav className="segment">
        <NavLink to="/mission/indoor" replace>
          집 안
        </NavLink>
        <NavLink to="/mission/outdoor" replace>
          집 밖
        </NavLink>
      </nav>
      {loading && <p className="lead muted">미션을 불러오고 있어요</p>}
      {missions.map((m) => (
        <MissionItem key={m.id} mission={m} selected={m.id === selected} onSelect={() => setSelected(m.id)} />
      ))}
    </Page>
  )
}
