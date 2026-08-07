import { useState } from 'react'
import Swal from 'sweetalert2'
import { FiX } from 'react-icons/fi'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import { createExperience, updateExperience } from '../../api/experienceApi'

const CATEGORY_OPTIONS = ['Research', 'Industry', 'Teaching']
const VISIBILITY_OPTIONS = ['job', 'academic', 'personal']

const emptyForm = {
  role: '',
  organization: '',
  location: '',
  startDate: '',
  endDate: '',
  category: 'Industry',
  highlightsText: '',
  isPublic: true,
  visibility: ['job'],
}

const toFormState = (exp) => {
  if (!exp) return emptyForm
  return {
    role: exp.role || '',
    organization: exp.organization || '',
    location: exp.location || '',
    startDate: exp.startDate || '',
    endDate: exp.endDate || '',
    category: exp.category || 'Industry',
    highlightsText: (exp.highlights || []).join('\n'),
    isPublic: exp.isPublic !== false,
    visibility: exp.visibility?.length ? exp.visibility : ['job'],
  }
}

export default function ExperienceFormModal({ experience, onClose, onSaved }) {
  const axiosSecure = useAxiosSecure()
  const isEdit = !!experience
  const [form, setForm] = useState(() => toFormState(experience))
  const [submitting, setSubmitting] = useState(false)

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const toggleVisibility = (value) => {
    setForm((prev) => {
      const has = prev.visibility.includes(value)
      return { ...prev, visibility: has ? prev.visibility.filter((v) => v !== value) : [...prev.visibility, value] }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = {
        role: form.role,
        organization: form.organization,
        location: form.location,
        startDate: form.startDate,
        endDate: form.endDate,
        category: form.category,
        highlights: form.highlightsText.split('\n').map((s) => s.trim()).filter(Boolean),
        isPublic: form.isPublic,
        visibility: form.visibility,
      }

      if (isEdit) {
        await updateExperience(axiosSecure, experience._id, payload)
      } else {
        await createExperience(axiosSecure, payload)
      }

      await Swal.fire({
        icon: 'success',
        title: isEdit ? 'Experience updated successfully!' : 'Experience added successfully!',
        timer: 1500,
        showConfirmButton: false,
      })
      onSaved?.()
      onClose()
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Save failed', text: err?.response?.data?.message || err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-neutral/60 flex items-center justify-center px-4 py-8" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-base-300 bg-base-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-lg">{isEdit ? 'Update experience' : 'Add experience'}</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle"><FiX className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="eyebrow text-xs text-base-content/50">Role</label>
            <input required value={form.role} onChange={(e) => update('role', e.target.value)} className="input input-bordered w-full" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="eyebrow text-xs text-base-content/50">Organization</label>
            <input required value={form.organization} onChange={(e) => update('organization', e.target.value)} className="input input-bordered w-full" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="eyebrow text-xs text-base-content/50">Location</label>
            <input value={form.location} onChange={(e) => update('location', e.target.value)} className="input input-bordered w-full" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="eyebrow text-xs text-base-content/50">Start date</label>
              <input value={form.startDate} onChange={(e) => update('startDate', e.target.value)} placeholder="2024-01" className="input input-bordered w-full" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="eyebrow text-xs text-base-content/50">End date</label>
              <input value={form.endDate} onChange={(e) => update('endDate', e.target.value)} placeholder="Present" className="input input-bordered w-full" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="eyebrow text-xs text-base-content/50">Category</label>
            <select value={form.category} onChange={(e) => update('category', e.target.value)} className="select select-bordered w-full">
              {CATEGORY_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="eyebrow text-xs text-base-content/50">Highlights (one per line)</label>
            <textarea value={form.highlightsText} onChange={(e) => update('highlightsText', e.target.value)} rows={4} className="textarea textarea-bordered w-full" />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isPublic} onChange={(e) => update('isPublic', e.target.checked)} className="checkbox checkbox-sm" />
            Visible to visitors
          </label>

          <div className="flex flex-col gap-1">
            <label className="eyebrow text-xs text-base-content/50">Show on sites</label>
            <div className="flex gap-4">
              {VISIBILITY_OPTIONS.map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm capitalize">
                  <input type="checkbox" checked={form.visibility.includes(opt)} onChange={() => toggleVisibility(opt)} className="checkbox checkbox-sm" />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn btn-primary rounded-full mt-2">
            {submitting ? 'Saving…' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  )
}
