import { Page } from '@/components/Page'
import { Toggle } from '@/components/Toggle'
import { clearActivity } from '@/lib/activity'
import { requestPosition } from '@/lib/places'
import { settingsStore, updateSettings } from '@/lib/settings'
import pkg from '../../package.json'

export function Settings() {
  const s = settingsStore.use()

  const toggleLocation = async (on: boolean) => {
    if (!on) return updateSettings({ useLocation: false })
    // 브라우저 권한이 거부되면 켜지지 않는다
    updateSettings({ useLocation: (await requestPosition()) !== null })
  }

  const reset = async () => {
    if (window.confirm('모든 활동 기록을 삭제할까요? 삭제한 기록은 되돌릴 수 없어요.')) {
      await clearActivity()
    }
  }

  return (
    <Page>
      <h1 className="title">설정</h1>
      <div className="rows">
        <div className="row">
          알림 받기
          <Toggle checked={s.notify} label="알림 받기" onChange={(notify) => updateSettings({ notify })} />
        </div>
        <div className="row">
          알림 시간
          <input
            type="time"
            value={s.notifyTime}
            disabled={!s.notify}
            onChange={(e) => updateSettings({ notifyTime: e.target.value })}
          />
        </div>
        <div className="row">
          위치 정보 사용
          <Toggle checked={s.useLocation} label="위치 정보 사용" onChange={toggleLocation} />
        </div>
        <button type="button" className="row" onClick={reset}>
          활동 기록 전체 삭제
          <small>›</small>
        </button>
        <details>
          <summary className="row" style={{ cursor: 'pointer' }}>
            개인정보 처리 안내
          </summary>
          <p className="lead muted" style={{ padding: '8px 0 16px' }}>
            위치 정보는 주변 장소를 추천할 때만 쓰고 저장하지 않아요. 활동 기록은 내가 해낸 미션을
            돌아보는 데만 쓰이고, 설정에서 언제든 삭제할 수 있어요.
          </p>
        </details>
        <div className="row">
          버전
          <small>{pkg.version}</small>
        </div>
      </div>
    </Page>
  )
}
