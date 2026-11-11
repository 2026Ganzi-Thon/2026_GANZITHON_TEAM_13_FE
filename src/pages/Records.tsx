import { Page } from '@/components/Page'
import { useEntries, weekProgress } from '@/lib/records'
import { formatWhen } from '@/lib/time'

const DAYS = ['월', '화', '수', '목', '금', '토', '일']

export function Records() {
  const entries = useEntries()
  const week = weekProgress(entries)
  const past = entries.filter((e) => e.kind === 'done').slice(0, 10)

  return (
    <Page left="1분 미션" right="기록">
      <h1 className="title">작은 성취</h1>
      <p className="lead">이번 주에 해낸 작은 행동이에요.</p>
      <div className="week">
        {DAYS.map((d, i) => (
          <div key={d}>
            <i className={week[i] ? 'on' : undefined} />
            {d}
          </div>
        ))}
      </div>
      <h2 className="section-title">지난 미션</h2>
      {past.length === 0 ? (
        <p className="lead">아직 기록이 없어요. 작은 것부터 시작해봐요.</p>
      ) : (
        <ul className="rows" style={{ listStyle: 'none', padding: 0 }}>
          {past.map((e) => (
            <li key={e.id} className="row">
              {e.title}
              <small>{formatWhen(new Date(e.at))}</small>
            </li>
          ))}
        </ul>
      )}
    </Page>
  )
}
