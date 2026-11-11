import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BackLink } from '@/components/BackLink'
import { Button } from '@/components/Button'
import { Page } from '@/components/Page'
import { randomMissions } from '@/lib/missions'
import { formatDuration } from '@/lib/time'

export function MissionPick() {
  const [options, setOptions] = useState(() => randomMissions(4))

  return (
    <Page
      left={<BackLink />}
      right="다른 미션"
      footer={<Button onClick={() => setOptions(randomMissions(4))}>랜덤으로 제안받기</Button>}
    >
      <h1 className="title">다른 미션 고르기</h1>
      <p className="lead">마음에 드는 걸 골라보세요.</p>
      {options.map((m) => (
        <Link key={m.id} to={`/run/${m.id}`} className="card">
          {m.title} · {formatDuration(m.seconds)}
        </Link>
      ))}
    </Page>
  )
}
