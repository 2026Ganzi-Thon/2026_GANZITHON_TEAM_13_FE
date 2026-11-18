import { useNavigate } from 'react-router-dom'
import { Page } from '@/components/Page'
import { recordRest } from '@/lib/activity'

export function Home() {
  const navigate = useNavigate()

  const rest = () => {
    recordRest('REST')
    navigate('/rest')
  }

  return (
    <Page homeLink={false}>
      <h1 className="title">{'오늘은 어떤 활동이\n편하신가요?'}</h1>
      <p className="lead muted">지금 상태에 맞는 작은 미션을 골라보세요.</p>
      <button type="button" className="pill" onClick={() => navigate('/mission/indoor')}>
        집 안에서 가볍게 움직이는 활동
      </button>
      <button type="button" className="pill" onClick={() => navigate('/mission/outdoor')}>
        잠깐 밖에 나가는 활동
      </button>
      <button type="button" className="pill" onClick={rest}>
        오늘은 쉬기
      </button>
    </Page>
  )
}
