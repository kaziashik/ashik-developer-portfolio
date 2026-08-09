import { useState } from 'react'
import { FiX, FiPlus, FiTrash2, FiSave } from 'react-icons/fi'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import { addSkillCategory, updateSkillCategory, deleteSkillCategory } from '../../api/profileApi'
import { useProfileData } from '../../contexts/ProfileContext'
import { confirmDelete, toastError, toastSuccess } from '../../utils/swal'

const FIELD = { research: 'researchSkills', development: 'developmentSkills' }

export default function SkillsFormModal({ type = 'development', onClose }) {
  const axiosSecure = useAxiosSecure()
  const { profile, refetchProfile } = useProfileData()
  const categories = profile?.[FIELD[type]] || []

  const [drafts, setDrafts] = useState(() =>
    categories.map((c) => ({ _id: c._id, category: c.category, itemsText: (c.items || []).join(', ') }))
  )
  const [newCategory, setNewCategory] = useState('')
  const [newItemsText, setNewItemsText] = useState('')
  const [busyId, setBusyId] = useState(null)

  const success = () => toastSuccess('Skills & Tech Stack updated successfully')
  const fail = (err) => toastError('Update failed', err?.response?.data?.message || err.message)

  const handleDraftChange = (id, field, value) => {
    setDrafts((prev) => prev.map((d) => (d._id === id ? { ...d, [field]: value } : d)))
  }

  const handleSaveRow = async (draft) => {
    setBusyId(draft._id)
    try {
      const items = draft.itemsText.split(',').map((s) => s.trim()).filter(Boolean)
      await updateSkillCategory(axiosSecure, type, draft._id, { category: draft.category, items })
      await refetchProfile()
      success()
    } catch (err) {
      fail(err)
    } finally {
      setBusyId(null)
    }
  }

  const handleDeleteRow = async (id) => {
    const result = await confirmDelete('Remove this category?', 'This skill group will be removed.')
    if (!result.isConfirmed) return

    setBusyId(id)
    try {
      await deleteSkillCategory(axiosSecure, type, id)
      await refetchProfile()
      setDrafts((prev) => prev.filter((d) => d._id !== id))
      success()
    } catch (err) {
      fail(err)
    } finally {
      setBusyId(null)
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!newCategory.trim() || !newItemsText.trim()) return

    setBusyId('new')
    try {
      const items = newItemsText.split(',').map((s) => s.trim()).filter(Boolean)
      const order = categories.length + 1
      await addSkillCategory(axiosSecure, type, { category: newCategory.trim(), items, order })
      const updated = await refetchProfile()
      const freshList = updated?.[FIELD[type]] || []
      setDrafts(freshList.map((c) => ({ _id: c._id, category: c.category, itemsText: (c.items || []).join(', ') })))
      setNewCategory('')
      setNewItemsText('')
      success()
    } catch (err) {
      fail(err)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-neutral/60 flex items-center justify-center px-6" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-base-300 bg-base-100 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-lg">
            Update Skills &amp; Tech Stack <span className="text-base-content/40 text-sm">({type})</span>
          </h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {drafts.map((draft) => (
            <div key={draft._id} className="rounded-xl border border-base-300 p-4 flex flex-col gap-2">
              <input
                value={draft.category}
                onChange={(e) => handleDraftChange(draft._id, 'category', e.target.value)}
                className="input input-bordered input-sm w-full font-display font-semibold"
                placeholder="Category name (e.g. Frontend)"
              />
              <textarea
                value={draft.itemsText}
                onChange={(e) => handleDraftChange(draft._id, 'itemsText', e.target.value)}
                rows={2}
                className="textarea textarea-bordered textarea-sm w-full"
                placeholder="Comma-separated: React, Next.js, Redux"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleDeleteRow(draft._id)}
                  disabled={busyId === draft._id}
                  className="btn btn-ghost btn-xs text-error gap-1"
                >
                  <FiTrash2 className="w-3.5 h-3.5" /> Remove
                </button>
                <button
                  onClick={() => handleSaveRow(draft)}
                  disabled={busyId === draft._id}
                  className="btn btn-primary btn-xs gap-1"
                >
                  <FiSave className="w-3.5 h-3.5" /> Save
                </button>
              </div>
            </div>
          ))}

          <form onSubmit={handleAddCategory} className="rounded-xl border border-dashed border-base-300 p-4 flex flex-col gap-2">
            <p className="eyebrow text-xs text-base-content/50 uppercase">Add new category</p>
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="input input-bordered input-sm w-full"
              placeholder="e.g. Next.js / New Tech"
            />
            <textarea
              value={newItemsText}
              onChange={(e) => setNewItemsText(e.target.value)}
              rows={2}
              className="textarea textarea-bordered textarea-sm w-full"
              placeholder="Comma-separated: Next.js, tRPC"
            />
            <button type="submit" disabled={busyId === 'new'} className="btn btn-outline btn-sm gap-1 self-end">
              <FiPlus className="w-3.5 h-3.5" /> Add category
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
