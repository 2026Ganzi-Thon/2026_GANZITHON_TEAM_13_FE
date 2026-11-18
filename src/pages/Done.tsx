import { useLocation } from 'react-router-dom'
import { Button } from '@/components/Button'
import { Mascot } from '@/components/Mascot'
import { Page } from '@/components/Page'

export function Done() {
  const count = (useLocation().state as { count?: number } | null)?.count

  return (
    <Page
      footer={
        <>
          <Button to="/mission/indoor">하나 더 해볼까요?</Button>
          <Button variant="dark" to="/home">
            오늘은 여기까지
          </Button>
          <Button variant="text" to="/records">
            기록 보기
          </Button>
        </>
      }
    >
      <h1 className="title">{'작은 한 걸음\n해냈어요!'}</h1>
      <div className="page-body center" style={{ gap: 16 }}>
        <Mascot size={120} />
        {count !== undefined && <p className="lead">오늘의 작은 행동 {count}개</p>}
      </div>
    </Page>
  )
}
