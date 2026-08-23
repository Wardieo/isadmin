import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { Icon, type IconName } from './Icon'
import { phDate } from '../types'

export type Page = 'overview' | 'bookings' | 'calendar' | 'reviews' | 'reports' | 'settings'
const nav: Array<{ id: Page; label: string; icon: IconName }> = [
  { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
  { id: 'bookings', label: 'Bookings', icon: 'CalendarCheck2' },
  { id: 'calendar', label: 'Calendar', icon: 'CalendarDays' },
  { id: 'reviews', label: 'Reviews', icon: 'MessageSquareText' },
  { id: 'reports', label: 'Reports', icon: 'ChartNoAxesCombined' },
  { id: 'settings', label: 'Settings', icon: 'Settings' },
]

export function Layout({ page, setPage, user, onLogout, children }: { page: Page; setPage: (page: Page) => void; user: User; onLogout: () => void; children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('isora-sidebar-collapsed') === 'true')
  const [mobileOpen, setMobileOpen] = useState(false)
  const current = nav.find((item) => item.id === page)!
  useEffect(() => setMobileOpen(false), [page])
  useEffect(() => localStorage.setItem('isora-sidebar-collapsed', String(collapsed)), [collapsed])
  return <div className={`app-shell ${collapsed ? 'is-collapsed' : ''}`}>
    {mobileOpen && <button className="drawer-overlay" aria-label="Close menu" onClick={() => setMobileOpen(false)} />}
    <aside className={`sidebar ${mobileOpen ? 'is-open' : ''}`}>
      <div className="brand"><div className="brand__mark">IS</div><div><strong>Isora Studio</strong><span>Admin workspace</span></div></div>
      <nav aria-label="Dashboard navigation">{nav.map((item) => <button key={item.id} className={page === item.id ? 'active' : ''} onClick={() => setPage(item.id)} aria-current={page === item.id ? 'page' : undefined}><Icon name={item.icon} size={19}/><span>{item.label}</span></button>)}</nav>
      <div className="sidebar__footer"><button type="button" onClick={onLogout}><Icon name="LogOut" size={19}/><span>Log out</span></button><button type="button" className="collapse-button" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}><Icon name={collapsed ? 'PanelLeftOpen' : 'PanelLeftClose'} size={19}/><span>{collapsed ? 'Expand sidebar' : 'Collapse sidebar'}</span></button></div>
    </aside>
    <div className="app-main">
      <header className="topbar"><div className="topbar__title"><button className="menu-button" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Icon name="Menu" /></button><div><h1>{current.label}</h1><p>{phDate(new Date(), { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p></div></div><div className="topbar__actions"><button className="icon-button" aria-label="Notifications"><Icon name="Bell"/><span className="notification-dot" /></button><div className="account"><span className="avatar">{(user.email?.[0] || 'A').toUpperCase()}</span><div><strong>{user.user_metadata?.full_name || 'Studio Admin'}</strong><span>{user.email}</span></div></div></div></header>
      <main>{children}</main>
    </div>
  </div>
}
