import { Button } from '@/components/Button'
import { Mascot } from '@/components/Mascot'
import { Page } from '@/components/Page'
import { restApi } from '@/api/endpoints'
import { useLoad } from '@/hooks/useLoad'

const defaultMessage = '오늘은 잠시 쉬어가도 괜찮아요.'

export function Rest() {
  const { data } = useLoad(() =>
    restApi.guidance('REST').then((r) => r.message).catch(() => defaultMessage),
  )

  return (
    <Page
      footer={
        <>
          <Button to="/breathing">호흡법 시작</Button>
          <Button variant="dark" to="/home">
            다른 미션 보기
          </Button>
        </>
      }
    >
      <h1 className="title">{'오늘은\n쉬어도 괜찮아요'}</h1>
      <p className="lead muted">{data ?? defaultMessage}</p>
      <section className="card">
        <Mascot size={64} />
        <h2 className="card-title">호흡법</h2>
        <p className="lead">천천히 들이쉬고, 더 천천히 내쉬어요.</p>
      </section>
    </Page>
  )
}
