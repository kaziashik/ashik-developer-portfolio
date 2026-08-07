import { useEffect, useState } from 'react'
import { FiX, FiDownload } from 'react-icons/fi'
import { getSwal } from '../../utils/swal'
import { API_BASE_URL } from '../../config/env'

const RESUME_URL = `${API_BASE_URL}/api/profile/resume`

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
        const response = await fetch(RESUME_URL)
        if (!response.ok) {
          const data = await response.json().catch(() => null)
          throw new Error(data?.message || 'Could not load CV preview.')
        }

        const blob = await response.blob()
        if (cancelled) return

        objectUrl = URL.createObjectURL(blob)
        setPreviewUrl(objectUrl)
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Could not load CV preview.')
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
      const res = await fetch(RESUME_URL)
      if (!res.ok) throw new Error('Download failed')

      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = blobUrl
      link.download = 'CV.pdf'
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(blobUrl)

      const Swal = await getSwal()
      Swal.fire({
        icon: 'success',
        title: 'CV downloaded.',
        timer: 1600,
        showConfirmButton: false,
      })
    } catch {
      const Swal = await getSwal()
      Swal.fire({ icon: 'error', title: 'Download failed', text: 'Please try again.' })
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-neutral/70 flex items-center justify-center p-2 md:p-3" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-7xl h-[94vh] rounded-2xl border border-base-300 bg-base-100 overflow-hidden flex flex-col shadow-2xl"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-300 shrink-0">
          <h3 className="font-display font-semibold text-lg md:text-xl">Kazi Ashik CV</h3>
          <div className="flex items-center gap-2">
            {!loading && !error && previewUrl && (
              <button type="button" onClick={handleDownload} className="btn btn-primary btn-sm rounded-full gap-2">
                <FiDownload className="w-4 h-4" /> Download CV
              </button>
            )}
            <button type="button" onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 bg-base-200">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <span className="loading loading-spinner loading-md text-primary" />
            </div>
          ) : error ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-base-content/60 text-sm px-6 text-center">
              <p>{error}</p>
              <p className="text-xs text-base-content/45">
                Log in as admin, click <strong>Update CV</strong>, and upload your PDF again.
              </p>
            </div>
          ) : (
            <object
              data={`${previewUrl}#view=FitH`}
              type="application/pdf"
              className="w-full h-full bg-white"
            >
              <iframe
                src={`${previewUrl}#view=FitH`}
                title="CV preview"
                className="w-full h-full border-0 bg-white"
              />
            </object>
          )}
        </div>
      </div>
    </div>
  )
}
