import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SplashCursor from './Components/React-bits/splash_cur.jsx'
import { HomePage } from './Pages/HomePage.jsx'
import { GamesPage } from './Pages/GamesPage.jsx'
import { LoginPage } from './Pages/LoginPage.jsx'
import { GamePlayPage } from './Pages/GamePlayPage.jsx'
import { AIPage } from './Pages/ai_page.jsx'
import { AIChatPage } from './Pages/ai_chat_page.jsx'
import { ImageGenPage } from './Pages/ImageGenPage.jsx'
import '../src/App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/play/:gameId" element={<GamePlayPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/ai" element={<AIPage />} />
        <Route path="/ai/chat" element={<AIChatPage />} />
        <Route path="/generate" element={<ImageGenPage />} />
      </Routes>
    </Router>
  )
}

export default App
