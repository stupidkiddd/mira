import { useRef } from 'react'

function WindowFrame({ id, title, children, position, zIndex, active, minimized, maximized, onClose, onFocus, onMove, onMinimize, onToggleMaximize, wide = false }) {
  const dragData = useRef(null)
  const lastTitlePointerDown = useRef(null)

  const handlePointerDown = (event) => {
    if (event.button !== 0) return
    onFocus(id)
    if (event.target.closest('button')) {
      lastTitlePointerDown.current = null
      return
    }
    const isWindowBar = Boolean(event.target.closest('.window-frame__bar'))
    const isBrowserTabStrip = wide && Boolean(event.target.closest('.browser-tabs'))
    const isTitleSurface = isWindowBar || isBrowserTabStrip
    if (!isTitleSurface) {
      lastTitlePointerDown.current = null
      return
    }

    const previousPointerDown = lastTitlePointerDown.current
    const isDoubleClick = previousPointerDown
      && event.timeStamp - previousPointerDown.time <= 450
      && Math.abs(event.clientX - previousPointerDown.x) <= 6
      && Math.abs(event.clientY - previousPointerDown.y) <= 6

    if (isDoubleClick) {
      lastTitlePointerDown.current = null
      dragData.current = null
      onToggleMaximize(id)
      event.preventDefault()
      return
    }

    lastTitlePointerDown.current = { time: event.timeStamp, x: event.clientX, y: event.clientY }
    if (maximized) return

    const bounds = event.currentTarget.getBoundingClientRect()
    dragData.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      left: position.left,
      top: position.top,
      width: bounds.width,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    event.preventDefault()
  }

  const handlePointerMove = (event) => {
    if (!dragData.current || dragData.current.pointerId !== event.pointerId) return
    const nextLeft = Math.max(0, Math.min(window.innerWidth - dragData.current.width, dragData.current.left + event.clientX - dragData.current.x))
    const nextTop = Math.max(0, Math.min(window.innerHeight - 88, dragData.current.top + event.clientY - dragData.current.y))
    onMove(id, { left: nextLeft, top: nextTop })
  }

  const stopDragging = (event) => {
    if (dragData.current?.pointerId === event.pointerId) dragData.current = null
  }

  if (minimized) return null

  return (
    <section
      className={`window-frame ${wide ? 'window-frame--wide' : ''} ${active ? 'is-active' : ''} ${maximized ? 'is-maximized' : ''}`}
      style={{ left: position.left, top: position.top, zIndex }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      aria-label={title}
    >
      <header className="window-frame__bar">
        <div className="window-frame__title">
          {id === 'browser' ? <span className="chrome-logo chrome-logo--title"><i /></span> : <span className="window-app-icon">◇</span>}
          {title}
        </div>
        <div className="window-frame__controls">
          <button className="window-frame__minimize" type="button" onClick={(event) => { event.stopPropagation(); onMinimize(id) }} aria-label={`最小化${title}`}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5h10" /></svg>
          </button>
          <button className="window-frame__maximize" type="button" onClick={(event) => { event.stopPropagation(); onToggleMaximize(id) }} aria-label={`${maximized ? '還原' : '最大化'}${title}`}>
            {maximized
              ? <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5.5 5.5h7v7h-7zM3.5 10.5h-1v-7h7v1" /></svg>
              : <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="3.5" width="9" height="9" /></svg>}
          </button>
          <button className="window-frame__close" type="button" onClick={(event) => { event.stopPropagation(); onClose(id) }} aria-label={`關閉${title}`}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" /></svg>
          </button>
        </div>
      </header>
      <div className="window-frame__content">{children}</div>
    </section>
  )
}

export default WindowFrame
