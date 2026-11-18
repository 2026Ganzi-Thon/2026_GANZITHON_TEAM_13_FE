import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackLink } from '@/components/BackLink'
import { Button } from '@/components/Button'
import { MissionItem } from '@/components/MissionItem'
import { Page } from '@/components/Page'
import { useLoad } from '@/hooks/useLoad'
import { startSession } from '@/lib/activity'
import { loadAllMissions, pickRandom, type Mission } from '@/lib/missions'

export function MissionPick() {
  const navigate = useNavigate()
  const [seed, setSeed] = useState(0)
  const { data } = useLoad(() => loadAllMissions().then((all) => pickRandom(all, 3)), [seed])

  const start = async (mission: Mission) => {
    const sessionId = await startSession(mission)
    navigate(`/run/${sessionId}`, { state: { mission } })
  }

  return (
    <Page left={<BackLink />} footer={<Button onClick={() => setSeed((s) => s + 1)}>랜덤으로 제안받기</Button>}>
      <h1 className="title">다른 미션 고르기</h1>
      <p className="lead">마음에 드는 걸 골라보세요.</p>
      {data?.map((m) => (
        <MissionItem key={m.id} mission={m} showDesc={false} onSelect={() => start(m)} />
      ))}
    </Page>
  )
}
