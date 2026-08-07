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

      await axiosSecure.post('/api/profile/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      invalidatePortfolio()

      await Swal.fire({
        icon: 'success',
        title: 'CV updated successfully.',
        timer: 1600,
        showConfirmButton: false,
      })
      onClose()
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Upload failed',
        text: err.response?.data?.message || err.message || 'Please try again.',
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-neutral/60 flex items-center justify-center px-6" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl border border-base-300 bg-base-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-lg">Update CV</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full"
          />
          <button type="submit" disabled={!file || uploading} className="btn btn-primary rounded-full gap-2">
            <FiUpload className="w-4 h-4" />
            {uploading ? 'Uploading…' : 'Upload & Save'}
          </button>
        </form>
      </div>
    </div>
  )
}
