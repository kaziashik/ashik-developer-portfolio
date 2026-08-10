import { useState } from 'react'
import Swal from 'sweetalert2'
import { FiX, FiUpload } from 'react-icons/fi'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import { usePortfolio } from '../../contexts/PortfolioProvider'

export default function CVUploadModal({ onClose }) {
  const axiosSecure = useAxiosSecure()
  const { invalidatePortfolio } = usePortfolio()
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (selected && selected.type !== 'application/pdf') {
      Swal.fire({ icon: 'error', title: 'Please choose a PDF file' })
      return
    }
    setFile(selected)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('resume', file)

      // Let the browser set multipart boundary — do not force Content-Type.
      await axiosSecure.post('/api/profile/resume', formData)
      invalidatePortfolio()

      await Swal.fire({
        icon: 'success',
        title: 'Resume updated successfully.',
        text: 'Open View Resume to confirm the new file.',
        timer: 2000,
        showConfirmButton: false,
      })
      onClose()
    } catch (err) {
      const status = err.response?.status
      const message =
        status === 401
          ? 'Please log in as admin first, then try again.'
          : status === 413
            ? 'File is too large. Max size is about 4.5 MB on the live server.'
            : err.response?.data?.message || err.message || 'Please try again.'
      Swal.fire({
        icon: 'error',
        title: 'Upload failed',
        text: message,
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-neutral/60 px-6" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-base-300 bg-base-100 p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Update Resume</h3>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-sm btn-circle" aria-label="Close">
            <FiX className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full"
          />
          <p className="font-mono text-[11px] text-base-content/45">
            Visitors always see and download this as <span className="text-base-content/70">Ashik_Resume.pdf</span>
          </p>
          <button type="submit" disabled={!file || uploading} className="btn btn-primary gap-2 rounded-full">
            <FiUpload className="h-4 w-4" />
            {uploading ? 'Uploading…' : 'Upload & Save'}
          </button>
        </form>
      </div>
    </div>
  )
}
