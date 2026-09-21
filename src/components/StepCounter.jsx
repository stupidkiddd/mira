function StepCounter({ step, extra = false, savedAt }) {
  const savedTime = savedAt
    ? new Intl.DateTimeFormat('zh-HK', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(savedAt))
    : null

  return (
    <div className="step-counter" aria-live="polite">
      <span className="step-counter__save"><i aria-hidden="true" />{savedTime ? `已自動保存 ${savedTime}` : '自動保存已開啟'}</span>
      <strong>{extra ? '【額外資料】' : `【${String(step).padStart(2, '0')}/36】`}</strong>
    </div>
  )
}

export default StepCounter
