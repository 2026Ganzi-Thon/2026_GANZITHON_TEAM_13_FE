import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  variant?: 'primary' | 'dark' | 'text'
  to?: string
  state?: unknown
  disabled?: boolean
  onClick?: () => void
  children: ReactNode
}

const classes = { primary: 'btn', dark: 'btn btn-dark', text: 'btn btn-text' }

export function Button({ variant = 'primary', to, state, disabled, onClick, children }: Props) {
  if (to && !disabled) {
    return (
      <Link className={classes[variant]} to={to} state={state} onClick={onClick}>
        {children}
      </Link>
    )
  }
  return (
    <button className={classes[variant]} type="button" disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}
