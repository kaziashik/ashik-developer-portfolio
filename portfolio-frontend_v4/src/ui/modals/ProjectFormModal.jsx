import { useState } from 'react'
import Swal from 'sweetalert2'
import { FiX } from 'react-icons/fi'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import { createProject, updateProject } from '../../api/projectsApi'

const VISIBILITY_OPTIONS = ['job', 'academic', 'personal']

const emptyForm = {
  title: '',
  startDate: '',
  endDate: '',
  toolsUsedText: '',
  detailsText: '',
  imageUrlsText: '',
  github: '',
  live: '',
  paper: '',
  featured: false,
  isPublic: true,
  visibility: ['job'],
}

const toFormState = (project) => {
  if (!project) return emptyForm
  return {
    title: project.title || '',
    startDate: project.startDate || '',
    endDate: project.endDate || '',
    toolsUsedText: (project.toolsUsed || []).join(', '),
    detailsText: (project.details || []).join('\n'),
    imageUrlsText: (project.imageUrls || []).join('\n'),
    github: project.links?.github || '',
    live: project.links?.live || '',
    paper: project.links?.paper || '',
    featured: !!project.featured,
    isPublic: project.isPublic !== false,
    visibility: project.visibility?.length ? project.visibility : ['job'],
  }
}

export default function ProjectFormModal({ project, onClose, onSaved }) {
  const axiosSecure = useAxiosSecure()
  const isEdit = !!project
  const [form, setForm] = useState(() => toFormState(project))
  const [submitting, setSubmitting] = useState(false)

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const toggleVisibility = (value) => {
    setForm((prev) => {
      const has = prev.visibility.includes(value)
      return {
        ...prev,
        visibility: has ? prev.visibility.filter((v) => v !== value) : [...prev.visibility, value],
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = {
        title: form.title,
        startDate: form.startDate,
        endDate: form.endDate,
        toolsUsed: form.toolsUsedText.split(',').map((s) => s.trim()).filter(Boolean),
        details: form.detailsText.split('\n').map((s) => s.trim()).filter(Boolean),
        imageUrls: form.imageUrlsText.split('\n').map((s) => s.trim()).filter(Boolean),
        links: { github: form.github.trim(), live: form.live.trim(), paper: form.paper.trim() },
        featured: form.featured,
        isPublic: form.isPublic,
        visibility: form.visibility,
      }

      if (isEdit) {
        await updateProject(axiosSecure, project._id, payload)
      } else {
        await createProject(axiosSecure, payload)
      }

      await Swal.fire({
        icon: 'success',
        title: isEdit ? 'Project updated successfully!' : 'Project added successfully!',
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
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-base-300 bg-base-100 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-lg">{isEdit ? 'Update project' : 'Add new project'}</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="eyebrow text-xs text-base-content/50">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="eyebrow text-xs text-base-content/50">Start date</label>
              <input
                value={form.startDate}
                onChange={(e) => update('startDate', e.target.value)}
                placeholder="2025-01"
                className="input input-bordered w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="eyebrow text-xs text-base-content/50">End date</label>
              <input
                value={form.endDate}
                onChange={(e) => update('endDate', e.target.value)}
                placeholder="Present"
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="eyebrow text-xs text-base-content/50">Tools used (comma-separated)</label>
            <input
              value={form.toolsUsedText}
              onChange={(e) => update('toolsUsedText', e.target.value)}
              placeholder="React, Node.js, MongoDB"
              className="input input-bordered w-full"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="eyebrow text-xs text-base-content/50">Details (one bullet per line)</label>
            <textarea
              value={form.detailsText}
              onChange={(e) => update('detailsText', e.target.value)}
              rows={4}
              className="textarea textarea-bordered w-full"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="eyebrow text-xs text-base-content/50">Image URLs (one per line)</label>
            <textarea
              value={form.imageUrlsText}
              onChange={(e) => update('imageUrlsText', e.target.value)}
              rows={2}
              className="textarea textarea-bordered w-full"
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="eyebrow text-xs text-base-content/50">GitHub link</label>
              <input value={form.github} onChange={(e) => update('github', e.target.value)} className="input input-bordered input-sm w-full" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="eyebrow text-xs text-base-content/50">Live demo link</label>
              <input value={form.live} onChange={(e) => update('live', e.target.value)} className="input input-bordered input-sm w-full" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="eyebrow text-xs text-base-content/50">Paper link</label>
              <input value={form.paper} onChange={(e) => update('paper', e.target.value)} className="input input-bordered input-sm w-full" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-1">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} className="checkbox checkbox-sm" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isPublic} onChange={(e) => update('isPublic', e.target.checked)} className="checkbox checkbox-sm" />
              Visible to visitors
            </label>
          </div>

          <div className="flex flex-col gap-1">
            <label className="eyebrow text-xs text-base-content/50">Show on sites</label>
            <div className="flex gap-4">
              {VISIBILITY_OPTIONS.map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm capitalize">
                  <input
                    type="checkbox"
                    checked={form.visibility.includes(opt)}
                    onChange={() => toggleVisibility(opt)}
                    className="checkbox checkbox-sm"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn btn-primary rounded-full mt-3">
            {submitting ? 'Saving…' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  )
}
