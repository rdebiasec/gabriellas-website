import { useEffect, useState } from 'react'
import './App.css'
import PhotoGallery from './components/PhotoGallery'
import VideoGallery from './components/VideoGallery'
import Hero from './components/Hero'
import Timeline from './components/Timeline'
import GabysWall from './components/GabysWall'
import GabysBook from './components/GabysBook'
import NavDrawer from './components/NavDrawer'
import { useLocale, useStrings } from './i18n/LocaleProvider'

type Tab = 'home' | 'timeline' | 'photos' | 'videos' | 'wall' | 'book'

function App() {
  const strings = useStrings()
  const { locale, setLocale } = useLocale()

  const navItems: { id: Tab; label: string }[] = [
    { id: 'home', label: strings.nav.home },
    { id: 'timeline', label: strings.nav.timeline },
    { id: 'photos', label: strings.nav.photos },
    { id: 'videos', label: strings.nav.videos },
    { id: 'wall', label: strings.nav.wall },
    { id: 'book', label: strings.nav.book },
  ]

  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showMenuHint, setShowMenuHint] = useState(() => {
    if (typeof window === 'undefined') return false
    const hasSeenHint = window.localStorage.getItem('gab-menu-hint')
    if (!hasSeenHint) {
      window.localStorage.setItem('gab-menu-hint', 'seen')
      return true
    }
    return false
  })

  useEffect(() => {
    if (!showMenuHint) return
    const timer = window.setTimeout(() => setShowMenuHint(false), 6000)
    return () => window.clearTimeout(timer)
  }, [showMenuHint])

  const openDrawer = () => {
    setIsDrawerOpen(true)
    setShowMenuHint(false)
  }

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    setIsDrawerOpen(false)
  }

  const navigateToTab = (tab: Tab) => {
    setActiveTab(tab)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app">
      <div className="app-gradient" />
      <div className="app-content">
        <header className="header">
          <div className="header-inner">
            <nav className="nav desktop-nav">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className={`nav-button ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => handleTabChange(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="hamburger-wrapper">
              <span className="hamburger-tagline">{strings.header.tagline}</span>
              <button
                className={`hamburger ${showMenuHint ? 'pulsing' : ''}`}
                aria-label={strings.header.openMenuAria}
                onClick={openDrawer}
              >
                <span />
                <span />
                <span />
              </button>
              {showMenuHint && (
                <div className="menu-hint" role="status">
                  <p>{strings.header.menuHint}</p>
                  <button type="button" onClick={() => setShowMenuHint(false)}>
                    {strings.header.menuHintButton}
                  </button>
                </div>
              )}
            </div>
            <div className="language-toggle" role="group" aria-label={strings.languageToggle.ariaLabel}>
              <button
                type="button"
                className={locale === 'es' ? 'active' : ''}
                aria-pressed={locale === 'es'}
                onClick={() => setLocale('es')}
                title={strings.languageToggle.switchToSpanish}
              >
                <span className="flag" aria-hidden="true">
                  🇨🇴
                </span>
                {strings.languageToggle.esLabel}
              </button>
              <button
                type="button"
                className={locale === 'en' ? 'active' : ''}
                aria-pressed={locale === 'en'}
                onClick={() => setLocale('en')}
                title={strings.languageToggle.switchToEnglish}
              >
                <span className="flag" aria-hidden="true">
                  🇺🇸
                </span>
                {strings.languageToggle.enLabel}
              </button>
            </div>
          </div>
        </header>

        <main className="main-content">
          {activeTab === 'home' && (
            <Hero
              onNavigate={(tab) => {
                if (tab === 'photos' || tab === 'videos' || tab === 'wall' || tab === 'book') {
                  navigateToTab(tab)
                }
              }}
            />
          )}
          {activeTab === 'timeline' && <Timeline />}
          {activeTab === 'photos' && <PhotoGallery />}
          {activeTab === 'videos' && <VideoGallery />}
          {activeTab === 'wall' && <GabysWall />}
          {activeTab === 'book' && <GabysBook />}
        </main>

        <footer className="footer">
          <p className="footer-message">{strings.footer.message}</p>
        </footer>
      </div>

      <NavDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        navItems={navItems}
        activeTab={activeTab}
        onNavigate={(id) => handleTabChange(id as Tab)}
      />
    </div>
  )
}

export default App
