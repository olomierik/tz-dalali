import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard, FileText, Heart, Bell, User, Building2, Plus,
  Briefcase, DollarSign, Users, Settings, LogOut, Menu, X, ChevronRight,
  ClipboardList, ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { NotificationBell } from '@/components/common/NotificationBell'
import { useAuthContext } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

interface NavItem {
  to: string
  icon: React.ElementType
  label: string
}

const BUYER_NAV: NavItem[] = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/transactions', icon: FileText, label: 'My Transactions' },
  { to: '/dashboard/saved', icon: Heart, label: 'Saved Properties' },
  { to: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
  { to: '/dashboard/profile', icon: User, label: 'Profile' },
]

const SELLER_NAV: NavItem[] = [
  { to: '/seller', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/seller/listings', icon: Building2, label: 'My Listings' },
  { to: '/seller/listings/new', icon: Plus, label: 'New Listing' },
  { to: '/seller/transactions', icon: FileText, label: 'Transactions' },
  { to: '/dashboard/profile', icon: User, label: 'Profile' },
]

const PARTNER_NAV: NavItem[] = [
  { to: '/partner', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/partner/transactions', icon: Briefcase, label: 'Assigned Deals' },
  { to: '/partner/payouts', icon: DollarSign, label: 'Payouts' },
  { to: '/partner/profile', icon: User, label: 'Firm Profile' },
]

const ADMIN_NAV: NavItem[] = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/listings', icon: Building2, label: 'Listings' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/partners', icon: ShieldCheck, label: 'Partners' },
  { to: '/admin/transactions', icon: ClipboardList, label: 'Transactions' },
]

const ROLE_LABELS: Record<string, string> = {
  buyer: 'Buyer',
  seller: 'Seller',
  law_firm: 'Law Firm',
  tax_consultant: 'Tax Consultant',
  admin: 'Admin',
  superadmin: 'Super Admin',
}

function getNav(role: string | null): NavItem[] {
  if (role === 'admin' || role === 'superadmin') return ADMIN_NAV
  if (role === 'law_firm' || role === 'tax_consultant') return PARTNER_NAV
  if (role === 'seller') return [...SELLER_NAV, ...BUYER_NAV.filter(n => n.to === '/dashboard/saved' || n.to === '/dashboard/notifications')]
  return BUYER_NAV
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { profile, role, signOut } = useAuthContext()
  const navigate = useNavigate()
  const nav = getNav(role)

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : profile?.email?.[0]?.toUpperCase() ?? '?'

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-baseline gap-0.5 mb-4" onClick={onClose}>
          <span className="font-bold text-xl tracking-tight text-sidebar-foreground">TZ</span>
          <span className="font-serif text-xl text-sidebar-primary font-semibold">Dalali</span>
        </Link>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={profile?.avatar_url ?? ''} />
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-sm">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{profile?.full_name || profile?.email || 'User'}</p>
            <Badge variant="secondary" className="text-xs bg-sidebar-accent text-sidebar-accent-foreground border-0 mt-0.5">
              {ROLE_LABELS[role ?? ''] ?? role}
            </Badge>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {nav.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard' || item.to === '/seller' || item.to === '/admin' || item.to === '/partner'}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border space-y-1">
        <Link to="/listings" onClick={onClose}>
          <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent">
            <Building2 className="h-4 w-4 mr-2" /> Browse Listings
          </Button>
        </Link>
        <Button
          variant="ghost" size="sm"
          className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" /> Sign Out
        </Button>
      </div>
    </div>
  )
}

export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { profile, signOut } = useAuthContext()
  const navigate = useNavigate()

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : profile?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-sidebar border-r border-sidebar-border fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar border-sidebar-border">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <SidebarContent onClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-background border-b border-border h-16 flex items-center px-4 gap-3">
          <Button
            variant="ghost" size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1" />

          <NotificationBell />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={profile?.avatar_url ?? ''} />
                  <AvatarFallback className="text-xs bg-gold/20 text-gold">{initials}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm max-w-[120px] truncate">
                  {profile?.full_name || profile?.email}
                </span>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/dashboard/profile"><User className="h-4 w-4 mr-2" />Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/listings"><Building2 className="h-4 w-4 mr-2" />Browse Listings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={async () => { await signOut(); navigate('/') }}>
                <LogOut className="h-4 w-4 mr-2" />Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
