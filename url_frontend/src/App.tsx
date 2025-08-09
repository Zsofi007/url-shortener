import './App.css'
import { Header } from './components/Header/Header'
import { UrlShortener } from './components/UrlShortener/UrlShortener'

function App() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      <Header />
      <main className="relative w-full h-[calc(100vh-4rem)] flex items-center justify-center overflow-y-auto">
        {/* Background decoration */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-300/10 to-purple-300/10 rounded-full blur-3xl"></div>
        </div>
        
        {/* Content */}
        <div className="glass relative z-10 w-full h-full flex items-center justify-center animate-fade-in-up">
          <UrlShortener />
        </div>
      </main>
    </div>
  )
}

export default App
