import './App.css'
import { Header } from './components/Header/Header'
import { UrlShortener } from './components/UrlShortener/UrlShortener'
import { DarkModeProvider } from './shared/contexts/DarkModeContext'

function App() {
  return (
    <DarkModeProvider>
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
        <Header />
        <main className="relative w-full">
          {/* Background decoration */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-60 -right-60 w-[32rem] h-[32rem] bg-gradient-to-br from-blue-300/15 to-purple-300/15 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-60 -left-60 w-[32rem] h-[32rem] bg-gradient-to-br from-purple-300/15 to-pink-300/15 dark:from-purple-500/10 dark:to-pink-500/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/3 right-1/4 w-[28rem] h-[28rem] bg-gradient-to-br from-indigo-200/10 to-cyan-200/10 dark:from-indigo-400/8 dark:to-cyan-400/8 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/3 left-1/4 w-[28rem] h-[28rem] bg-gradient-to-br from-rose-200/10 to-orange-200/10 dark:from-rose-400/8 dark:to-orange-400/8 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] bg-gradient-to-br from-blue-200/8 to-purple-200/8 dark:from-blue-400/6 dark:to-purple-400/6 rounded-full blur-3xl"></div>
          </div>
          
          {/* Content with proper spacing */}
          <div className="glass relative z-10 w-full min-h-[calc(100vh-4rem)] pt-8 sm:pt-12 lg:pt-16 pb-16 sm:pb-20 lg:pb-24 animate-fade-in-up">
            <UrlShortener />
          </div>
        </main>
      </div>
    </DarkModeProvider>
  )
}

export default App
