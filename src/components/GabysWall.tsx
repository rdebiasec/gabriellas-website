import { useCallback, useEffect, useMemo, useState } from 'react'
import { createWallEntry, fetchWallEntries, type WallEntry } from '../api/comments'
import './GabysWall.css'
import { useStrings } from '../i18n/LocaleProvider'

const MAX_MESSAGE_LENGTH = 1024

function GabysWall() {
  const [entries, setEntries] = useState<WallEntry[]>([])
  const [fullName, setFullName] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const strings = useStrings()

  const loadEntries = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const data = await fetchWallEntries()
      setEntries(data)
    } catch (error) {
      console.error(error)
      setLoadError(strings.wall.feed.error)
    } finally {
      setIsLoading(false)
    }
  }, [strings.wall.feed.error])

  useEffect(() => {
    void loadEntries()
  }, [loadEntries])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus(null)

    const trimmedName = fullName.trim()
    const trimmedMessage = message.trim()

    if (!trimmedName || !trimmedMessage) {
      setStatus({ type: 'error', text: strings.wall.form.validation.missingFields })
      return
    }

    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      setStatus({
        type: 'error',
        text: strings.wall.form.validation.messageTooLong(trimmedMessage.length, MAX_MESSAGE_LENGTH),
      })
      return
    }

    setIsSubmitting(true)

    try {
      const created = await createWallEntry({ fullName: trimmedName, message: trimmedMessage })
      const normalizedEntry: WallEntry = {
        id: created?.id ?? crypto.randomUUID(),
        fullName: created?.fullName ?? trimmedName,
        message: created?.message ?? trimmedMessage,
        createdAt: created?.createdAt ?? new Date().toISOString(),
      }

      setEntries((prev) => [normalizedEntry, ...prev])
      setFullName('')
      setMessage('')
      setStatus({ type: 'success', text: strings.wall.form.success })
    } catch (error) {
      console.error(error)
      setStatus({
        type: 'error',
        text: strings.wall.form.failure,
      })
    } finally {
      setIsSubmitting(false)
    }
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
        <p className="kicker">{strings.wall.kicker}</p>
        <h2 className="section-title">{strings.wall.title}</h2>
        <p className="section-description">{strings.wall.description}</p>
      </div>

      <div className="wall-layout">
        <form className="wall-form" onSubmit={handleSubmit}>
          <label className="form-label">
            {strings.wall.form.nameLabel}
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={strings.wall.form.namePlaceholder}
              required
            />
          </label>

          <label className="form-label">
            {strings.wall.form.messageLabel}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={strings.wall.form.messagePlaceholder}
              maxLength={MAX_MESSAGE_LENGTH}
              rows={5}
              required
            />
            <span className="char-count">
              {strings.wall.form.charCount(message.length, MAX_MESSAGE_LENGTH)}
            </span>
          </label>

          {status && (
            <p className={`form-status ${status.type === 'error' ? 'error' : 'success'}`}>
              {status.text}
            </p>
          )}

          <div className="form-actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? strings.wall.form.submitBusy : strings.wall.form.submitIdle}
            </button>
            <button type="button" className="secondary" onClick={downloadEntries} disabled={entries.length === 0}>
              {strings.wall.form.download}
            </button>
          </div>

          <p className="backup-note">
            {strings.wall.form.backupNote}
          </p>
        </form>

        <div className="wall-feed">
          <div className="feed-header">
            <h3>{strings.wall.feed.header}</h3>
            <span>{strings.wall.feed.count(entries.length)}</span>
          </div>

          {isLoading ? (
            <p className="loading">{strings.wall.feed.loading}</p>
          ) : loadError ? (
            <div className="load-error">
              <p>{loadError}</p>
              <button type="button" onClick={() => void loadEntries()}>
                {strings.wall.feed.retry}
              </button>
            </div>
          ) : newestEntries.length === 0 ? (
            <p className="empty">{strings.wall.feed.empty}</p>
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

