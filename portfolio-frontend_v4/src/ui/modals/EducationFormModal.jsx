import { useState } from 'react'
import { FiX } from 'react-icons/fi'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import { createEducation, updateEducation } from '../../api/educationApi'
import { toastError, toastSuccess } from '../../utils/swal'

const VISIBILITY_OPTIONS = ['job', 'academic', 'personal']

const emptyForm = {
  degree: '',
  institution: '',
  location: '',
  startDate: '',
  endDate: '',
  gpa: '',
  isPublic: true,
  visibility: ['job'],
}

const toFormState = (ed) => {
  if (!ed) return emptyForm
  return {
    degree: ed.degree || '',
    institution: ed.institution || '',
    location: ed.location || '',
    startDate: ed.startDate || '',
    endDate: ed.endDate || '',
    gpa: ed.gpa || '',
    isPublic: ed.isPublic !== false,
    visibility: ed.visibility?.length ? ed.visibility : ['job'],
  }
}

export default function EducationFormModal({ education, onClose, onSaved }) {
  const axiosSecure = useAxiosSecure()
  const isEdit = !!education
  const [form, setForm] = useState(() => toFormState(education))
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
        degree: form.degree,
        institution: form.institution,
        location: form.location,
        startDate: form.startDate,
        endDate: form.endDate,
        gpa: form.gpa,
        isPublic: form.isPublic,
        visibility: form.visibility,
      }

      if (isEdit) {
        await updateEducation(axiosSecure, education._id, payload)
      } else {
        await createEducation(axiosSecure, payload)
      }

      await toastSuccess(isEdit ? 'Education updated successfully' : 'Education added successfully')
      onSaved?.()
      onClose()
    } catch (err) {
      await toastError('Save failed', err?.response?.data?.message || err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-neutral/60 flex items-center justify-center px-4 py-8" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-base-300 bg-base-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-lg">{isEdit ? 'Update education' : 'Add education'}</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle"><FiX className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="eyebrow text-xs text-base-content/50">Degree</label>
            <input required value={form.degree} onChange={(e) => update('degree', e.target.value)} className="input input-bordered w-full" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="eyebrow text-xs text-base-content/50">Institution</label>
            <input required value={form.institution} onChange={(e) => update('institution', e.target.value)} className="input input-bordered w-full" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="eyebrow text-xs text-base-content/50">Location</label>
            <input value={form.location} onChange={(e) => update('location', e.target.value)} className="input input-bordered w-full" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="eyebrow text-xs text-base-content/50">Start date</label>
              <input value={form.startDate} onChange={(e) => update('startDate', e.target.value)} placeholder="2023-11" className="input input-bordered w-full" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="eyebrow text-xs text-base-content/50">End date</label>
              <input value={form.endDate} onChange={(e) => update('endDate', e.target.value)} placeholder="2025-07" className="input input-bordered w-full" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="eyebrow text-xs text-base-content/50">GPA</label>
            <input value={form.gpa} onChange={(e) => update('gpa', e.target.value)} placeholder="4.00/4.00" className="input input-bordered w-full" />
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
