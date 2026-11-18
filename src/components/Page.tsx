import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { HomeIcon } from './Icons'

interface Props {
  left?: ReactNode
  footer?: ReactNode
  center?: boolean
  /** 우측 상단 "홈" 바로가기. 홈 화면에서는 끈다. */
  homeLink?: boolean
  children: ReactNode
}

export function Page({ left, footer, center, homeLink = true, children }: Props) {
  return (
    <div className="page">
      <header className="topbar">
        <span>{left ?? <Link to="/home">쉼표</Link>}</span>
        {homeLink && (
          <Link to="/home" aria-label="홈으로 가기">
            <HomeIcon size={16} />홈
          </Link>
        )}
      </header>
      <main className={center ? 'page-body center' : 'page-body'}>{children}</main>
      {footer && <footer className="page-foot">{footer}</footer>}
    </div>
  )
}
