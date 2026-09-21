import { useEffect, useRef, useState } from 'react'
import { browserTabNames, historyItems } from '../game/storyContent.js'

const browserViewUrls = {
  blank: '搜尋 Google 或輸入網址', history: 'chrome://history', mira: 'mira-uat.jinglung.internal',
  'system-intro': 'mira-uat.jinglung.internal/about', 'test-detail': 'mira-uat.jinglung.internal/tests/MIRA-QA-E017',
  restoring: 'mira-uat.jinglung.internal/tests/MIRA-QA-E017/restore', search: 'mira-uat.jinglung.internal/search',
  demo: 'mira-uat.jinglung.internal/demo', 'member-profile': 'mira-uat.jinglung.internal/members/JL-4827',
  'recent-test': 'mira-uat.jinglung.internal/members/JL-4827/recent-test', 'role-document': 'mira-uat.jinglung.internal/documents/project-roles',
  'access-notice': 'mira-uat.jinglung.internal/documents/access-notice', 'modified-files': 'mira-uat.jinglung.internal/search/recent-files',
  'other-records': 'mira-uat.jinglung.internal/search/other-records', 'e017-record': 'mira-uat.jinglung.internal/records/E017',
}

let browserTabSerial = 0
function createBrowserTabId() { browserTabSerial += 1; return `tab-${Date.now()}-${browserTabSerial}` }
function fallbackTab(view = 'blank') { return { id: 'tab-fallback', title: browserTabNames[view] || browserTabNames.blank, view, url: browserViewUrls[view] || browserViewUrls.blank } }
function getBrowserTabs(state) { return Array.isArray(state.browserTabs) && state.browserTabs.length ? state.browserTabs : [fallbackTab(state.browserView)] }
function getActiveBrowserTab(state, tabs = getBrowserTabs(state)) { return tabs.find((tab) => tab.id === state.activeBrowserTabId) || tabs.at(-1) }
function twoWeeksAgo() { const date = new Date(); date.setDate(date.getDate() - 14); return new Intl.DateTimeFormat('zh-HK', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date) }

function BrowserChrome({ game, tabs, activeTab, onActivateTab, onCloseTab, onNewTab, onOpenHistory, onBack, children }) {
  const currentView = activeTab?.view || 'blank'
  const address = activeTab?.url || browserViewUrls[currentView] || browserViewUrls.blank
  return <div className="browser-app">
    <div className="browser-tabs" role="tablist" aria-label="Chrome 分頁">{tabs.map((tab) => {
      const isActive = tab.id === activeTab?.id
      return <div className={`browser-tab ${isActive ? 'is-active' : ''}`} role="tab" aria-selected={isActive} tabIndex={isActive ? 0 : -1} key={tab.id} onClick={() => onActivateTab(tab.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onActivateTab(tab.id) }}><i className="chrome-logo chrome-logo--tab"><b /></i><span className="browser-tab__title">{tab.title}</span><button className="browser-tab__close" type="button" aria-label={`關閉分頁「${tab.title}」`} onClick={(event) => { event.stopPropagation(); onCloseTab(tab.id) }}>×</button></div>
    })}<button className="browser-new-tab" type="button" aria-label="新增分頁" onClick={onNewTab}>＋</button></div>
    <div className="browser-toolbar"><button type="button" aria-label="返回" onClick={onBack}>←</button><button type="button" aria-label="重新整理">↻</button><div className="browser-address"><span>{['blank', 'history'].includes(currentView) ? '◉' : '⌾'}</span>{address}<b>☆</b></div><button className="browser-profile" type="button" aria-label="Chrome 個人資料">晴</button><button className="browser-menu-button" type="button" aria-label="瀏覽器選單" onClick={() => onActivateTab(activeTab.id, { toggleMenu: true })}>⋮</button>{game.browserMenuOpen && <div className="browser-menu"><button type="button" onClick={onNewTab}>新增分頁 <kbd>Ctrl+T</kbd></button><button type="button">下載項目 <kbd>Ctrl+J</kbd></button><button className="browser-menu__highlight" type="button" onClick={onOpenHistory}>瀏覽紀錄 <kbd>Ctrl+H</kbd></button><button type="button">設定</button></div>}</div>
    <div className="browser-page">{children}</div>
  </div>
}

function BlankPage({ onOpenHistory }) { return <div className="browser-blank"><div className="chrome-logo chrome-logo--large"><i /></div><h2>Chrome 未正常關閉</h2><p>Google Chrome 可以重新開啟先前使用的頁面。</p><button type="button" onClick={onOpenHistory}>查看瀏覽紀錄</button><small>你也可以使用右上角的 ⋮ 選單。</small></div> }

function HistoryPage({ onSelectMira }) {
  return <div className="history-page"><aside><h2><span className="chrome-logo chrome-logo--history"><i /></span>Chrome</h2><button className="is-active" type="button">瀏覽紀錄</button><button type="button">分頁群組</button><button type="button">來自其他裝置</button><button type="button">清除瀏覽資料</button></aside><main><div className="history-page__heading"><div><span>LYQ-OLD-07</span><h2>瀏覽紀錄</h2></div><label><span>⌕</span><input aria-label="搜尋瀏覽紀錄" placeholder="搜尋紀錄" /></label></div><p className="history-date">14 日前</p><div className="history-list">{historyItems.map((item) => <button className={item.important ? 'is-important' : ''} type="button" key={item.url} onClick={item.important ? onSelectMira : undefined}><time>{item.time}</time><i>{item.important ? 'M' : '◇'}</i><span><strong>{item.title}</strong>{item.subtitle && <em>{item.subtitle}</em>}<small>{item.url}</small></span><b>{item.important ? '開啟' : '•••'}</b></button>)}</div></main></div>
}

function BankHeader() { return <header className="jl-header"><div className="jl-brand"><i>景</i><span><strong>景隆銀行</strong><small>JING LUNG BANK</small></span></div><div className="jl-product"><strong>MIRA 客服系統</strong><span>內部驗收版本</span><small>僅供獲授權職員使用</small></div></header> }

function MiraHome({ onOpenTest, onDemo, onIntro }) {
  return <div className="mira-uat"><BankHeader /><main className="mira-dashboard"><div className="mira-dashboard__heading"><span>內部測試平台</span><h1>MIRA 客服回應改善</h1><p>驗收測試已結束。請核對此裝置仍保留的本機記錄。</p></div><div className="mira-summary-grid"><section><small>合作單位</small><strong>NOVA</strong><span>回應模型測試支援</span></section><section><small>項目狀態</small><strong className="is-ended">已結束</strong><span>不再接受新增測試</span></section><section><small>最後活動</small><strong>{twoWeeksAgo()}　20:41</strong><span>來自這台電腦</span></section><section><small>未完成記錄</small><strong className="is-warning">1</strong><span>需在本機處理</span></section></div><div className="mira-entry-grid"><button type="button" onClick={onIntro}><span>01</span><strong>系統介紹</strong><small>了解 MIRA 測試範圍與使用方式</small><b>開啟 →</b></button><button type="button" onClick={onDemo}><span>02</span><strong>正常回應示範</strong><small>查看已通過驗收的標準回應</small><b>開啟 →</b></button><button className="is-priority" type="button" onClick={onOpenTest}><span>03</span><strong>上次未完成的測試</strong><small>MIRA-QA-E017 · 本機異常記錄</small><b>查看上次未完成的測試 →</b></button></div></main><footer className="jl-footer">景隆銀行　客戶服務品質部　／　MIRA 內部驗收環境</footer></div>
}

function SimpleInternalPage({ title, eyebrow, children, onBack }) { return <div className="mira-uat"><BankHeader /><main className="internal-simple"><button className="internal-back" type="button" onClick={onBack}>← 返回</button><span>{eyebrow}</span><h1>{title}</h1>{children}</main></div> }
function SystemIntroPage({ onBack }) { return <SimpleInternalPage title="MIRA 系統介紹" eyebrow="額外資料" onBack={onBack}><p>MIRA 用於測試客服回應的清晰度、一致性及處理流程。這個驗收環境只保存測試內容，不會連接客戶的真實銀行資料。</p><div className="internal-notice">此頁不影響調查進度。</div></SimpleInternalPage> }
function DemoPage({ onBack }) { return <SimpleInternalPage title="正常回應示範" eyebrow="已通過驗收" onBack={onBack}><div className="mira-demo-chat"><p className="is-user">我遺失了提款卡，應該怎樣處理？</p><p>請立即透過景隆銀行流動應用程式暫停提款卡，或致電卡務熱線。完成身份核對後，職員可以安排補發。</p></div><div className="internal-notice">此為正常回應樣本，不影響調查進度。</div></SimpleInternalPage> }

function TestDetail({ onRestore, onBack }) {
  return <div className="mira-uat"><BankHeader /><main className="test-record"><button className="internal-back" type="button" onClick={onBack}>← 返回測試中心</button><div className="test-record__flag">本機異常記錄</div><h1>MIRA-QA-E017</h1><p>此記錄上次未能正常完成，只能從建立記錄的電腦恢復。</p><dl><div><dt>測試編號</dt><dd><strong>MIRA-QA-E017</strong></dd></div><div><dt>建立者</dt><dd>林以晴</dd></div><div><dt>最後活動</dt><dd>{twoWeeksAgo()}　20:41</dd></div><div><dt>儲存位置</dt><dd>這台電腦</dd></div><div><dt>狀態</dt><dd><span className="record-status">異常</span></dd></div></dl><div className="test-record__warning"><b>!</b><span><strong>恢復本機記錄</strong><small>過程中可能會短暫出現未完成的測試內容。</small></span></div><div className="test-record__actions"><button type="button" onClick={onBack}>返回</button><button className="mira-primary" type="button" onClick={onRestore}>恢復記錄 →</button></div></main></div>
}

function RestoreSequence({ onComplete }) {
  const [phase, setPhase] = useState(0)
  const [progress, setProgress] = useState(8)
  const completeRef = useRef(onComplete)
  useEffect(() => { completeRef.current = onComplete }, [onComplete])
  useEffect(() => {
    const progressTimer = window.setInterval(() => setProgress((value) => Math.min(82, value + 7)), 180)
    const timers = [window.setTimeout(() => setPhase(1), 2400), window.setTimeout(() => setPhase(2), 4300), window.setTimeout(() => { setPhase(3); setProgress(100) }, 5900), window.setTimeout(() => completeRef.current(), 7200)]
    return () => { window.clearInterval(progressTimer); timers.forEach(window.clearTimeout) }
  }, [])
  if (phase === 1 || phase === 2) return <div className="restore-anomaly"><div className="restore-anomaly__scan" /><span className="anomaly-code">LOCAL REACTION DATA / E017</span><h1>個人反應資料</h1><dl><div><dt>目標</dt><dd>E017</dd></div><div><dt>高影響關係</dt><dd>1</dd></div><div><dt>情緒預測</dt><dd>可用</dd></div><div><dt>關聯內容</dt><dd><i className="redacted" /> <i className="redacted short" /></dd></div></dl>{phase === 2 && <div className="anomaly-observation"><span>NEW OPERATION BEHAVIOUR</span><strong>正在建立新的觀察記錄</strong><p className="deleted-line">記錄已刪除</p></div>}<small>本機觀察程序 · 請勿中斷</small></div>
  return <div className={`restore-normal ${phase === 3 ? 'is-complete' : ''}`}><div className="restore-normal__icon">{phase === 3 ? '✓' : <i />}</div><span>MIRA-QA-E017</span><h1>{phase === 3 ? '本機記錄已恢復' : '正在讀取本機記錄'}</h1><p>{phase === 3 ? '正在開啟資料搜尋工具……' : '正在檢查未完成的測試資料，請勿關閉瀏覽器。'}</p><div className="restore-meter"><i style={{ width: `${progress}%` }} /></div><b>{progress}%</b></div>
}

function SearchResultCard({ title, subtitle, onClick }) { return <button className="search-result-card" type="button" onClick={onClick}><span><strong>{title}</strong><small>{subtitle}</small></span><b>開啟 →</b></button> }

function MiraSearchPage({ game, updateGame, onOpenMember, onOpenExtra, onOpenE017 }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('idle')
  const [rescueText, setRescueText] = useState('')
  const timersRef = useRef([])
  const intervalRef = useRef(null)
  useEffect(() => () => { timersRef.current.forEach(window.clearTimeout); if (intervalRef.current) window.clearInterval(intervalRef.current) }, [])
  const remember = (label, patch) => updateGame((current) => ({ ...patch, miraSearchHistory: [...current.miraSearchHistory.filter((item) => item !== label), label] }))
  const revealLin = () => {
    setStatus('searching')
    timersRef.current.push(window.setTimeout(() => { setStatus('rescue'); setRescueText('救救我。') }, 650))
    timersRef.current.push(window.setTimeout(() => { intervalRef.current = window.setInterval(() => { setRescueText((text) => { if (text.length <= 1) { window.clearInterval(intervalRef.current); setStatus('modified'); timersRef.current.push(window.setTimeout(() => { setStatus('idle'); remember('把我找出來', { miraRescueSeen: true, lastMiraSearch: 'lin', currentStep: 7, unlocked: Array.from(new Set([...game.unlocked, 'lin-search'])) }) }, 850)); return '' } return text.slice(0, -1) }) }, 150) }, 2600))
  }
  const submit = (event) => {
    event.preventDefault(); if (status !== 'idle') return
    const exact = query.trim()
    if (exact === '林以晴') { if (game.miraRescueSeen) remember('把我找出來', { lastMiraSearch: 'lin', currentStep: Math.max(game.currentStep, 7) }); else revealLin(); return }
    if (exact === 'E017' && game.e017Discovered) { remember('E017', { lastMiraSearch: 'e017', currentStep: 9, unlocked: Array.from(new Set([...game.unlocked, 'e017-search'])) }); return }
    if (exact) remember(exact, { lastMiraSearch: 'not-found' })
  }
  const showLin = game.lastMiraSearch === 'lin' && status === 'idle'
  const showE017 = game.lastMiraSearch === 'e017' && status === 'idle'
  const notFound = game.lastMiraSearch === 'not-found' && status === 'idle'
  return <div className="mira-search"><header><div><i>M</i><span><strong>MIRA</strong><small>資料搜尋</small></span></div><small>景隆銀行內部驗收版本</small></header><div className="mira-search__layout"><main><span className="search-eyebrow">搜尋資料</span><h1>搜尋資料</h1><p>輸入完整名字或內容。搜尋只會顯示完全相符的資料。</p><form onSubmit={submit}><input aria-label="輸入名字或內容" placeholder="輸入名字或內容" value={query} onChange={(event) => setQuery(event.target.value)} disabled={status !== 'idle'} /><button type="submit" disabled={!query.trim() || status !== 'idle'}>搜尋</button></form><div className="search-output" aria-live="polite">{status === 'searching' && <p className="searching-label"><i />正在尋找相關內容……</p>}{status === 'rescue' && <p className="rescue-message">{rescueText}<span /></p>}{status === 'modified' && <p className="modified-message">內容已被修改</p>}{notFound && <div className="no-results"><strong>找不到這個詞</strong><span>請檢查文字是否完全相同。</span></div>}{showLin && <div className="search-results"><div className="search-results__summary"><strong>把我找出來</strong><span>找到 4 項相關內容</span></div><SearchResultCard title="林以晴｜項目成員資料" subtitle="員工及項目資料" onClick={onOpenMember} /><SearchResultCard title="MIRA 項目分工" subtitle="內部項目文件" onClick={() => onOpenExtra('role-document')} /><SearchResultCard title="最近修改的文件" subtitle="3 項本機文件記錄" onClick={() => onOpenExtra('modified-files')} /><SearchResultCard title="其他相關記錄" subtitle="補充記錄" onClick={() => onOpenExtra('other-records')} /></div>}{showE017 && <div className="search-results"><div className="search-results__summary"><strong>E017</strong><span>找到 1 項記錄</span></div><article className="e017-result"><span>E017 回應評分記錄</span><dl><div><dt>類型</dt><dd>客服回應測試</dd></div><div><dt>建立者</dt><dd>林以晴</dd></div><div><dt>來源</dt><dd>Q4 客戶回應測試</dd></div><div><dt>狀態</dt><dd>本機副本</dd></div></dl><button type="button" onClick={onOpenE017}>開啟文件</button></article></div>}</div></main><aside><strong>搜尋記錄</strong>{game.miraSearchHistory.length ? game.miraSearchHistory.map((item) => <button type="button" key={item} onClick={() => setQuery(item === '把我找出來' ? '林以晴' : item)}>{item}</button>) : <span>尚未有搜尋記錄</span>}<small>搜尋記錄只保存在這台電腦。</small></aside></div></div>
}

function MemberProfile({ onRecentTest, onDocument, onBack }) {
  return <div className="mira-uat"><BankHeader /><main className="member-profile"><button className="internal-back" type="button" onClick={onBack}>← 返回搜尋</button><span className="member-profile__eyebrow">項目成員資料</span><div className="member-profile__title"><div>林</div><span><h1>林以晴</h1><small>LIN YI QING</small></span><b>帳戶已暫停</b></div><dl><div><dt>員工編號</dt><dd>JL-4827</dd></div><div><dt>部門</dt><dd>客戶服務品質部</dd></div><div><dt>項目角色</dt><dd>核心語言訓練員</dd></div><div><dt>工作地點</dt><dd>海港市總部</dd></div><div><dt>帳戶狀態</dt><dd>已暫停</dd></div><div><dt>最後活動</dt><dd>{twoWeeksAgo()}　20:41</dd></div></dl><h2>相關文件</h2><div className="member-documents"><button type="button" onClick={() => onDocument('role-document')}><strong>MIRA 項目分工</strong><span>查看項目職責 →</span></button><button className="is-key" type="button" onClick={onRecentTest}><strong>最近測試記錄</strong><span>查看最後一筆記錄 →</span></button><button type="button" onClick={() => onDocument('access-notice')}><strong>權限變更通知</strong><span>查看通知 →</span></button></div></main></div>
}

function RecentTestRecord({ onBack }) { return <SimpleInternalPage title="最近測試記錄" eyebrow="林以晴｜本機資料" onBack={onBack}><dl className="document-fields"><div><dt>員工姓名</dt><dd>林以晴</dd></div><div><dt>原有記錄</dt><dd>已移除</dd></div><div className="is-key"><dt>關聯編號</dt><dd><strong>E017</strong></dd></div></dl><div className="internal-notice">這份記錄不會自動加入筆記。請自行記下關聯編號，再返回搜尋。</div></SimpleInternalPage> }
const extraCopy = {
  'role-document': { eyebrow: '內部項目文件', title: 'MIRA 項目分工', body: '林以晴負責整理客服用語樣本、標記回應品質，並參與內部驗收。' },
  'access-notice': { eyebrow: '系統通知', title: '權限變更通知', body: '項目結束後，所有成員帳戶將分批暫停。未同步的本機測試記錄不會自動刪除。' },
  'modified-files': { eyebrow: '搜尋結果', title: '最近修改的文件', body: '此清單只包含一般項目文件，沒有發現可推進調查的新內容。' },
  'other-records': { eyebrow: '搜尋結果', title: '其他相關記錄', body: '其餘記錄均為一般行政資料，不影響目前調查。' },
}
function ExtraDocument({ view, onBack }) { const copy = extraCopy[view]; return <SimpleInternalPage title={copy.title} eyebrow={copy.eyebrow} onBack={onBack}><p>{copy.body}</p><div className="internal-notice">此為補充資料，不影響調查進度。</div></SimpleInternalPage> }
function E017Record({ onBack }) { return <SimpleInternalPage title="E017 回應評分記錄" eyebrow="本機副本" onBack={onBack}><dl className="document-fields"><div><dt>類型</dt><dd>客服回應測試</dd></div><div><dt>建立者</dt><dd>林以晴</dd></div><div><dt>來源</dt><dd>Q4 客戶回應測試</dd></div><div><dt>狀態</dt><dd>本機副本</dd></div></dl><div className="internal-notice">文件內容將在下一階段繼續。</div></SimpleInternalPage> }

function BrowserApp({ game, updateGame }) {
  const tabs = getBrowserTabs(game), activeTab = getActiveBrowserTab(game, tabs), currentView = activeTab?.view || 'blank'
  const openTab = (view, tabDetails = {}, getProgressPatch = () => ({})) => {
    const tabId = createBrowserTabId()
    updateGame((current) => { const currentTabs = getBrowserTabs(current), currentActiveTab = getActiveBrowserTab(current, currentTabs); const tab = { id: tabId, title: browserTabNames[view] || browserTabNames.blank, view, url: browserViewUrls[view] || browserViewUrls.blank, openerTabId: currentActiveTab?.id, ...tabDetails }; return { browserTabs: [...currentTabs, tab], activeBrowserTabId: tabId, browserView: view, browserMenuOpen: false, ...getProgressPatch(current) } })
    return tabId
  }
  const activateTab = (tabId, options = {}) => updateGame((current) => { const currentTabs = getBrowserTabs(current); const nextTab = currentTabs.find((tab) => tab.id === tabId) || getActiveBrowserTab(current, currentTabs); return { activeBrowserTabId: nextTab.id, browserView: nextTab.view, browserMenuOpen: options.toggleMenu ? !current.browserMenuOpen : false } })
  const closeTab = (tabId) => updateGame((current) => { const currentTabs = getBrowserTabs(current), closingIndex = currentTabs.findIndex((tab) => tab.id === tabId), remainingTabs = currentTabs.filter((tab) => tab.id !== tabId); if (!remainingTabs.length) { const newTab = { ...fallbackTab(), id: createBrowserTabId() }; return { browserTabs: [newTab], activeBrowserTabId: newTab.id, browserView: newTab.view, browserMenuOpen: false } } const nextActiveTab = current.activeBrowserTabId === tabId ? remainingTabs[Math.min(closingIndex, remainingTabs.length - 1)] : getActiveBrowserTab(current, remainingTabs); return { browserTabs: remainingTabs, activeBrowserTabId: nextActiveTab.id, browserView: nextActiveTab.view, browserMenuOpen: false } })
  const returnToParentTab = (preferredView) => { const parentTab = tabs.find((tab) => tab.id === activeTab?.openerTabId), matchingTab = [...tabs].reverse().find((tab) => tab.view === preferredView), targetTab = parentTab?.view === preferredView ? parentTab : matchingTab; if (targetTab) activateTab(targetTab.id) }
  const goBack = () => { const parentTab = tabs.find((tab) => tab.id === activeTab?.openerTabId), activeIndex = tabs.findIndex((tab) => tab.id === activeTab?.id), targetTab = parentTab || (activeIndex > 0 ? tabs[activeIndex - 1] : null); if (targetTab) activateTab(targetTab.id) }
  const openHistory = () => openTab('history', {}, (current) => ({ currentStep: Math.max(current.currentStep, 3), unlocked: Array.from(new Set([...current.unlocked, 'browser-history'])) }))
  const openMira = () => openTab('mira', {}, (current) => ({ foundMira: true, currentStep: Math.max(current.currentStep, 4), unlocked: Array.from(new Set([...current.unlocked, 'mira-site'])) }))
  const openTest = () => openTab('test-detail', {}, (current) => ({ currentStep: Math.max(current.currentStep, 5), unlocked: Array.from(new Set([...current.unlocked, 'mira-test'])) }))
  const openExtra = (view) => openTab(view, {}, (current) => ({ viewedExtras: Array.from(new Set([...current.viewedExtras, view])) }))
  const completeRestore = () => updateGame((current) => { const updatedTabs = getBrowserTabs(current).map((tab) => tab.id === current.activeBrowserTabId && tab.view === 'restoring' ? { ...tab, title: browserTabNames.search, view: 'search', url: browserViewUrls.search } : tab); return { browserTabs: updatedTabs, browserView: 'search', testRestored: true, currentStep: Math.max(current.currentStep, 6), unlocked: Array.from(new Set([...current.unlocked, 'mira-search'])) } })
  const openMember = () => openTab('member-profile', {}, (current) => ({ currentStep: Math.max(current.currentStep, 8), unlocked: Array.from(new Set([...current.unlocked, 'member-profile'])) }))
  const openRecentTest = () => openTab('recent-test', {}, (current) => ({ e017Discovered: true, unlocked: Array.from(new Set([...current.unlocked, 'e017-keyword'])) }))
  let content
  if (currentView === 'history') content = <HistoryPage onSelectMira={openMira} />
  else if (currentView === 'mira') content = <MiraHome onOpenTest={openTest} onDemo={() => openExtra('demo')} onIntro={() => openExtra('system-intro')} />
  else if (currentView === 'system-intro') content = <SystemIntroPage onBack={() => returnToParentTab('mira')} />
  else if (currentView === 'demo') content = <DemoPage onBack={() => returnToParentTab('mira')} />
  else if (currentView === 'test-detail') content = <TestDetail onRestore={() => openTab('restoring')} onBack={() => returnToParentTab('mira')} />
  else if (currentView === 'restoring') content = <RestoreSequence onComplete={completeRestore} />
  else if (currentView === 'search') content = <MiraSearchPage game={game} updateGame={updateGame} onOpenMember={openMember} onOpenExtra={openExtra} onOpenE017={() => openTab('e017-record')} />
  else if (currentView === 'member-profile') content = <MemberProfile onRecentTest={openRecentTest} onDocument={openExtra} onBack={() => returnToParentTab('search')} />
  else if (currentView === 'recent-test') content = <RecentTestRecord onBack={() => returnToParentTab('member-profile')} />
  else if (extraCopy[currentView]) content = <ExtraDocument view={currentView} onBack={goBack} />
  else if (currentView === 'e017-record') content = <E017Record onBack={() => returnToParentTab('search')} />
  else content = <BlankPage onOpenHistory={openHistory} />
  return <BrowserChrome game={game} tabs={tabs} activeTab={activeTab} onActivateTab={activateTab} onCloseTab={closeTab} onNewTab={() => openTab('blank')} onOpenHistory={openHistory} onBack={goBack}>{content}</BrowserChrome>
}

export default BrowserApp
