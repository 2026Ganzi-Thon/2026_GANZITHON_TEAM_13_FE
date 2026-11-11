import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/Button'
import { Page } from '@/components/Page'

const ROUNDS = 3
const PHASES = [
  { label: '들이쉬기', seconds: 4, scale: 1.25 },
  { label: '내쉬기', seconds: 6, scale: 1 },
]

interface Step {
  round: number
  phase: number
  left: number
}

function next({ round, phase, left }: Step): Step {
  if (left > 1) return { round, phase, left: left - 1 }
  if (phase === 0) return { round, phase: 1, left: PHASES[1].seconds }
  return { round: round + 1, phase: 0, left: PHASES[0].seconds }
}

export function Breathing() {
  const [step, setStep] = useState<Step>({ round: 1, phase: 0, left: PHASES[0].seconds })
  const finished = step.round > ROUNDS
  const phase = PHASES[step.phase]

  useEffect(() => {
    if (finished) return
    const id = setTimeout(() => setStep(next), 1000)
    return () => clearTimeout(id)
  }, [step, finished])

  return (
    <Page
      left={<Link to="/rest">← 닫기</Link>}
      right="호흡법"
      footer={
        <Button variant="primary" to="/home">
          마칠게요
        </Button>
      }
    >
      <h1 className="title">함께 숨 쉬어요</h1>
      <div className="page-body center" style={{ gap: 24 }}>
        <div
          className="ring ring-breath"
          style={{
            transform: `scale(${finished ? 1 : phase.scale})`,
            transitionDuration: `${finished ? 1 : phase.seconds}s`,
          }}
        >
          {finished ? '잘했어요' : `${phase.label} ${step.left}초`}
        </div>
        <p className="lead">
          {finished ? `${ROUNDS}회를 마쳤어요` : `들이쉬기 4초 · 내쉬기 6초 · ${ROUNDS}회 중 ${step.round}회`}
        </p>
      </div>
    </Page>
  )
}
