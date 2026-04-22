import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Header, UrlShortener, AuthPage, EmailConfirmation, Dashboard, ProtectedRoute } from './components'
import { DarkModeProvider } from './shared/contexts/DarkModeContext'
import { useAuthContext } from './shared/contexts/AuthContext'

function AppContent() {
  const { state } = useAuthContext();

  // Show loading spinner while checking authentication
  if (state.isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <Header />
      <main className="relative w-full">
        {/* Background decoration */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-64 -right-64 w-[34rem] h-[34rem] bg-gradient-to-br from-indigo-300/20 to-cyan-200/10 dark:from-indigo-500/15 dark:to-cyan-400/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-64 -left-64 w-[34rem] h-[34rem] bg-gradient-to-br from-fuchsia-200/10 to-indigo-200/10 dark:from-fuchsia-500/10 dark:to-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-[26rem] h-[26rem] bg-gradient-to-br from-sky-200/10 to-indigo-200/10 dark:from-sky-500/8 dark:to-indigo-500/8 rounded-full blur-3xl"></div>
        </div>
        
        {/* Content with proper spacing */}
        <div className="relative z-10 w-full min-h-[calc(100vh-4rem)] pt-8 sm:pt-12 lg:pt-16 pb-16 sm:pb-20 lg:pb-24">
          <Routes>
            <Route path="/" element={<UrlShortener />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/register" element={<AuthPage />} />
            <Route path="/auth/confirm" element={<EmailConfirmation />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <DarkModeProvider>
      <AppContent />
    </DarkModeProvider>
  )
}

export default App
