import { useState, useMemo, useEffect, useCallback } from 'react'
import './VideoGallery.css'
import { useLocale, useStrings } from '../i18n/LocaleProvider'
import { localizeVideo, translateCategoryKey, type LocalizedVideo } from '../i18n/mediaTranslations'

interface Video {
  id: number
  title: string
  description: string
  thumbnail: string
  videoUrl: string
  youtubeId?: string // Optional: explicit YouTube video ID
  date?: string
  category: string
  year: number
}

// Utility functions to detect and extract YouTube video IDs
function isYouTubeUrl(url: string): boolean {
  return /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/.test(url) || 
         /^[a-zA-Z0-9_-]{11}$/.test(url) // Just the video ID
}

function extractYouTubeId(urlOrId: string): string | null {
  // If it's already just an ID (11 characters)
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) {
    return urlOrId
  }
  
  // Extract from various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    /youtube\.com\/embed\/([^"&?\/\s]{11})/,
    /youtube\.com\/v\/([^"&?\/\s]{11})/,
  ]
  
  for (const pattern of patterns) {
    const match = urlOrId.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  
  return null
}

function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
}

function getYouTubeThumbnail(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'maxres'): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`
}

function getVideoType(video: Video): 'youtube' | 'local' {
  // Check if explicit youtubeId is provided
  if (video.youtubeId) {
    return 'youtube'
  }
  
  // Check if videoUrl is a YouTube URL or ID
  if (isYouTubeUrl(video.videoUrl)) {
    return 'youtube'
  }
  
  // Otherwise, treat as local file
  return 'local'
}

function getYouTubeVideoId(video: Video): string | null {
  if (video.youtubeId) {
    return video.youtubeId
  }
  
  if (isYouTubeUrl(video.videoUrl)) {
    return extractYouTubeId(video.videoUrl)
  }
  
  return null
}

function VideoGallery() {
  const [videosData, setVideosData] = useState<Video[]>([])
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null)
  const [_currentIndex, setCurrentIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { locale } = useLocale()
  const strings = useStrings()

  // Load videos from JSON file on component mount
  useEffect(() => {
    const loadVideos = () => {
      // Use import.meta.env.BASE_URL to handle base path correctly
      // Add cache-busting parameter to prevent stale data
      const cacheBuster = `?t=${Date.now()}`
      fetch(`${import.meta.env.BASE_URL}data/videos.json${cacheBuster}`)
        .then(res => res.json())
        .then(data => {
          setVideosData(data)
        })
        .catch(err => {
          console.error('Error loading videos:', err)
          setVideosData([])
        })
    }
    
    loadVideos()
    
    // Refresh videos every 30 seconds to pick up new additions
    const interval = setInterval(loadVideos, 30000)
    
    return () => clearInterval(interval)
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

  const selectedVideo = useMemo(() => {
    if (selectedVideoId == null) return null
    return filteredVideos.find((video) => video.id === selectedVideoId) ?? null
  }, [filteredVideos, selectedVideoId])

  const handleDownload = (video: LocalizedVideo<Video>) => {
    // Only allow download for local videos, not YouTube
    const videoType = getVideoType(video)
    if (videoType === 'youtube') {
      // For YouTube, open the video in a new tab
      const youtubeId = getYouTubeVideoId(video)
      if (youtubeId) {
        window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank')
      }
      return
    }
    
    const link = document.createElement('a')
    link.href = video.videoUrl
    link.download = `${video.title.replace(/\s+/g, '_')}.mp4`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleNext = useCallback(() => {
    if (filteredVideos.length === 0) return
    setCurrentIndex(prevIndex => {
      const nextIndex = (prevIndex + 1) % filteredVideos.length
      setSelectedVideoId(filteredVideos[nextIndex].id)
      return nextIndex
    })
  }, [filteredVideos])

  const handlePrev = useCallback(() => {
    if (filteredVideos.length === 0) return
    setCurrentIndex(prevIndex => {
      const newPrevIndex = (prevIndex - 1 + filteredVideos.length) % filteredVideos.length
      setSelectedVideoId(filteredVideos[newPrevIndex].id)
      return newPrevIndex
    })
  }, [filteredVideos])

  const openVideo = (video: LocalizedVideo<Video>) => {
    const index = filteredVideos.findIndex(v => v.id === video.id)
    setCurrentIndex(index >= 0 ? index : 0)
    setSelectedVideoId(video.id)
  }

  const closeVideo = () => {
    setSelectedVideoId(null)
  }

  // Keyboard navigation support
  useEffect(() => {
    if (selectedVideoId === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeVideo()
      } else if (e.key === 'ArrowLeft') {
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedVideoId, handlePrev, handleNext])

  const handleFullscreen = (videoId: number, video: LocalizedVideo<Video>) => {
    const videoType = getVideoType(video)
    
    // For YouTube, the iframe handles fullscreen itself
    if (videoType === 'youtube') {
      const iframe = document.getElementById(`youtube-lightbox-${videoId}`) as HTMLIFrameElement | null
      if (iframe) {
        // YouTube iframe has built-in fullscreen support via right-click or controls
        // We can't programmatically trigger it due to browser security, but the iframe supports it
        return
      }
    }
    
    // For local videos, use the existing fullscreen logic
    const element = document.getElementById(`video-lightbox-${videoId}`) as (HTMLVideoElement & {
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
        <>
          <div className="videos-grid">
            {filteredVideos.map((video) => {
              const videoType = getVideoType(video)
              const youtubeId = getYouTubeVideoId(video)
              const thumbnailUrl = videoType === 'youtube' && youtubeId && (!video.thumbnail || video.thumbnail.includes('youtube.com') || video.thumbnail.includes('youtu.be'))
                ? getYouTubeThumbnail(youtubeId)
                : video.thumbnail
              
              return (
                <div 
                  key={video.id} 
                  className="video-card"
                  onClick={() => openVideo(video)}
                >
                  <div className="video-wrapper">
                    <img 
                      src={thumbnailUrl} 
                      alt={video.title}
                      className="video-thumbnail"
                      onError={(e) => {
                        // Fallback to YouTube thumbnail if custom thumbnail fails
                        if (videoType === 'youtube' && youtubeId) {
                          const target = e.target as HTMLImageElement
                          target.src = getYouTubeThumbnail(youtubeId, 'default')
                        }
                      }}
                    />
                    <button 
                      className="play-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        openVideo(video)
                      }}
                      aria-label={strings.videos.playLabel(video.title)}
                    >
                      <svg width="80" height="80" viewBox="0 0 64 64" fill="none">
                        <circle cx="32" cy="32" r="32" fill="rgba(142, 97, 171, 0.9)"/>
                        <path d="M24 20L44 32L24 44V20Z" fill="#f5e6ff"/>
                      </svg>
                    </button>
                  </div>
                  <div className="video-info">
                    <h3 className="video-title">{video.title}</h3>
                    <div className="video-meta">
                      {video.date && <span className="video-date">{video.date}</span>}
                      <span className="video-category">{translateCategoryKey(video.categoryKey, locale)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {selectedVideo && (
            <div 
              className="video-lightbox"
              onClick={closeVideo}
            >
              <div className="video-lightbox-content" onClick={(e) => e.stopPropagation()}>
                <button 
                  className="video-lightbox-close"
                  onClick={closeVideo}
                  aria-label={strings.photos.lightboxClose}
                >
                  ×
                </button>
                
                <button 
                  className="video-lightbox-nav video-lightbox-prev"
                  onClick={handlePrev}
                  aria-label={strings.photos.lightboxPrev}
                >
                  ‹
                </button>
                
                {getVideoType(selectedVideo) === 'youtube' && getYouTubeVideoId(selectedVideo) ? (
                  <div className="video-lightbox-player-wrapper">
                    <iframe
                      id={`youtube-lightbox-${selectedVideo.id}`}
                      className="video-lightbox-player video-lightbox-youtube"
                      src={getYouTubeEmbedUrl(getYouTubeVideoId(selectedVideo)!)}
                      title={selectedVideo.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="video-lightbox-player-wrapper">
                    <video 
                      id={`video-lightbox-${selectedVideo.id}`}
                      controls 
                      autoPlay
                      className="video-lightbox-player"
                    >
                      <source src={selectedVideo.videoUrl} type="video/mp4" />
                      {strings.videos.unsupported}
                    </video>
                  </div>
                )}
                
                <button 
                  className="video-lightbox-nav video-lightbox-next"
                  onClick={handleNext}
                  aria-label={strings.photos.lightboxNext}
                >
                  ›
                </button>

                <div className="video-lightbox-info">
                  <h3>{selectedVideo.title}</h3>
                  {selectedVideo.description && <p className="video-lightbox-description">{selectedVideo.description}</p>}
                  <div className="video-lightbox-tags">
                    {selectedVideo.date && <span className="video-lightbox-tag">{selectedVideo.date}</span>}
                    <span className="video-lightbox-tag">{translateCategoryKey(selectedVideo.categoryKey, locale)}</span>
                  </div>
                </div>

                <div className="video-lightbox-actions">
                  {getVideoType(selectedVideo) === 'local' && (
                    <button 
                      className="video-lightbox-action-button"
                      onClick={() => handleFullscreen(selectedVideo.id, selectedVideo)}
                    >
                      {strings.videos.fullscreen}
                    </button>
                  )}
                  <button 
                    className="video-lightbox-action-button"
                    onClick={() => handleDownload(selectedVideo)}
                  >
                    {getVideoType(selectedVideo) === 'youtube' 
                      ? (locale === 'es' ? 'Ver en YouTube' : 'Watch on YouTube') 
                      : strings.videos.download}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default VideoGallery
