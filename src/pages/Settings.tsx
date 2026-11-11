import { Page } from '@/components/Page'
import { Toggle } from '@/components/Toggle'
import { clearEntries } from '@/lib/records'
import { settingsStore, updateSettings } from '@/lib/settings'
import pkg from '../../package.json'

export function Settings() {
  const s = settingsStore.use()

  const reset = () => {
    if (window.confirm('모든 기록을 삭제할까요? 되돌릴 수 없어요.')) clearEntries()
  }

  return (
    <Page left="1분 미션" right="설정">
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
          <Toggle
            checked={s.useLocation}
            label="위치 정보 사용"
            onChange={(useLocation) => updateSettings({ useLocation })}
          />
        </div>
        <button type="button" className="row" onClick={reset}>
          기록 삭제
          <small>›</small>
        </button>
        <div className="row">
          앱 버전
          <small>{pkg.version}</small>
        </div>
      </div>
    </Page>
  )
}
