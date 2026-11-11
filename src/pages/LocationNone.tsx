import { BackLink } from '@/components/BackLink'
import { Button } from '@/components/Button'
import { Page } from '@/components/Page'
import { findMission, missionMeta } from '@/lib/missions'

const walk = findMission(11)!

export function LocationNone() {
  return (
    <Page
      left={<BackLink />}
      right="집 밖 미션"
      footer={
        <>
          <Button variant="primary" to={`/run/${walk.id}`}>
            이 미션으로 시작
          </Button>
          <Button to="/settings">설정에서 위치 켜기</Button>
        </>
      }
    >
      <div className="illust" style={{ height: 200 }} />
      <h1 className="title">위치 없이도 괜찮아요</h1>
      <p className="lead">가까운 곳을 10분 정도 걸어보는 미션을 안내할게요.</p>
      <section className="card">
        <p className="eyebrow">{missionMeta(walk)}</p>
        <h2 className="card-title">{walk.title}</h2>
      </section>
    </Page>
  )
}
