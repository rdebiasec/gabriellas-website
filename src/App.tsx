import { useEffect, useState } from 'react'
import './App.css'
import PhotoGallery from './components/PhotoGallery'
import VideoGallery from './components/VideoGallery'
import Hero from './components/Hero'
import Timeline from './components/Timeline'
import GabysWall from './components/GabysWall'
import GabysBook from './components/GabysBook'
import NavDrawer from './components/NavDrawer'

type Tab = 'home' | 'timeline' | 'photos' | 'videos' | 'wall' | 'book'

function App() {
  const navItems: { id: Tab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'photos', label: 'Photos' },
    { id: 'videos', label: 'Videos' },
    { id: 'wall', label: "Gaby's Wall" },
    { id: 'book', label: "Gaby's Book" },
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
            <div className="brand">
              <span className="brand-pill">Celebrating Gabriella</span>
              <h1 className="site-title">In Memory of Gabriella</h1>
            </div>
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
              <button
                className={`hamburger ${showMenuHint ? 'pulsing' : ''}`}
                aria-label="Open menu"
                onClick={openDrawer}
              >
                <span />
                <span />
                <span />
              </button>
              {showMenuHint && (
                <div className="menu-hint" role="status">
                  <p>Tap here to browse photos, videos, her timeline, wall, and keepsake book.</p>
                  <button type="button" onClick={() => setShowMenuHint(false)}>
                    Got it
                  </button>
                </div>
              )}
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
          <p>Forever in our hearts ❤️</p>
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
