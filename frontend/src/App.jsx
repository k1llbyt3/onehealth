import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useUIStore, applyTheme } from './store/uiStore'
import { AppShell } from './components/layout/AppShell'
import { Spinner } from './components/ui/index'

// Pages
import Landing from './pages/Landing'
import { Login, Register, OTP } from './pages/Auth'
import Onboarding from './pages/Onboarding'
import Dashboard from './components/dashboard/Dashboard'
import Passport from './components/passport/Passport'
import SymptomAnalyzer from './components/symptom/SymptomAnalyzer'
import Emergency from './components/emergency/Emergency'
import ReportAnalyzer from './components/reports/ReportAnalyzer'
import Medications from './components/medications/Medications'
import FeedbackAnalytics from './components/dashboard/FeedbackAnalytics'
import HealthReportGenerator from './components/dashboard/HealthReportGenerator'

// Doctor Portal
import { DoctorLayout } from './components/doctor/layout/DoctorLayout'
import { DoctorLogin } from './pages/doctor/auth/DoctorLogin'
import { DoctorRegister } from './pages/doctor/auth/DoctorRegister'
import { Dashboard as DoctorDashboard } from './pages/doctor/Dashboard'
import { PatientDirectory } from './pages/doctor/PatientDirectory'
import { PatientPassport as DoctorPatientPassport } from './pages/doctor/PatientPassport'
import { ActiveConsultation } from './pages/doctor/ActiveConsultation'
import { Analytics as DoctorAnalytics } from './pages/doctor/Analytics'
import { Profile as DoctorProfile } from './pages/doctor/Profile'

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>
  )
}

// Route guard — redirect to /login if not authenticated
function PrivateRoute() {
  // For demo: always allow access (mock user is pre-loaded in store)
  return <Outlet />
}

// Page title map
const PAGE_TITLES = {
  '/dashboard':          { title: 'Dashboard',             subtitle: 'Your health at a glance' },
  '/passport':           { title: 'Health Passport',        subtitle: 'Your complete medical history' },
  '/symptoms':           { title: 'Symptom Analyzer',       subtitle: 'AI-powered health triage' },
  '/emergency':          { title: 'Emergency Card',         subtitle: 'Critical information for first responders' },
  '/reports':            { title: 'Report Analyzer',        subtitle: 'AI analysis of your lab reports' },
  '/medications':        { title: 'Medications',            subtitle: 'Track and manage your prescriptions' },
  '/risk':               { title: 'Risk Prediction',        subtitle: 'AI-driven health risk assessment' },
  '/feedback-analytics': { title: 'Feedback Analytics',    subtitle: 'AI sentiment analysis' },
  '/health-report':      { title: 'AI Health Report',      subtitle: 'Generate your comprehensive health report' },
  '/settings':           { title: 'Settings',              subtitle: 'Manage your account and preferences' },
}

function DashboardShellWrapper({ pagePath }) {
  const info = PAGE_TITLES[pagePath] || {}
  return <AppShell title={info.title} subtitle={info.subtitle} />
}

// Placeholder for pages not yet built
function Placeholder({ name }) {
  return (
    <div className="page-container py-16 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface-2)] flex items-center justify-center mb-4 text-3xl">🚧</div>
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{name}</h1>
      <p className="text-[var(--color-text-secondary)] mt-2">This page is coming soon.</p>
    </div>
  )
}

export default function App() {
  const theme = useUIStore(s => s.theme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] font-sans flex flex-col transition-colors duration-300">
        <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Doctor Public Routes */}
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/doctor/register" element={<DoctorRegister />} />

          {/* Doctor Protected Routes */}
          <Route path="/doctor" element={<DoctorLayout />}>
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="patients" element={<PatientDirectory />} />
            <Route path="patients/:id" element={<DoctorPatientPassport />} />
            <Route path="consultation" element={<Navigate to="/doctor/patients" replace />} />
            <Route path="consultation/:id" element={<ActiveConsultation />} />
            <Route path="analytics" element={<DoctorAnalytics />} />
            <Route path="profile" element={<DoctorProfile />} />
            <Route index element={<Navigate to="/doctor/dashboard" replace />} />
          </Route>

          {/* Protected app routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<AppShell title="Dashboard" subtitle="Your health at a glance" />}>
              <Route index element={<Dashboard />} />
            </Route>
            <Route path="/passport" element={<AppShell title="Health Passport" subtitle="Your complete medical history" />}>
              <Route index element={<Passport />} />
            </Route>
            <Route path="/symptoms" element={<AppShell title="Symptom Analyzer" subtitle="AI-powered health triage" />}>
              <Route index element={<SymptomAnalyzer />} />
            </Route>
            <Route path="/emergency" element={<AppShell title="Emergency Card" subtitle="Critical information for first responders" />}>
              <Route index element={<Emergency />} />
            </Route>
            <Route path="/reports" element={<AppShell title="Report Analyzer" subtitle="AI analysis of your lab reports" />}>
              <Route index element={<ReportAnalyzer />} />
            </Route>
            <Route path="/medications" element={<AppShell title="Medications" subtitle="Track and manage your prescriptions" />}>
              <Route index element={<Medications />} />
            </Route>
            <Route path="/risk" element={<AppShell title="Risk Prediction" subtitle="AI-driven health risk assessment" />}>
              <Route index element={<Placeholder name="Risk Prediction" />} />
            </Route>
            <Route path="/feedback-analytics" element={<AppShell title="Feedback Analytics" subtitle="AI sentiment analysis" />}>
              <Route index element={<FeedbackAnalytics />} />
            </Route>
            <Route path="/health-report" element={<AppShell title="AI Health Report" subtitle="Generate your comprehensive health report" />}>
              <Route index element={<HealthReportGenerator />} />
            </Route>
            <Route path="/settings" element={<AppShell title="Settings" subtitle="Manage your account and preferences" />}>
              <Route index element={<Placeholder name="Settings" />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      </div>
    </BrowserRouter>
  )
}
