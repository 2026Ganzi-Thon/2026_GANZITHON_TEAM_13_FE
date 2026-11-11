import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'
import { Page } from '@/components/Page'
import { Toggle } from '@/components/Toggle'
import { updateSettings } from '@/lib/settings'

const STEPS = 2

export function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [notify, setNotify] = useState(true)
  const [time, setTime] = useState('12:00')

  const finish = (saveNotify: boolean) => {
    updateSettings(saveNotify ? { onboarded: true, notify, notifyTime: time } : { onboarded: true })
    navigate('/home', { replace: true })
  }

  const dots = (
    <div className="dots">
      {Array.from({ length: STEPS }, (_, i) => (
        <i key={i} className={i === step ? 'on' : undefined} />
      ))}
    </div>
  )

  if (step === 0) {
    return (
      <Page
        right={`온보딩 1/${STEPS}`}
        footer={
          <>
            {dots}
            <Button variant="primary" onClick={() => setStep(1)}>
              다음
            </Button>
            <Button variant="text" onClick={() => finish(false)}>
              건너뛰기
            </Button>
          </>
        }
      >
        <div className="illust" />
        <h1 className="title">1분이면 충분해요</h1>
        <p className="lead">1분 안에 끝나는 게 아니라, 1분만 시작하면 되는 작은 행동이에요.</p>
        <ul className="card lead" style={{ paddingLeft: 32 }}>
          <li>작은 성취로 일상을 이어가요</li>
          <li>부담 없이 제안받아요</li>
          <li>집 안에서도, 밖에서도</li>
        </ul>
      </Page>
    )
  }

  return (
    <Page
      right={`온보딩 ${STEPS}/${STEPS}`}
      footer={
        <>
          {dots}
          <Button variant="primary" onClick={() => finish(true)}>
            시작하기
          </Button>
          <Button variant="text" onClick={() => finish(false)}>
            나중에 설정할게요
          </Button>
        </>
      }
    >
      <h1 className="title">시작하기 전에</h1>
      <p className="lead">모두 선택 사항이에요. 나중에 설정에서 바꿀 수 있어요.</p>
      <section className="card">
        <h2 className="card-title">미션 알림</h2>
        <p className="eyebrow">하루 한 번 가볍게 알려드려요</p>
        <div className="row">
          알림 받기
          <Toggle checked={notify} label="알림 받기" onChange={setNotify} />
        </div>
        <div className="row">
          알림 시간
          <input
            type="time"
            value={time}
            disabled={!notify}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </section>
    </Page>
  )
}
