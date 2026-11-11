import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  variant?: 'primary' | 'line' | 'text'
  to?: string
  state?: unknown
  disabled?: boolean
  onClick?: () => void
  children: ReactNode
}

export function Button({ variant = 'line', to, state, disabled, onClick, children }: Props) {
  const className = variant === 'text' ? 'btn btn-text' : `btn btn-${variant}`
  if (to && !disabled) {
    return (
      <Link className={className} to={to} state={state} onClick={onClick}>
        {children}
      </Link>
    )
  }
  return (
    <button className={className} type="button" disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}
