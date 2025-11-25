import { useEffect, useMemo, useState } from 'react'
import './GabysWall.css'

type WallEntry = {
  id: string
  fullName: string
  message: string
  createdAt: string
}

const WALL_STORAGE_KEY = 'gabys-wall-messages'
const MAX_MESSAGE_LENGTH = 1024

function GabysWall() {
  const [entries, setEntries] = useState<WallEntry[]>([])
  const [fullName, setFullName] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    const hydrateFromStorage = () => {
      if (typeof window === 'undefined') return null
      const stored = window.localStorage.getItem(WALL_STORAGE_KEY)
      return stored ? (JSON.parse(stored) as WallEntry[]) : null
    }

    const storedEntries = hydrateFromStorage()
    if (storedEntries && storedEntries.length > 0) {
      setEntries(storedEntries)
      setIsLoading(false)
      return
    }

    const loadSeedData = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}data/wall.json`)
        if (!response.ok) throw new Error('Failed to load wall messages')
        const data: WallEntry[] = await response.json()
        if (isActive) {
          setEntries(data)
        }
      } catch (error) {
        console.error(error)
        if (isActive) {
          setEntries([])
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadSeedData()

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (entries.length > 0) {
      window.localStorage.setItem(WALL_STORAGE_KEY, JSON.stringify(entries))
    }
  }, [entries])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus(null)

    if (!fullName.trim() || !message.trim()) {
      setStatus({ type: 'error', text: 'Please share both your full name and a message.' })
      return
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      setStatus({
        type: 'error',
        text: `Messages are limited to ${MAX_MESSAGE_LENGTH} characters.`,
      })
      return
    }

    const newEntry: WallEntry = {
      id: crypto.randomUUID(),
      fullName: fullName.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    }

    setEntries((prev) => [newEntry, ...prev])
    setFullName('')
    setMessage('')
    setStatus({ type: 'success', text: 'Your note has been added to Gaby’s Wall.' })
  }

  const downloadEntries = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'gabys-wall-entries.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const newestEntries = useMemo(() => entries.slice(0, 12), [entries])

  return (
    <section className="wall" id="gabys-wall">
      <div className="section-heading">
        <p className="kicker">Gaby&apos;s Wall</p>
        <h2 className="section-title">Messages of love from around the world</h2>
        <p className="section-description">
          Share a note that celebrates Gabriella&apos;s joyful spirit. Entries stay in your browser,
          and you can download them as a JSON file to back up in the repository so nothing is lost.
        </p>
      </div>

      <div className="wall-layout">
        <form className="wall-form" onSubmit={handleSubmit}>
          <label className="form-label">
            Full name
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </label>

          <label className="form-label">
            Message
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write up to 1024 characters..."
              maxLength={MAX_MESSAGE_LENGTH}
              rows={5}
              required
            />
            <span className="char-count">
              {message.length}/{MAX_MESSAGE_LENGTH}
            </span>
          </label>

          {status && (
            <p className={`form-status ${status.type === 'error' ? 'error' : 'success'}`}>
              {status.text}
            </p>
          )}

          <div className="form-actions">
            <button type="submit">Post to Gaby&apos;s Wall</button>
            <button type="button" className="secondary" onClick={downloadEntries} disabled={entries.length === 0}>
              Download entries
            </button>
          </div>

          <p className="backup-note">
            After downloading, upload the JSON file to `public/data/wall.json` in GitHub so the notes
            stay permanently, and consider saving a copy elsewhere for backup.
          </p>
        </form>

        <div className="wall-feed">
          <div className="feed-header">
            <h3>Recent notes</h3>
            <span>{entries.length} shared memories</span>
          </div>

          {isLoading ? (
            <p className="loading">Loading heartfelt notes...</p>
          ) : newestEntries.length === 0 ? (
            <p className="empty">Be the first to leave a message for Gabriella.</p>
          ) : (
            <ul className="wall-messages">
              {newestEntries.map((entry) => (
                <li key={entry.id} className="wall-message">
                  <div className="message-meta">
                    <span className="message-author">{entry.fullName}</span>
                    <span className="message-date">
                      {new Date(entry.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <p>{entry.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

export default GabysWall

