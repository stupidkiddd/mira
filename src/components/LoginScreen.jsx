import { useEffect, useRef, useState } from 'react'
import StepCounter from './StepCounter.jsx'
import { introPages } from '../game/storyContent.js'

function CaseReference({ onClose }) {
  return (
    <div className="case-reference" role="dialog" aria-modal="true" aria-label="案件資料">
      <div className="case-reference__panel">
        <header><div><span>案件檔案／M-240916</span><h2>失蹤人口案件</h2></div><button type="button" onClick={onClose} aria-label="關閉案件資料">×</button></header>
        <dl>{introPages[0].fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      </div>
    </div>
  )
}

function LoginScreen({ game, updateGame, restartGame }) {
  const [password, setPassword] = useState('')
  const [showCase, setShowCase] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const errorMessage = game.wrongAttempts > 0 ? '密碼不正確。你可以查看案件資料。' : ''

  const playLoginSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      const audio = new AudioContext()
      const gain = audio.createGain()
      gain.gain.setValueAtTime(0.0001, audio.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.06, audio.currentTime + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.55)
      gain.connect(audio.destination)
      ;[523.25, 659.25, 783.99].forEach((frequency, index) => {
        const oscillator = audio.createOscillator()
        oscillator.type = 'sine'
        oscillator.frequency.value = frequency
        oscillator.connect(gain)
        oscillator.start(audio.currentTime + index * 0.08)
        oscillator.stop(audio.currentTime + 0.48)
      })
      window.setTimeout(() => audio.close(), 700)
    } catch {
      // Audio is optional when the browser blocks Web Audio.
    }
  }

  const submit = (event) => {
    event.preventDefault()
    if (loading) return
    if (password !== '0916') {
      updateGame({ wrongAttempts: game.wrongAttempts + 1 })
      setPassword('')
      inputRef.current?.focus()
      return
    }
    setLoading(true)
    playLoginSound()
    window.setTimeout(() => updateGame({ screen: 'desktop', loggedIn: true, currentStep: 2, unlocked: Array.from(new Set([...game.unlocked, 'desktop'])) }), 1250)
  }

  return (
    <section className="login-screen">
      <div className="login-screen__wash" />
      <div className="windows-corner-brand" aria-label="Windows 11">
        <span className="windows-logo"><i /><i /><i /><i /></span>
        <strong>Windows 11</strong>
      </div>
      <form className="login-card" onSubmit={submit}>
        <div className="login-avatar" aria-hidden="true"><div className="login-avatar__head" /><div className="login-avatar__shoulders" /></div>
        <p className="login-card__label">歡迎</p><h1>林以晴</h1><span className="login-card__device">LYQ-OLD-07</span>
        <label className="password-field"><span className="sr-only">四位數密碼</span><input ref={inputRef} inputMode="numeric" autoComplete="off" maxLength="4" value={password} placeholder="輸入四位數密碼" onChange={(event) => setPassword(event.target.value.replace(/\D/g, ''))} aria-invalid={Boolean(errorMessage)} /><button type="submit" aria-label="登入" disabled={password.length !== 4 || loading}>→</button></label>
        {errorMessage && <p className="login-error" role="alert">{errorMessage}</p>}
        <button className="case-link" type="button" onClick={() => setShowCase(true)}>查看案件資料</button>
      </form>
      <button className="login-reset" type="button" onClick={restartGame}>重新開始</button>
      <div className="login-system-controls" aria-label="系統選項">
        <button className="login-system-controls__network" type="button" aria-label="網絡"><i /><i /><i /></button>
        <button className="login-system-controls__access" type="button" aria-label="協助工具">◉</button>
        <button className="login-system-controls__power" type="button" aria-label="電源">↻</button>
      </div>
      {loading && <div className="loading-screen" role="status"><div className="loading-screen__mark">M</div><p>正在載入本機資料</p><div className="loading-bar"><i /></div></div>}
      {showCase && <CaseReference onClose={() => setShowCase(false)} />}
      <StepCounter step={1} savedAt={game.lastSavedAt} />
    </section>
  )
}

export default LoginScreen
