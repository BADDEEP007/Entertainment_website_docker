import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SplashCursor from './Components/React-bits/splash_cur.jsx'
import { HomePage } from './Pages/HomePage.jsx'
import { GamesPage } from './Pages/GamesPage.jsx'
import { LoginPage } from './Pages/LoginPage.jsx'
import '../src/App.css'
import GamePlay from './Pages/GamePlay.jsx'

function App() {
  return (
    <Router>
     
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path = "/play/:gameid" element = {<GamePlay/>}/>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  )
}

export default App
