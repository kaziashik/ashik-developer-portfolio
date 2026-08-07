import { useState } from 'react'
import Swal from 'sweetalert2'
import { FiX, FiUpload } from 'react-icons/fi'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import { updateProfile } from '../../api/profileApi'
import { usePortfolio } from '../../contexts/PortfolioProvider'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export default function ProfileImageModal({ onClose }) {
  const axiosSecure = useAxiosSecure()
  const { refetchProfile } = usePortfolio()
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      Swal.fire({
        icon: 'error',
        title: 'Cloudinary is not configured',
        text: 'Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.',
      })
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', UPLOAD_PRESET)

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      )
      const cloudinaryData = await cloudinaryRes.json()
      if (!cloudinaryRes.ok) {
        throw new Error(cloudinaryData?.error?.message || 'Image upload failed');
      }

      await updateProfile(axiosSecure, { profileImageUrl: cloudinaryData.secure_url })
      await refetchProfile()

      await Swal.fire({
        icon: 'success',
        title: 'Your website has been updated successfully!',
        timer: 1600,
        showConfirmButton: false,
      })
      onClose()
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Upload failed', text: err.message || 'Please try again.' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-neutral/60 flex items-center justify-center px-6" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-base-300 bg-base-100 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-lg">Update profile image</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="aspect-square w-32 mx-auto rounded-xl bg-base-200 border border-base-300 overflow-hidden">
            {preview && <img src={preview} alt="Preview" className="w-full h-full object-cover" />}
          </div>

          <input
            type="file"
            accept="image/*"
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
