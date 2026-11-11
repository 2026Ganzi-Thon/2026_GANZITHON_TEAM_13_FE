import { Button } from '@/components/Button'
import { Page } from '@/components/Page'

export function Rest() {
  return (
    <Page
      left="1분 미션"
      right="건너뛴 날"
      footer={
        <>
          <Button variant="primary" to="/breathing">
            호흡법 시작
          </Button>
          <Button to="/home">다른 미션 보기</Button>
        </>
      }
    >
      <h1 className="title">오늘은 쉬어도 괜찮아요</h1>
      <p className="lead">평가하지 않아요. 마음이 편해지는 방법을 골라보세요.</p>
      <section className="card" style={{ gap: 10 }}>
        <div className="illust" />
        <h2 className="card-title">호흡법</h2>
        <p className="lead">천천히 들이쉬고, 더 천천히 내쉬어요.</p>
      </section>
      <section className="card">
        <h2 className="card-title">마음 진정 팁</h2>
        <p className="lead">지금 느끼는 감정에 이름 붙여보기</p>
      </section>
    </Page>
  )
}
