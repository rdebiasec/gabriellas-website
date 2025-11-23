import './Hero.css'

function Hero() {
  return (
    <div className="hero">
      <div className="hero-content">
        <h2 className="hero-title">Gabriella</h2>
        <p className="hero-subtitle">A beautiful life remembered</p>
        <p className="hero-description">
          This is a collection of memories, moments, and milestones from Gabriella's time with us. 
          Each photo, video, and document tells a story of love, joy, and the precious moments we shared.
        </p>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">10+</span>
            <span className="stat-label">Photos</span>
          </div>
          <div className="stat">
            <span className="stat-number">3</span>
            <span className="stat-label">Videos</span>
          </div>
          <div className="stat">
            <span className="stat-number">∞</span>
            <span className="stat-label">Memories</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero

