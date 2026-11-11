import type { ReactNode } from 'react'

interface Props {
  left?: ReactNode
  right?: ReactNode
  footer?: ReactNode
  center?: boolean
  children: ReactNode
}

export function Page({ left, right, footer, center, children }: Props) {
  return (
    <div className="page">
      <header className="topbar">
        <span>{left}</span>
        <span>{right}</span>
      </header>
      <main className={center ? 'page-body center' : 'page-body'}>{children}</main>
      {footer && <footer className="page-foot">{footer}</footer>}
    </div>
  )
}
