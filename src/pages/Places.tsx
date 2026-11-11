import { useState } from 'react'
import { BackLink } from '@/components/BackLink'
import { Button } from '@/components/Button'
import { Page } from '@/components/Page'
import { filters, nearbyPlaces } from '@/lib/places'

const WALK_MISSION = '/run/11'

export function Places() {
  const [active, setActive] = useState<string[]>(['near'])
  const [selected, setSelected] = useState<number>()

  const toggle = (key: string) =>
    setActive((cur) => (cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key]))

  const tests = filters.filter((f) => active.includes(f.key))
  const list = nearbyPlaces.filter((p) => tests.every((f) => f.test(p)))
  const picked = nearbyPlaces.find((p) => p.id === selected)

  return (
    <Page
      left={<BackLink />}
      right="장소 추천"
      footer={
        <>
          <Button variant="primary" to={WALK_MISSION} state={{ place: picked?.name }} disabled={!picked}>
            이 장소로 미션 시작
          </Button>
          <Button to={WALK_MISSION}>장소 없이 시작</Button>
        </>
      }
    >
      <h1 className="title">어디로 가볼까요?</h1>
      <div className="chips">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            className="chip"
            aria-pressed={active.includes(f.key)}
            onClick={() => toggle(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
      {list.length === 0 && <p className="lead">조건에 맞는 장소가 없어요. 필터를 줄여보세요.</p>}
      {list.map((p) => (
        <button
          key={p.id}
          type="button"
          className="card"
          aria-pressed={selected === p.id}
          onClick={() => setSelected(p.id)}
        >
          <div className="illust" style={{ height: 72 }} />
          <h2 className="card-title">{p.name}</h2>
          <p className="eyebrow">
            도보 {p.walkMinutes}분 · {p.free ? '무료' : '유료'} · {p.sit ? '앉아서 쉬기 좋음' : '걷기 좋음'}
          </p>
        </button>
      ))}
    </Page>
  )
}
