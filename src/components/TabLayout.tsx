import { NavLink, Outlet } from 'react-router-dom'
import { GearIcon, HomeIcon, PencilIcon } from './Icons'

const tabs = [
  { to: '/records', label: '기록', icon: <PencilIcon /> },
  { to: '/home', label: '홈', icon: <HomeIcon /> },
  { to: '/settings', label: '설정', icon: <GearIcon /> },
]

export function TabLayout() {
  return (
    <div className="tabs-layout">
      <Outlet />
      <nav className="tabbar">
        {tabs.map((t) => (
          <NavLink key={t.to} to={t.to}>
            {t.icon}
            {t.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
