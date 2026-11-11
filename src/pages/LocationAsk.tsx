import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackLink } from '@/components/BackLink'
import { Button } from '@/components/Button'
import { Page } from '@/components/Page'
import { requestPosition } from '@/lib/places'
import { updateSettings } from '@/lib/settings'

export function LocationAsk() {
  const navigate = useNavigate()
  const [pending, setPending] = useState(false)

  const allow = async () => {
    setPending(true)
    const granted = await requestPosition()
    updateSettings({ useLocation: granted })
    navigate(granted ? '/places' : '/location/none', { replace: true })
  }

  return (
    <Page
      left={<BackLink />}
      right="위치 안내"
      footer={
        <>
          <Button variant="primary" disabled={pending} onClick={allow}>
            위치 허용
          </Button>
          <Button to="/location/none">위치 없이 계속</Button>
          <Button variant="text" to="/mission/outdoor">
            다음에 할게요
          </Button>
        </>
      }
    >
      <div className="illust" style={{ height: 200 }} />
      <h1 className="title">가까운 곳을 추천해드릴까요?</h1>
      <p className="lead">
        위치 정보로 가까운 공원이나 카페를 보여드려요. 동의는 선택이고, 설정에서 언제든 끌 수 있어요.
      </p>
    </Page>
  )
}
