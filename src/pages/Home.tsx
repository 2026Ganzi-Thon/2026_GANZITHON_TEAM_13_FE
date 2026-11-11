import { useNavigate } from 'react-router-dom'
import { Page } from '@/components/Page'
import { addEntry } from '@/lib/records'

const options = [
  { label: '집 안에서 가볍게 움직이는 활동', to: '/mission/indoor' },
  { label: '잠깐 밖에 나가는 활동', to: '/mission/outdoor' },
]

export function Home() {
  const navigate = useNavigate()

  const rest = () => {
    addEntry('rest', '쉬어가기')
    navigate('/rest')
  }

  return (
    <Page
      left="1분 미션"
      right="홈"
      footer={
        <p className="lead" style={{ textAlign: 'center' }}>
          언제든 다른 선택으로 바꿀 수 있어요.
        </p>
      }
    >
      <h1 className="title">오늘은 어떤 활동이 편하신가요?</h1>
      <p className="lead">지금 상태에 맞는 작은 미션을 골라보세요.</p>
      {options.map((o) => (
        <button key={o.to} type="button" className="card" onClick={() => navigate(o.to)}>
          {o.label}
        </button>
      ))}
      <button type="button" className="card" onClick={rest}>
        오늘은 쉬기
      </button>
    </Page>
  )
}
