import { useState } from 'react'
import { motion } from 'framer-motion'
import Swal from 'sweetalert2'
import { FiMail, FiGithub, FiLinkedin, FiMapPin } from 'react-icons/fi'
import { useProfileData } from '../contexts/ProfileContext'
import useAxios from '../hooks/useAxios'

export default function Contact() {
  const { profile } = useProfileData()
  const axiosPublic = useAxios()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const adminFirstName = (profile?.name || 'Kazi Ashik').split(' ').slice(0, 2).join(' ')

  const onSubmit = async (e) => {
    e.preventDefault()

    setStatus('sending')
    try {
      await axiosPublic.post('/api/contact', {
        name: form.name,
        email: form.email,
        message: form.message,
      })

      setStatus('sent')
      setForm({ name: '', email: '', message: '' })

      Swal.fire({
        icon: 'success',
        title: 'Message sent!',
        text: `Your message has been sent successfully to ${adminFirstName}. Thank you for reaching out! I will get back to you as soon as possible.`,
      })
    } catch (err) {
      setStatus('error')
      Swal.fire({
        icon: 'error',
        title: 'Could not send your message',
        text: err?.response?.data?.message || 'Please try again in a moment.',
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen pt-32 pb-24 max-w-5xl mx-auto px-6 grid md:grid-cols-[0.8fr_1.2fr] gap-14"
    >
      <div>
        <p className="eyebrow text-primary text-xs mb-3 uppercase">// contact</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-base-content mb-6">Let&apos;s talk</h1>
        <p className="text-base-content/70 mb-8 max-w-sm">
          Send a message and it'll land straight in my inbox — I read every one.
        </p>
        <div className="flex flex-col gap-3 text-sm text-base-content/70">
          {profile?.email && (
            <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-primary">
              <FiMail className="w-4 h-4" /> {profile.email}
            </a>
          )}
          {profile?.links?.github && (
            <a href={profile.links.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary">
              <FiGithub className="w-4 h-4" /> {profile.links.github.replace('https://', '')}
            </a>
          )}
          {profile?.links?.linkedin && (
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary">
              <FiLinkedin className="w-4 h-4" /> {profile.links.linkedin.replace('https://', '')}
            </a>
          )}
          {profile?.location && (
            <p className="flex items-center gap-2"><FiMapPin className="w-4 h-4" /> {profile.location}</p>
          )}
        </div>
      </div>

      <form onSubmit={onSubmit} className="rounded-2xl border border-base-300 bg-base-100 p-6 md:p-8 flex flex-col gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="eyebrow text-xs text-base-content/50">Name</label>
            <input name="name" value={form.name} onChange={onChange} required
              className="input input-bordered w-full" placeholder="Jane Doe" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="eyebrow text-xs text-base-content/50">Email</label>
            <input type="email" name="email" value={form.email} onChange={onChange} required
              className="input input-bordered w-full" placeholder="jane@example.com" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="eyebrow text-xs text-base-content/50">Message</label>
          <textarea name="message" value={form.message} onChange={onChange} required rows={5}
            className="textarea textarea-bordered w-full" placeholder="What's on your mind?" />
        </div>
        <button type="submit" disabled={status === 'sending'} className="btn btn-primary rounded-full mt-2">
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
      </form>
    </motion.div>
  )
}
