import { Button } from '@/components/Button'
import { Page } from '@/components/Page'
import { doneToday, useEntries } from '@/lib/records'

export function Done() {
  const count = doneToday(useEntries())

  return (
    <Page
      footer={
        <>
          <Button variant="primary" to="/mission/indoor">
            하나 더 해볼까요?
          </Button>
          <Button to="/home">오늘은 여기까지</Button>
          <Button variant="text" to="/records">
            기록 보기
          </Button>
        </>
      }
    >
      <div className="illust" style={{ marginTop: 32 }} />
      <h1 className="title" style={{ textAlign: 'center' }}>
        작은 한 걸음, 해냈어요
      </h1>
      <p className="lead" style={{ textAlign: 'center' }}>
        오늘의 작은 행동 {count}개
      </p>
    </Page>
  )
}
