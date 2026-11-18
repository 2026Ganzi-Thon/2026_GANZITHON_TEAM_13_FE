import { useMemo, useState } from 'react'
import { CheckIcon } from '@/components/Icons'
import { Page } from '@/components/Page'
import { useLoad } from '@/hooks/useLoad'
import { type Activity, isSameMonth, isThisWeek, loadActivity, weekDone } from '@/lib/activity'
import { formatDay, formatTime, startOfDay, weekdayIndex } from '@/lib/time'

const DAYS = ['월', '화', '수', '목', '금', '토', '일']

const periods = [
  { key: 'week', label: '이번 주', test: isThisWeek },
  { key: 'month', label: '이번 달', test: (d: Date) => isSameMonth(d) },
  { key: 'all', label: '전체', test: () => true },
] as const

const kinds = [
  { key: 'all', label: '전체', test: () => true },
  { key: 'done', label: '해낸 미션', test: (a: Activity) => a.kind === 'done' },
  { key: 'etc', label: '쉬어간 날', test: (a: Activity) => a.kind !== 'done' },
] as const

const kindLabel: Record<Activity['kind'], string | null> = {
  done: null,
  cancel: '잠깐 멈춤',
  rest: '쉬어간 날',
  skip: '건너뛴 날',
}

export function Records() {
  const { data: all = [], loading } = useLoad(loadActivity)
  const [period, setPeriod] = useState<(typeof periods)[number]['key']>('week')
  const [kind, setKind] = useState<(typeof kinds)[number]['key']>('all')
  const [day, setDay] = useState<number | null>(null)

  const week = weekDone(all)
  const doneThisWeek = all.filter((a) => a.kind === 'done' && isThisWeek(new Date(a.at))).length

  const groups = useMemo(() => {
    const inPeriod = periods.find((p) => p.key === period)!.test
    const byKind = kinds.find((k) => k.key === kind)!.test
    const shown = all.filter((a) => {
      const at = new Date(a.at)
      return inPeriod(at) && byKind(a) && (day === null || (isThisWeek(at) && weekdayIndex(at) === day))
    })
    const map = new Map<number, Activity[]>()
    for (const a of shown) {
      const key = startOfDay(new Date(a.at)).getTime()
      map.set(key, [...(map.get(key) ?? []), a])
    }
    return [...map.entries()]
  }, [all, period, kind, day])

  return (
    <Page>
      <h1 className="title">기록</h1>
      <p className="lead">
        {doneThisWeek > 0
          ? `이번 주에 작은 행동 ${doneThisWeek}개를 해냈어요.`
          : '이번 주에 해낸 작은 행동들이 여기 모여요.'}
      </p>
      <div className="week">
        {DAYS.map((d, i) => (
          <button
            key={d}
            type="button"
            aria-pressed={day === i}
            aria-label={`${d}요일 활동 ${day === i ? '전체 보기' : '보기'}`}
            onClick={() => setDay(day === i ? null : i)}
          >
            <i className={week[i] ? 'on' : undefined}>{week[i] && <CheckIcon />}</i>
            {d}
          </button>
        ))}
      </div>

      <h2 className="section-title">지난 활동</h2>
      <div className="chips">
        {periods.map((p) => (
          <button key={p.key} type="button" className="chip" aria-pressed={period === p.key} onClick={() => setPeriod(p.key)}>
            {p.label}
          </button>
        ))}
      </div>
      <div className="chips">
        {kinds.map((k) => (
          <button key={k.key} type="button" className="chip" aria-pressed={kind === k.key} onClick={() => setKind(k.key)}>
            {k.label}
          </button>
        ))}
      </div>

      {!loading && groups.length === 0 && (
        <p className="lead muted">아직 기록이 없어요. 작은 것부터 천천히 시작해봐요.</p>
      )}
      {groups.map(([time, list]) => (
        <section key={time}>
          <p className="lead muted" style={{ marginTop: 8 }}>
            {formatDay(new Date(time))}
          </p>
          <ul className="rows">
            {list.map((a) => (
              <li key={a.id} className="row">
                <span>
                  {a.title}
                  {kindLabel[a.kind] && <span className="tag" style={{ marginLeft: 8 }}>{kindLabel[a.kind]}</span>}
                </span>
                <small>{formatTime(new Date(a.at))}</small>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </Page>
  )
}
