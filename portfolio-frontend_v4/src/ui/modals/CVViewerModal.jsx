import { useEffect, useState } from 'react'
import { FiX, FiDownload, FiFileText } from 'react-icons/fi'
import { getSwal } from '../../utils/swal'
import { API_BASE_URL } from '../../config/env'

const RESUME_URL = `${API_BASE_URL}/api/profile/resume`
const RESUME_TITLE = 'Ashik Resume'
const RESUME_FILENAME = 'Ashik_Resume.pdf'

export default function CVViewerModal({ open, onClose }) {
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(!!open)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) {
      setLoading(false)
      setPreviewUrl(null)
      setError('')
      return
    }

    let objectUrl = null
    let cancelled = false

    async function loadPreview() {
      setLoading(true)
      setError('')
      setPreviewUrl(null)

      try {
        const response = await fetch(`${RESUME_URL}?t=${Date.now()}`, {
          cache: 'no-store',
        })
        if (!response.ok) {
          const data = await response.json().catch(() => null)
          throw new Error(data?.message || 'Could not load resume preview.')
        }

        const blob = await response.blob()
        if (cancelled) return

        objectUrl = URL.createObjectURL(blob)
        setPreviewUrl(objectUrl)
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Could not load resume preview.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadPreview()

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [open])

  const handleDownload = async () => {
    try {
      let blobUrl = previewUrl

      if (!blobUrl) {
        const res = await fetch(`${RESUME_URL}?t=${Date.now()}`, { cache: 'no-store' })
        if (!res.ok) throw new Error('Download failed')
        const blob = await res.blob()
        blobUrl = URL.createObjectURL(blob)
      }

      const link = document.createElement('a')
      link.href = blobUrl
      link.download = RESUME_FILENAME
      document.body.appendChild(link)
      link.click()
      link.remove()

      if (blobUrl !== previewUrl) URL.revokeObjectURL(blobUrl)

      const Swal = await getSwal()
      Swal.fire({
        icon: 'success',
        title: 'Resume downloaded',
        text: RESUME_FILENAME,
        timer: 1400,
        showConfirmButton: false,
      })
    } catch {
      const Swal = await getSwal()
      Swal.fire({ icon: 'error', title: 'Download failed', text: 'Please try again.' })
    }
  }

  const viewerSrc = previewUrl
    ? `${previewUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`
    : ''

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-neutral/75 p-3 backdrop-blur-[2px] md:p-5"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-2xl"
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-base-300 px-4 py-3 md:px-5">
          <div className="min-w-0">
            <h3 className="font-display text-base font-semibold text-base-content md:text-lg">
              {RESUME_TITLE}
            </h3>
            <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[11px] text-base-content/50">
              <FiFileText className="h-3.5 w-3.5 shrink-0" />
              {RESUME_FILENAME}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {!loading && !error && previewUrl && (
              <button
                type="button"
                onClick={handleDownload}
                className="btn btn-primary btn-sm gap-2 rounded-full px-4"
              >
                <FiDownload className="h-4 w-4" />
                <span className="hidden sm:inline">Download Resume</span>
                <span className="sm:hidden">Download</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-circle"
              aria-label="Close resume preview"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 bg-base-200">
          {loading ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3">
              <span className="loading loading-spinner loading-md text-primary" />
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-base-content/45">
                Loading resume
              </p>
            </div>
          ) : error ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center text-sm text-base-content/60">
              <p>{error}</p>
              <p className="text-xs text-base-content/45">
                Log in as admin, click <strong>Update Resume</strong>, and upload your PDF again.
              </p>
            </div>
          ) : (
            <iframe
              src={viewerSrc}
              title={RESUME_TITLE}
              className="h-full w-full border-0 bg-white"
            />
          )}
        </div>
      </div>
    </div>
  )
}
