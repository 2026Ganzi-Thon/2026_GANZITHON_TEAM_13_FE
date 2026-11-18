import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { BackLink } from '@/components/BackLink'
import { Button } from '@/components/Button'
import { Page } from '@/components/Page'
import { useLoad } from '@/hooks/useLoad'
import { startSession } from '@/lib/activity'
import { findLocalMission, type Mission } from '@/lib/missions'
import { type Coords, loadPlaces, RADIUS_OPTIONS } from '@/lib/places'

interface PlacesState {
  mission?: Mission
  coords?: Coords | null
}

export function Places() {
  const navigate = useNavigate()
  const state = useLocation().state as PlacesState | null
  const [radius, setRadius] = useState(1000)
  const [selected, setSelected] = useState<number>()
  const [starting, setStarting] = useState(false)

  const mission = state?.mission ?? findLocalMission(11)!
  const coords = state?.coords
  const { data: places = [], loading } = useLoad(
    () => (coords ? loadPlaces(mission.id, coords, radius) : Promise.resolve([])),
    [radius],
  )

  if (!coords) return <Navigate to="/location" replace />

  const place = places.find((p) => p.id === selected)

  const start = async () => {
    setStarting(true)
    const sessionId = await startSession(mission)
    navigate(`/run/${sessionId}`, { state: { mission, placeName: place?.name } })
  }

  return (
    <Page
      left={<BackLink />}
      footer={
        <>
          <Button disabled={starting} onClick={start}>
            {place ? '이 장소로 미션 시작' : '장소 없이 미션 시작'}
          </Button>
        </>
      }
    >
      <h1 className="title">어디로 가볼까요?</h1>
      <div className="chips">
        {RADIUS_OPTIONS.map((r) => (
          <button
            key={r}
            type="button"
            className="chip"
            aria-pressed={radius === r}
            onClick={() => setRadius(r)}
          >
            {r < 1000 ? `${r}m` : `${r / 1000}km`} 이내
          </button>
        ))}
      </div>
      {!loading && places.length === 0 && (
        <p className="lead muted">근처에 추천할 곳을 찾지 못했어요. 범위를 넓히거나 장소 없이 시작해도 괜찮아요.</p>
      )}
      {places.map((p) => (
        <button
          key={p.id}
          type="button"
          className="pill"
          style={{ flexDirection: 'column', alignItems: 'stretch', borderRadius: 22 }}
          aria-pressed={selected === p.id}
          onClick={() => setSelected(p.id)}
        >
          <span style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="pill-title">{p.name}</span>
            <span className="badge">도보 {p.walkMinutes}분</span>
          </span>
          <span
            className="photo"
            style={p.imageUrl ? { backgroundImage: `url(${p.imageUrl})` } : undefined}
          />
        </button>
      ))}
    </Page>
  )
}
