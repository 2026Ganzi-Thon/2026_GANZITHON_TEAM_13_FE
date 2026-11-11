import { useNavigate } from 'react-router-dom'

export function BackLink({ label = '← 뒤로' }: { label?: string }) {
  const navigate = useNavigate()
  return (
    <button type="button" onClick={() => navigate(-1)}>
      {label}
    </button>
  )
}
