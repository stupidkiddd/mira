import { browserTabNames } from './storyContent.js'

export const STORAGE_KEY = 'mira-game-state-v2'

const initialBrowserTab = () => ({ id: 'tab-start', title: browserTabNames.blank, view: 'blank' })

export function createInitialState() {
  return {
    version: 2,
    screen: 'intro',
    introPage: 0,
    hasReadIntro: false,
    currentStep: 1,
    unlocked: ['case-file'],
    viewedExtras: [],
    openWindows: [],
    activeWindow: null,
    windowPositions: {},
    windowStates: {},
    zOrder: [],
    notes: '',
    loggedIn: false,
    foundMira: false,
    testRestored: false,
    miraRescueSeen: false,
    miraSearchHistory: [],
    lastMiraSearch: null,
    e017Discovered: false,
    wrongAttempts: 0,
    browserView: 'blank',
    browserTabs: [initialBrowserTab()],
    activeBrowserTabId: 'tab-start',
    browserMenuOpen: false,
    startMenuOpen: false,
    lastSavedAt: null,
  }
}

export function loadGameState() {
  const fallback = createInitialState()

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return fallback
    const parsed = JSON.parse(saved)
    if (parsed.version !== fallback.version) return fallback

    const savedView = parsed.browserView || fallback.browserView
    const savedTabs = Array.isArray(parsed.browserTabs) && parsed.browserTabs.length
      ? parsed.browserTabs
      : [{ id: 'tab-restored', title: browserTabNames[savedView] || browserTabNames.blank, view: savedView }]
    const savedActiveTabId = savedTabs.some((tab) => tab.id === parsed.activeBrowserTabId)
      ? parsed.activeBrowserTabId
      : savedTabs.at(-1).id

    return {
      ...fallback,
      ...parsed,
      openWindows: Array.isArray(parsed.openWindows) ? parsed.openWindows : [],
      windowPositions: parsed.windowPositions && typeof parsed.windowPositions === 'object' ? parsed.windowPositions : {},
      windowStates: parsed.windowStates && typeof parsed.windowStates === 'object' ? parsed.windowStates : {},
      zOrder: Array.isArray(parsed.zOrder) ? parsed.zOrder : [],
      unlocked: Array.isArray(parsed.unlocked) ? parsed.unlocked : fallback.unlocked,
      viewedExtras: Array.isArray(parsed.viewedExtras) ? parsed.viewedExtras : [],
      miraSearchHistory: Array.isArray(parsed.miraSearchHistory) ? parsed.miraSearchHistory : [],
      browserTabs: savedTabs,
      activeBrowserTabId: savedActiveTabId,
    }
  } catch {
    return fallback
  }
}

export function saveGameState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // The game still works when storage is unavailable; only persistence is lost.
  }
}
