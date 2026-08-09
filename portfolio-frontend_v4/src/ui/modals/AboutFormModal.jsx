import { useState } from 'react'
import { FiX } from 'react-icons/fi'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import { updateProfile } from '../../api/profileApi'
import { useProfileData } from '../../contexts/ProfileContext'
import { toastError, toastSuccess } from '../../utils/swal'

export default function AboutFormModal({ onClose }) {
  const axiosSecure = useAxiosSecure()
  const { profile, refetchProfile } = useProfileData()
  const [text, setText] = useState(profile?.researchSummary || '')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await updateProfile(axiosSecure, { researchSummary: text })
      await refetchProfile()
      await toastSuccess('About section updated successfully')
      onClose()
    } catch (err) {
      await toastError('Update failed', err?.response?.data?.message || err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-neutral/60 flex items-center justify-center px-6" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl border border-base-300 bg-base-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-lg">Update About Me</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className="textarea textarea-bordered w-full"
            placeholder="Tell visitors about yourself..."
          />
          <button type="submit" disabled={submitting} className="btn btn-primary rounded-full">
            {submitting ? 'Saving…' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  )
}
