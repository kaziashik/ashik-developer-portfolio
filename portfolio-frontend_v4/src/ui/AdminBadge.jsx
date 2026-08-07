import { FiLogOut, FiShield } from 'react-icons/fi'
import useAuth from '../hooks/useAuth'
import { getSwal } from '../utils/swal'

export default function AdminBadge() {
  const { isAdmin, logout } = useAuth()

  if (!isAdmin) return null

  const handleLogout = async () => {
    const Swal = await getSwal()
    const result = await Swal.fire({
      icon: 'question',
      title: 'Log out?',
      showCancelButton: true,
      confirmButtonText: 'Log out',
    })
    if (!result.isConfirmed) return

    await logout()
    Swal.fire({ icon: 'success', title: 'Logged out', timer: 1200, showConfirmButton: false })
  }

  return (
    <div className="dropdown dropdown-end">
      <button tabIndex={0} className="btn btn-ghost btn-xs gap-1 eyebrow text-[10px] uppercase">
        <FiShield className="w-3.5 h-3.5 text-primary" /> Admin
      </button>
      <ul tabIndex={0} className="dropdown-content menu menu-sm z-50 mt-2 p-2 shadow bg-base-100 border border-base-300 rounded-box w-40">
        <li>
          <button onClick={handleLogout} className="flex items-center gap-2">
            <FiLogOut className="w-4 h-4" /> Log out
          </button>
        </li>
      </ul>
    </div>
  )
}
