import { NavLink, Outlet } from 'react-router-dom'

const tabs = [
  { to: '/home', label: '홈' },
  { to: '/records', label: '기록' },
  { to: '/settings', label: '설정' },
]

export function TabLayout() {
  return (
    <div className="tabs-layout">
      <Outlet />
      <nav className="tabbar">
        {tabs.map((t) => (
          <NavLink key={t.to} to={t.to}>
            {t.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
