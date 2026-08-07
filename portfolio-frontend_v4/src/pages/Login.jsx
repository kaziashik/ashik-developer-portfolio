import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation, Link } from 'react-router'
import { FcGoogle } from 'react-icons/fc'
import { FiLock, FiMail } from 'react-icons/fi'
import useAuth from '../hooks/useAuth'
import { getSwal } from '../utils/swal'

export default function Login() {
  const { loginWithEmail, loginWithGoogle, forgotPassword } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const friendlyError = (err) => {
    const code = err?.code || ''
    if (code.includes('user-not-found') || code.includes('wrong-password') || code.includes('invalid-credential')) {
      return 'Incorrect email or password.'
    }
    if (code.includes('too-many-requests')) {
      return 'Too many attempts. Please wait a moment and try again.'
    }
    return err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.'
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await loginWithEmail(email, password)
      const Swal = await getSwal()
      await Swal.fire({
        icon: 'success',
        title: 'Welcome back',
        text: 'Logged in successfully.',
        timer: 1400,
        showConfirmButton: false,
      })
      navigate(redirectTo, { replace: true })
    } catch (err) {
      const Swal = await getSwal()
      Swal.fire({ icon: 'error', title: 'Login failed', text: friendlyError(err) })
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    setSubmitting(true)
    try {
      await loginWithGoogle()
      const Swal = await getSwal()
      await Swal.fire({
        icon: 'success',
        title: 'Welcome back',
        text: 'Logged in successfully with Google.',
        timer: 1400,
        showConfirmButton: false,
      })
      navigate(redirectTo, { replace: true })
    } catch (err) {
      const Swal = await getSwal()
      Swal.fire({ icon: 'error', title: 'Google login failed', text: friendlyError(err) })
    } finally {
      setSubmitting(false)
    }
  }

  const handleForgotPassword = async () => {
    const Swal = await getSwal()
    const { value: resetEmail } = await Swal.fire({
      title: 'Reset your password',
      input: 'email',
      inputLabel: 'Email address',
      inputValue: email,
      inputPlaceholder: 'you@example.com',
      showCancelButton: true,
      confirmButtonText: 'Send reset link',
    })
    if (!resetEmail) return

    try {
      await forgotPassword(resetEmail)
      Swal.fire({
        icon: 'success',
        title: 'Check your inbox',
        text: `A password reset link has been sent to ${resetEmail}.`,
      })
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Could not send reset email', text: friendlyError(err) })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen flex items-center justify-center pt-24 pb-16 px-6"
    >
      <div className="w-full max-w-sm">
        <p className="eyebrow text-primary text-xs mb-3 uppercase text-center">// admin access</p>
        <h1 className="font-display text-3xl font-bold text-base-content mb-8 text-center">Sign in</h1>

        <form onSubmit={handleEmailLogin} className="rounded-2xl border border-base-300 bg-base-100 p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="eyebrow text-xs text-base-content/50">Email</label>
            <label className="input input-bordered flex items-center gap-2">
              <FiMail className="w-4 h-4 text-base-content/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="grow"
              />
            </label>
          </div>

          <div className="flex flex-col gap-1">
            <label className="eyebrow text-xs text-base-content/50">Password</label>
            <label className="input input-bordered flex items-center gap-2">
              <FiLock className="w-4 h-4 text-base-content/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="grow"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="eyebrow text-xs text-base-content/50 hover:text-primary text-right"
          >
            Forgot password?
          </button>

          <button type="submit" disabled={submitting} className="btn btn-primary rounded-full mt-2">
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>

          <div className="divider text-xs text-base-content/40 uppercase eyebrow">or</div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={submitting}
            className="btn btn-outline rounded-full gap-2"
          >
            <FcGoogle className="w-5 h-5" />
            Continue with Google
          </button>
        </form>

        <p className="text-center mt-6">
          <Link to="/" className="eyebrow text-xs text-base-content/50 hover:text-primary">
            ← Back to portfolio
          </Link>
        </p>
      </div>
    </motion.div>
  )
}
