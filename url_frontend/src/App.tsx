import './App.css'
import { Header } from './components/Header/Header'
import { UrlShortener } from './components/UrlShortener/UrlShortener'
import { DarkModeProvider } from './shared/contexts/DarkModeContext'

function App() {
  return (
    <DarkModeProvider>
      <div className="w-full h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden transition-colors duration-300">
        <Header />
        <main className="relative w-full h-[calc(100vh-4rem)] flex items-center justify-center overflow-y-auto">
          {/* Background decoration */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-400/30 dark:from-blue-600/30 dark:to-purple-600/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/30 to-pink-400/30 dark:from-purple-600/30 dark:to-pink-600/30 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-purple-300/20 dark:from-blue-500/20 dark:to-purple-500/20 rounded-full blur-3xl"></div>
          </div>
          
          {/* Content */}
          <div className="glass relative z-10 w-full h-full flex items-center justify-center animate-fade-in-up">
            <UrlShortener />
          </div>
        </main>
      </div>
    </DarkModeProvider>
  )
}

export default App
