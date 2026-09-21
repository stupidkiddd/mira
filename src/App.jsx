import { useCallback, useEffect, useMemo, useState } from 'react'
import IntroScreen from './components/IntroScreen.jsx'
import LoginScreen from './components/LoginScreen.jsx'
import DesktopScreen from './components/DesktopScreen.jsx'
import { createInitialState, loadGameState, saveGameState, STORAGE_KEY } from './game/gameState.js'
import './App.css'
import './styles/game.css'

function App() {
  const [game, setGame] = useState(loadGameState)

  useEffect(() => {
    saveGameState(game)
  }, [game])

  const updateGame = useCallback((patch) => {
    setGame((current) => {
      const changes = typeof patch === 'function' ? patch(current) : patch
      return { ...current, ...changes, lastSavedAt: new Date().toISOString() }
    })
  }, [])

  const restartGame = useCallback(() => {
    if (!window.confirm('確定要清除所有進度，重新開始調查嗎？')) return
    localStorage.removeItem(STORAGE_KEY)
    setGame(createInitialState())
  }, [])

  const screen = useMemo(() => {
    if (game.screen === 'login') return <LoginScreen game={game} updateGame={updateGame} restartGame={restartGame} />
    if (game.screen === 'desktop') return <DesktopScreen game={game} updateGame={updateGame} restartGame={restartGame} />
    return <IntroScreen game={game} updateGame={updateGame} />
  }, [game, restartGame, updateGame])

  return (
    <main className="game-shell">
      {screen}
      <div className="mobile-notice" role="dialog" aria-modal="true">
        <div className="mobile-notice__card">
          <span className="mobile-notice__mark">M</span>
          <h1>請使用電腦開啟</h1>
          <p>這次調查需要操作桌面、視窗與瀏覽器，建議使用寬度至少 1024 像素的電腦螢幕。</p>
        </div>
      </div>
    </main>
  )
}

export default App
