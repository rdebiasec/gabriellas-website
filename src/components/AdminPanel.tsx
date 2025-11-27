import { useState, useEffect, useCallback } from 'react'
import './AdminPanel.css'
import {
  adminLogin,
  adminLogout,
  isAuthenticated,
  fetchVideos,
  addYouTubeVideo,
  addLocalVideo,
  updateVideo,
  deleteVideo,
  type Video,
} from '../api/admin'

function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const [videos, setVideos] = useState<Video[]>([])
  const [isLoadingVideos, setIsLoadingVideos] = useState(false)
  const [videosError, setVideosError] = useState<string | null>(null)

  const [activeForm, setActiveForm] = useState<'youtube' | 'local' | null>(null)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)

  // YouTube form state
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [youtubeCategory, setYoutubeCategory] = useState('Family')
  const [youtubeDate, setYoutubeDate] = useState('')
  const [isAddingYouTube, setIsAddingYouTube] = useState(false)

  // Local video form state
  const [localVideo, setLocalVideo] = useState({
    title: '',
    description: '',
    thumbnail: '',
    videoUrl: '',
    date: '',
    category: 'Family',
    year: new Date().getFullYear(),
  })
  const [isAddingLocal, setIsAddingLocal] = useState(false)

  // Check if already authenticated on mount
  useEffect(() => {
    if (isAuthenticated()) {
      setLoggedIn(true)
      loadVideos()
    }
  }, [])

  const loadVideos = useCallback(async () => {
    setIsLoadingVideos(true)
    setVideosError(null)
    try {
      const data = await fetchVideos()
      setVideos(data)
    } catch (error) {
      console.error(error)
      setVideosError(error instanceof Error ? error.message : 'Failed to load videos')
    } finally {
      setIsLoadingVideos(false)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)
    setIsLoggingIn(true)

    try {
      await adminLogin(password)
      setLoggedIn(true)
      setPassword('')
      await loadVideos()
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = () => {
    adminLogout()
    setLoggedIn(false)
    setVideos([])
    setActiveForm(null)
    setEditingVideo(null)
  }

  const handleAddYouTube = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAddingYouTube(true)
    setVideosError(null)

    try {
      const newVideo = await addYouTubeVideo(youtubeUrl, youtubeCategory, youtubeDate || undefined)
      setVideos((prev) => [...prev, newVideo].sort((a, b) => b.id - a.id))
      setYoutubeUrl('')
      setYoutubeCategory('Family')
      setYoutubeDate('')
      setActiveForm(null)
      alert('Video added successfully!')
    } catch (error) {
      setVideosError(error instanceof Error ? error.message : 'Failed to add video')
    } finally {
      setIsAddingYouTube(false)
    }
  }

  const handleAddLocal = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAddingLocal(true)
    setVideosError(null)

    try {
      const year = localVideo.date ? parseInt(localVideo.date.substring(0, 4), 10) : new Date().getFullYear()
      const newVideo = await addLocalVideo({
        ...localVideo,
        year,
      })
      setVideos((prev) => [...prev, newVideo].sort((a, b) => b.id - a.id))
      setLocalVideo({
        title: '',
        description: '',
        thumbnail: '',
        videoUrl: '',
        date: '',
        category: 'Family',
        year: new Date().getFullYear(),
      })
      setActiveForm(null)
      alert('Video added successfully!')
    } catch (error) {
      setVideosError(error instanceof Error ? error.message : 'Failed to add video')
    } finally {
      setIsAddingLocal(false)
    }
  }

  const handleEdit = (video: Video) => {
    setEditingVideo(video)
    setLocalVideo({
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail,
      videoUrl: video.videoUrl,
      date: video.date || '',
      category: video.category,
      year: video.year,
    })
    setActiveForm('local')
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingVideo) return

    setIsAddingLocal(true)
    setVideosError(null)

    try {
      const year = localVideo.date ? parseInt(localVideo.date.substring(0, 4), 10) : new Date().getFullYear()
      const updated = await updateVideo(editingVideo.id, {
        ...localVideo,
        year,
      })
      setVideos((prev) => prev.map((v) => (v.id === updated.id ? updated : v)))
      setEditingVideo(null)
      setActiveForm(null)
      setLocalVideo({
        title: '',
        description: '',
        thumbnail: '',
        videoUrl: '',
        date: '',
        category: 'Family',
        year: new Date().getFullYear(),
      })
      alert('Video updated successfully!')
    } catch (error) {
      setVideosError(error instanceof Error ? error.message : 'Failed to update video')
    } finally {
      setIsAddingLocal(false)
    }
  }

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    setVideosError(null)
    try {
      await deleteVideo(id)
      setVideos((prev) => prev.filter((v) => v.id !== id))
      alert('Video deleted successfully!')
    } catch (error) {
      setVideosError(error instanceof Error ? error.message : 'Failed to delete video')
    }
  }

  const categories = ['Family', 'Celebration', 'Adventure', 'School', 'Other']

  if (!loggedIn) {
    return (
      <div className="admin-panel">
        <div className="admin-login">
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-label">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                autoFocus
              />
            </div>
            {loginError && <div className="error-message">{loginError}</div>}
            <div className="form-actions">
              <button type="submit" disabled={isLoggingIn}>
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Video Management</h2>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      {videosError && <div className="error-message">{videosError}</div>}

      <div className="admin-actions">
        <button
          onClick={() => {
            setActiveForm(activeForm === 'youtube' ? null : 'youtube')
            setEditingVideo(null)
          }}
          className="action-button"
        >
          {activeForm === 'youtube' ? 'Cancel' : 'Add YouTube Video'}
        </button>
        <button
          onClick={() => {
            setActiveForm(activeForm === 'local' ? null : 'local')
            setEditingVideo(null)
            if (activeForm !== 'local') {
              setLocalVideo({
                title: '',
                description: '',
                thumbnail: '',
                videoUrl: '',
                date: '',
                category: 'Family',
                year: new Date().getFullYear(),
              })
            }
          }}
          className="action-button"
        >
          {activeForm === 'local' ? 'Cancel' : 'Add Local Video'}
        </button>
        <button onClick={loadVideos} className="action-button" disabled={isLoadingVideos}>
          {isLoadingVideos ? 'Loading...' : 'Refresh List'}
        </button>
      </div>

      {activeForm === 'youtube' && (
        <div className="admin-form">
          <h3>{editingVideo ? 'Edit Video' : 'Add YouTube Video'}</h3>
          <form onSubmit={handleAddYouTube}>
            <div className="form-label">
              <label>YouTube URL or Video ID</label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=VIDEO_ID or just VIDEO_ID"
                required
              />
            </div>
            <div className="form-label">
              <label>Category</label>
              <select
                value={youtubeCategory}
                onChange={(e) => setYoutubeCategory(e.target.value)}
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-label">
              <label>Date (optional, format: YYYY)</label>
              <input
                type="text"
                value={youtubeDate}
                onChange={(e) => setYoutubeDate(e.target.value)}
                placeholder="2024"
                pattern="\d{4}"
              />
            </div>
            <div className="form-actions">
              <button type="submit" disabled={isAddingYouTube}>
                {isAddingYouTube ? 'Adding...' : 'Add Video'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeForm === 'local' && (
        <div className="admin-form">
          <h3>{editingVideo ? 'Edit Video' : 'Add Local Video'}</h3>
          <form onSubmit={editingVideo ? handleUpdate : handleAddLocal}>
            <div className="form-label">
              <label>Title *</label>
              <input
                type="text"
                value={localVideo.title}
                onChange={(e) => setLocalVideo({ ...localVideo, title: e.target.value })}
                required
              />
            </div>
            <div className="form-label">
              <label>Description</label>
              <textarea
                value={localVideo.description}
                onChange={(e) => setLocalVideo({ ...localVideo, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="form-label">
              <label>Video URL * (e.g., /videos/my-video.mp4)</label>
              <input
                type="text"
                value={localVideo.videoUrl}
                onChange={(e) => setLocalVideo({ ...localVideo, videoUrl: e.target.value })}
                placeholder="/videos/video.mp4"
                required
              />
            </div>
            <div className="form-label">
              <label>Thumbnail URL (e.g., /videos/thumbnails/thumb.jpg)</label>
              <input
                type="text"
                value={localVideo.thumbnail}
                onChange={(e) => setLocalVideo({ ...localVideo, thumbnail: e.target.value })}
                placeholder="/videos/thumbnails/thumb.jpg"
              />
            </div>
            <div className="form-label">
              <label>Category *</label>
              <select
                value={localVideo.category}
                onChange={(e) => setLocalVideo({ ...localVideo, category: e.target.value })}
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-label">
              <label>Date (format: YYYY)</label>
              <input
                type="text"
                value={localVideo.date}
                onChange={(e) => setLocalVideo({ ...localVideo, date: e.target.value })}
                placeholder="2024"
                pattern="\d{4}"
              />
            </div>
            <div className="form-actions">
              <button type="submit" disabled={isAddingLocal}>
                {isAddingLocal
                  ? editingVideo
                    ? 'Updating...'
                    : 'Adding...'
                  : editingVideo
                  ? 'Update Video'
                  : 'Add Video'}
              </button>
              {editingVideo && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingVideo(null)
                    setActiveForm(null)
                    setLocalVideo({
                      title: '',
                      description: '',
                      thumbnail: '',
                      videoUrl: '',
                      date: '',
                      category: 'Family',
                      year: new Date().getFullYear(),
                    })
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="admin-videos-list">
        <h3>Videos ({videos.length})</h3>
        {isLoadingVideos ? (
          <div className="loading">Loading videos...</div>
        ) : videos.length === 0 ? (
          <div className="empty-state">No videos found</div>
        ) : (
          <div className="videos-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => (
                  <tr key={video.id}>
                    <td>{video.id}</td>
                    <td>{video.title}</td>
                    <td>{video.category}</td>
                    <td>{video.date || video.year}</td>
                    <td>{video.youtubeId ? 'YouTube' : 'Local'}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(video)}
                        className="edit-button"
                        disabled={!!editingVideo}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(video.id, video.title)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel

