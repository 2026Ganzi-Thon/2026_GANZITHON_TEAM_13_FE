import { useMemo } from 'react'
import { Link, Navigate, NavLink, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/Button'
import { Page } from '@/components/Page'
import { isPlace, missionMeta, randomMission } from '@/lib/missions'
import { addEntry } from '@/lib/records'

export function MissionSuggest() {
  const { place } = useParams()
  const navigate = useNavigate()
  const mission = useMemo(() => (isPlace(place) ? randomMission(place) : undefined), [place])

  if (!isPlace(place) || !mission) return <Navigate to="/home" replace />

  const outdoor = place === 'outdoor'

  const skip = () => {
    addEntry('rest', '건너뛴 날')
    navigate('/rest')
  }

  return (
    <Page
      left="1분 미션"
      right="미션 제안"
      footer={
        <>
          <Button variant="primary" to={`/run/${mission.id}`}>
            {outdoor ? '밖으로 나가 보기' : '시작하기'}
          </Button>
          <Button to={outdoor ? '/mission/indoor' : '/mission/pick'}>
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
      <section className="card" style={{ gap: 10 }}>
        <div className="illust" />
        <p className="eyebrow">{missionMeta(mission)}</p>
        <h1 className="title" style={{ fontSize: 18 }}>
          {mission.title}
        </h1>
        <p className="lead">
          {outdoor ? '부담되면 집 안 미션으로 바꿀 수 있어요.' : '할 수 있을 때, 부담 없이 시작해요.'}
        </p>
      </section>
      {outdoor && (
        <Link to="/location" className="card card-dashed">
          <span className="eyebrow">장소 추천 · 위치 동의 시</span>
          <span className="card-title">근처 가볼 만한 곳 보기</span>
        </Link>
      )}
    </Page>
  )
}
