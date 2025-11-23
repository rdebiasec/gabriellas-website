import { useState } from 'react'
import './App.css'
import PhotoGallery from './components/PhotoGallery'
import VideoGallery from './components/VideoGallery'
import Documents from './components/Documents'
import Hero from './components/Hero'
import Timeline from './components/Timeline'

type Tab = 'home' | 'timeline' | 'photos' | 'videos' | 'documents'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home')

  return (
    <div className="app">
      <header className="header">
        <h1 className="site-title">In Memory of Gabriella</h1>
        <nav className="nav">
          <button 
            className={`nav-button ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          <button 
            className={`nav-button ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            Timeline
          </button>
          <button 
            className={`nav-button ${activeTab === 'photos' ? 'active' : ''}`}
            onClick={() => setActiveTab('photos')}
          >
            Photos
          </button>
          <button 
            className={`nav-button ${activeTab === 'videos' ? 'active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            Videos
          </button>
          <button 
            className={`nav-button ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            Documents
          </button>
        </nav>
      </header>

      <main className="main-content">
        {activeTab === 'home' && <Hero />}
        {activeTab === 'timeline' && <Timeline />}
        {activeTab === 'photos' && <PhotoGallery />}
        {activeTab === 'videos' && <VideoGallery />}
        {activeTab === 'documents' && <Documents />}
      </main>

      <footer className="footer">
        <p>Forever in our hearts ❤️</p>
      </footer>
    </div>
  )
}

export default App
