import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { BackLink } from '@/components/BackLink'
import { Button } from '@/components/Button'
import { Page } from '@/components/Page'
import type { Mission } from '@/lib/missions'
import { requestPosition } from '@/lib/places'
import { updateSettings } from '@/lib/settings'

export function LocationAsk() {
  const navigate = useNavigate()
  const state = useLocation().state as { mission?: Mission } | null
  const [pending, setPending] = useState(false)

  const allow = async () => {
    setPending(true)
    const coords = await requestPosition()
    updateSettings({ useLocation: coords !== null })
    navigate(coords ? '/places' : '/location/none', { replace: true, state: { ...state, coords } })
  }

  return (
    <Page
      left={<BackLink />}
      footer={
        <>
          <Button disabled={pending} onClick={allow}>
            위치 허용
          </Button>
          <Button variant="dark" to="/location/none" state={state}>
            위치 없이 계속
          </Button>
          <Button variant="text" to="/mission/outdoor">
            다음에 할게요
          </Button>
        </>
      }
    >
      <h1 className="title">{'가까운 곳을\n추천 해드릴까요?'}</h1>
      <p className="lead">
        위치 정보로 가까운 공원이나 카페를 보여드려요. 동의는 선택이고, 설정에서 언제든 끌 수 있어요.
        위치는 장소 추천에만 쓰고 저장하지 않아요.
      </p>
    </Page>
  )
}
