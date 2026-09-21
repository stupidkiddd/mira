import { useEffect, useState } from 'react'
import StepCounter from './StepCounter.jsx'
import WindowFrame from './WindowFrame.jsx'
import BrowserApp from './BrowserApp.jsx'
import { desktopItems, windowCopy } from '../game/storyContent.js'

const defaultPositions = {
  browser: { left: 220, top: 48 },
  documents: { left: 310, top: 96 },
  photos: { left: 360, top: 122 },
  backup: { left: 290, top: 80 },
  recycle: { left: 380, top: 106 },
  notes: { left: 420, top: 76 },
  computer: { left: 360, top: 90 },
}

function clampWindowPosition(id, position) {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const frameWidth = id === 'browser'
    ? Math.min(980, Math.max(740, viewportWidth - 250))
    : Math.min(720, Math.max(580, viewportWidth - 350))

  return {
    left: Math.max(0, Math.min(position.left, viewportWidth - frameWidth)),
    top: Math.max(0, Math.min(position.top, viewportHeight - 88)),
  }
}

function IconGlyph({ type }) {
  return <span className={`desktop-icon__glyph desktop-icon__glyph--${type}`}><i /><b /></span>
}

function FileWindow({ data }) {
  return (
    <div className="file-window">
      <div className="file-window__toolbar"><button type="button">←</button><button type="button">→</button><div>此電腦　›　{data.title}</div><label>搜尋 {data.title}</label></div>
      {data.notice && <div className="file-window__notice">!　{data.notice}</div>}
      {data.rows.length ? <div className="file-list"><header><span>名稱</span><span>類型</span><span>修改日期</span></header>{data.rows.map((row) => <div key={row[0]}><span><i />{row[0]}</span><span>{row[1]}</span><span>{row[2]}</span></div>)}</div> : <div className="file-window__empty"><span>◇</span><p>{data.emptyTitle}</p></div>}
      <footer>{data.rows.length ? data.emptyTitle : '0 個項目'}</footer>
    </div>
  )
}

function ComputerWindow() {
  return (
    <div className="computer-info">
      <div className="computer-info__hero"><span><i /></span><div><small>這台裝置</small><h2>LYQ-OLD-07</h2><p>Windows 11 Pro</p></div></div>
      <h3>裝置資料</h3><dl><div><dt>裝置名稱</dt><dd>LYQ-OLD-07</dd></div><div><dt>類型</dt><dd>私人裝置</dd></div><div><dt>曾登記用途</dt><dd>客服系統測試</dd></div><div><dt>狀態</dt><dd><span>已申報損壞</span></dd></div></dl><p className="computer-info__footnote">此為額外資料，不影響調查進度。</p>
    </div>
  )
}

function NotesWindow({ value, onChange }) {
  return <div className="notes-app"><div className="notes-app__toolbar"><strong>調查筆記</strong><span>本機自動保存</span></div><textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={'在這裏記下線索……\n\n例如：姐姐的生日、可疑網站或檔案名稱。'} /><footer>{value.length} 個字元</footer></div>
}

function DesktopScreen({ game, updateGame, restartGame }) {
  const [clock, setClock] = useState(new Date())
  useEffect(() => { const timer = window.setInterval(() => setClock(new Date()), 30000); return () => window.clearInterval(timer) }, [])

  const focusWindow = (id) => {
    updateGame((current) => ({
      activeWindow: id,
      startMenuOpen: false,
      zOrder: [...current.zOrder.filter((item) => item !== id), id],
      windowStates: {
        ...current.windowStates,
        [id]: { ...current.windowStates?.[id], minimized: false },
      },
    }))
  }

  const openWindow = (id) => {
    updateGame((current) => {
      const nextPatch = {
        openWindows: Array.from(new Set([...current.openWindows, id])),
        activeWindow: id,
        zOrder: [...current.zOrder.filter((item) => item !== id), id],
        startMenuOpen: false,
        windowStates: {
          ...current.windowStates,
          [id]: { ...current.windowStates?.[id], minimized: false },
        },
      }
      if (id === 'browser' && current.currentStep === 2) {
        nextPatch.browserView = 'blank'
        nextPatch.browserTabs = [{ id: 'tab-start', title: '新分頁', view: 'blank' }]
        nextPatch.activeBrowserTabId = 'tab-start'
      }
      if (id === 'computer') nextPatch.viewedExtras = Array.from(new Set([...current.viewedExtras, 'device-info']))
      return nextPatch
    })
  }

  const closeWindow = (id) => {
    updateGame((current) => {
      const remaining = current.openWindows.filter((item) => item !== id)
      const nextZ = current.zOrder.filter((item) => item !== id)
      const nextWindowStates = Object.fromEntries(Object.entries(current.windowStates || {}).filter(([windowId]) => windowId !== id))
      const nextActiveWindow = [...nextZ].reverse().find((windowId) => !nextWindowStates[windowId]?.minimized) || null
      return { openWindows: remaining, windowStates: nextWindowStates, zOrder: nextZ, activeWindow: nextActiveWindow }
    })
  }

  const minimizeWindow = (id) => {
    updateGame((current) => {
      const nextWindowStates = {
        ...current.windowStates,
        [id]: { ...current.windowStates?.[id], minimized: true },
      }
      const nextActiveWindow = [...current.zOrder].reverse().find((windowId) => windowId !== id && !nextWindowStates[windowId]?.minimized) || null
      return { windowStates: nextWindowStates, activeWindow: nextActiveWindow, startMenuOpen: false }
    })
  }

  const toggleMaximizeWindow = (id) => {
    updateGame((current) => ({
      activeWindow: id,
      startMenuOpen: false,
      zOrder: [...current.zOrder.filter((item) => item !== id), id],
      windowStates: {
        ...current.windowStates,
        [id]: {
          ...current.windowStates?.[id],
          minimized: false,
          maximized: !current.windowStates?.[id]?.maximized,
        },
      },
    }))
  }

  const handleTaskbarApp = (id) => {
    if (!game.openWindows.includes(id) || game.windowStates?.[id]?.minimized) openWindow(id)
    else if (game.activeWindow === id) minimizeWindow(id)
    else focusWindow(id)
  }

  const moveWindow = (id, position) => updateGame((current) => ({ windowPositions: { ...current.windowPositions, [id]: position } }))
  const windowIsActive = (id) => game.activeWindow === id && !game.windowStates?.[id]?.minimized
  const taskbarAppClass = (id) => [
    'taskbar__app',
    game.openWindows.includes(id) ? 'is-open' : '',
    windowIsActive(id) ? 'is-active' : '',
  ].filter(Boolean).join(' ')
  const activeExtra = windowIsActive('computer')
  const timeText = new Intl.DateTimeFormat('zh-HK', { hour: '2-digit', minute: '2-digit', hour12: false }).format(clock)
  const dateText = new Intl.DateTimeFormat('zh-HK', { year: 'numeric', month: 'numeric', day: 'numeric' }).format(clock)

  return (
    <section className="desktop-screen" onPointerDown={() => game.startMenuOpen && updateGame({ startMenuOpen: false })}>
      <div className="desktop-wallpaper"><div className="windows-bloom windows-bloom--one" /><div className="windows-bloom windows-bloom--two" /><div className="windows-bloom windows-bloom--three" /></div>
      <div className="desktop-icons">{desktopItems.map((item) => <button className="desktop-icon" type="button" key={item.id} onClick={() => openWindow(item.id)}><IconGlyph type={item.glyph} /><span>{item.label}</span>{item.badge && game.currentStep <= 3 && <small>{item.badge}</small>}</button>)}</div>
      <div className="desktop-tip"><span>調查目標</span><p>{game.currentStep === 2 ? '開啟瀏覽器，查看上次留下的內容。' : game.currentStep === 3 ? '從瀏覽紀錄尋找可疑網站。' : game.currentStep === 4 ? '查看 MIRA 上次未完成的測試。' : game.currentStep === 5 ? '恢復本機異常測試記錄。' : game.currentStep === 6 ? '在 MIRA 搜尋一個名字。' : game.currentStep === 7 ? '查看與林以晴相關的項目資料。' : game.currentStep === 8 ? '閱讀最近測試記錄，找出關聯編號。' : '在 MIRA 搜尋剛發現的編號。'}</p></div>

      {game.openWindows.map((id) => {
        const index = game.zOrder.indexOf(id)
        const position = clampWindowPosition(id, game.windowPositions[id] || defaultPositions[id])
        const windowState = game.windowStates?.[id] || {}
        const title = id === 'browser' ? 'Google Chrome' : id === 'notes' ? '記事本 — 調查筆記' : id === 'computer' ? '此電腦' : windowCopy[id]?.title
        return <WindowFrame key={id} id={id} title={title} wide={id === 'browser'} position={position} zIndex={20 + Math.max(0, index)} active={windowIsActive(id)} minimized={windowState.minimized} maximized={windowState.maximized} onClose={closeWindow} onFocus={focusWindow} onMove={moveWindow} onMinimize={minimizeWindow} onToggleMaximize={toggleMaximizeWindow}>{id === 'browser' && <BrowserApp game={game} updateGame={updateGame} />}{id === 'notes' && <NotesWindow value={game.notes} onChange={(notes) => updateGame({ notes })} />}{id === 'computer' && <ComputerWindow />}{windowCopy[id] && <FileWindow data={windowCopy[id]} />}</WindowFrame>
      })}

      {game.startMenuOpen && <div className="start-menu" onPointerDown={(event) => event.stopPropagation()}><div className="start-menu__search"><span>⌕</span><input aria-label="搜尋應用程式" placeholder="搜尋應用程式、設定及文件" readOnly /></div><div className="start-menu__section-title"><strong>已釘選</strong><button type="button">所有應用程式　›</button></div><div className="start-menu__apps"><button type="button" onClick={() => openWindow('browser')}><IconGlyph type="chrome" /><span>Google Chrome</span></button><button type="button" onClick={() => openWindow('documents')}><IconGlyph type="folder" /><span>檔案總管</span></button><button type="button" onClick={() => openWindow('notes')}><IconGlyph type="note" /><span>記事本</span></button><button type="button" onClick={() => openWindow('photos')}><IconGlyph type="photo" /><span>相片</span></button><button type="button" onClick={() => openWindow('computer')}><IconGlyph type="computer" /><span>此電腦</span></button><button type="button"><span className="settings-icon">⚙</span><span>設定</span></button></div><div className="start-menu__recommended"><strong>建議項目</strong><span>最近使用的檔案會顯示在這裏</span></div><footer><div><div className="start-menu__avatar" /><span><strong>林以晴</strong><small>本機帳戶</small></span></div><button type="button" onClick={restartGame} aria-label="清除進度並重新開始">⏻</button></footer></div>}

      <nav className="taskbar" onPointerDown={(event) => event.stopPropagation()}>
        <div className="taskbar__center">
          <button className={`start-button ${game.startMenuOpen ? 'is-active' : ''}`} type="button" onClick={() => updateGame({ startMenuOpen: !game.startMenuOpen })} aria-label="開始"><span className="windows-logo"><i /><i /><i /><i /></span></button>
          <button className="taskbar-search" type="button" aria-label="搜尋"><span className="taskbar-search__icon" /><em>搜尋</em></button>
          <button className={taskbarAppClass('documents')} type="button" onClick={() => handleTaskbarApp('documents')} aria-label="檔案總管"><IconGlyph type="folder" /></button>
          <button className={taskbarAppClass('browser')} type="button" onClick={() => handleTaskbarApp('browser')} aria-label="Google Chrome"><IconGlyph type="chrome" /></button>
          {game.openWindows.filter((id) => !['browser', 'documents'].includes(id)).map((id) => <button className={taskbarAppClass(id)} key={id} type="button" onClick={() => handleTaskbarApp(id)} aria-label={id === 'notes' ? '記事本' : id === 'computer' ? '此電腦' : windowCopy[id]?.title}><IconGlyph type={id === 'notes' ? 'note' : 'folder'} /></button>)}
        </div>
        <div className="taskbar__tray" aria-label="系統狀態">
          <span className="tray-icon tray-icon--caret" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="m4.5 9.5 3.5-3 3.5 3" /></svg></span>
          <span className="tray-icon tray-icon--wifi" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M2.5 6.3a8 8 0 0 1 11 0M4.8 8.7a4.7 4.7 0 0 1 6.4 0M7.1 11.1a1.4 1.4 0 0 1 1.8 0" /><circle cx="8" cy="12.5" r=".7" /></svg></span>
          <span className="tray-icon tray-icon--volume" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M2.5 6.3h2.3L8 3.8v8.4L4.8 9.7H2.5zM10.3 6a3 3 0 0 1 0 4M12.2 4.5a5 5 0 0 1 0 7" /></svg></span>
          <span className="tray-icon tray-icon--battery" aria-hidden="true"><svg viewBox="0 0 20 16"><rect x="1.5" y="4.5" width="15" height="7" rx="1.5" /><path d="M16.5 7h2v2h-2" /><path className="tray-icon__fill" d="M3.5 6.5h9v3h-9z" /></svg></span>
          <div className="taskbar__clock"><strong>{timeText}</strong><small>{dateText}</small></div>
        </div>
      </nav>
      <StepCounter step={game.currentStep} extra={activeExtra} savedAt={game.lastSavedAt} />
    </section>
  )
}

export default DesktopScreen
