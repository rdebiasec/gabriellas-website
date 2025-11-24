import { useState, useMemo, useEffect } from 'react'
import './VideoGallery.css'

interface Video {
  id: number
  title: string
  description: string
  thumbnail: string
  videoUrl: string
  date?: string
  category: string
  year: number
}

function VideoGallery() {
  const [videosData, setVideosData] = useState<Video[]>([])
  const [playingVideo, setPlayingVideo] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Load videos from JSON file on component mount
  useEffect(() => {
    // Use import.meta.env.BASE_URL to handle base path correctly
    fetch(`${import.meta.env.BASE_URL}data/videos.json`)
      .then(res => res.json())
      .then(data => {
        setVideosData(data)
      })
      .catch(err => {
        console.error('Error loading videos:', err)
        setVideosData([])
      })
  }, [])

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(videosData.map(v => v.category)))]
  }, [videosData])

  const filteredVideos = useMemo(() => {
    return videosData.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           video.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [videosData, searchQuery, selectedCategory])

  const handleDownload = (video: Video) => {
    const link = document.createElement('a')
    link.href = video.videoUrl
    link.download = `${video.title.replace(/\s+/g, '_')}.mp4`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleFullscreen = (videoId: number) => {
    const videoElement = document.getElementById(`video-${videoId}`) as HTMLVideoElement
    if (videoElement) {
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen()
      } else if ((videoElement as any).webkitRequestFullscreen) {
        (videoElement as any).webkitRequestFullscreen()
      } else if ((videoElement as any).mozRequestFullScreen) {
        (videoElement as any).mozRequestFullScreen()
      }
    }
  }

  return (
    <div className="video-gallery">
      <h2 className="section-title">Video Gallery</h2>
      <p className="section-description">
        Videos that capture special moments and memories
      </p>

      <div className="gallery-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-button ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredVideos.length === 0 ? (
        <div className="no-results">
          <p>No videos found matching your search.</p>
        </div>
      ) : (
        <div className="videos-grid">
          {filteredVideos.map((video) => (
            <div key={video.id} className="video-card">
              <div className="video-wrapper">
                {playingVideo === video.id ? (
                  <video 
                    id={`video-${video.id}`}
                    controls 
                    autoPlay
                    className="video-player"
                    onEnded={() => setPlayingVideo(null)}
                  >
                    <source src={video.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <>
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="video-thumbnail"
                    />
                    <button 
                      className="play-button"
                      onClick={() => setPlayingVideo(video.id)}
                      aria-label={`Play ${video.title}`}
                    >
                      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                        <circle cx="32" cy="32" r="32" fill="rgba(255, 255, 255, 0.9)"/>
                        <path d="M24 20L44 32L24 44V20Z" fill="#8b7a9e"/>
                      </svg>
                    </button>
                  </>
                )}
              </div>
              <div className="video-info">
                <h3 className="video-title">{video.title}</h3>
                <p className="video-description">{video.description}</p>
                <div className="video-meta">
                  {video.date && <span className="video-date">{video.date}</span>}
                  <span className="video-category">{video.category}</span>
                </div>
                <div className="video-actions">
                  {playingVideo === video.id && (
                    <>
                      <button 
                        className="action-button"
                        onClick={() => handleFullscreen(video.id)}
                      >
                        ⛶ Fullscreen
                      </button>
                      <button 
                        className="action-button"
                        onClick={() => handleDownload(video)}
                      >
                        ⬇ Download
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VideoGallery
