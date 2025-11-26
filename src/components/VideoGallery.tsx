import { useState, useMemo, useEffect } from 'react'
import './VideoGallery.css'
import { useLocale, useStrings } from '../i18n/LocaleProvider'
import { localizeVideo, translateCategoryKey, type LocalizedVideo } from '../i18n/mediaTranslations'

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
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { locale } = useLocale()
  const strings = useStrings()

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

  const localizedVideos = useMemo<LocalizedVideo<Video>[]>(() => videosData.map((video) => localizeVideo(video, locale)), [videosData, locale])

  const categories = useMemo(() => {
    const uniqueKeys = Array.from(new Set(localizedVideos.map((video) => video.categoryKey)))
    return [
      { key: 'all', label: strings.filters.all },
      ...uniqueKeys.map((key) => ({
        key,
        label: translateCategoryKey(key, locale),
      })),
    ]
  }, [localizedVideos, locale, strings.filters.all])

  const filteredVideos = useMemo(() => {
    return localizedVideos.filter(video => {
      const matchesSearch =
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || video.categoryKey === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [localizedVideos, searchQuery, selectedCategory])

  const handleDownload = (video: LocalizedVideo<Video>) => {
    const link = document.createElement('a')
    link.href = video.videoUrl
    link.download = `${video.title.replace(/\s+/g, '_')}.mp4`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleFullscreen = (videoId: number) => {
    const element = document.getElementById(`video-${videoId}`) as (HTMLVideoElement & {
      webkitRequestFullscreen?: () => Promise<void> | void
      mozRequestFullScreen?: () => Promise<void> | void
    }) | null
    if (!element) return

    if (element.requestFullscreen) {
      element.requestFullscreen()
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen()
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen()
    }
  }

  return (
    <div className="video-gallery">
      <h2 className="section-title">{strings.videos.title}</h2>
      <p className="section-description">{strings.videos.description}</p>

      <div className="gallery-controls">
        <div className="search-container">
          <input
            type="text"
              placeholder={strings.videos.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filters">
            {categories.map(cat => (
            <button
                key={cat.key}
                className={`category-button ${selectedCategory === cat.key ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.key)}
            >
                {cat.label}
            </button>
          ))}
        </div>
      </div>

      {filteredVideos.length === 0 ? (
        <div className="no-results">
          <p>{strings.videos.noResults}</p>
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
                    {strings.videos.unsupported}
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
                      aria-label={strings.videos.playLabel(video.title)}
                    >
                    <svg width="80" height="80" viewBox="0 0 64 64" fill="none">
                      <circle cx="32" cy="32" r="32" fill="rgba(142, 97, 171, 0.9)"/>
                      <path d="M24 20L44 32L24 44V20Z" fill="#f5e6ff"/>
                      </svg>
                    </button>
                  </>
                )}
              </div>
              <div className="video-info">
                <h3 className="video-title">{video.title}</h3>
                <div className="video-meta">
                  {video.date && <span className="video-date">{video.date}</span>}
                    <span className="video-category">{translateCategoryKey(video.categoryKey, locale)}</span>
                </div>
                <div className="video-actions">
                  {playingVideo === video.id && (
                    <>
                      <button 
                        className="action-button"
                        onClick={() => handleFullscreen(video.id)}
                      >
                          {strings.videos.fullscreen}
                      </button>
                      <button 
                        className="action-button"
                        onClick={() => handleDownload(video)}
                      >
                          {strings.videos.download}
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
