import { durationLabel, type Mission } from '@/lib/missions'
import { ClockIcon } from './Icons'

interface Props {
  mission: Mission
  selected?: boolean
  showDesc?: boolean
  onSelect: () => void
}

export function MissionItem({ mission, selected, showDesc = true, onSelect }: Props) {
  return (
    <button type="button" className="pill" aria-pressed={selected} onClick={onSelect}>
      <span>
        <span className="pill-title">{mission.title}</span>
        {showDesc && <span className="pill-desc" style={{ display: 'block' }}>{mission.description}</span>}
      </span>
      <span className="badge">
        <ClockIcon />
        {durationLabel(mission)}
      </span>
    </button>
  )
}
