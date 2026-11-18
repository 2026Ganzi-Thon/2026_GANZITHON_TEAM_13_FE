import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { restApi } from '@/api/endpoints'
import { Button } from '@/components/Button'
import { Page } from '@/components/Page'
import { useLoad } from '@/hooks/useLoad'
import { recordRest } from '@/lib/activity'

interface Config {
  inhaleSeconds: number
  exhaleSeconds: number
  repeatCount: number
}

const defaults: Config = { inhaleSeconds: 4, exhaleSeconds: 6, repeatCount: 3 }

export function Breathing() {
  const { data, loading } = useLoad(() => restApi.breathing().catch(() => defaults))
  return loading || !data ? <Page>{null}</Page> : <Guide config={data} />
}

interface Step {
  round: number
  inhale: boolean
  left: number
}

function Guide({ config }: { config: Config }) {
  const { inhaleSeconds, exhaleSeconds, repeatCount } = config
  const [step, setStep] = useState<Step>({ round: 1, inhale: true, left: inhaleSeconds })
  const finished = step.round > repeatCount

  useEffect(() => {
    if (finished) {
      recordRest('REST', true)
      return
    }
    const id = setTimeout(
      () =>
        setStep(({ round, inhale, left }) => {
          if (left > 1) return { round, inhale, left: left - 1 }
          if (inhale) return { round, inhale: false, left: exhaleSeconds }
          return { round: round + 1, inhale: true, left: inhaleSeconds }
        }),
      1000,
    )
    return () => clearTimeout(id)
  }, [step, finished, inhaleSeconds, exhaleSeconds])

  const seconds = step.inhale ? inhaleSeconds : exhaleSeconds

  return (
    <Page
      left={<Link to="/rest">← 닫기</Link>}
      footer={<Button to="/home">{finished ? '마쳤어요' : '마칠게요'}</Button>}
    >
      <h1 className="title">함께 숨 쉬어요</h1>
      <div className="page-body center" style={{ gap: 24 }}>
        <div
          className="ring ring-breath"
          style={{
            transform: `scale(${finished || !step.inhale ? 1 : 1.12})`,
            transitionDuration: `${finished ? 1 : seconds}s`,
          }}
        >
          {finished ? (
            '잘했어요'
          ) : (
            <span>
              <small>{step.inhale ? '들이쉬기' : '내쉬기'}</small>
              {step.left}초
            </span>
          )}
        </div>
        <p className="lead muted">
          {finished ? `${repeatCount}회를 마쳤어요` : `${repeatCount}회 중 ${step.round}회`}
        </p>
      </div>
    </Page>
  )
}
