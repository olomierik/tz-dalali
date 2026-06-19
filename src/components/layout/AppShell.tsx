import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { useOfflineSync } from '@/hooks/useOfflineSync'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Megaphone, BookOpen, CalendarCheck,
  MessageSquare, Calendar, Users, GraduationCap,
  ClipboardList, Settings, LogOut, Menu, X, Wifi, WifiOff,
  RotateCcw, Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface NavItem {
  to: string
  labelKey: string
  icon: React.ElementType
  roles: string[]
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard, roles: ['super_admin','school_admin','teacher','parent','student'] },
  { to: '/announcements', labelKey: 'nav.announcements', icon: Megaphone, roles: ['super_admin','school_admin','teacher','parent','student'] },
  { to: '/assignments', labelKey: 'nav.assignments', icon: BookOpen, roles: ['super_admin','school_admin','teacher','parent','student'] },
  { to: '/attendance', labelKey: 'nav.attendance', icon: CalendarCheck, roles: ['super_admin','school_admin','teacher','parent','student'] },
  { to: '/messages', labelKey: 'nav.messages', icon: MessageSquare, roles: ['super_admin','school_admin','teacher','parent'] },
  { to: '/calendar', labelKey: 'nav.calendar', icon: Calendar, roles: ['super_admin','school_admin','teacher','parent','student'] },
  { to: '/students', labelKey: 'nav.students', icon: Users, roles: ['super_admin','school_admin','teacher'] },
  { to: '/classes', labelKey: 'nav.classes', icon: GraduationCap, roles: ['super_admin','school_admin','teacher'] },
  { to: '/admin/audit-log', labelKey: 'nav.auditLog', icon: ClipboardList, roles: ['super_admin','school_admin'] },
  { to: '/admin/settings', labelKey: 'nav.settings', icon: Settings, roles: ['super_admin','school_admin'] },
]

const BOTTOM_TAB_ITEMS: NavItem[] = [
  { to: '/dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard, roles: ['super_admin','school_admin','teacher','parent','student'] },
  { to: '/assignments', labelKey: 'nav.assignments', icon: BookOpen, roles: ['super_admin','school_admin','teacher','parent','student'] },
  { to: '/messages', labelKey: 'nav.messages', icon: MessageSquare, roles: ['super_admin','school_admin','teacher','parent'] },
  { to: '/calendar', labelKey: 'nav.calendar', icon: Calendar, roles: ['super_admin','school_admin','teacher','parent','student'] },
]

export function AppShell() {
  const { t } = useTranslation()
  const { profile, signOut } = useAuth()
  const { isOnline, isSyncing, queueLength } = useOfflineSync()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const role = profile?.role ?? 'student'
  const visibleNav = NAV_ITEMS.filter(item => item.roles.includes(role))
  const visibleTabs = BOTTOM_TAB_ITEMS.filter(item => item.roles.includes(role))

  const initials = profile?.full_name
    ?.split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? '?'

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className={cn(
        'hidden md:flex flex-col w-64 bg-blue-900 text-white shrink-0 transition-all duration-300',
        !sidebarOpen && 'md:w-16'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-blue-800">
          <div className="w-8 h-8 rounded-lg bg-blue-400 flex items-center justify-center shrink-0">
            <Shield className="h-5 w-5 text-white" />
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="font-bold text-sm leading-tight">{t('app.name')}</p>
              <p className="text-blue-300 text-xs truncate">Elohim Education Centre</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="ml-auto text-blue-300 hover:text-white"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-0.5 overflow-y-auto">
          {visibleNav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-blue-700 text-white font-medium'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span className="truncate">{t(item.labelKey)}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User + sign out */}
        <div className="border-t border-blue-800 p-4 space-y-3">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-blue-600 text-white text-xs">{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-xs font-medium text-white truncate">{profile?.full_name}</p>
                <p className="text-xs text-blue-300 capitalize">{t(`roles.${role}`)}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-blue-300 hover:text-white text-xs w-full"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {sidebarOpen && t('nav.signOut')}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside className={cn(
        'md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-blue-900 text-white transform transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-blue-800">
          <div className="w-8 h-8 rounded-lg bg-blue-400 flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm">{t('app.name')}</p>
            <p className="text-blue-300 text-xs">Elohim Education Centre</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto text-blue-300">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="py-4 space-y-0.5">
          {visibleNav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-4 py-3 text-sm transition-colors',
                isActive ? 'bg-blue-700 text-white font-medium' : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5" />
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-blue-800 p-4">
          <button onClick={handleSignOut} className="flex items-center gap-2 text-blue-300 hover:text-white text-sm w-full">
            <LogOut className="h-5 w-5" />
            {t('nav.signOut')}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-700" />
            <span className="font-bold text-blue-900 text-sm">{t('app.name')}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {!isOnline && <WifiOff className="h-4 w-4 text-red-500" />}
            {isSyncing && <RotateCcw className="h-4 w-4 text-blue-500 animate-spin" />}
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-blue-700 text-white text-xs">{initials}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Offline banner */}
        {(!isOnline || isSyncing) && (
          <div className={cn(
            'text-xs text-center py-1.5 px-4',
            !isOnline ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
          )}>
            {!isOnline ? (
              <span className="flex items-center justify-center gap-1">
                <WifiOff className="h-3 w-3" /> {t('common.offline')}
                {queueLength > 0 && <Badge variant="secondary" className="ml-1 text-[10px] h-4">{queueLength} pending</Badge>}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1">
                <RotateCcw className="h-3 w-3 animate-spin" /> {t('common.syncing')}
              </span>
            )}
          </div>
        )}

        {/* Desktop top bar */}
        <header className="hidden md:flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {!isOnline && (
              <span className="flex items-center gap-1 text-red-600">
                <WifiOff className="h-4 w-4" /> Offline
              </span>
            )}
            {isOnline && <span className="flex items-center gap-1 text-green-600"><Wifi className="h-4 w-4" /> Connected</span>}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{profile?.full_name}</span>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-700 text-white text-sm">{initials}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto pb-20 md:pb-0">
          <Outlet />
        </main>

        {/* Mobile bottom tab bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 flex">
          {visibleTabs.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                'flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] transition-colors',
                isActive ? 'text-blue-700 font-medium' : 'text-gray-500'
              )}
            >
              <item.icon className="h-5 w-5" />
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
