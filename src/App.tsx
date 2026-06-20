import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { AppShell } from '@/components/layout/AppShell'

import LoginPage from '@/pages/auth/LoginPage'
import ConsentPage from '@/pages/auth/ConsentPage'
import OnboardingPage from '@/pages/auth/OnboardingPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import AnnouncementsPage from '@/pages/announcements/AnnouncementsPage'
import AssignmentsPage from '@/pages/assignments/AssignmentsPage'
import AttendancePage from '@/pages/attendance/AttendancePage'
import MessagesPage from '@/pages/messages/MessagesPage'
import CalendarPage from '@/pages/calendar/CalendarPage'
import StudentsPage from '@/pages/students/StudentsPage'
import ClassesPage from '@/pages/classes/ClassesPage'
import AuditLogPage from '@/pages/admin/AuditLogPage'
import SettingsPage from '@/pages/admin/SettingsPage'
import type { UserRole } from '@/types'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
})

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: UserRole[] }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  // Logged in but no profile yet → needs to set up their school
  if (!profile) return <Navigate to="/onboarding" replace />

  if (profile.consent_status === 'pending_consent' && profile.role === 'student') {
    return <Navigate to="/consent" replace />
  }

  if (roles && !roles.includes(profile.role as UserRole)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (user && profile?.consent_status === 'pending_consent' && profile.role === 'student') {
    return (
      <Routes>
        <Route path="/consent" element={<ConsentPage />} />
        <Route path="*" element={<Navigate to="/consent" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={profile ? '/dashboard' : '/onboarding'} replace />} />
      <Route path="/onboarding" element={user && !profile ? <OnboardingPage /> : <Navigate to={user ? '/dashboard' : '/login'} replace />} />
      <Route path="/consent" element={<ConsentPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="assignments" element={<AssignmentsPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route
          path="students"
          element={
            <ProtectedRoute roles={['super_admin', 'school_admin', 'teacher']}>
              <StudentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="classes"
          element={
            <ProtectedRoute roles={['super_admin', 'school_admin', 'teacher']}>
              <ClassesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/audit-log"
          element={
            <ProtectedRoute roles={['super_admin', 'school_admin']}>
              <AuditLogPage />
            </ProtectedRoute>
          }
        />
        <Route path="admin/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
