import { introPages } from '../game/storyContent.js'

function CasePage({ page }) {
  return (
    <div className="case-file">
      <div className="case-file__stamp">未結案</div>
      <div className="case-file__rule" />
      <dl>
        {page.fields.map(([label, value]) => <div key={label} className={label === '案件狀態' ? 'case-file__status' : ''}><dt>{label}</dt><dd>{value}</dd></div>)}
      </dl>
      <div className="case-file__number">CASE NO. M-240916</div>
    </div>
  )
}

function MessagePage({ page }) {
  return (
    <div className="message-log">
      {page.messages.map((message) => (
        <div className={`message ${message.outgoing ? 'message--outgoing' : ''}`} key={message.time}>
          <div className="message__meta"><strong>{message.sender}</strong><span>{message.time}</span></div>
          <p>{message.body}</p>
          {message.unread && <span className="message__unread">訊息未讀</span>}
        </div>
      ))}
    </div>
  )
}

function LaptopPage({ page }) {
  return (
    <div className="laptop-scene">
      <div className="laptop-scene__device" aria-hidden="true"><div className="laptop-scene__screen"><span>LYQ</span></div><div className="laptop-scene__base" /></div>
      <div className="intro-paragraphs intro-paragraphs--compact">{page.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
    </div>
  )
}

function IntroScreen({ game, updateGame }) {
  const pageIndex = game.introPage || 0
  const page = introPages[pageIndex]
  const isLast = pageIndex === introPages.length - 1

  const goNext = () => {
    if (isLast) {
      updateGame({ screen: 'login', hasReadIntro: true, currentStep: 1, unlocked: Array.from(new Set([...game.unlocked, 'login'])) })
      return
    }
    updateGame({ introPage: pageIndex + 1 })
  }

  return (
    <section className="intro-screen">
      <div className="intro-screen__grain" />
      <header className="intro-header"><div className="intro-brand"><span>M</span> MIRA</div></header>
      <article className={`intro-card intro-card--${page.type}`}>
        <div className="intro-card__heading"><span>{page.eyebrow}</span><h1>{page.title}</h1></div>
        <div className="intro-card__content">
          {page.type === 'case' && <CasePage page={page} />}
          {page.type === 'messages' && <MessagePage page={page} />}
          {page.type === 'laptop' && <LaptopPage page={page} />}
          {page.type === 'statement' && <div className="intro-paragraphs">{page.paragraphs.map((paragraph, index) => <p className={index === 0 ? 'intro-paragraphs__lead' : ''} key={paragraph}>{paragraph}</p>)}<div className="statement-signature">林以澄　／　失蹤者妹妹</div></div>}
        </div>
        <footer className="intro-card__footer">
          <button className="text-button" type="button" disabled={pageIndex === 0} onClick={() => updateGame({ introPage: pageIndex - 1 })}>返回</button>
          <div className="intro-progress" aria-hidden="true">{introPages.map((item, index) => <i className={index <= pageIndex ? 'is-active' : ''} key={item.title} />)}</div>
          <button className="primary-button" type="button" onClick={goNext}>{isLast ? '開啟電腦' : '繼續'} <span aria-hidden="true">→</span></button>
        </footer>
      </article>
    </section>
  )
}

export default IntroScreen
